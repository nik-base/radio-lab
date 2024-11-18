import { CommandProps, Extension } from '@tiptap/core';

export interface NodeAlignOptions {
  /**
   * The types where the text align attribute can be applied.
   * @default []
   * @example ['heading', 'paragraph']
   */
  types: string[];

  /**
   * The alignments which are allowed.
   * @default ['left', 'center', 'right', 'justify']
   * @example ['left', 'right']
   */
  alignments: string[];

  /**
   * The default alignment.
   * @default 'left'
   * @example 'center'
   */
  defaultAlignment: string;
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    setNodeAlign: {
      setNodeAlign: (options: string) => ReturnType;
    };
    unsetNodeAlign: {
      unsetNodeAlign: () => ReturnType;
    };
  }
}

export const EditorNodeAlign: Extension<NodeAlignOptions, unknown> =
  Extension.create({
    name: 'nodeAlign',
    addOptions() {
      return {
        defaultAlignment: 'center',
        alignments: ['flex-start', 'center', 'flex-end'],
        types: ['image', 'video', 'audio', 'iframe', 'file'],
      };
    },
    addGlobalAttributes() {
      return [
        {
          types: this.options.types,
          attributes: {
            nodeAlign: {
              default: this.options.defaultAlignment,
              parseHTML: (element: HTMLElement) => {
                return (
                  element.style.justifyContent || this.options.defaultAlignment
                );
              },
              renderHTML: (attributes: Record<string, unknown>) => {
                if (attributes['nodeAlign'] === this.options.defaultAlignment) {
                  return {};
                }
                return {
                  style: `justify-content: ${attributes['nodeAlign']?.toString()}`,
                };
              },
            },
          },
        },
      ];
    },
    addCommands() {
      return {
        setNodeAlign:
          (alignment: string) =>
          ({ commands }: CommandProps) => {
            if (!this.options.alignments.includes(alignment)) {
              return false;
            }
            return this.options.types.every((type: string) =>
              commands.updateAttributes(type, { nodeAlign: alignment })
            );
          },
        unsetNodeAlign:
          () =>
          ({ commands }: CommandProps) => {
            return this.options.types.every((type: string) =>
              commands.resetAttributes(type, 'nodeAlign')
            );
          },
      };
    },
  });
