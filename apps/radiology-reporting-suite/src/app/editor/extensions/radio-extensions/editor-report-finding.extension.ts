import { CommandProps, Extension } from '@tiptap/core';

import { insertFindingInEditor } from '@app/editor/utils/editor-report-extension.functions';
import { EditorFindingData } from '@app/models/ui';

export interface EditorReportFindingOptions {
  readonly finding: EditorFindingData;
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    insertReportFinding: {
      /**
       * Inserts a finding, impression and recommendation in their appropriate section into the editor based on the provided finding data.
       */
      insertReportFinding: (options: EditorReportFindingOptions) => ReturnType;
    };
  }
}

export const EditorReportFinding: Extension<
  EditorReportFindingOptions,
  unknown
> = Extension.create({
  name: 'radioReportFinding',

  addCommands() {
    return {
      insertReportFinding:
        (options: EditorReportFindingOptions) =>
        ({ editor, chain }: CommandProps) => {
          return insertFindingInEditor(editor, chain, options.finding);
        },
    };
  },
});
