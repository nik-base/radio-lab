import { Node } from '@tiptap/core';
import { BulletList, BulletListOptions } from '@tiptap/extension-bullet-list';

// https://www.npmjs.com/package/tiptap-extension-bullet-list
export const EditorBulletedList: Node<BulletListOptions, unknown> =
  BulletList.extend({
    content: 'listItem*',
    addAttributes() {
      return {
        ...this.parent?.(),
        listType: {
          default: 'disc',
          parseHTML: (element: HTMLElement): string =>
            element.style.getPropertyValue('list-style-type') || 'disc',
          renderHTML: ({ listType }: Record<string, unknown>) => {
            return {
              style: `list-style-type: ${listType?.toString()}`,
            };
          },
        },
      };
    },
  });
