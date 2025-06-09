import { CommandProps, Extension } from '@tiptap/core';

import {
  insertFindingInEditor,
  insertImpressionInEditor,
  insertRecommendationInEditor,
} from '@app/editor/utils/editor-report-extension.functions';
import { EditorFindingData } from '@app/models/ui';

export interface EditorReportFindingOptions {
  readonly finding: EditorFindingData;
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    insertReportFinding: {
      /**
       * Inserts a finding into the editor based on the provided finding data.
       */
      insertReportFinding: (options: EditorReportFindingOptions) => ReturnType;
    };

    insertReportImpression: {
      /**
       * Inserts a impression into the editor based on the provided finding data.
       */
      insertReportImpression: (
        options: EditorReportFindingOptions
      ) => ReturnType;
    };

    insertReportRecommendation: {
      /**
       * Inserts a recommendation into the editor based on the provided finding data.
       */
      insertReportRecommendation: (
        options: EditorReportFindingOptions
      ) => ReturnType;
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

      insertReportImpression:
        (options: EditorReportFindingOptions) =>
        ({ editor, chain }: CommandProps) => {
          return insertImpressionInEditor(editor, chain, options.finding);
        },

      insertReportRecommendation:
        (options: EditorReportFindingOptions) =>
        ({ editor, chain }: CommandProps) => {
          return insertRecommendationInEditor(editor, chain, options.finding);
        },
    };
  },
});
