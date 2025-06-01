import { CommandProps, Extension } from '@tiptap/core';

import {
  replaceVariableValueForFindingInEditor,
  replaceVariableValueForImpressionInEditor,
  replaceVariableValueInNextTableCellForNoInEditor,
} from '@app/editor/utils/editor-report-extension.functions';

export interface EditorReportVariableValueOptions {
  readonly variableId: string;
  readonly variableName: string;
  readonly variableValue: string;
  readonly variableNodePosition: number;
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    replaceReportVariableValueForFinding: {
      /**
       * Replace the variable value in place of the variable for finding in the editor.
       */
      replaceReportVariableValueForFinding: (
        options: EditorReportVariableValueOptions
      ) => ReturnType;
    };
    replaceReportVariableValueInNextTableCellForNo: {
      /**
       * Replace the next table cell variable value in place of the variable with "-" when current table cell variable has value "No" in the editor.
       */
      replaceReportVariableValueInNextTableCellForNo: (
        options: EditorReportVariableValueOptions
      ) => ReturnType;
    };
    replaceReportVariableValueForImpression: {
      /**
       * Replace the variable value in place of the variable for impression in the editor.
       */
      replaceReportVariableValueForImpression: (
        options: EditorReportVariableValueOptions
      ) => ReturnType;
    };
  }
}

export const EditorReportVariableValue: Extension<
  EditorReportVariableValueOptions,
  unknown
> = Extension.create({
  name: 'radioReportVariableValue',

  addCommands() {
    return {
      replaceReportVariableValueForFinding:
        (options: EditorReportVariableValueOptions) =>
        ({ chain }: CommandProps) => {
          return replaceVariableValueForFindingInEditor(chain, options);
        },
      replaceReportVariableValueInNextTableCellForNo:
        (options: EditorReportVariableValueOptions) =>
        ({ chain, view }: CommandProps) => {
          return replaceVariableValueInNextTableCellForNoInEditor(
            chain,
            view,
            options
          );
        },
      replaceReportVariableValueForImpression:
        (options: EditorReportVariableValueOptions) =>
        ({ chain, view }: CommandProps) => {
          return replaceVariableValueForImpressionInEditor(
            chain,
            view,
            options
          );
        },
    };
  },
});
