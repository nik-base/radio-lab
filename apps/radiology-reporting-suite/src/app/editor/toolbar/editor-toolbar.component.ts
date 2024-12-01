import { CommonModule } from '@angular/common';
import { Component, computed, input, InputSignal, Signal } from '@angular/core';
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
import { EditorInputFontSizeComponent } from './input-font-size/editor-input-font-size.component';
import { EditorSelectorFontFamilyComponent } from './selector-font-family/editor-selector-font-family.component';

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
    EditorSelectorFontFamilyComponent,
    EditorInputFontSizeComponent,
  ],
  templateUrl: './editor-toolbar.component.html',
  styleUrls: ['./editor-toolbar.component.scss'],
})
export class EditorToolbarComponent {
  readonly editor: InputSignal<Editor | undefined> = input.required<
    Editor | undefined
  >();

  readonly toolbar: InputSignal<EditorToolbarConfig | undefined> =
    input<EditorToolbarConfig>();

  readonly toolbarConfig: Signal<EditorToolbarConfig> = computed(() => {
    const toolbarConfig: EditorToolbarConfig | undefined = this.toolbar();

    return !toolbarConfig ? this.defaultToolbarConfig : toolbarConfig;
  });

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
      'font-family',
      'font-size',
      '|',
      'undo',
      'redo',
    ],
  };
}
