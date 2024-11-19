import { Editor } from '@tiptap/core';

export interface EditorToolbarItemContext<T = unknown> {
  readonly editor: Editor;
  readonly options?: T;
}
