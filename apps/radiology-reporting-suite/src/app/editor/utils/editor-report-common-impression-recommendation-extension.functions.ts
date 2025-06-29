import { ChainedCommands, Editor, NodePos } from '@tiptap/core';
import { isNil } from 'lodash-es';

import { EditorContent } from '@app/models/domain';
import { EditorFindingData } from '@app/models/ui';
import { isNilOrEmpty } from '@app/utils/functions/common.functions';

import {
  EDITOR_REPORT_ATTRIBUTE_NAMES,
  EDITOR_REPORT_EXTENSION_LIST_ITEM_NODE_NAME,
  EDITOR_REPORT_EXTENSION_NODE_NAME,
  EDITOR_REPORT_ID,
} from '../constants';

import {
  findClosestInArray,
  findEditorNodeIndicesByAttribute,
  findEditorRootNodeById,
  generateEditorDataAttributeName,
} from './editor-report-common-extension.functions';

export function insertRadioImpressionOrRecommendationInEditor(
  editor: Editor,
  chain: () => ChainedCommands,
  findingData: EditorFindingData,
  editorContent: EditorContent | null,
  id: string,
  radioItemAttr: string,
  scopeIndexAttr: string,
  groupIdAttr: string,
  generateHTML: (findingData: EditorFindingData, editorHTML: string) => string,
  generateFirstHTML: (
    findingData: EditorFindingData,
    editorHTML: string
  ) => string
): ChainedCommands {
  const textContent: string | undefined = editorContent?.text;

  const hasNoContent: boolean = isNilOrEmpty(textContent?.trim());

  const existingScopeNodes: NodePos[] = findExistingListScopeNodes(
    editor,
    findingData.scopeIndex,
    scopeIndexAttr
  );

  if (existingScopeNodes && existingScopeNodes.length) {
    // Node(s) for scope already exists
    return insertNodeInExistingScopeNodes(
      editor,
      chain,
      findingData,
      editorContent?.html ?? null,
      existingScopeNodes,
      id,
      radioItemAttr,
      groupIdAttr,
      generateHTML
    );
  }

  if (!editorContent || hasNoContent) {
    return chain();
  }

  const scopeIndices: number[] = findEditorNodeIndicesByAttribute(
    editor,
    EDITOR_REPORT_EXTENSION_LIST_ITEM_NODE_NAME,
    radioItemAttr,
    scopeIndexAttr
  );

  if (!scopeIndices.length) {
    // First node in report
    return insertFirstNodeInReport(
      editor,
      chain,
      findingData,
      editorContent.html,
      id,
      generateFirstHTML
    );
  }

  // First node in scope
  return insertFirstNodeInScope(
    editor,
    chain,
    findingData,
    editorContent.html,
    scopeIndices,
    scopeIndexAttr,
    generateHTML
  );
}

function findExistingListScopeNodes(
  editor: Editor,
  scopeIndex: number,
  attributeName: string
): NodePos[] {
  return editor.$doc.querySelectorAll(
    EDITOR_REPORT_EXTENSION_LIST_ITEM_NODE_NAME,
    {
      [generateEditorDataAttributeName(attributeName)]: scopeIndex,
    }
  );
}

function insertFirstNodeInScope(
  editor: Editor,
  chain: () => ChainedCommands,
  finding: EditorFindingData,
  editorHTML: string,
  scopeIndices: number[],
  scopeIndexAttr: string,
  generateHTML: (finding: EditorFindingData, editorHTML: string) => string
) {
  const closestIndex: number = findClosestInArray(
    scopeIndices,
    finding.scopeIndex
  );

  const html: string = generateHTML(finding, editorHTML);

  const closestScopeNodes: NodePos[] = editor.$doc.querySelectorAll(
    EDITOR_REPORT_EXTENSION_LIST_ITEM_NODE_NAME,
    {
      [generateEditorDataAttributeName(scopeIndexAttr)]: closestIndex,
    }
  );

  if (!closestScopeNodes?.length) {
    throw new Error('No closest scope node found');
  }

  if (finding.scopeIndex < closestIndex) {
    // insert node before closest scope node
    const firstNodeInClosestScope: NodePos = closestScopeNodes[0];

    return chain().insertContentAt(firstNodeInClosestScope.pos - 1, html);
  } else {
    // insert node after closest scope node
    const lastNodeInClosestScope: NodePos =
      closestScopeNodes[closestScopeNodes.length - 1];

    return chain().insertContentAt(
      lastNodeInClosestScope.pos + lastNodeInClosestScope.size - 1,
      html
    );
  }
}

function insertFirstNodeInReport(
  editor: Editor,
  chain: () => ChainedCommands,
  finding: EditorFindingData,
  editorHTML: string,
  id: string,
  generateHTML: (finding: EditorFindingData, editorHTML: string) => string
): ChainedCommands {
  const html: string = generateHTML(finding, editorHTML);

  const impressionsSection: NodePos | null = editor.$doc.querySelector(
    EDITOR_REPORT_EXTENSION_NODE_NAME,
    {
      id: EDITOR_REPORT_ID.RadioReportImpressions,
    }
  );

  if (
    impressionsSection &&
    id === EDITOR_REPORT_ID.RadioReportRecommendations
  ) {
    // Insert after impressions sections if node is recommendation
    return chain().insertContentAt(
      impressionsSection.pos + impressionsSection.size - 1,
      html
    );
  }

  const findingsSection: NodePos | null = editor.$doc.querySelector(
    EDITOR_REPORT_EXTENSION_NODE_NAME,
    {
      id: EDITOR_REPORT_ID.RadioReportFindings,
    }
  );

  if (findingsSection) {
    // Insert after findings section
    return chain().insertContentAt(
      findingsSection.pos + findingsSection.size - 1,
      html
    );
  }

  const firstEditorChild: NodePos | null = editor.$doc.firstChild;

  if (firstEditorChild) {
    // insert at first child of editor
    return chain().insertContentAt(firstEditorChild, html);
  }

  // editor empty
  return chain().insertContentAt(0, html);
}

function insertNodeInExistingScopeNodes(
  editor: Editor,
  chain: () => ChainedCommands,
  findingData: EditorFindingData,
  editorHTML: string | null,
  existingScopeNodes: NodePos[],
  id: string,
  radioItemAttr: string,
  groupIdAttr: string,
  generateHTML: (findingData: EditorFindingData, editorHTML: string) => string
): ChainedCommands {
  const html: string | null = isNil(editorHTML)
    ? null
    : generateHTML(findingData, editorHTML);

  const lastNode: NodePos = existingScopeNodes[existingScopeNodes.length - 1];

  if (findingData.finding.isNormal) {
    // If normal finding than remove existing nodes and insert only normal node
    return replaceNodeWithNormalNodeInGroup(
      editor,
      chain,
      html,
      existingScopeNodes,
      id,
      findingData.finding.groupId,
      radioItemAttr,
      groupIdAttr
    );
  }

  const normalNode: NodePos | null = tryGetNormalNode(
    existingScopeNodes,
    groupIdAttr,
    findingData.finding.groupId
  );

  if (normalNode) {
    // If not normal finding and existing scope has any normal node. Remove normal node and insert the new node
    return replaceNormalNodeWithAbNormalNode(
      editor,
      chain,
      html,
      normalNode,
      existingScopeNodes,
      id,
      radioItemAttr
    );
  }

  if (isNil(html)) {
    return chain();
  }

  const existingGroupNodes: NodePos[] = existingScopeNodes.filter(
    (node: NodePos): boolean =>
      node.attributes[
        generateEditorDataAttributeName(EDITOR_REPORT_ATTRIBUTE_NAMES.RadioItem)
      ] === radioItemAttr &&
      node.attributes[generateEditorDataAttributeName(groupIdAttr)] ===
        findingData.finding.groupId
  );

  if (existingGroupNodes.length > 0) {
    const lastGroupNode: NodePos =
      existingGroupNodes[existingGroupNodes.length - 1];

    return chain().insertContentAt(
      lastGroupNode.pos + lastGroupNode.size - 1,
      html
    );
  }

  // insert after the last node of the existing scope nodes
  return chain().insertContentAt(lastNode.pos + lastNode.size - 1, html);
}

function replaceNormalNodeWithAbNormalNode(
  editor: Editor,
  chain: () => ChainedCommands,
  html: string | null,
  normal: NodePos,
  existingGroupNodes: NodePos[],
  id: string,
  radioItemAttr: string
): ChainedCommands {
  if (isNil(html)) {
    return replaceNodeWhenGroupHasOneNode(
      editor,
      chain,
      html,
      normal,
      existingGroupNodes,
      id,
      radioItemAttr
    );
  }

  return chain()
    .deleteRange({
      from: normal.pos - 1,
      to: normal.pos + normal.size,
    })
    .insertContentAt(normal.pos - 1, html);
}

function insertFirstNodeAsLastItemInScope(
  chain: () => ChainedCommands,
  html: string | null,
  existingScopeNodes: NodePos[]
): ChainedCommands {
  if (isNil(html)) {
    // No node to insert
    return chain();
  }

  const lastNode: NodePos = existingScopeNodes[existingScopeNodes.length - 1];

  // Insert after last existing scope node
  return chain().insertContentAt(lastNode.pos + lastNode.size - 1, html);
}

function replaceNodeWhenGroupHasOneNode(
  editor: Editor,
  chain: () => ChainedCommands,
  html: string | null,
  firstNode: NodePos,
  existingGroupNodes: NodePos[],
  id: string,
  radioItemAttr: string
): ChainedCommands {
  if (isNil(html)) {
    return removeNodesInGroup(
      editor,
      chain,
      firstNode,
      firstNode,
      existingGroupNodes,
      id,
      radioItemAttr
    );
  }

  // Remove the only node and replace it with normal node
  return chain()
    .deleteRange({
      from: firstNode.pos - 1,
      to: firstNode.pos + firstNode.size,
    })
    .insertContentAt(firstNode.pos - 1, html);
}

function removeNodesInGroup(
  editor: Editor,
  chain: () => ChainedCommands,
  firstNode: NodePos,
  lastNode: NodePos,
  existingGroupNodes: NodePos[],
  id: string,
  radioItemAttr: string
): ChainedCommands {
  const onlyCurrentGroupNodes: boolean = hasOnlyCurrentGroupNodes(
    editor,
    existingGroupNodes,
    radioItemAttr
  ); // Node to be removed are the only nodes in the report

  if (onlyCurrentGroupNodes) {
    // Remove entire section since the nodes to be removed are the only nodes in the report
    return removeSection(editor, chain, firstNode, lastNode, id);
  }

  // Remove node from first to last
  return chain().deleteRange({
    from: firstNode.pos - 1,
    to: lastNode.pos + lastNode.size,
  });
}

function removeSection(
  editor: Editor,
  chain: () => ChainedCommands,
  firstNode: NodePos,
  lastNode: NodePos,
  id: string
): ChainedCommands {
  const rootNode: NodePos | null = findEditorRootNodeById(editor, id);

  if (!rootNode) {
    // Remove all node from first to last
    return chain().deleteRange({
      from: firstNode.pos - 1,
      to: lastNode.pos + lastNode.size,
    });
  }

  // Remove nodes root node (section)
  return chain().deleteRange({
    from: rootNode.pos - 1,
    to: rootNode.pos + rootNode.size - 1,
  });
}

function replaceNodeWithNormalNodeInGroup(
  editor: Editor,
  chain: () => ChainedCommands,
  html: string | null,
  existingNodes: NodePos[],
  id: string,
  groupId: string,
  radioItemAttr: string,
  groupIdAttr: string
): ChainedCommands {
  const existingScopeNodes: NodePos[] = existingNodes.filter(
    (node: NodePos): boolean =>
      node.attributes[
        generateEditorDataAttributeName(EDITOR_REPORT_ATTRIBUTE_NAMES.RadioItem)
      ] === radioItemAttr
  );

  const existingGroupNodes: NodePos[] = existingScopeNodes.filter(
    (node: NodePos): boolean =>
      node.attributes[generateEditorDataAttributeName(groupIdAttr)] === groupId
  );

  if (!existingGroupNodes?.length) {
    // first node in scope
    return insertFirstNodeAsLastItemInScope(chain, html, existingNodes);
  }

  const firstNode: NodePos = existingGroupNodes[0];

  if (existingGroupNodes.length === 1) {
    // Remove the only abnormal node and replace it with normal node
    return replaceNodeWhenGroupHasOneNode(
      editor,
      chain,
      html,
      firstNode,
      existingGroupNodes,
      id,
      radioItemAttr
    );
  }

  const lastNode: NodePos = existingGroupNodes[existingGroupNodes.length - 1];

  // Remove all the abnormal node and replace it with normal node
  if (isNil(html)) {
    return removeNodesInGroup(
      editor,
      chain,
      firstNode,
      lastNode,
      existingGroupNodes,
      id,
      radioItemAttr
    );
  }

  // Remove nodes from first to last
  return chain()
    .deleteRange({
      from: firstNode.pos - 1,
      to: lastNode.pos + lastNode.size,
    })
    .insertContentAt(firstNode.pos - 1, html);
}

function hasOnlyCurrentGroupNodes(
  editor: Editor,
  existingGroupNodes: NodePos[],
  radioItemAttr: string
): boolean {
  const allNodes: NodePos[] = editor.$doc.querySelectorAll(
    EDITOR_REPORT_EXTENSION_LIST_ITEM_NODE_NAME,
    {
      [generateEditorDataAttributeName(
        EDITOR_REPORT_ATTRIBUTE_NAMES.RadioItem
      )]: radioItemAttr,
    }
  );

  return allNodes.length === existingGroupNodes.length;
}

function tryGetNormalNode(
  existingScopeNodes: NodePos[],
  groupIdAttr: string,
  groupId: string
): NodePos | null {
  const normal: NodePos | null =
    existingScopeNodes.find(
      (node: NodePos): boolean =>
        node.attributes[generateEditorDataAttributeName(groupIdAttr)] ===
          groupId &&
        node.attributes[
          generateEditorDataAttributeName(
            EDITOR_REPORT_ATTRIBUTE_NAMES.IsNormalFinding
          )
        ] === true
    ) ?? null;

  return normal;
}
