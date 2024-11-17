import { JSONContent } from '@tiptap/core';

export interface EditorContent {
  readonly text: string;
  readonly html: string;
  readonly json: JSONContent | null;
}
