import { Node, mergeAttributes } from '@tiptap/core';

import {
  EDITOR_REPORT_ATTRIBUTE_NAMES,
  EDITOR_REPORT_EXTENSION_NODE_NAME,
} from '@app/editor/constants';

export const EditorReportDiv: Node = Node.create({
  name: EDITOR_REPORT_EXTENSION_NODE_NAME,
  group: 'block',
  content: 'block*',
  addAttributes() {
    return {
      [`data-${EDITOR_REPORT_ATTRIBUTE_NAMES.RadioItem}`]: {},
      [`data-${EDITOR_REPORT_ATTRIBUTE_NAMES.ScopeIndex}`]: {},
      [`data-${EDITOR_REPORT_ATTRIBUTE_NAMES.FindingIndex}`]: {},
      [`data-${EDITOR_REPORT_ATTRIBUTE_NAMES.ImpressionIndex}`]: {},
      [`data-${EDITOR_REPORT_ATTRIBUTE_NAMES.RecommendationIndex}`]: {},
      id: {},
    };
  },
  parseHTML() {
    return [{ tag: 'div' }];
  },
  // eslint-disable-next-line @typescript-eslint/typedef
  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes(HTMLAttributes), 0];
  },
});
