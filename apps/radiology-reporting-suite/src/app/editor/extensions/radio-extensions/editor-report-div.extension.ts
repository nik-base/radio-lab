import { Node, mergeAttributes } from '@tiptap/core';

import {
  EDITOR_REPORT_ATTRIBUTE_NAMES,
  EDITOR_REPORT_EXTENSION_NODE_NAME,
} from '@app/editor/constants';
import { generateEditorDataAttributeName } from '@app/editor/utils/editor-report-common-extension.functions';

export const EditorReportDiv: Node = Node.create({
  name: EDITOR_REPORT_EXTENSION_NODE_NAME,
  group: 'block',
  content: 'block*',
  addAttributes() {
    return {
      [generateEditorDataAttributeName(
        EDITOR_REPORT_ATTRIBUTE_NAMES.RadioItem
      )]: {},
      [generateEditorDataAttributeName(
        EDITOR_REPORT_ATTRIBUTE_NAMES.FindingScopeIndex
      )]: {},
      [generateEditorDataAttributeName(
        EDITOR_REPORT_ATTRIBUTE_NAMES.FindingIndex
      )]: {},
      [generateEditorDataAttributeName(EDITOR_REPORT_ATTRIBUTE_NAMES.ScopeId)]:
        {},
      [generateEditorDataAttributeName(
        EDITOR_REPORT_ATTRIBUTE_NAMES.FindingId
      )]: {},
      [generateEditorDataAttributeName(
        EDITOR_REPORT_ATTRIBUTE_NAMES.IsNormalFinding
      )]: {},
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
