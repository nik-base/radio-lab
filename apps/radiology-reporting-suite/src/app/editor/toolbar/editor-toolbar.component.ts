import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Editor } from '@tiptap/core';
import { DividerModule } from 'primeng/divider';
import { ToolbarModule } from 'primeng/toolbar';

import { EDITOR_TOOLBAR_ITEM_TYPE } from '../constants';
import { EditorToolbarConfig } from '../models/editor-toolbar-config.interface';

import { EditorButtonAlignCenterComponent } from './button-align-center/editor-button-align-center.component';
import { EditorButtonAlignLeftComponent } from './button-align-left/editor-button-align-left.component';
import { EditorButtonAlignRightComponent } from './button-align-right/editor-button-align-right.component';
import { EditorButtonBoldComponent } from './button-bold/editor-button-bold.component';
import { EditorButtonBulletedListComponent } from './button-bulleted-list/editor-button-bulleted-list.component';
import { EditorButtonItalicComponent } from './button-italic/editor-button-italic.component';
import { EditorButtonOrderedListComponent } from './button-ordered-list/editor-button-ordered-list.component';
import { EditorButtonRedoComponent } from './button-redo/editor-button-redo.component';
import { EditorButtonUnderlineComponent } from './button-underline/editor-button-underline.component';
import { EditorButtonUndoComponent } from './button-undo/editor-button-undo.component';

@Component({
  selector: 'radio-editor-toolbar',
  standalone: true,
  imports: [
    CommonModule,
    ToolbarModule,
    DividerModule,
    EditorButtonBoldComponent,
    EditorButtonItalicComponent,
    EditorButtonUnderlineComponent,
    EditorButtonAlignLeftComponent,
    EditorButtonAlignCenterComponent,
    EditorButtonAlignRightComponent,
    EditorButtonBulletedListComponent,
    EditorButtonOrderedListComponent,
    EditorButtonUndoComponent,
    EditorButtonRedoComponent,
  ],
  templateUrl: './editor-toolbar.component.html',
  styleUrls: ['./editor-toolbar.component.scss'],
})
export class EditorToolbarComponent {
  @Input({ required: true }) editor: Editor | undefined;

  @Input() set toolbarConfig(value: EditorToolbarConfig | undefined) {
    if (!value) {
      return;
    }

    this._toolbarConfig = value;
  }

  get toolbarConfig(): EditorToolbarConfig {
    return this._toolbarConfig;
  }

  readonly ToolbarItemType: typeof EDITOR_TOOLBAR_ITEM_TYPE =
    EDITOR_TOOLBAR_ITEM_TYPE;

  readonly defaultToolbarConfig: EditorToolbarConfig = {
    items: [
      'bold',
      'italic',
      'underline',
      '|',
      'align-left',
      'align-center',
      'align-right',
      '|',
      'bulleted-list',
      'ordered-list',
      '|',
      'undo',
      'redo',
    ],
  };

  private _toolbarConfig: EditorToolbarConfig = this.defaultToolbarConfig;
}
