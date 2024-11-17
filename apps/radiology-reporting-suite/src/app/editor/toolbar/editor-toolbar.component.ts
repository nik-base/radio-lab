import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Editor } from '@tiptap/core';
import { DividerModule } from 'primeng/divider';
import { ToolbarModule } from 'primeng/toolbar';

import { EDITOR_TOOLBAR_ITEM_TYPE } from '../constants';
import { EditorToolbarConfig } from '../models/editor-toolbar-config.interface';

import { EditorButtonBoldComponent } from './button-bold/editor-button-bold.component';
import { EditorButtonItalicComponent } from './button-italic/editor-button-italic.component';
import { EditorButtonUnderlineComponent } from './button-underline/editor-button-underline.component';

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
    items: ['underline', '|', 'bold', 'italic'],
  };

  private _toolbarConfig: EditorToolbarConfig = this.defaultToolbarConfig;
}
