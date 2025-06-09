import { Node } from '@tiptap/core';
import { ListItem, ListItemOptions } from '@tiptap/extension-list-item';

import { EDITOR_REPORT_ATTRIBUTE_NAMES } from '@app/editor/constants';
import { generateEditorDataAttributeName } from '@app/editor/utils/editor-report-common-extension.functions';

export const EditorReportListItem: Node<ListItemOptions> = ListItem.extend({
  content: 'paragraph block*',

  addAttributes() {
    return {
      [generateEditorDataAttributeName(
        EDITOR_REPORT_ATTRIBUTE_NAMES.RadioItem
      )]: {},
      [generateEditorDataAttributeName(
        EDITOR_REPORT_ATTRIBUTE_NAMES.ImpressionScopeIndex
      )]: {},
      [generateEditorDataAttributeName(
        EDITOR_REPORT_ATTRIBUTE_NAMES.ImpressionIndex
      )]: {},
      [generateEditorDataAttributeName(
        EDITOR_REPORT_ATTRIBUTE_NAMES.RecommendationScopeIndex
      )]: {},
      [generateEditorDataAttributeName(
        EDITOR_REPORT_ATTRIBUTE_NAMES.RecommendationIndex
      )]: {},
      [generateEditorDataAttributeName(
        EDITOR_REPORT_ATTRIBUTE_NAMES.ImpressionId
      )]: {},
      [generateEditorDataAttributeName(
        EDITOR_REPORT_ATTRIBUTE_NAMES.RecommendationId
      )]: {},
      [generateEditorDataAttributeName(
        EDITOR_REPORT_ATTRIBUTE_NAMES.IsNormalFinding
      )]: {},
    };
  },
});
