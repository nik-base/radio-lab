import { ChainedCommands, Editor, NodePos } from '@tiptap/core';
import { EditorView } from '@tiptap/pm/view';
import DOMPurify from 'dompurify';
import { escape, isEmpty, isNil } from 'lodash-es';

import { EditorContent, FindingData, Template } from '@app/models/domain';
import { EditorFindingData } from '@app/models/ui';
import { isNilOrEmpty } from '@app/utils/functions/common.functions';

import {
  EDITOR_REPORT_ATTRIBUTE_NAMES,
  EDITOR_REPORT_ATTRIBUTE_VALUES,
  EDITOR_REPORT_EXTENSION_LIST_ITEM_NODE_NAME,
  EDITOR_REPORT_EXTENSION_NODE_NAME,
  EDITOR_REPORT_ID,
} from '../constants';
import { EditorReportVariableValueOptions } from '../extensions/radio-extensions/editor-report-variable-value.extension';

export function generateEditorAttributeName(attributeName: string): string {
  return `data-${attributeName}`;
}

export function insertProtocolInEditor(
  editor: Editor,
  chain: () => ChainedCommands,
  template: Template
): boolean {
  const html: string = generateProtocolHTML(template);

  const findingsSection: NodePos | null = editor.$doc.querySelector(
    EDITOR_REPORT_EXTENSION_NODE_NAME,
    {
      id: EDITOR_REPORT_ID.RadioReportFindings,
    }
  );

  if (!findingsSection) {
    // editor empty
    return chain().insertContentAt(0, html).run();
  }

  // editor has findings
  return chain()
    .insertContentAt(findingsSection.pos - 1, html)
    .run();
}

export function insertFindingInEditor(
  editor: Editor,
  chain: () => ChainedCommands,
  findingData: EditorFindingData
): boolean {
  return insertFinding(editor, chain, findingData).run();
}

export function insertImpressionInEditor(
  editor: Editor,
  chain: () => ChainedCommands,
  findingData: EditorFindingData
): boolean {
  return insertImpression(editor, chain, findingData).run();
}

export function insertRecommendationInEditor(
  editor: Editor,
  chain: () => ChainedCommands,
  findingData: EditorFindingData
): boolean {
  return insertRecommendation(editor, chain, findingData).run();
}

export function replaceVariableValueForFindingInEditor(
  chain: () => ChainedCommands,
  options: EditorReportVariableValueOptions
): boolean {
  if (isEmpty(options.variableValue.trim())) {
    // Do not insert variable value
    return false;
  }

  return insertVariableValueForFinding(chain, options);
}

export function replaceVariableValueInNextTableCellForNoInEditor(
  chain: () => ChainedCommands,
  view: EditorView,
  options: EditorReportVariableValueOptions
): boolean {
  if (isEmpty(options.variableValue.trim())) {
    // Do not insert variable value
    return false;
  }

  if (options.variableValue.toLocaleLowerCase() === 'no') {
    // In table if current cell variable is set to "No" then set next cell variable to "-"
    return replaceVariableValueInNextTableCellForNo(chain, view, options);
  }

  return false;
}

export function replaceVariableValueForImpressionInEditor(
  chain: () => ChainedCommands,
  view: EditorView,
  options: EditorReportVariableValueOptions
): boolean {
  if (isEmpty(options.variableValue.trim())) {
    // Do not insert variable value
    return false;
  }

  // Replace same variable in impression with same value
  return replaceVariableValueForImpression(chain, view, options);
}

function replaceVariableValueForImpression(
  chain: () => ChainedCommands,
  view: EditorView,
  options: EditorReportVariableValueOptions
): boolean {
  const impressionVariableElement: HTMLElement | null = view.dom.querySelector(
    `#${EDITOR_REPORT_ID.RadioReportImpressions} [data-type="mention"][data-id="${options.variableId}"]`
  );

  if (!impressionVariableElement) {
    return false;
  }

  const impressionVariablePosition: number = view.posAtDOM(
    impressionVariableElement,
    0
  );

  if (impressionVariablePosition < 0) {
    return false;
  }

  return chain()
    .deleteRange({
      from: impressionVariablePosition,
      to: impressionVariablePosition + 1,
    })
    .insertContentAt(impressionVariablePosition, options.variableValue)
    .run();
}

function replaceVariableValueInNextTableCellForNo(
  chain: () => ChainedCommands,
  view: EditorView,
  options: EditorReportVariableValueOptions
): boolean {
  const currentCellElement: HTMLElement | null =
    view
      .domAtPos(options.variableNodePosition)
      ?.node?.parentElement?.closest('td') ?? null;

  if (!currentCellElement) {
    return false;
  }

  const nextCellElement: HTMLElement | null =
    currentCellElement.nextElementSibling as HTMLElement;

  if (!nextCellElement) {
    return false;
  }

  const nextCellVariableElement: HTMLElement | null =
    nextCellElement.querySelector('.radio-mention[data-type="mention"]');

  if (!nextCellVariableElement) {
    return false;
  }

  const nextCellVariablePosition: number = view.posAtDOM(
    nextCellVariableElement,
    0
  );

  return chain()
    .deleteRange({
      from: nextCellVariablePosition,
      to: nextCellVariablePosition + 1,
    })
    .insertContentAt(nextCellVariablePosition, '-')
    .run();
}

function insertVariableValueForFinding(
  chain: () => ChainedCommands,
  options: EditorReportVariableValueOptions
): boolean {
  return (
    chain()
      .focus()
      // Delete variable placeholder
      .deleteRange({
        from: options.variableNodePosition,
        to: options.variableNodePosition + 1,
      })
      // Insert variable value in place of variable
      .insertContentAt(options.variableNodePosition, options.variableValue)
      .run()
  );
}

function insertFinding(
  editor: Editor,
  chain: () => ChainedCommands,
  findingData: EditorFindingData
): ChainedCommands {
  const existingScopeSection: NodePos | null = editor.$doc.querySelector(
    EDITOR_REPORT_EXTENSION_NODE_NAME,
    {
      [generateEditorAttributeName(
        EDITOR_REPORT_ATTRIBUTE_NAMES.FindingScopeIndex
      )]: findingData.scopeIndex,
    }
  );

  if (existingScopeSection) {
    // Scope section already exists
    return insertFindingInExistingScope(
      chain,
      findingData,
      existingScopeSection
    );
  }

  const scopeIndices: number[] = findScopeFindingIndices(editor);

  if (!scopeIndices.length) {
    // First finding in report
    return insertFirstFindingInReport(editor, chain, findingData);
  }

  // first finding in scope
  return insertFirstFindingInScope(editor, chain, findingData, scopeIndices);
}

function insertImpression(
  editor: Editor,
  chain: () => ChainedCommands,
  findingData: EditorFindingData
): ChainedCommands {
  const impression: EditorContent | null = findingData.finding.impression;

  const impressionText: string | undefined = impression?.text;

  const hasNoImpression: boolean = isNilOrEmpty(impressionText?.trim());

  const existingScopeImpressions: NodePos[] = findExistingScopeImpressions(
    editor,
    findingData
  );

  if (existingScopeImpressions && existingScopeImpressions.length) {
    // Impression(s) for scope already exists
    return insertImpressionInExistingScopeImpressions(
      editor,
      chain,
      findingData,
      impression?.html ?? null,
      existingScopeImpressions
    );
  }

  if (!impression || hasNoImpression) {
    return chain();
  }

  const scopeImpressionIndices: number[] = findScopeImpressionIndices(editor);

  if (!scopeImpressionIndices.length) {
    // First impression in report
    return insertFirstImpressionInReport(
      editor,
      chain,
      findingData,
      impression.html
    );
  }

  // First impression in scope
  return insertFirstImpressionInScope(
    editor,
    chain,
    findingData,
    impression.html,
    scopeImpressionIndices
  );
}

function findExistingScopeImpressions(
  editor: Editor,
  findingData: EditorFindingData
): NodePos[] {
  return editor.$doc.querySelectorAll(
    EDITOR_REPORT_EXTENSION_LIST_ITEM_NODE_NAME,
    {
      [generateEditorAttributeName(
        EDITOR_REPORT_ATTRIBUTE_NAMES.ImpressionScopeIndex
      )]: findingData.scopeIndex,
    }
  );
}

function insertRecommendation(
  editor: Editor,
  chain: () => ChainedCommands,
  findingData: EditorFindingData
): ChainedCommands {
  const recommendation: EditorContent | null =
    findingData.finding.recommendation;

  const recommendationText: string | undefined = recommendation?.text;

  if (!recommendation || isNilOrEmpty(recommendationText?.trim())) {
    return chain();
  }

  const existingScopeRecommendations: NodePos[] = editor.$doc.querySelectorAll(
    EDITOR_REPORT_EXTENSION_LIST_ITEM_NODE_NAME,
    {
      [generateEditorAttributeName(
        EDITOR_REPORT_ATTRIBUTE_NAMES.RecommendationScopeIndex
      )]: findingData.scopeIndex,
    }
  );

  if (existingScopeRecommendations && existingScopeRecommendations.length) {
    // Recommendation(s) for scope already exists
    return insertRecommendationInExistingScopeRecommendations(
      chain,
      findingData,
      recommendation.html,
      existingScopeRecommendations
    );
  }

  const scopeRecommendationIndices: number[] =
    findScopeRecommendationIndices(editor);

  if (!scopeRecommendationIndices.length) {
    // First recommendation in report
    return insertFirstRecommendationInReport(
      editor,
      chain,
      findingData,
      recommendation.html
    );
  }

  // First recommendation in scope
  return insertFirstRecommendationInScope(
    editor,
    chain,
    findingData,
    recommendation.html,
    scopeRecommendationIndices
  );
}

function insertFirstRecommendationInScope(
  editor: Editor,
  chain: () => ChainedCommands,
  finding: EditorFindingData,
  recommendationHTML: string,
  scopeRecommendationIndices: number[]
) {
  const closestIndex: number = findClosest(
    scopeRecommendationIndices,
    finding.scopeIndex
  );

  const html: string = generateRecommendationHTML(finding, recommendationHTML);

  const closestScopeRecommendationNodes: NodePos[] =
    editor.$doc.querySelectorAll(EDITOR_REPORT_EXTENSION_LIST_ITEM_NODE_NAME, {
      [generateEditorAttributeName(
        EDITOR_REPORT_ATTRIBUTE_NAMES.RecommendationScopeIndex
      )]: closestIndex,
    });

  if (!closestScopeRecommendationNodes?.length) {
    throw new Error('No closest scope recommendations found');
  }

  if (finding.scopeIndex < closestIndex) {
    // insert recommendation before closest scope recommendations
    const firstRecommendationInClosestScope: NodePos =
      closestScopeRecommendationNodes[0];

    return chain().insertContentAt(
      firstRecommendationInClosestScope.pos - 1,
      html
    );
  } else {
    // insert recommendation after closest scope recommendations
    const lastRecommendationInClosestScope: NodePos =
      closestScopeRecommendationNodes[
        closestScopeRecommendationNodes.length - 1
      ];

    return chain().insertContentAt(
      lastRecommendationInClosestScope.pos +
        lastRecommendationInClosestScope.size -
        1,
      html
    );
  }
}

function insertFirstImpressionInScope(
  editor: Editor,
  chain: () => ChainedCommands,
  finding: EditorFindingData,
  impressionHTML: string,
  scopeImpressionIndices: number[]
) {
  const closestIndex: number = findClosest(
    scopeImpressionIndices,
    finding.scopeIndex
  );

  const html: string = generateImpressionHTML(finding, impressionHTML);

  const closestScopeImpressionNodes: NodePos[] = editor.$doc.querySelectorAll(
    EDITOR_REPORT_EXTENSION_LIST_ITEM_NODE_NAME,
    {
      [generateEditorAttributeName(
        EDITOR_REPORT_ATTRIBUTE_NAMES.ImpressionScopeIndex
      )]: closestIndex,
    }
  );

  if (!closestScopeImpressionNodes?.length) {
    throw new Error('No closest scope impressions found');
  }

  if (finding.scopeIndex < closestIndex) {
    // insert impression before closest scope impression
    const firstImpressionInClosestScope: NodePos =
      closestScopeImpressionNodes[0];

    return chain().insertContentAt(firstImpressionInClosestScope.pos - 1, html);
  } else {
    // insert impression after closest scope impression
    const lastImpressionInClosestScope: NodePos =
      closestScopeImpressionNodes[closestScopeImpressionNodes.length - 1];

    return chain().insertContentAt(
      lastImpressionInClosestScope.pos + lastImpressionInClosestScope.size - 1,
      html
    );
  }
}

function insertFirstImpressionInReport(
  editor: Editor,
  chain: () => ChainedCommands,
  finding: EditorFindingData,
  impressionHTML: string
): ChainedCommands {
  const html: string = generateFirstImpressionHTML(finding, impressionHTML);

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

function insertFirstRecommendationInReport(
  editor: Editor,
  chain: () => ChainedCommands,
  finding: EditorFindingData,
  recommendationHTML: string
): ChainedCommands {
  const html: string = generateFirstRecommendationHTML(
    finding,
    recommendationHTML
  );

  const impressionsSection: NodePos | null = editor.$doc.querySelector(
    EDITOR_REPORT_EXTENSION_NODE_NAME,
    {
      id: EDITOR_REPORT_ID.RadioReportImpressions,
    }
  );

  if (impressionsSection) {
    // Insert after impressions sections
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

function insertImpressionInExistingScopeImpressions(
  editor: Editor,
  chain: () => ChainedCommands,
  findingData: EditorFindingData,
  impressionHTML: string | null,
  existingScopeImpressionNodes: NodePos[]
): ChainedCommands {
  const html: string | null = isNil(impressionHTML)
    ? null
    : generateImpressionHTML(findingData, impressionHTML);

  const lastNode: NodePos =
    existingScopeImpressionNodes[existingScopeImpressionNodes.length - 1];

  if (findingData.finding.isNormal) {
    // If normal finding than remove existing impressions and insert only normal impression
    return replaceWithNormalImpressionInScope(
      editor,
      chain,
      html,
      existingScopeImpressionNodes
    );
  }

  const normalNode: NodePos | null = tryGetNormalImpression(
    existingScopeImpressionNodes
  );

  if (normalNode) {
    // If not normal finding and existing scope has any normal impression. Remove normal impression and insert the new impression
    return replaceNormalImpressionWithAbNormalImpression(
      editor,
      chain,
      html,
      normalNode,
      existingScopeImpressionNodes
    );
  }

  if (isNil(html)) {
    return chain();
  }

  // insert after the last impression of the existing scope impressions
  return chain().insertContentAt(lastNode.pos + lastNode.size - 1, html);
}

function insertRecommendationInExistingScopeRecommendations(
  chain: () => ChainedCommands,
  findingData: EditorFindingData,
  recommendationHTML: string,
  existingScopeRecommendationNodes: NodePos[]
): ChainedCommands {
  const html: string = generateRecommendationHTML(
    findingData,
    recommendationHTML
  );

  const lastRecommendationNode: NodePos =
    existingScopeRecommendationNodes[
      existingScopeRecommendationNodes.length - 1
    ];

  // insert after the last recommendation of the existing scope recommendations
  return chain().insertContentAt(
    lastRecommendationNode.pos + lastRecommendationNode.size - 1,
    html
  );
}

function insertFirstFindingInScope(
  editor: Editor,
  chain: () => ChainedCommands,
  findingData: EditorFindingData,
  scopeIndices: number[]
): ChainedCommands {
  const closestIndex: number = findClosest(
    scopeIndices,
    findingData.scopeIndex
  );

  const html: string = generateFirstFindingInScopeHTML(findingData);

  const closestScopeDiv: NodePos = editor.$doc.querySelector(
    EDITOR_REPORT_EXTENSION_NODE_NAME,
    {
      [generateEditorAttributeName(
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

function findClosest(array: number[], num: number): number {
  return array.reduce((prev: number, curr: number): number => {
    return Math.abs(curr - num) < Math.abs(prev - num) ? curr : prev;
  });
}

function findScopeFindingIndices(editor: Editor): number[] {
  return findIndices(
    editor,
    EDITOR_REPORT_EXTENSION_NODE_NAME,
    EDITOR_REPORT_ATTRIBUTE_VALUES.Scope,
    EDITOR_REPORT_ATTRIBUTE_NAMES.FindingScopeIndex
  );
}

function findScopeImpressionIndices(editor: Editor): number[] {
  return findIndices(
    editor,
    EDITOR_REPORT_EXTENSION_LIST_ITEM_NODE_NAME,
    EDITOR_REPORT_ATTRIBUTE_VALUES.Impression,
    EDITOR_REPORT_ATTRIBUTE_NAMES.ImpressionScopeIndex
  );
}

function findScopeRecommendationIndices(editor: Editor): number[] {
  return findIndices(
    editor,
    EDITOR_REPORT_EXTENSION_LIST_ITEM_NODE_NAME,
    EDITOR_REPORT_ATTRIBUTE_VALUES.Recommendation,
    EDITOR_REPORT_ATTRIBUTE_NAMES.RecommendationScopeIndex
  );
}

function findIndices(
  editor: Editor,
  nodeName: string,
  nodeType: string,
  indexAttributeName: string
): number[] {
  const indices: number[] = [];

  editor.$doc
    .querySelectorAll(nodeName, {
      [generateEditorAttributeName(EDITOR_REPORT_ATTRIBUTE_NAMES.RadioItem)]:
        nodeType,
    })
    .forEach((node: NodePos): void => {
      const indexAttribute: string = node.attributes[
        generateEditorAttributeName(indexAttributeName)
      ] as string;

      const index: number = parseInt(indexAttribute, 10);

      indices.push(index);
    });

  return indices;
}

function insertFindingInExistingScope(
  chain: () => ChainedCommands,
  findingData: EditorFindingData,
  existingScopeSection: NodePos
): ChainedCommands {
  const html: string = generateFindingHTML(findingData.finding);

  if (findingData.finding.isNormal) {
    // If normal finding than remove existing findings and insert only normal finding
    return replaceWithNormalFindingInScope(chain, html, existingScopeSection);
  }

  const normalFinding: NodePos | null =
    tryGetNormalFinding(existingScopeSection);

  if (normalFinding) {
    // If not normal finding and existing scope has any normal finding. Remove normal finding and insert the new finding
    return replaceNormalFindingWithAbNormalFinding(chain, html, normalFinding);
  }

  // If finding is not normal and there are no existing normal findings in scope
  return appendFindingInScope(chain, html, existingScopeSection);
}

function appendFindingInScope(
  chain: () => ChainedCommands,
  html: string,
  existingScopeSection: NodePos
): ChainedCommands {
  const lastChild: NodePos | null = existingScopeSection.lastChild;

  if (lastChild) {
    // Add finding as the last item in the scope section
    return chain().insertContentAt(lastChild.pos + lastChild.size - 1, html);
  }

  // Add finding as the first item in the scope section
  return chain().insertContentAt(existingScopeSection.pos, html);
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

function replaceNormalImpressionWithAbNormalImpression(
  editor: Editor,
  chain: () => ChainedCommands,
  html: string | null,
  normal: NodePos,
  existingScopeNodes: NodePos[]
): ChainedCommands {
  if (isNil(html)) {
    return replaceImpressionWhenScopeHasOneImpression(
      editor,
      chain,
      html,
      normal,
      existingScopeNodes
    );
  }

  return chain()
    .deleteRange({
      from: normal.pos - 1,
      to: normal.pos + normal.size,
    })
    .insertContentAt(normal.pos - 1, html);
}

function replaceWithNormalFindingInScope(
  chain: () => ChainedCommands,
  html: string,
  existingScopeSection: NodePos
): ChainedCommands {
  const existingFindings: NodePos[] = existingScopeSection.querySelectorAll(
    EDITOR_REPORT_EXTENSION_NODE_NAME,
    {
      [generateEditorAttributeName(EDITOR_REPORT_ATTRIBUTE_NAMES.RadioItem)]:
        EDITOR_REPORT_ATTRIBUTE_VALUES.Finding,
    }
  );

  if (!existingFindings?.length) {
    // first finding in scope
    return appendFindingInScope(chain, html, existingScopeSection);
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

function insertFirstImpressionAsLastItemInScope(
  chain: () => ChainedCommands,
  html: string | null,
  existingScopeNodes: NodePos[]
): ChainedCommands {
  if (isNil(html)) {
    // No impression to insert
    return chain();
  }

  const lastNode: NodePos = existingScopeNodes[existingScopeNodes.length - 1];

  // Insert after last existing scope impression
  return chain().insertContentAt(lastNode.pos + lastNode.size - 1, html);
}

function replaceImpressionWhenScopeHasOneImpression(
  editor: Editor,
  chain: () => ChainedCommands,
  html: string | null,
  firstNode: NodePos,
  existingScopeNodes: NodePos[]
): ChainedCommands {
  if (isNil(html)) {
    return removeImpressionsInScope(
      editor,
      chain,
      firstNode,
      firstNode,
      existingScopeNodes
    );
  }

  // Remove the only impression and replace it with normal impression
  return chain()
    .deleteRange({
      from: firstNode.pos - 1,
      to: firstNode.pos + firstNode.size,
    })
    .insertContentAt(firstNode.pos - 1, html);
}

function removeImpressionsInScope(
  editor: Editor,
  chain: () => ChainedCommands,
  firstNode: NodePos,
  lastNode: NodePos,
  existingScopeNodes: NodePos[]
): ChainedCommands {
  const hasOnlyCurrentScopeNodes: boolean = hasOnlyCurrentScopeImpression(
    editor,
    existingScopeNodes
  ); // Impression to be removed are the only impressions in the report

  if (hasOnlyCurrentScopeNodes) {
    // Remove impressions section since the impressions to be removed are the only impressions in the report
    return removeImpressionSection(editor, chain, firstNode, lastNode);
  }

  // Remove impression from first to last
  return chain().deleteRange({
    from: firstNode.pos - 1,
    to: lastNode.pos + lastNode.size,
  });
}

function removeImpressionSection(
  editor: Editor,
  chain: () => ChainedCommands,
  firstNode: NodePos,
  lastNode: NodePos
): ChainedCommands {
  const rootNode: NodePos | null = findRootImpressionNode(editor);

  if (!rootNode) {
    // Remove all impression from first to last
    return chain().deleteRange({
      from: firstNode.pos - 1,
      to: lastNode.pos + lastNode.size,
    });
  }

  // Remove impressions root node (section)
  return chain().deleteRange({
    from: rootNode.pos - 1,
    to: rootNode.pos + rootNode.size - 1,
  });
}

function replaceWithNormalImpressionInScope(
  editor: Editor,
  chain: () => ChainedCommands,
  html: string | null,
  existingScopeNodes: NodePos[]
): ChainedCommands {
  const existingNodes: NodePos[] = existingScopeNodes.filter(
    (node: NodePos): boolean =>
      node.attributes[
        generateEditorAttributeName(EDITOR_REPORT_ATTRIBUTE_NAMES.RadioItem)
      ] === EDITOR_REPORT_ATTRIBUTE_VALUES.Impression
  );

  if (!existingNodes?.length) {
    // first impression in scope
    return insertFirstImpressionAsLastItemInScope(
      chain,
      html,
      existingScopeNodes
    );
  }

  const firstNode: NodePos = existingNodes[0];

  if (existingNodes.length === 1) {
    // Remove the only abnormal impression and replace it with normal impression)
    return replaceImpressionWhenScopeHasOneImpression(
      editor,
      chain,
      html,
      firstNode,
      existingNodes
    );
  }

  const lastNode: NodePos = existingNodes[existingNodes.length - 1];

  // Remove all the abnormal impression and replace it with normal impression
  if (isNil(html)) {
    return removeImpressionsInScope(
      editor,
      chain,
      firstNode,
      lastNode,
      existingScopeNodes
    );
  }

  // Remove impressions from first to last
  return chain()
    .deleteRange({
      from: firstNode.pos - 1,
      to: lastNode.pos + lastNode.size,
    })
    .insertContentAt(firstNode.pos - 1, html);
}

function hasOnlyCurrentScopeImpression(
  editor: Editor,
  existingScopeNodes: NodePos[]
): boolean {
  const allNodes: NodePos[] = editor.$doc.querySelectorAll(
    EDITOR_REPORT_EXTENSION_LIST_ITEM_NODE_NAME,
    {
      [generateEditorAttributeName(EDITOR_REPORT_ATTRIBUTE_NAMES.RadioItem)]:
        EDITOR_REPORT_ATTRIBUTE_VALUES.Impression,
    }
  );

  return allNodes.length === existingScopeNodes.length;
}

function findRootImpressionNode(editor: Editor): NodePos | null {
  return editor.$doc.querySelector(EDITOR_REPORT_EXTENSION_NODE_NAME, {
    id: EDITOR_REPORT_ID.RadioReportImpressions,
  });
}

function tryGetNormalFinding(existingScopeSection: NodePos): NodePos | null {
  const normalFinding: NodePos | null = existingScopeSection.querySelector(
    EDITOR_REPORT_EXTENSION_NODE_NAME,
    {
      [generateEditorAttributeName(
        EDITOR_REPORT_ATTRIBUTE_NAMES.IsNormalFinding
      )]: true,
    }
  );

  return normalFinding;
}

function tryGetNormalImpression(existingScopeNodes: NodePos[]): NodePos | null {
  const normal: NodePos | null =
    existingScopeNodes.find(
      (node: NodePos): boolean =>
        node.attributes[
          generateEditorAttributeName(
            EDITOR_REPORT_ATTRIBUTE_NAMES.IsNormalFinding
          )
        ] === true
    ) ?? null;

  return normal;
}

function generateProtocolHTML(template: Template): string {
  const radioItem: string = generateDataAttribute(
    EDITOR_REPORT_ATTRIBUTE_NAMES.RadioItem,
    EDITOR_REPORT_ATTRIBUTE_VALUES.ProtocolSection
  );

  const sectionId: string = EDITOR_REPORT_ID.RadioReportProtocol;

  const protocolTitle: string = generateDataAttribute(
    EDITOR_REPORT_ATTRIBUTE_NAMES.RadioItem,
    EDITOR_REPORT_ATTRIBUTE_VALUES.ProtocolTitle
  );

  return (
    `<div ${radioItem} id="${sectionId}">` +
    `<p ${protocolTitle}><u><b>${escapeAndSanitizeHTML(template.name)}</b></u></p>` +
    `<p><b>Protocol:</b></p>` +
    sanitizeHTML(template.protocol.html) +
    `<p><b>Clinical Profile:</b></p>` +
    `<p><b>Comparison:</b></p>` +
    `</div>`
  );
}

function generateFirstFindingInReportHTML(
  findingData: EditorFindingData
): string {
  const radioItem: string = generateDataAttribute(
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
  const radioItem: string = generateDataAttribute(
    EDITOR_REPORT_ATTRIBUTE_NAMES.RadioItem,
    EDITOR_REPORT_ATTRIBUTE_VALUES.Scope
  );

  const scopeIndex: string = generateDataAttribute(
    EDITOR_REPORT_ATTRIBUTE_NAMES.FindingScopeIndex,
    findingData.scopeIndex
  );

  const dataId: string = generateDataAttribute(
    EDITOR_REPORT_ATTRIBUTE_NAMES.ScopeId,
    findingData.scope.id
  );

  return (
    `<div ${radioItem} ${scopeIndex} ${dataId}>` +
    `<p><b>${escapeAndSanitizeHTML(findingData.scope.name)}</b></p>` +
    generateFindingHTML(findingData.finding) +
    `</div>`
  );
}

function generateFindingHTML(finding: FindingData): string {
  const radioItem: string = generateDataAttribute(
    EDITOR_REPORT_ATTRIBUTE_NAMES.RadioItem,
    EDITOR_REPORT_ATTRIBUTE_VALUES.Finding
  );

  const isNormal: string = generateDataAttribute(
    EDITOR_REPORT_ATTRIBUTE_NAMES.IsNormalFinding,
    finding.isNormal
  );

  const dataId: string = generateDataAttribute(
    EDITOR_REPORT_ATTRIBUTE_NAMES.FindingId,
    finding.id
  );

  return (
    `<div ${radioItem} ${isNormal} ${dataId}>` +
    sanitizeHTML(finding.description.html) +
    `</div>`
  );
}

function generateFirstImpressionHTML(
  findingData: EditorFindingData,
  impressionHTML: string
): string {
  const radioItem: string = generateDataAttribute(
    EDITOR_REPORT_ATTRIBUTE_NAMES.RadioItem,
    EDITOR_REPORT_ATTRIBUTE_VALUES.ImpressionsSection
  );

  const sectionId: string = EDITOR_REPORT_ID.RadioReportImpressions;

  const listId: string = EDITOR_REPORT_ID.RadioReportImpressionsList;

  return (
    `<div ${radioItem} id="${sectionId}">` +
    `<p><u><b>Impressions:</b></u></p>` +
    `<ol id="${listId}">` +
    generateImpressionHTML(findingData, impressionHTML) +
    `</ol>` +
    `</div>`
  );
}

function generateImpressionHTML(
  findingData: EditorFindingData,
  impressionHTML: string
): string {
  const radioItem: string = generateDataAttribute(
    EDITOR_REPORT_ATTRIBUTE_NAMES.RadioItem,
    EDITOR_REPORT_ATTRIBUTE_VALUES.Impression
  );

  const scopeIndex: string = generateDataAttribute(
    EDITOR_REPORT_ATTRIBUTE_NAMES.ImpressionScopeIndex,
    findingData.scopeIndex
  );

  const isNormal: string = generateDataAttribute(
    EDITOR_REPORT_ATTRIBUTE_NAMES.IsNormalFinding,
    findingData.finding.isNormal
  );

  const dataId: string = generateDataAttribute(
    EDITOR_REPORT_ATTRIBUTE_NAMES.ImpressionId,
    findingData.finding.id
  );

  return (
    `<li ${radioItem} ${scopeIndex} ${isNormal} ${dataId}>` +
    sanitizeHTML(impressionHTML) +
    `</li>`
  );
}

function generateFirstRecommendationHTML(
  findingData: EditorFindingData,
  recommendationHTML: string
): string {
  const radioItem: string = generateDataAttribute(
    EDITOR_REPORT_ATTRIBUTE_NAMES.RadioItem,
    EDITOR_REPORT_ATTRIBUTE_VALUES.RecommendationsSection
  );

  const sectionId: string = EDITOR_REPORT_ID.RadioReportRecommendations;

  const listId: string = EDITOR_REPORT_ID.RadioReportRecommendationsList;

  return (
    `<div ${radioItem} id="${sectionId}">` +
    `<p><u><b>Recommendations:</b></u></p>` +
    `<ol id="${listId}">` +
    generateRecommendationHTML(findingData, recommendationHTML) +
    `</ol>` +
    `</div>`
  );
}

function generateRecommendationHTML(
  findingData: EditorFindingData,
  recommendationHTML: string
): string {
  const radioItem: string = generateDataAttribute(
    EDITOR_REPORT_ATTRIBUTE_NAMES.RadioItem,
    EDITOR_REPORT_ATTRIBUTE_VALUES.Recommendation
  );

  const scopeIndex: string = generateDataAttribute(
    EDITOR_REPORT_ATTRIBUTE_NAMES.RecommendationScopeIndex,
    findingData.scopeIndex
  );

  const isNormal: string = generateDataAttribute(
    EDITOR_REPORT_ATTRIBUTE_NAMES.IsNormalFinding,
    findingData.finding.isNormal
  );

  const dataId: string = generateDataAttribute(
    EDITOR_REPORT_ATTRIBUTE_NAMES.RecommendationId,
    findingData.finding.id
  );

  return (
    `<li ${radioItem} ${scopeIndex} ${isNormal} ${dataId}>` +
    sanitizeHTML(recommendationHTML) +
    `</li>`
  );
}

function generateDataAttribute(
  attributeName: string,
  attributeValue: string | number | boolean
): string {
  if (typeof attributeValue === 'string') {
    return `${generateEditorAttributeName(attributeName)}="${attributeValue}"`;
  }

  return `${generateEditorAttributeName(attributeName)}=${attributeValue}`;
}

function sanitizeHTML(html: string | null | undefined): string {
  if (isNil(html)) {
    return '';
  }

  return DOMPurify.sanitize(html, { USE_PROFILES: { html: true } });
}

function escapeHTML(html: string | null | undefined): string {
  return escape(html ?? undefined);
}

function escapeAndSanitizeHTML(html: string | null | undefined): string {
  return sanitizeHTML(escapeHTML(html));
}
