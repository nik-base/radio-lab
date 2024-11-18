import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Editor } from '@tiptap/core';
import { Underline } from '@tiptap/extension-underline';
import { StarterKit } from '@tiptap/starter-kit';
import { NgxTiptapModule } from 'ngx-tiptap';

import { EditorBold } from './extensions/editor-bold.extension';
import { EditorBulletedList } from './extensions/editor-bulleted-list.extension';
import { EditorNodeAlign } from './extensions/editor-node-align.extension';
import { EditorOrderedList } from './extensions/editor-ordered-list.extension';
import { EditorTextAlign } from './extensions/editor-text-align.extensin';
import { EditorToolbarComponent } from './toolbar/editor-toolbar.component';

@Component({
  selector: 'radio-editor',
  standalone: true,
  imports: [CommonModule, NgxTiptapModule, EditorToolbarComponent],
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss'],
})
export class EditorComponent {
  readonly editor: Editor = new Editor({
    extensions: [
      StarterKit.configure({
        bold: false,
        bulletList: false,
        orderedList: false,
        listItem: undefined,
      }),
      EditorBold,
      Underline,
      EditorTextAlign,
      EditorNodeAlign,
      EditorBulletedList,
      EditorOrderedList,
    ],
    content: null,
    editorProps: {
      attributes: {
        class:
          'tiptap-container tiptap ProseMirror p-2 outline-none border-round-bottom-lg',
        spellCheck: 'false',
      },
    },
  });
}
