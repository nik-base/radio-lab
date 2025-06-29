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

export function insertRadioImpressionInEditor(
  editor: Editor,
  chain: () => ChainedCommands,
  findingData: EditorFindingData
): ChainedCommands {
  return insertRadioImpressionOrRecommendationInEditor(
    editor,
    chain,
    findingData,
    findingData.finding.impression,
    EDITOR_REPORT_ID.RadioReportImpressions,
    EDITOR_REPORT_ATTRIBUTE_VALUES.Impression,
    EDITOR_REPORT_ATTRIBUTE_NAMES.ImpressionScopeIndex,
    EDITOR_REPORT_ATTRIBUTE_NAMES.ImpressionGroupId,
    generateImpressionHTML,
    generateFirstImpressionHTML
  );
}

function generateFirstImpressionHTML(
  findingData: EditorFindingData,
  impressionHTML: string
): string {
  const radioItem: string = generateEditorDataAttribute(
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
  const radioItem: string = generateEditorDataAttribute(
    EDITOR_REPORT_ATTRIBUTE_NAMES.RadioItem,
    EDITOR_REPORT_ATTRIBUTE_VALUES.Impression
  );

  const scopeIndex: string = generateEditorDataAttribute(
    EDITOR_REPORT_ATTRIBUTE_NAMES.ImpressionScopeIndex,
    findingData.scopeIndex
  );

  const isNormal: string = generateEditorDataAttribute(
    EDITOR_REPORT_ATTRIBUTE_NAMES.IsNormalFinding,
    findingData.finding.isNormal
  );

  const dataId: string = generateEditorDataAttribute(
    EDITOR_REPORT_ATTRIBUTE_NAMES.ImpressionId,
    findingData.finding.id
  );

  const groupId: string = generateEditorDataAttribute(
    EDITOR_REPORT_ATTRIBUTE_NAMES.ImpressionGroupId,
    findingData.finding.groupId
  );

  return (
    `<li ${radioItem} ${scopeIndex} ${isNormal} ${groupId} ${dataId}>` +
    sanitizeHTML(impressionHTML) +
    `</li>`
  );
}
