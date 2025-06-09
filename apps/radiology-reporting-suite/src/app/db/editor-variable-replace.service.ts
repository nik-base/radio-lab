import { DOCUMENT } from '@angular/common';
import { inject, Injectable } from '@angular/core';
import { JSONContent } from '@tiptap/core';
import { isNil } from 'lodash-es';

import { isNotNil } from '@app/utils/functions/common.functions';
import { JsonService } from '@app/utils/services/json.service';

@Injectable({ providedIn: 'root' })
export class EditorVariableReplaceService {
  private readonly document: Document = inject(DOCUMENT);

  private readonly jsonService: JsonService = inject(JsonService);

  replaceInHtml(
    html: string | null | undefined,
    idsMap: Map<string, string>
  ): string | undefined {
    if (isNil(html)) {
      return undefined;
    }

    const tempDiv: HTMLDivElement = this.document.createElement('div');

    tempDiv.innerHTML = html;

    for (const [oldId, newId] of idsMap) {
      const elementsToUpdate: NodeListOf<HTMLElement> =
        tempDiv.querySelectorAll(
          `.radio-mention[data-type="mention"][data-id="${oldId}"]`
        );

      elementsToUpdate.forEach((element: HTMLElement): void => {
        element.setAttribute('data-id', newId);
      });
    }

    return tempDiv.innerHTML;
  }

  replaceInJson(
    json: string | null | undefined,
    idsMap: Map<string, string>
  ): string | undefined {
    if (isNil(json)) {
      return undefined;
    }

    const jsonContent: JSONContent =
      this.jsonService.parseSafe<JSONContent>(json);

    this.tryReplaceVariableIds(jsonContent, idsMap);

    return this.jsonService.stringifySafe(jsonContent);
  }

  /**
   * Recursively traverses the Tiptap JSONContent tree and updates
   * 'id' attributes for nodes of type 'mention'.
   *
   * @param {JSONContent} node The current Tiptap node in the JSONContent tree.
   * @param {Map<string, string>} idsMap A map of old IDs to new IDs.
   */
  private tryReplaceVariableIds(
    node: JSONContent,
    idsMap: Map<string, string>
  ) {
    if (!node) {
      return;
    }

    // 1. Check the current node
    if (
      node.type === 'mention' &&
      isNotNil(node.attrs) &&
      (typeof node.attrs['id'] === 'string' ||
        typeof node.attrs['id'] === 'number')
    ) {
      const oldId: string = node.attrs['id'].toString();

      if (isNotNil(oldId) && idsMap.has(oldId)) {
        node.attrs['id'] = idsMap.get(oldId);
      }
    }

    // 2. If the node has content, recurse into its children
    if (node.content && Array.isArray(node.content)) {
      for (const childNode of node.content) {
        this.tryReplaceVariableIds(childNode, idsMap);
      }
    }
  }
}
