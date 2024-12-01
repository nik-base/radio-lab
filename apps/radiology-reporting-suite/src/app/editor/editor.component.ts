import { CommonModule } from '@angular/common';
import {
  Component,
  effect,
  HostBinding,
  inject,
  input,
  InputSignal,
  OnInit,
} from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Editor, EditorEvents } from '@tiptap/core';
import { FontFamily } from '@tiptap/extension-font-family';
import TextStyle from '@tiptap/extension-text-style';
import { Underline } from '@tiptap/extension-underline';
import { EditorState } from '@tiptap/pm/state';
import { StarterKit } from '@tiptap/starter-kit';
import { NgxTiptapModule } from 'ngx-tiptap';
import { Subscription, tap } from 'rxjs';

import { HostControlDirective } from '@app/directives/host-control.directive';
import { EditorContent } from '@app/models/domain';
import { isNilOrEmpty } from '@app/utils/functions/common.functions';

import { EditorBold } from './extensions/editor-bold.extension';
import { EditorBulletedList } from './extensions/editor-bulleted-list.extension';
import { EditorFontSize } from './extensions/editor-font-size.extension';
import { EditorNodeAlign } from './extensions/editor-node-align.extension';
import { EditorOrderedList } from './extensions/editor-ordered-list.extension';
import { EditorTextAlign } from './extensions/editor-text-align.extensin';
import { EditorToolbarComponent } from './toolbar/editor-toolbar.component';

@UntilDestroy()
@Component({
  selector: 'radio-editor',
  standalone: true,
  imports: [CommonModule, NgxTiptapModule, EditorToolbarComponent],
  hostDirectives: [HostControlDirective],
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss'],
})
export class EditorComponent implements OnInit {
  readonly maxHeight: InputSignal<string | undefined> = input<string>();

  @HostBinding('style.--editor-max-height')
  private _maxHeight: string | undefined;

  readonly editor: Editor = new Editor({
    extensions: [
      StarterKit.configure({
        bold: false,
        bulletList: false,
        orderedList: false,
      }),
      EditorBold,
      Underline,
      EditorTextAlign,
      EditorNodeAlign,
      EditorBulletedList,
      EditorOrderedList,
      TextStyle,
      FontFamily.configure({
        types: ['textStyle'],
      }),
      EditorFontSize,
    ],
    content: null,
    onCreate: (ctx: EditorEvents['create']) => {
      const html: string | null | undefined =
        this.hostControlDirective?.control?.getRawValue()?.html;

      if (isNilOrEmpty(html)) {
        return;
      }

      this.setEditorContent(ctx.editor, html);

      const newEditorState: EditorState = EditorState.create({
        doc: ctx.editor.state.doc,
        plugins: ctx.editor.state.plugins,
        schema: ctx.editor.state.schema,
      });

      ctx.editor.view.updateState(newEditorState);
    },
    onUpdate: (ctx: EditorEvents['update']): void => {
      this.setHostControl(ctx.editor);

      this.markEditorDirty();
    },
    onFocus: (): void => {
      this.markEditorTouched();
    },
    editorProps: {
      attributes: {
        class:
          'tiptap-container tiptap ProseMirror p-2 bg-white outline-none border-1 surface-border border-solid border-round-bottom-lg h-full overflow-auto editor-input-container',
        spellCheck: 'false',
      },
    },
  });

  readonly hostControlDirective: HostControlDirective<EditorContent> | null =
    inject<HostControlDirective<EditorContent>>(HostControlDirective, {
      optional: true,
    });

  private hostControlChangesSubscription: Subscription | undefined;

  constructor() {
    effect((): void => {
      this._maxHeight = this.maxHeight();
    });
  }

  ngOnInit(): void {
    this.handleHostControlChanges();
  }

  private handleHostControlChanges(): void {
    this.hostControlChangesSubscription =
      this.hostControlDirective?.control?.valueChanges
        .pipe(
          tap((value: EditorContent | null): void => {
            this.setEditorContent(this.editor, value?.html ?? null);
          }),
          untilDestroyed(this)
        )
        .subscribe();
  }

  private setEditorContent(editor: Editor, html: string | null) {
    editor?.chain().setContent(html).run();
  }

  private markEditorDirty(): void {
    this.hostControlDirective?.control?.markAsDirty();
  }

  private markEditorTouched(): void {
    this.hostControlDirective?.control?.markAsTouched();
  }

  private setHostControl(editor: Editor): void {
    // Unsubscribe to avoid setting editor again on value changes in handleHostControlChanges
    this.hostControlChangesSubscription?.unsubscribe();

    this.hostControlDirective?.control?.setValue({
      text: editor.getText(),
      html: editor.getHTML(),
      json: editor.getJSON(),
    });

    // Subscribe again
    this.handleHostControlChanges();
  }
}
