import { CommonModule } from '@angular/common';
import {
  Component,
  DestroyRef,
  effect,
  HostBinding,
  inject,
  Injector,
  input,
  InputSignal,
  OnInit,
  output,
  OutputEmitterRef,
  Signal,
  viewChild,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Editor, EditorEvents, Extension, Extensions } from '@tiptap/core';
import { FontFamily } from '@tiptap/extension-font-family';
import { MentionOptions } from '@tiptap/extension-mention';
import Paragraph from '@tiptap/extension-paragraph';
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
import { MenuItem } from 'primeng/api';
import { ContextMenu } from 'primeng/contextmenu';
import { Observable, of, Subscription, tap } from 'rxjs';

import { HostControlDirective } from '@app/directives/host-control.directive';
import { EditorContent, Template } from '@app/models/domain';
import { EditorFindingData } from '@app/models/ui';
import { isNilOrEmpty } from '@app/utils/functions/common.functions';

import { EditorBold } from './extensions/editor-bold.extension';
import { EditorBulletedList } from './extensions/editor-bulleted-list.extension';
import { EditorFontSize } from './extensions/editor-font-size.extension';
import { EditorMentionVariable } from './extensions/editor-mention-variable.extension';
import { EditorNodeAlign } from './extensions/editor-node-align.extension';
import { EditorOrderedList } from './extensions/editor-ordered-list.extension';
import { EditorTable } from './extensions/editor-table.extension';
import { EditorTextAlign } from './extensions/editor-text-align.extension';
import { EditorReportDiv } from './extensions/radio-extensions/editor-report-div.extension';
import { EditorReportFinding } from './extensions/radio-extensions/editor-report-finding.extension';
import { EditorReportListItem } from './extensions/radio-extensions/editor-report-list-item.extension';
import { EditorReportProtocol } from './extensions/radio-extensions/editor-report-protocol.extension';
import {
  EditorReportVariableValue,
  EditorReportVariableValueOptions,
} from './extensions/radio-extensions/editor-report-variable-value.extension';
import {
  EditorMentionVariableClickEventData,
  EditorMentionVariableItem,
  EditorMentionVariableNodeAttributes,
} from './models';
import { EditorToolbarComponent } from './toolbar/editor-toolbar.component';
import { generateEditorMentionVariableConfig } from './utils/editor-extension.functions';

@Component({
  selector: 'radio-editor',
  standalone: true,
  imports: [
    CommonModule,
    ContextMenu,
    TiptapEditorDirective,
    EditorToolbarComponent,
  ],
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

  readonly #destroyRef: DestroyRef = inject(DestroyRef);

  @HostBinding('style.--editor-max-height')
  private _maxHeight: string | undefined;

  protected readonly tableContextMenu: Signal<ContextMenu> =
    viewChild.required<ContextMenu>('tableContextMenu');

  readonly tableContextMenuItems: MenuItem[] = [
    {
      label: 'Insert column left',
      command: () => {
        this.onInsertColumnLeft();
      },
    },
    {
      label: 'Insert column right',
      command: () => {
        this.onInsertColumnRight();
      },
    },
    { separator: true },
    {
      label: 'Insert row above',
      command: () => {
        this.onInsertRowAbove();
      },
    },
    {
      label: 'Insert row below',
      command: () => {
        this.onInsertRowBelow();
      },
    },
    { separator: true },
    {
      label: 'Delete column',
      command: () => {
        this.onDeleteColumn();
      },
    },
    {
      label: 'Delete row',
      command: () => {
        this.onDeleteRow();
      },
    },
    { separator: true },
    {
      label: 'Delete table',
      command: () => {
        this.onDeleteTable();
      },
    },
  ];

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

  private readonly editorReportExtensions: Extensions = [
    EditorReportDiv,
    EditorReportListItem,
    EditorReportProtocol,
    EditorReportFinding,
    EditorReportVariableValue,
  ];

  private readonly editorExtensions: Extensions = [
    StarterKit.configure({
      bold: false,
      bulletList: false,
      orderedList: false,
      paragraph: false,
      listItem: false,
    }) as Extension,
    Paragraph.configure({
      HTMLAttributes: {
        class: 'radio-report-paragraph',
      },
    }),
    EditorBold,
    Underline,
    EditorTextAlign,
    EditorNodeAlign,
    EditorBulletedList.configure({
      HTMLAttributes: {
        class: 'pl-4',
      },
    }),
    EditorOrderedList.configure({
      HTMLAttributes: {
        class: 'pl-4',
      },
    }),
    TextStyle,
    FontFamily.configure({
      types: ['textStyle'],
    }),
    EditorFontSize,
    ...this.editorTableExtensions,
    EditorMentionVariable.configure(this.mentionVariableConfig),
    ...this.editorReportExtensions,
  ];

  readonly editor: Editor = new Editor({
    extensions: this.editorExtensions,
    parseOptions: {
      preserveWhitespace: 'full',
    },
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
      handleDOMEvents: {
        contextmenu: (_: EditorView, event: MouseEvent): boolean | void => {
          return this.onEditorContextMenu(event);
        },
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

  insertReportProtocol(template: Template): void {
    this.editor.chain().focus().insertReportProtocol({ template }).run();
  }

  insertReportFinding(finding: EditorFindingData): void {
    this.editor.chain().focus().insertReportFinding({ finding }).run();

    this.editor.chain().focus().insertReportImpression({ finding }).run();

    this.editor.chain().focus().insertReportRecommendation({ finding }).run();
  }

  insertReportFindings(findings: ReadonlyArray<EditorFindingData>): void {
    for (const finding of findings) {
      this.insertReportFinding(finding);
    }
  }

  replaceVariableValue(options: EditorReportVariableValueOptions): void {
    this.editor
      .chain()
      .focus()
      .replaceReportVariableValueForFinding(options)
      .run();

    this.editor
      .chain()
      .focus()
      .replaceReportVariableValueInNextTableCellForNo(options)
      .run();

    this.editor
      .chain()
      .focus()
      .replaceReportVariableValueForImpression(options)
      .run();
  }

  private onEditorContextMenu(event: MouseEvent): boolean | void {
    const target: HTMLElement = event.target as HTMLElement;

    const table: HTMLElement | null = target.closest('table');

    if (!table) {
      return false;
    }

    this.tableContextMenu().toggle(event);

    return true;
  }

  private onDeleteTable() {
    this.editor.chain().focus().deleteTable().run();
  }

  private onDeleteRow() {
    this.editor.chain().focus().deleteRow().run();
  }

  private onDeleteColumn() {
    this.editor.chain().focus().deleteColumn().run();
  }

  private onInsertRowBelow() {
    this.editor.chain().focus().addRowAfter().run();
  }

  private onInsertRowAbove() {
    this.editor.chain().focus().addRowBefore().run();
  }

  private onInsertColumnRight() {
    this.editor.chain().focus().addColumnAfter().run();
  }

  private onInsertColumnLeft() {
    this.editor.chain().focus().addColumnBefore().run();
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
          takeUntilDestroyed(this.#destroyRef)
        )
        .subscribe();
  }

  private setEditorContent(editor: Editor, html: string | null) {
    editor
      ?.chain()
      .setContent(html, false, { preserveWhitespace: 'full' })
      .run();
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
