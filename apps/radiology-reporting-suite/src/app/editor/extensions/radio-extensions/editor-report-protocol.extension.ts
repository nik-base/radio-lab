import { CommandProps, Extension } from '@tiptap/core';

import { insertProtocolInEditor } from '@app/editor/utils/editor-report-extension.functions';
import { Template } from '@app/models/domain';

export interface EditorReportProtocolOptions {
  readonly template: Template;
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    insertReportProtocol: {
      /**
       * Inserts a protocol section into the editor based on the provided template.
       */
      insertReportProtocol: (
        options: EditorReportProtocolOptions
      ) => ReturnType;
    };
  }
}

export const EditorReportProtocol: Extension<
  EditorReportProtocolOptions,
  unknown
> = Extension.create({
  name: 'radioReportProtocol',

  addCommands() {
    return {
      insertReportProtocol:
        (options: EditorReportProtocolOptions) =>
        ({ editor, chain }: CommandProps) => {
          return insertProtocolInEditor(editor, chain, options.template);
        },
    };
  },
});
