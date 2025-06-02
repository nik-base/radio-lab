import { Node } from '@tiptap/core';
import { ListItem, ListItemOptions } from '@tiptap/extension-list-item';

import { EDITOR_REPORT_ATTRIBUTE_NAMES } from '@app/editor/constants';
import { generateEditorAttributeName } from '@app/editor/utils/editor-report-extension.functions';

export const EditorReportListItem: Node<ListItemOptions> = ListItem.extend({
  content: 'paragraph block*',

  addAttributes() {
    return {
      [generateEditorAttributeName(EDITOR_REPORT_ATTRIBUTE_NAMES.RadioItem)]:
        {},
      [generateEditorAttributeName(
        EDITOR_REPORT_ATTRIBUTE_NAMES.ImpressionScopeIndex
      )]: {},
      [generateEditorAttributeName(
        EDITOR_REPORT_ATTRIBUTE_NAMES.ImpressionIndex
      )]: {},
      [generateEditorAttributeName(
        EDITOR_REPORT_ATTRIBUTE_NAMES.RecommendationScopeIndex
      )]: {},
      [generateEditorAttributeName(
        EDITOR_REPORT_ATTRIBUTE_NAMES.RecommendationIndex
      )]: {},
      [generateEditorAttributeName(EDITOR_REPORT_ATTRIBUTE_NAMES.ImpressionId)]:
        {},
      [generateEditorAttributeName(
        EDITOR_REPORT_ATTRIBUTE_NAMES.RecommendationId
      )]: {},
      [generateEditorAttributeName(
        EDITOR_REPORT_ATTRIBUTE_NAMES.IsNormalFinding
      )]: {},
    };
  },
});
