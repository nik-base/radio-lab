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

import { EditorMentionNodeAttributes } from '@app/editor/models';

@Component({
  selector: 'radio-editor-mention-suggestions',
  templateUrl: './editor-mention-suggestions.component.html',
  styleUrls: ['./editor-mention-suggestions.component.scss'],
  imports: [ListboxModule],
  standalone: true,
})
export class EditorMentionSuggestionsComponent<
  T extends { readonly id: string; readonly name: string },
> extends AngularNodeViewComponent {
  readonly listBox: Signal<Listbox> = viewChild.required<Listbox>('listBox');

  readonly props:
    | InputSignal<SuggestionProps<T, EditorMentionNodeAttributes<T>>>
    | SuggestionProps<T, EditorMentionNodeAttributes<T>> =
    input.required<SuggestionProps<T, EditorMentionNodeAttributes<T>>>();

  readonly suggestions: Signal<T[]> = computed(() =>
    isSignal(this.props) ? this.props().items : this.props.items
  );

  onSelect(event: ListboxChangeEvent): void {
    const value: T | null = event.value as T;

    if (isNil(value)) {
      return;
    }

    const props: SuggestionProps<T, EditorMentionNodeAttributes<T>> = isSignal(
      this.props
    )
      ? this.props()
      : this.props;

    props.command({
      id: value.id,
      label: value.name,
      data: value,
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
