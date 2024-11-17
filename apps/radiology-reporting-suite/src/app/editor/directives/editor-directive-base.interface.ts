import { EditorToolbarItemContext } from '../models/editor-toolbar-item-context.interface';

export interface EditorDirectiveBase {
  context: EditorToolbarItemContext | undefined;
  readonly disabled: boolean;
}
