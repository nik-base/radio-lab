import { ChainedCommands, Editor } from '@tiptap/core';

import { EditorFindingData } from '@app/models/ui';

import {
  EDITOR_REPORT_ATTRIBUTE_NAMES,
  EDITOR_REPORT_ATTRIBUTE_VALUES,
  EDITOR_REPORT_ID,
} from '../constants';

import {
  generateEditorDataAttribute,
  sanitizeHTML,
} from './editor-report-common-extension.functions';
import { insertRadioImpressionOrRecommendationInEditor } from './editor-report-common-impression-recommendation-extension.functions';

export function insertRadioRecommendationInEditor(
  editor: Editor,
  chain: () => ChainedCommands,
  findingData: EditorFindingData
): ChainedCommands {
  return insertRadioImpressionOrRecommendationInEditor(
    editor,
    chain,
    findingData,
    findingData.finding.recommendation,
    EDITOR_REPORT_ID.RadioReportRecommendations,
    EDITOR_REPORT_ATTRIBUTE_VALUES.Recommendation,
    EDITOR_REPORT_ATTRIBUTE_NAMES.RecommendationScopeIndex,
    generateRecommendationHTML,
    generateFirstRecommendationHTML
  );
}

function generateFirstRecommendationHTML(
  findingData: EditorFindingData,
  recommendationHTML: string
): string {
  const radioItem: string = generateEditorDataAttribute(
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
  const radioItem: string = generateEditorDataAttribute(
    EDITOR_REPORT_ATTRIBUTE_NAMES.RadioItem,
    EDITOR_REPORT_ATTRIBUTE_VALUES.Recommendation
  );

  const scopeIndex: string = generateEditorDataAttribute(
    EDITOR_REPORT_ATTRIBUTE_NAMES.RecommendationScopeIndex,
    findingData.scopeIndex
  );

  const isNormal: string = generateEditorDataAttribute(
    EDITOR_REPORT_ATTRIBUTE_NAMES.IsNormalFinding,
    findingData.finding.isNormal
  );

  const dataId: string = generateEditorDataAttribute(
    EDITOR_REPORT_ATTRIBUTE_NAMES.RecommendationId,
    findingData.finding.id
  );

  return (
    `<li ${radioItem} ${scopeIndex} ${isNormal} ${dataId}>` +
    sanitizeHTML(recommendationHTML) +
    `</li>`
  );
}
