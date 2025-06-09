import {
  Component,
  computed,
  inject,
  input,
  InputSignal,
  isSignal,
  Signal,
  viewChild,
} from '@angular/core';
import { SuggestionKeyDownProps, SuggestionProps } from '@tiptap/suggestion';
import { isNil } from 'lodash-es';
import { AngularNodeViewComponent } from 'ngx-tiptap';
import { Listbox, ListboxChangeEvent, ListboxModule } from 'primeng/listbox';
import { SkeletonModule } from 'primeng/skeleton';

import {
  EditorMentionVariableItem,
  EditorMentionVariableNodeAttributes,
} from '@app/editor/models';
import { EditorMentionVariableService } from '@app/editor/services/editor-mention-variable.service';

@Component({
  selector: 'radio-editor-mention-suggestions',
  templateUrl: './editor-mention-variable-suggestions.component.html',
  imports: [ListboxModule, SkeletonModule],
  standalone: true,
})
export class EditorMentionVariableSuggestionsComponent extends AngularNodeViewComponent {
  readonly listBox: Signal<Listbox> = viewChild.required<Listbox>('listBox');

  protected readonly mentionService: EditorMentionVariableService = inject(
    EditorMentionVariableService
  );

  readonly props:
    | InputSignal<
        SuggestionProps<
          EditorMentionVariableItem,
          EditorMentionVariableNodeAttributes
        >
      >
    | SuggestionProps<
        EditorMentionVariableItem,
        EditorMentionVariableNodeAttributes
      > =
    input.required<
      SuggestionProps<
        EditorMentionVariableItem,
        EditorMentionVariableNodeAttributes
      >
    >();

  readonly suggestions: Signal<EditorMentionVariableItem[]> = computed(() => {
    const props: SuggestionProps<
      EditorMentionVariableItem,
      EditorMentionVariableNodeAttributes
    > = isSignal(this.props) ? this.props() : this.props;

    const items: EditorMentionVariableItem[] = props.items;

    if (!this.mentionService.isLoading() && items?.length > 0) {
      return items;
    }

    const variables: EditorMentionVariableItem[] =
      this.mentionService.variables();

    const filteredVariables: EditorMentionVariableItem[] = variables.filter(
      (variable: EditorMentionVariableItem): boolean =>
        variable.name.toLowerCase().includes(props.query.toLowerCase())
    );

    return filteredVariables;
  });

  protected readonly mockSuggestions: EditorMentionVariableItem[] =
    Array<EditorMentionVariableItem>(3).fill({
      id: '',
      name: '',
      source: '',
      type: '',
      entityId: '',
      sortOrder: 0,
    });

  onSelect(event: ListboxChangeEvent): void {
    const value: EditorMentionVariableItem | null =
      event.value as EditorMentionVariableItem;

    if (isNil(value)) {
      return;
    }

    const props: SuggestionProps<
      EditorMentionVariableItem,
      EditorMentionVariableNodeAttributes
    > = isSignal(this.props) ? this.props() : this.props;

    props.command({
      id: value.id,
      label: value.name,
      varsource: value.source,
      vartype: value.type,
    });
  }

  onKeyDown({ event }: SuggestionKeyDownProps): boolean {
    const handledKeys: string[] = [
      'ArrowDown',
      'ArrowUp',
      'Home',
      'End',
      'PageDown',
      'PageUp',
      'Enter',
      'Space',
      'NumpadEnter',
    ];

    if (!handledKeys.includes(event.code)) {
      return false;
    }

    this.listBox().onListKeyDown(event);

    return true;
  }
}
