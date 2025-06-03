import { ChainedCommands, Editor } from '@tiptap/core';
import { EditorView } from '@tiptap/pm/view';

import { Template } from '@app/models/domain';
import { EditorFindingData } from '@app/models/ui';

import { EditorReportVariableValueOptions } from '../extensions/radio-extensions/editor-report-variable-value.extension';

import { insertRadioFindingInEditor } from './editor-report-finding-extension.functions';
import { insertRadioImpressionInEditor } from './editor-report-impression-extension.functions';
import { insertRadioProtocolInEditor } from './editor-report-protocol-extension.functions';
import { insertRadioRecommendationInEditor } from './editor-report-recommendation-extension.functions';
import {
  replaceRadioVariableValueForFindingInEditor,
  replaceRadioVariableValueForImpressionInEditor,
  replaceRadioVariableValueInNextTableCellForNoInEditor,
} from './editor-report-variable-value-extension.functions';

export function insertProtocolInEditor(
  editor: Editor,
  chain: () => ChainedCommands,
  template: Template
): boolean {
  return insertRadioProtocolInEditor(editor, chain, template).run();
}

export function insertFindingInEditor(
  editor: Editor,
  chain: () => ChainedCommands,
  findingData: EditorFindingData
): boolean {
  return insertRadioFindingInEditor(editor, chain, findingData).run();
}

export function insertImpressionInEditor(
  editor: Editor,
  chain: () => ChainedCommands,
  findingData: EditorFindingData
): boolean {
  return insertRadioImpressionInEditor(editor, chain, findingData).run();
}

export function insertRecommendationInEditor(
  editor: Editor,
  chain: () => ChainedCommands,
  findingData: EditorFindingData
): boolean {
  return insertRadioRecommendationInEditor(editor, chain, findingData).run();
}

export function replaceVariableValueForFindingInEditor(
  chain: () => ChainedCommands,
  options: EditorReportVariableValueOptions
): boolean {
  return replaceRadioVariableValueForFindingInEditor(chain, options);
}

export function replaceVariableValueInNextTableCellForNoInEditor(
  chain: () => ChainedCommands,
  view: EditorView,
  options: EditorReportVariableValueOptions
): boolean {
  return replaceRadioVariableValueInNextTableCellForNoInEditor(
    chain,
    view,
    options
  );
}

export function replaceVariableValueForImpressionInEditor(
  chain: () => ChainedCommands,
  view: EditorView,
  options: EditorReportVariableValueOptions
): boolean {
  return replaceRadioVariableValueForImpressionInEditor(chain, view, options);
}
