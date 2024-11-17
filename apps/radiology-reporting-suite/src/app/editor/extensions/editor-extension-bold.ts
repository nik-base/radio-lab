import { Mark } from '@tiptap/core';
import { Bold, BoldOptions } from '@tiptap/extension-bold';

export const EditorBold: Mark<BoldOptions, unknown> = Bold.extend({
  renderHTML: ({
    HTMLAttributes,
  }: {
    HTMLAttributes: Record<string, unknown>;
  }) => ['b', HTMLAttributes, 0],
});
