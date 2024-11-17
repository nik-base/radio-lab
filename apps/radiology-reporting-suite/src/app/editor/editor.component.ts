import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Editor } from '@tiptap/core';
import { Underline } from '@tiptap/extension-underline';
import { StarterKit } from '@tiptap/starter-kit';
import { NgxTiptapModule } from 'ngx-tiptap';

import { EditorBold } from './extensions/editor-extension-bold.extension';
import { EditorNodeAlign } from './extensions/editor-extension-node-align.extension';
import { EditorTextAlign } from './extensions/editor-extension-text-align.extensin';
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
        listItem: false,
      }),
      EditorBold,
      Underline,
      EditorTextAlign,
      EditorNodeAlign,
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
