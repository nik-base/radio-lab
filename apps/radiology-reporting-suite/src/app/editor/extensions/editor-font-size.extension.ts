import { CommandProps, Extension } from '@tiptap/core';

import { EDITOR_DEFAULT_FONT_SIZE } from '../constants';

export interface FontSizeOptions {
  readonly types: string[];
  readonly defaultFontSize: string;
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    setFontSize: {
      setFontSize: (fontSize: string) => ReturnType;
    };
    setFontSizeInPx: {
      setFontSizeInPx: (fontSizeInPx: number) => ReturnType;
    };
    unsetFontSize: {
      unsetFontSize: () => ReturnType;
    };
  }
}

export const EditorFontSize: Extension<FontSizeOptions, unknown> =
  Extension.create<FontSizeOptions>({
    name: 'fontSize',
    addOptions() {
      return {
        types: ['textStyle'],
        defaultFontSize: `${EDITOR_DEFAULT_FONT_SIZE}px`,
      };
    },
    addGlobalAttributes() {
      return [
        {
          types: this.options.types,
          attributes: {
            fontSize: {
              default: this.options.defaultFontSize,
              parseHTML: (element: HTMLElement): string =>
                element.style.fontSize || this.options.defaultFontSize,
              renderHTML: (attributes: Record<string, unknown>) => {
                if (attributes['fontSize'] === this.options.defaultFontSize) {
                  return {};
                }

                return {
                  style: `font-size: ${attributes['fontSize']?.toString()}`,
                };
              },
            },
          },
        },
      ];
    },
    addCommands() {
      return {
        setFontSize:
          (fontSize: string) =>
          ({ chain }: CommandProps): boolean =>
            chain().setMark('textStyle', { fontSize }).run(),
        setFontSizeInPx:
          (fontSizeInPx: number) =>
          ({ chain }: CommandProps): boolean =>
            chain()
              .setMark('textStyle', { fontSize: `${fontSizeInPx}px` })
              .run(),
        unsetFontSize:
          () =>
          ({ chain }: CommandProps): boolean =>
            chain()
              .setMark('textStyle', { fontSize: null })
              .removeEmptyTextStyle()
              .run(),
      };
    },
  });
