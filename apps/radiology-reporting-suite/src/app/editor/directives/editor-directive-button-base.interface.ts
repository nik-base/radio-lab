import { EventEmitter } from '@angular/core';

import { EditorToolbarItemContext } from '../models/editor-toolbar-item-context.interface';

import { EditorDirectiveBase } from './editor-directive-base.interface';

export interface EditorDirectiveButtonBase extends EditorDirectiveBase {
  readonly isActive: boolean;
  readonly clicked: EventEmitter<EditorToolbarItemContext | undefined>;
}
