import { Injector } from '@angular/core';
import { Editor, mergeAttributes } from '@tiptap/core';
import { MentionOptions } from '@tiptap/extension-mention';
import { SuggestionKeyDownProps, SuggestionProps } from '@tiptap/suggestion';
import { AngularRenderer } from 'ngx-tiptap';
import { Observable, lastValueFrom } from 'rxjs';
import tippy, { GetReferenceClientRect, Instance, Props } from 'tippy.js';

import { Variable } from '@app/models/domain';

import { EditorMentionVariableSuggestionsComponent } from '../components/editor-mention-variable-suggestions/editor-mention-variable-suggestions.component';
import { EditorMentionVariableNodeAttributes } from '../models';

export const generateEditorMentionVariableConfig = (
  className: string,
  suggestions$: (query: string, editor: Editor) => Observable<Variable[]>,
  injector: Injector
): Partial<MentionOptions<Variable, EditorMentionVariableNodeAttributes>> => {
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
      }): Variable[] | Promise<Variable[]> => {
        const obs$: Observable<Variable[]> = suggestions$(query, editor);

        return lastValueFrom(obs$);
      },
      render: () => {
        let renderer: AngularRenderer<
          EditorMentionVariableSuggestionsComponent,
          EditorMentionVariableSuggestionsComponent
        >;

        let popup: Instance<Props>[];

        return {
          onStart: (
            props: SuggestionProps<
              Variable,
              EditorMentionVariableNodeAttributes
            >
          ) => {
            renderer = new AngularRenderer(
              EditorMentionVariableSuggestionsComponent,
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
          onUpdate(
            props: SuggestionProps<
              Variable,
              EditorMentionVariableNodeAttributes
            >
          ) {
            renderer.updateProps({ props });

            if (!popup?.length) {
              return;
            }

            popup[0].setProps({
              getReferenceClientRect:
                props.clientRect as GetReferenceClientRect,
            });
          },
          onKeyDown(props: SuggestionKeyDownProps) {
            return renderer.instance.onKeyDown(props);
          },
          onExit() {
            if (!popup?.length) {
              return;
            }

            popup[0].destroy();

            renderer.destroy();
          },
        };
      },
    },
  };
};
