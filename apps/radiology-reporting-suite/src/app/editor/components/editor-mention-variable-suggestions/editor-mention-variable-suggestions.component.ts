import {
  Component,
  computed,
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

import { EditorMentionVariableNodeAttributes } from '@app/editor/models';
import { Variable } from '@app/models/domain';

@Component({
  selector: 'radio-editor-mention-suggestions',
  templateUrl: './editor-mention-variable-suggestions.component.html',
  imports: [ListboxModule],
  standalone: true,
})
export class EditorMentionVariableSuggestionsComponent extends AngularNodeViewComponent {
  readonly listBox: Signal<Listbox> = viewChild.required<Listbox>('listBox');

  readonly props:
    | InputSignal<
        SuggestionProps<Variable, EditorMentionVariableNodeAttributes>
      >
    | SuggestionProps<Variable, EditorMentionVariableNodeAttributes> =
    input.required<
      SuggestionProps<Variable, EditorMentionVariableNodeAttributes>
    >();

  readonly suggestions: Signal<Variable[]> = computed(() =>
    isSignal(this.props) ? this.props().items : this.props.items
  );

  onSelect(event: ListboxChangeEvent): void {
    const value: Variable | null = event.value as Variable;

    if (isNil(value)) {
      return;
    }

    const props: SuggestionProps<
      Variable,
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
