import { Mention } from '@tiptap/extension-mention';

// eslint-disable-next-line @typescript-eslint/typedef
export const EditorMentionVariable = Mention.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      varsource: {
        default: null,
        parseHTML: (element: HTMLElement): string | null =>
          element.getAttribute('data-varsource'),
        renderHTML: (
          attributes: Record<string, unknown>
        ): Record<string, unknown> => {
          return {
            'data-varsource': attributes['varsource'],
          };
        },
      },
      vartype: {
        default: null,
        parseHTML: (element: HTMLElement): string | null =>
          element.getAttribute('data-vartype'),
        renderHTML: (
          attributes: Record<string, unknown>
        ): Record<string, unknown> => {
          return {
            'data-vartype': attributes['vartype'],
          };
        },
      },
    };
  },
});
