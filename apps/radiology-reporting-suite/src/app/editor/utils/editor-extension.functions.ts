import { Injector } from '@angular/core';
import { Editor, mergeAttributes } from '@tiptap/core';
import { MentionOptions } from '@tiptap/extension-mention';
import { SuggestionKeyDownProps, SuggestionProps } from '@tiptap/suggestion';
import { AngularRenderer } from 'ngx-tiptap';
import { Observable, lastValueFrom } from 'rxjs';
import tippy, { GetReferenceClientRect, Instance, Props } from 'tippy.js';

import { EditorMentionVariableSuggestionsComponent } from '../components/editor-mention-variable-suggestions/editor-mention-variable-suggestions.component';
import { EditorMentionVariable } from '../extensions/editor-mention-variable.extension';
import {
  EditorMentionVariableItem,
  EditorMentionVariableNodeAttributes,
} from '../models';

export const generateEditorMentionVariableConfig = (
  className: string,
  suggestions$: (
    query: string,
    editor: Editor
  ) => Observable<EditorMentionVariableItem[]>,
  injector: Injector
): Partial<
  MentionOptions<EditorMentionVariableItem, EditorMentionVariableNodeAttributes>
> => {
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
      }):
        | EditorMentionVariableItem[]
        | Promise<EditorMentionVariableItem[]> => {
        const storage: { suggestionsEnabled: boolean } | undefined =
          getEditorSuggestionsEnabledFromStorage(editor);

        if (storage && !storage.suggestionsEnabled) {
          return [];
        }

        const obs$: Observable<EditorMentionVariableItem[]> = suggestions$(
          query,
          editor
        );

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
              EditorMentionVariableItem,
              EditorMentionVariableNodeAttributes
            >
          ) => {
            const storage: { suggestionsEnabled: boolean } | undefined =
              getEditorSuggestionsEnabledFromStorage(props.editor);

            if (storage && !storage.suggestionsEnabled) {
              return;
            }

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
          onUpdate: (
            props: SuggestionProps<
              EditorMentionVariableItem,
              EditorMentionVariableNodeAttributes
            >
          ) => {
            const storage: { suggestionsEnabled: boolean } | undefined =
              getEditorSuggestionsEnabledFromStorage(props.editor);

            if (storage && !storage.suggestionsEnabled) {
              return;
            }

            renderer.updateProps({ props });

            if (popup?.length) {
              popup[0]?.setProps({
                getReferenceClientRect:
                  props.clientRect as GetReferenceClientRect,
              });
            }
          },
          onKeyDown(props: SuggestionKeyDownProps) {
            return renderer?.instance?.onKeyDown(props);
          },
          onExit() {
            if (popup?.length) {
              popup[0]?.destroy();
            }

            renderer?.destroy();
          },
        };
      },
    },
  };
};

function getEditorSuggestionsEnabledFromStorage(
  editor: Editor
): { suggestionsEnabled: boolean } | undefined {
  return editor.storage[EditorMentionVariable.name] as
    | { suggestionsEnabled: boolean }
    | undefined;
}
