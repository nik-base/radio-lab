import { Injector } from '@angular/core';
import { Editor, mergeAttributes, Node } from '@tiptap/core';
import { Mention, MentionOptions } from '@tiptap/extension-mention';
import { SuggestionKeyDownProps, SuggestionProps } from '@tiptap/suggestion';
import { AngularRenderer } from 'ngx-tiptap';
import { lastValueFrom, Observable } from 'rxjs';
import tippy, { GetReferenceClientRect, Instance, Props } from 'tippy.js';

import { EditorMentionSuggestionsComponent } from '../components/editor-mention-suggestions/editor-mention-suggestions.component';
import { EditorMentionNodeAttributes } from '../models';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface EditorSuggestionItem<T = any> {
  readonly id?: string;
  readonly name?: string;
  readonly data?: T;
}

export const EditorMention: Node<MentionOptions, unknown> =
  Mention.extend<MentionOptions>({});

export const generateEditorMentionConfig = <
  T extends { readonly id: string; readonly name: string },
>(
  className: string,
  suggestions$: (query: string, editor: Editor) => Observable<T[]>,
  injector: Injector
): Partial<MentionOptions<T, EditorMentionNodeAttributes<T>>> => {
  return {
    HTMLAttributes: {
      class: className,
    },
    // eslint-disable-next-line @typescript-eslint/typedef
    renderHTML({ options, node }) {
      return [
        'span',
        mergeAttributes(
          {
            ...this.HTMLAttributes,
          },
          options.HTMLAttributes
        ),
        `${node.attrs['label'] ?? node.attrs['id']}`,
      ];
    },
    suggestion: {
      char: '{{',
      items: ({
        query,
        editor,
      }: {
        query: string;
        editor: Editor;
      }): T[] | Promise<T[]> => {
        const obs$: Observable<T[]> = suggestions$(query, editor);

        return lastValueFrom(obs$);
      },
      render: () => {
        let renderer: AngularRenderer<
          EditorMentionSuggestionsComponent<T>,
          EditorMentionSuggestionsComponent<T>
        >;

        let popup: Instance<Props>[];

        return {
          onStart: (
            props: SuggestionProps<T, EditorMentionNodeAttributes<T>>
          ) => {
            renderer = new AngularRenderer(
              EditorMentionSuggestionsComponent<T>,
              injector,
              {
                props,
              }
            );

            renderer.updateProps({ props });

            popup = tippy('body', {
              getReferenceClientRect:
                props.clientRect as GetReferenceClientRect,
              appendTo: () => document.body,
              content: renderer.dom,
              showOnCreate: true,
              interactive: true,
              trigger: 'manual',
              placement: 'bottom-start',
              zIndex: 99999,
            });
          },
          onUpdate(props: SuggestionProps<T, EditorMentionNodeAttributes<T>>) {
            renderer.updateProps({ props });

            popup[0].setProps({
              getReferenceClientRect:
                props.clientRect as GetReferenceClientRect,
            });
          },
          onKeyDown(props: SuggestionKeyDownProps) {
            return renderer.instance.onKeyDown(props);
          },
          onExit() {
            popup[0].destroy();

            renderer.destroy();
          },
        };
      },
    },
  };
};
