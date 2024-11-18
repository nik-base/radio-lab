import { Node } from '@tiptap/core';
import {
  OrderedList,
  OrderedListOptions,
} from '@tiptap/extension-ordered-list';

// https://www.npmjs.com/package/tiptap-extension-ordered-list
export const EditorOrderedList: Node<OrderedListOptions, unknown> =
  OrderedList.extend({
    content: 'listItem*',
    addAttributes() {
      return {
        ...this.parent?.(),
        listType: {
          default: 'decimal',
          parseHTML: (element: HTMLElement): string =>
            element.style.getPropertyValue('list-style-type') || 'decimal',
          renderHTML: ({ listType }: Record<string, unknown>) => {
            return {
              style: `list-style-type: ${listType?.toString()}`,
            };
          },
        },
      };
    },
  });
