import { Editor, NodePos } from '@tiptap/core';
import DOMPurify from 'dompurify';
import { escape, isNil } from 'lodash-es';

import {
  EDITOR_REPORT_ATTRIBUTE_NAMES,
  EDITOR_REPORT_EXTENSION_NODE_NAME,
} from '../constants';

export function generateEditorDataAttributeName(attributeName: string): string {
  return `data-${attributeName}`;
}

export function findClosestInArray(array: number[], num: number): number {
  return array.reduce((prev: number, curr: number): number => {
    return Math.abs(curr - num) < Math.abs(prev - num) ? curr : prev;
  });
}

export function findEditorNodeIndicesByAttribute(
  editor: Editor,
  nodeName: string,
  nodeType: string,
  indexAttributeName: string
): number[] {
  const indices: number[] = [];

  editor.$doc
    .querySelectorAll(nodeName, {
      [generateEditorDataAttributeName(
        EDITOR_REPORT_ATTRIBUTE_NAMES.RadioItem
      )]: nodeType,
    })
    .forEach((node: NodePos): void => {
      const indexAttribute: string = node.attributes[
        generateEditorDataAttributeName(indexAttributeName)
      ] as string;

      const index: number = parseInt(indexAttribute, 10);

      indices.push(index);
    });

  return indices;
}

export function findEditorRootNodeById(
  editor: Editor,
  id: string
): NodePos | null {
  return editor.$doc.querySelector(EDITOR_REPORT_EXTENSION_NODE_NAME, {
    id,
  });
}

export function generateEditorDataAttribute(
  attributeName: string,
  attributeValue: string | number | boolean
): string {
  if (typeof attributeValue === 'string') {
    return `${generateEditorDataAttributeName(attributeName)}="${attributeValue}"`;
  }

  return `${generateEditorDataAttributeName(attributeName)}=${attributeValue}`;
}

export function sanitizeHTML(html: string | null | undefined): string {
  if (isNil(html)) {
    return '';
  }

  return DOMPurify.sanitize(html, { USE_PROFILES: { html: true } });
}

export function escapeHTML(html: string | null | undefined): string {
  return escape(html ?? undefined);
}

export function escapeAndSanitizeHTML(html: string | null | undefined): string {
  return sanitizeHTML(escapeHTML(html));
}
