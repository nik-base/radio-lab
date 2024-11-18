import { Extension } from '@tiptap/core';
import { TextAlign, TextAlignOptions } from '@tiptap/extension-text-align';

export const EditorTextAlign: Extension<TextAlignOptions, unknown> =
  TextAlign.extend({
    addOptions() {
      return {
        ...this.parent?.(),
        types: ['heading', 'paragraph'],
        alignments: ['left', 'center', 'right', 'justify', 'distributed'],
      };
    },
    addGlobalAttributes() {
      return [
        {
          types: this.options.types,
          attributes: {
            textAlign: {
              default: this.options.defaultAlignment,
              parseHTML: (element: HTMLElement): string => {
                if (element.style.textAlignLast) {
                  return 'distributed';
                }

                return element.style.textAlign || this.options.defaultAlignment;
              },
              renderHTML: (attributes: Record<string, unknown>) => {
                if (attributes['textAlign'] === this.options.defaultAlignment) {
                  return {};
                }

                if (attributes['textAlign'] === 'distributed') {
                  return { style: 'text-align-last: justify' };
                }

                return {
                  style: `text-align: ${attributes['textAlign']?.toString()}`,
                };
              },
            },
          },
        },
      ];
    },
    addKeyboardShortcuts() {
      return {
        ...this.parent?.(),
        'Mod-Shift-d': (): boolean =>
          this.editor.commands.setTextAlign('distributed'),
      };
    },
  });
