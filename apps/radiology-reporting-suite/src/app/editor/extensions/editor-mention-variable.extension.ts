import { CommandProps } from '@tiptap/core';
import { Mention } from '@tiptap/extension-mention';

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    disableSuggestions: {
      disableSuggestions: () => ReturnType;
    };

    enableSuggestions: {
      enableSuggestions: () => ReturnType;
    };
  }
}

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

  addStorage() {
    return {
      suggestionsEnabled: true,
    };
  },

  addCommands() {
    return {
      ...this.parent?.(),

      disableSuggestions:
        () =>
        ({ editor }: CommandProps) => {
          (
            editor.storage[EditorMentionVariable.name] as {
              suggestionsEnabled: boolean;
            }
          ).suggestionsEnabled = false;
          return true;
        },

      enableSuggestions:
        () =>
        ({ editor }: CommandProps) => {
          (
            editor.storage['mention'] as { suggestionsEnabled: boolean }
          ).suggestionsEnabled = true;
          return true;
        },
    };
  },
});
