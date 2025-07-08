import { ChainedCommands, Editor, NodePos } from '@tiptap/core';

import { FindingData } from '@app/models/domain';
import { EditorFindingData } from '@app/models/ui';

import {
  EDITOR_REPORT_ATTRIBUTE_NAMES,
  EDITOR_REPORT_ATTRIBUTE_VALUES,
  EDITOR_REPORT_EXTENSION_NODE_NAME,
  EDITOR_REPORT_ID,
} from '../constants';

import {
  escapeAndSanitizeHTML,
  findClosestInArray,
  findEditorNodeIndicesByAttribute,
  generateEditorDataAttribute,
  generateEditorDataAttributeName,
  sanitizeHTML,
} from './editor-report-common-extension.functions';

export function insertRadioFindingInEditor(
  editor: Editor,
  chain: () => ChainedCommands,
  findingData: EditorFindingData
): ChainedCommands {
  const existingScopeSection: NodePos | null = editor.$doc.querySelector(
    EDITOR_REPORT_EXTENSION_NODE_NAME,
    {
      [generateEditorDataAttributeName(
        EDITOR_REPORT_ATTRIBUTE_NAMES.FindingScopeIndex
      )]: findingData.scopeIndex,
    }
  );

  if (existingScopeSection) {
    // Scope section already exists
    return insertFindingInExistingScope(
      editor,
      chain,
      findingData,
      existingScopeSection
    );
  }

  const scopeIndices: number[] = findEditorNodeIndicesByAttribute(
    editor,
    EDITOR_REPORT_EXTENSION_NODE_NAME,
    EDITOR_REPORT_ATTRIBUTE_VALUES.Scope,
    EDITOR_REPORT_ATTRIBUTE_NAMES.FindingScopeIndex
  );

  if (!scopeIndices.length) {
    // First finding in report
    return insertFirstFindingInReport(editor, chain, findingData);
  }

  // first finding in scope
  return insertFirstFindingInScope(editor, chain, findingData, scopeIndices);
}

function insertFirstFindingInScope(
  editor: Editor,
  chain: () => ChainedCommands,
  findingData: EditorFindingData,
  scopeIndices: number[]
): ChainedCommands {
  const closestIndex: number = findClosestInArray(
    scopeIndices,
    findingData.scopeIndex
  );

  const html: string = generateFirstFindingInScopeHTML(findingData);

  const closestScopeDiv: NodePos = editor.$doc.querySelector(
    EDITOR_REPORT_EXTENSION_NODE_NAME,
    {
      [generateEditorDataAttributeName(
        EDITOR_REPORT_ATTRIBUTE_NAMES.FindingScopeIndex
      )]: closestIndex,
    }
  ) as NodePos;

  if (findingData.scopeIndex < closestIndex) {
    // insert finding before closest scope
    return chain().insertContentAt(closestScopeDiv.pos - 1, html);
  } else {
    // insert finding after closest scope
    return chain().insertContentAt(
      closestScopeDiv.pos + closestScopeDiv.size - 1,
      html
    );
  }
}

function insertFirstFindingInReport(
  editor: Editor,
  chain: () => ChainedCommands,
  findingData: EditorFindingData
): ChainedCommands {
  const html: string = generateFirstFindingInReportHTML(findingData);

  const protocolSection: NodePos | null = editor.$doc.querySelector(
    EDITOR_REPORT_EXTENSION_NODE_NAME,
    {
      id: EDITOR_REPORT_ID.RadioReportProtocol,
    }
  );

  if (protocolSection) {
    // Insert after protocol seciton
    return chain().insertContentAt(
      protocolSection.pos + protocolSection.size - 1,
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

function insertFindingInExistingScope(
  editor: Editor,
  chain: () => ChainedCommands,
  findingData: EditorFindingData,
  existingScopeSection: NodePos
): ChainedCommands {
  const existingGroupSection: NodePos | null = editor.$doc.querySelector(
    EDITOR_REPORT_EXTENSION_NODE_NAME,
    {
      [generateEditorDataAttributeName(EDITOR_REPORT_ATTRIBUTE_NAMES.GroupId)]:
        findingData.finding.groupId,
    }
  );

  if (existingGroupSection) {
    return insertFindingInExistingGroup(
      chain,
      findingData,
      existingGroupSection
    );
  }

  const html: string = generateFirstFindingInGroupHTML(findingData);

  const lastChild: NodePos =
    existingScopeSection.lastChild ?? existingScopeSection;

  return chain().insertContentAt(lastChild.pos + lastChild.size - 1, html);
}

function insertFindingInExistingGroup(
  chain: () => ChainedCommands,
  findingData: EditorFindingData,
  existingGroupSection: NodePos
): ChainedCommands {
  const html: string = generateFindingHTML(findingData.finding);

  if (findingData.finding.isNormal) {
    // If normal finding than remove existing findings and insert only normal finding
    return replaceWithNormalFindingInGroup(chain, html, existingGroupSection);
  }

  const normalFinding: NodePos | null =
    tryGetNormalFinding(existingGroupSection);

  if (normalFinding) {
    // If not normal finding and existing group has any normal finding. Remove normal finding and insert the new finding
    return replaceNormalFindingWithAbNormalFinding(chain, html, normalFinding);
  }

  // If finding is not normal and there are no existing normal findings in group
  return appendFindingInGroup(chain, html, existingGroupSection);
}

function appendFindingInGroup(
  chain: () => ChainedCommands,
  html: string,
  existingGroupSection: NodePos
): ChainedCommands {
  const lastChild: NodePos | null = existingGroupSection.lastChild;

  if (lastChild) {
    // Add finding as the last item in the group section
    return chain().insertContentAt(lastChild.pos + lastChild.size - 1, html);
  }

  // Add finding as the first item in the group section
  return chain().insertContentAt(existingGroupSection.pos, html);
}

function replaceNormalFindingWithAbNormalFinding(
  chain: () => ChainedCommands,
  html: string,
  normalFinding: NodePos
): ChainedCommands {
  return chain()
    .deleteRange({
      from: normalFinding.pos - 1,
      to: normalFinding.pos + normalFinding.size,
    })
    .insertContentAt(normalFinding.pos - 1, html);
}

function replaceWithNormalFindingInGroup(
  chain: () => ChainedCommands,
  html: string,
  existingGroupSection: NodePos
): ChainedCommands {
  const existingFindings: NodePos[] = existingGroupSection.querySelectorAll(
    EDITOR_REPORT_EXTENSION_NODE_NAME,
    {
      [generateEditorDataAttributeName(
        EDITOR_REPORT_ATTRIBUTE_NAMES.RadioItem
      )]: EDITOR_REPORT_ATTRIBUTE_VALUES.Finding,
    }
  );

  if (!existingFindings?.length) {
    // first finding in group
    return appendFindingInGroup(chain, html, existingGroupSection);
  }

  const firstFinding: NodePos = existingFindings[0];

  if (existingFindings.length === 1) {
    // Remove the only abnormal finding and replace it with normal finding
    return chain()
      .deleteRange({
        from: firstFinding.pos - 1,
        to: firstFinding.pos + firstFinding.size,
      })
      .insertContentAt(firstFinding.pos - 1, html);
  }

  const lastFinding: NodePos = existingFindings[existingFindings.length - 1];

  // Remove all the abnormal findings and replace it with normal finding
  return chain()
    .deleteRange({
      from: firstFinding.pos - 1,
      to: lastFinding.pos + lastFinding.size,
    })
    .insertContentAt(firstFinding.pos - 1, html);
}

function tryGetNormalFinding(existingGroupSection: NodePos): NodePos | null {
  const normalFinding: NodePos | null = existingGroupSection.querySelector(
    EDITOR_REPORT_EXTENSION_NODE_NAME,
    {
      [generateEditorDataAttributeName(
        EDITOR_REPORT_ATTRIBUTE_NAMES.IsNormalFinding
      )]: true,
    }
  );

  return normalFinding;
}

function generateFirstFindingInReportHTML(
  findingData: EditorFindingData
): string {
  const radioItem: string = generateEditorDataAttribute(
    EDITOR_REPORT_ATTRIBUTE_NAMES.RadioItem,
    EDITOR_REPORT_ATTRIBUTE_VALUES.FindingsSection
  );

  const sectionId: string = EDITOR_REPORT_ID.RadioReportFindings;

  return (
    `<div ${radioItem} id="${sectionId}">` +
    `<p><u><b>Findings:</b></u></p>` +
    generateFirstFindingInScopeHTML(findingData) +
    `</div>`
  );
}

function generateFirstFindingInScopeHTML(
  findingData: EditorFindingData
): string {
  const radioItem: string = generateEditorDataAttribute(
    EDITOR_REPORT_ATTRIBUTE_NAMES.RadioItem,
    EDITOR_REPORT_ATTRIBUTE_VALUES.Scope
  );

  const scopeIndex: string = generateEditorDataAttribute(
    EDITOR_REPORT_ATTRIBUTE_NAMES.FindingScopeIndex,
    findingData.scopeIndex
  );

  const dataId: string = generateEditorDataAttribute(
    EDITOR_REPORT_ATTRIBUTE_NAMES.ScopeId,
    findingData.scope.id
  );

  return (
    `<div ${radioItem} ${scopeIndex} ${dataId}>` +
    `<p><b>${escapeAndSanitizeHTML(findingData.scope.name)}</b></p>` +
    generateFirstFindingInGroupHTML(findingData) +
    `</div>`
  );
}

function generateFirstFindingInGroupHTML(
  findingData: EditorFindingData
): string {
  const radioItem: string = generateEditorDataAttribute(
    EDITOR_REPORT_ATTRIBUTE_NAMES.RadioItem,
    EDITOR_REPORT_ATTRIBUTE_VALUES.Group
  );

  const dataId: string = generateEditorDataAttribute(
    EDITOR_REPORT_ATTRIBUTE_NAMES.GroupId,
    findingData.finding.groupId
  );

  return (
    `<div ${radioItem} ${dataId}>` +
    generateFindingHTML(findingData.finding) +
    `</div>`
  );
}

function generateFindingHTML(finding: FindingData): string {
  const radioItem: string = generateEditorDataAttribute(
    EDITOR_REPORT_ATTRIBUTE_NAMES.RadioItem,
    EDITOR_REPORT_ATTRIBUTE_VALUES.Finding
  );

  const isNormal: string = generateEditorDataAttribute(
    EDITOR_REPORT_ATTRIBUTE_NAMES.IsNormalFinding,
    finding.isNormal
  );

  const dataId: string = generateEditorDataAttribute(
    EDITOR_REPORT_ATTRIBUTE_NAMES.FindingId,
    finding.id
  );

  return (
    `<div ${radioItem} ${isNormal} ${dataId}>` +
    sanitizeHTML(finding.description.html) +
    `</div>`
  );
}
