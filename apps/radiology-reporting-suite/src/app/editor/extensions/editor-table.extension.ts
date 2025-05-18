import { Node } from '@tiptap/core';
import { Table, TableOptions } from '@tiptap/extension-table';
import { EditorView } from '@tiptap/pm/view';
import { isNil } from 'lodash';
import {
  DOMParser as ProseMirrorDOMParser,
  Node as ProseMirrorNode,
} from 'prosemirror-model';
import { EditorState, Plugin, PluginKey, Transaction } from 'prosemirror-state';

// Parse the CSS rules of Excel in the clipboard (convert CSS string to object)
const parseCSS = (cssRules: string): Record<string, string> => {
  const results: Record<string, string> = {};

  const rules: string[] = cssRules
    .split(';')
    .map((rule: string): string => rule.trim())
    .filter(Boolean);

  rules.forEach((rule: string): void => {
    const [property, value]: string[] = rule
      .split(':')
      .map((part: string): string => part.trim());

    if (property && value) {
      results[property] = value;
    }
  });

  return results;
};

// Method to extract style rules
const extractStyles = (
  styleText: string
): Record<string, Record<string, string>> => {
  const regex: RegExp = /\.(\w+)\s*\{([^}]+)\}/g;

  let match: RegExpExecArray | null;

  const styles: Record<string, Record<string, string>> = {};

  while ((match = regex.exec(styleText)) !== null) {
    const [, className, cssRules]: string[] = match;

    const parsedRules: Record<string, string> = parseCSS(cssRules);

    styles[className] = parsedRules;
  }

  return styles;
};

export const EditorTable: Node<TableOptions, unknown> = Table.extend({
  addProseMirrorPlugins() {
    return [
      ...(this.parent?.() ?? []),
      // Handle table style issues when pasting from Microsoft Excel
      new Plugin({
        key: new PluginKey('handleExcelPaste'),
        props: {
          handlePaste(view: EditorView, event: ClipboardEvent): boolean {
            const { clipboardData }: ClipboardEvent = event;

            if (!clipboardData) {
              return false;
            }

            const html: string | undefined = clipboardData.getData('text/html');

            if (!html) {
              return false;
            }

            const parser: DOMParser = new DOMParser();

            const doc: Document | null = parser.parseFromString(
              html,
              'text/html'
            );

            const excel: boolean | undefined = doc
              ?.querySelector('html')
              ?.getAttribute('xmlns:x')
              ?.includes('office:excel');

            if (!excel) {
              return false;
            }

            const table: HTMLTableElement | null = doc.querySelector('table');

            if (!table) {
              return false;
            }

            const styleText: string = Array.from(
              doc.head.querySelectorAll('style')
            )
              .map(
                (style: HTMLStyleElement): string | null => style.textContent
              )
              .join('\n');

            // Extract all style rules
            const styles: Record<
              string,
              Record<string, string>
            > = extractStyles(styleText);

            // Apply styles to the table
            table.querySelectorAll('td, th').forEach((cellElement: Element) => {
              const cell: HTMLTableCellElement =
                cellElement as HTMLTableCellElement;

              const className: string | null = cell.getAttribute('class');

              const style: Record<string, string> = isNil(className)
                ? {}
                : styles[className];

              if (style?.['background']) {
                cell.style.background = style['background'];
              }

              if (style?.['color']) {
                cell.style.color = style['color'];
              }

              if (style?.['text-align']) {
                cell.setAttribute('align', style['text-align']);
              }
            });

            // Remove the style tag from the document
            const { schema }: EditorState = view.state;

            const fragment: ProseMirrorNode =
              ProseMirrorDOMParser.fromSchema(schema).parse(table);

            const transaction: Transaction =
              view.state.tr.replaceSelectionWith(fragment);

            view.dispatch(transaction);

            return true;
          },
        },
      }),
    ];
  },
});
