import { MentionNodeAttrs } from '@tiptap/extension-mention';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface EditorMentionNodeAttributes<T = any> extends MentionNodeAttrs {
  readonly data?: T;
}
