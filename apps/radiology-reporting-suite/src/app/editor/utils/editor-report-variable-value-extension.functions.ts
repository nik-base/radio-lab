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

  const noValues: string[] = ['no', 'free'];

  if (noValues.includes(options.variableValue.toLocaleLowerCase())) {
    // In table if current cell variable is set to "noValues" then set next cell variable to "-"
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

  const nextCellVariableElements: NodeListOf<HTMLElement> =
    nextCellElement.querySelectorAll<HTMLElement>(
      '.radio-mention[data-type="mention"]'
    );

  if (!nextCellVariableElements?.length) {
    return false;
  }

  return replaceVariableValuesInNextCell(
    chain,
    view,
    nextCellVariableElements
  ).run();
}

function replaceVariableValuesInNextCell(
  chain: () => ChainedCommands,
  view: EditorView,
  elements: NodeListOf<HTMLElement>
): ChainedCommands {
  let command: ChainedCommands = chain();

  for (let i: number = 0; i < elements.length; i++) {
    const position: number = view.posAtDOM(elements[i], 0);

    command = command
      .deleteRange({
        from: position,
        to: position + 1,
      })
      .insertContentAt(position, '-');
  }

  return command;
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
