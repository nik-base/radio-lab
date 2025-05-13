import { MentionNodeAttrs } from '@tiptap/extension-mention';

export interface EditorMentionVariableNodeAttributes extends MentionNodeAttrs {
  readonly varsource?: string;
  readonly vartype?: string;
}
