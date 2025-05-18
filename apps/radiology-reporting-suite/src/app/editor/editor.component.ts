import { CommonModule } from '@angular/common';
import {
  Component,
  effect,
  HostBinding,
  inject,
  Injector,
  input,
  InputSignal,
  OnInit,
  output,
  OutputEmitterRef,
} from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Editor, EditorEvents, Extensions } from '@tiptap/core';
import { FontFamily } from '@tiptap/extension-font-family';
import { MentionOptions } from '@tiptap/extension-mention';
import { TableCell } from '@tiptap/extension-table-cell';
import { TableHeader } from '@tiptap/extension-table-header';
import { TableRow } from '@tiptap/extension-table-row';
import { TextStyle } from '@tiptap/extension-text-style';
import { Underline } from '@tiptap/extension-underline';
import { Node } from '@tiptap/pm/model';
import { EditorState } from '@tiptap/pm/state';
import { EditorView } from '@tiptap/pm/view';
import { StarterKit } from '@tiptap/starter-kit';
import { TiptapEditorDirective } from 'ngx-tiptap';
import { Observable, of, Subscription, tap } from 'rxjs';

import { HostControlDirective } from '@app/directives/host-control.directive';
import { EditorContent } from '@app/models/domain';
import { isNilOrEmpty } from '@app/utils/functions/common.functions';

import { EditorBold } from './extensions/editor-bold.extension';
import { EditorBulletedList } from './extensions/editor-bulleted-list.extension';
import { EditorFontSize } from './extensions/editor-font-size.extension';
import { EditorMentionVariable } from './extensions/editor-mention-variable.extension';
import { EditorNodeAlign } from './extensions/editor-node-align.extension';
import { EditorOrderedList } from './extensions/editor-ordered-list.extension';
import { EditorTable } from './extensions/editor-table.extension';
import { EditorTextAlign } from './extensions/editor-text-align.extensin';
import {
  EditorMentionVariableClickEventData,
  EditorMentionVariableItem,
  EditorMentionVariableNodeAttributes,
} from './models';
import { EditorToolbarComponent } from './toolbar/editor-toolbar.component';
import { generateEditorMentionVariableConfig } from './utils/editor-extension.functions';

@UntilDestroy()
@Component({
  selector: 'radio-editor',
  standalone: true,
  imports: [CommonModule, TiptapEditorDirective, EditorToolbarComponent],
  hostDirectives: [HostControlDirective],
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss'],
})
export class EditorComponent implements OnInit {
  private readonly injector: Injector = inject(Injector);

  readonly maxHeight: InputSignal<string | undefined> = input<string>();

  readonly suggestions: InputSignal<EditorMentionVariableItem[]> = input<
    EditorMentionVariableItem[]
  >([]);

  readonly variableClick: OutputEmitterRef<EditorMentionVariableClickEventData> =
    output<EditorMentionVariableClickEventData>();

  @HostBinding('style.--editor-max-height')
  private _maxHeight: string | undefined;

  private readonly mentionVariableConfig: Partial<
    MentionOptions<
      EditorMentionVariableItem,
      EditorMentionVariableNodeAttributes
    >
  > = {
    ...generateEditorMentionVariableConfig(
      'radio-mention',
      (query: string): Observable<EditorMentionVariableItem[]> =>
        of(this.filterSuggestions(query, this.suggestions())),
      this.injector
    ),
  };

  private readonly editorTableExtensions: Extensions = [
    TableRow,
    TableHeader,
    TableCell,
    EditorTable.configure({ allowTableNodeSelection: true, resizable: true }),
  ];

  private readonly editorExtensions: Extensions = [
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
    ...this.editorTableExtensions,
    EditorMentionVariable.configure(this.mentionVariableConfig),
  ];

  readonly editor: Editor = new Editor({
    extensions: this.editorExtensions,
    content: null,
    onCreate: (ctx: EditorEvents['create']) => {
      this.onEditorCreate(ctx);
    },
    onUpdate: (ctx: EditorEvents['update']): void => {
      this.onEditorUpdate(ctx);
    },
    onFocus: (): void => {
      this.onEditorFocus();
    },
    editorProps: {
      attributes: {
        class:
          'tiptap-container tiptap ProseMirror p-2 bg-white outline-0 border border-surface border-solid rounded-b-lg h-full overflow-auto editor-input-container',
        spellCheck: 'false',
      },
      handleClickOn: (
        _: EditorView,
        __: number,
        node: Node,
        nodePos: number,
        event: MouseEvent
      ): boolean | void => {
        return this.onEditorClick(node, nodePos, event);
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

  private onEditorClick(
    node: Node,
    nodePos: number,
    event: MouseEvent
  ): boolean | void {
    if (node.type.name !== 'mention' || !node.attrs['id']) {
      return;
    }

    const variableClickEventData: EditorMentionVariableClickEventData = {
      id: node.attrs['id'] as string,
      name: node.attrs['label'] as string,
      source: node.attrs['varsource'] as string,
      type: node.attrs['vartype'] as string,
      event,
      nodePos,
    };

    this.variableClick.emit(variableClickEventData);
  }

  private onEditorFocus(): void {
    this.markEditorTouched();
  }

  private onEditorUpdate(ctx: EditorEvents['update']): void {
    this.setHostControl(ctx.editor);

    this.markEditorDirty();
  }

  private onEditorCreate(ctx: EditorEvents['create']): void {
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
  }

  private filterSuggestions(
    query: string,
    suggestions: EditorMentionVariableItem[]
  ): EditorMentionVariableItem[] {
    return suggestions.filter((item: EditorMentionVariableItem): boolean =>
      item.name.toLowerCase().includes(query.toLowerCase())
    );
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
