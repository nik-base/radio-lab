import { ChainedCommands, Editor, NodePos } from '@tiptap/core';
import DOMPurify from 'dompurify';
import { escape, isNil } from 'lodash-es';

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

  if (!impression || isNilOrEmpty(impressionText?.trim())) {
    return chain();
  }

  const existingScopeImpressions: NodePos[] = editor.$doc.querySelectorAll(
    EDITOR_REPORT_EXTENSION_LIST_ITEM_NODE_NAME,
    {
      [generateEditorAttributeName(
        EDITOR_REPORT_ATTRIBUTE_NAMES.ImpressionScopeIndex
      )]: findingData.scopeIndex,
    }
  );

  if (existingScopeImpressions && existingScopeImpressions.length) {
    // Impression(s) for scope already exists
    return insertImpressionInExistingScopeImpressions(
      chain,
      findingData,
      impression.html,
      existingScopeImpressions
    );
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
  chain: () => ChainedCommands,
  findingData: EditorFindingData,
  impressionHTML: string,
  existingScopeImpressionNodes: NodePos[]
): ChainedCommands {
  const html: string = generateImpressionHTML(findingData, impressionHTML);

  const lastImpressionNode: NodePos =
    existingScopeImpressionNodes[existingScopeImpressionNodes.length - 1];

  // insert after the last impression of the existing scope impressions
  return chain().insertContentAt(
    lastImpressionNode.pos + lastImpressionNode.size - 1,
    html
  );
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

  const lastChild: NodePos | null = existingScopeSection.lastChild;

  if (lastChild) {
    // Add finding as the last item in the scope section
    return chain().insertContentAt(lastChild.pos + lastChild.size - 1, html);
  }

  // Add finding as the first item in the scope section
  return chain().insertContentAt(existingScopeSection.pos, html);
}

function generateProtocolHTML(template: Template): string {
  return `<div ${generateEditorAttributeName(EDITOR_REPORT_ATTRIBUTE_NAMES.RadioItem)}="${EDITOR_REPORT_ATTRIBUTE_VALUES.ProtocolSection}" id="${EDITOR_REPORT_ID.RadioReportProtocol}"><p ${generateEditorAttributeName(EDITOR_REPORT_ATTRIBUTE_NAMES.RadioItem)}="${EDITOR_REPORT_ATTRIBUTE_VALUES.ProtocolTitle}"><u><b>${escapeAndSanitizeHTML(template.name)}</b></u></p><p><b>Protocol:</b></p>${sanitizeHTML(template.protocol.html)}<p><b>Clinical Profile:</b></p><p><b>Comparison:</b></p></div>`;
}

function generateFirstFindingInReportHTML(
  findingData: EditorFindingData
): string {
  return `<div ${generateEditorAttributeName(EDITOR_REPORT_ATTRIBUTE_NAMES.RadioItem)}="${EDITOR_REPORT_ATTRIBUTE_VALUES.FindingsSection}" id="${EDITOR_REPORT_ID.RadioReportFindings}"><p><u><b>Findings:</b></u></p>${generateFirstFindingInScopeHTML(findingData)}</div>`;
}

function generateFirstFindingInScopeHTML(
  findingData: EditorFindingData
): string {
  return `<div ${generateEditorAttributeName(EDITOR_REPORT_ATTRIBUTE_NAMES.RadioItem)}="${EDITOR_REPORT_ATTRIBUTE_VALUES.Scope}" ${generateEditorAttributeName(EDITOR_REPORT_ATTRIBUTE_NAMES.FindingScopeIndex)}="${findingData.scopeIndex}" ${generateEditorAttributeName(EDITOR_REPORT_ATTRIBUTE_NAMES.ScopeId)}="${findingData.scope.id}"><p><b>${escapeAndSanitizeHTML(findingData.scope.name)}</b></p>${generateFindingHTML(findingData.finding)}</div>`;
}

function generateFindingHTML(finding: FindingData): string {
  return `<div ${generateEditorAttributeName(EDITOR_REPORT_ATTRIBUTE_NAMES.RadioItem)}="${EDITOR_REPORT_ATTRIBUTE_VALUES.Finding}" ${generateEditorAttributeName(EDITOR_REPORT_ATTRIBUTE_NAMES.FindingId)}="${finding.id}">${sanitizeHTML(finding.description.html)}</div>`;
}

function generateFirstImpressionHTML(
  findingData: EditorFindingData,
  impressionHTML: string
): string {
  return `<div ${generateEditorAttributeName(EDITOR_REPORT_ATTRIBUTE_NAMES.RadioItem)}="${EDITOR_REPORT_ATTRIBUTE_VALUES.ImpressionsSection}" id="${EDITOR_REPORT_ID.RadioReportImpressions}"><p><u><b>Impressions:</b></u></p><ol id="${EDITOR_REPORT_ID.RadioReportImpressionsList}">${generateImpressionHTML(findingData, impressionHTML)}</ol></div>`;
}

function generateImpressionHTML(
  findingData: EditorFindingData,
  impressionHTML: string
): string {
  return `<li ${generateEditorAttributeName(EDITOR_REPORT_ATTRIBUTE_NAMES.RadioItem)}="${EDITOR_REPORT_ATTRIBUTE_VALUES.Impression}" ${generateEditorAttributeName(EDITOR_REPORT_ATTRIBUTE_NAMES.ImpressionScopeIndex)}=${findingData.scopeIndex} ${generateEditorAttributeName(EDITOR_REPORT_ATTRIBUTE_NAMES.ImpressionId)}="${findingData.finding.id}">${sanitizeHTML(impressionHTML)}</li>`;
}

function generateFirstRecommendationHTML(
  findingData: EditorFindingData,
  recommendationHTML: string
): string {
  return `<div ${generateEditorAttributeName(EDITOR_REPORT_ATTRIBUTE_NAMES.RadioItem)}="${EDITOR_REPORT_ATTRIBUTE_VALUES.RecommendationsSection}" id="${EDITOR_REPORT_ID.RadioReportRecommendations}"><p><u><b>Recommendations:</b></u></p><ol id="${EDITOR_REPORT_ID.RadioReportRecommendationsList}">${generateRecommendationHTML(findingData, recommendationHTML)}</ol></div>`;
}

function generateRecommendationHTML(
  findingData: EditorFindingData,
  recommendationHTML: string
): string {
  return `<li ${generateEditorAttributeName(EDITOR_REPORT_ATTRIBUTE_NAMES.RadioItem)}="${EDITOR_REPORT_ATTRIBUTE_VALUES.Recommendation}" ${generateEditorAttributeName(EDITOR_REPORT_ATTRIBUTE_NAMES.RecommendationScopeIndex)}=${findingData.scopeIndex} ${generateEditorAttributeName(EDITOR_REPORT_ATTRIBUTE_NAMES.RecommendationId)}="${findingData.finding.id}">${sanitizeHTML(recommendationHTML)}</li>`;
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
