import { ChainedCommands } from '@tiptap/core';
import { EditorView } from '@tiptap/pm/view';
import { isEmpty } from 'lodash-es';

import { EDITOR_REPORT_ID } from '../constants';
import { EditorReportVariableValueOptions } from '../extensions/radio-extensions/editor-report-variable-value.extension';

export function replaceRadioVariableValueForFindingInEditor(
  chain: () => ChainedCommands,
  options: EditorReportVariableValueOptions
): boolean {
  if (isEmpty(options.variableValue.trim())) {
    // Do not insert variable value
    return false;
  }

  return insertVariableValueForFinding(chain, options);
}

export function replaceRadioVariableValueInNextTableCellForNoInEditor(
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

export function replaceRadioVariableValueForImpressionInEditor(
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
