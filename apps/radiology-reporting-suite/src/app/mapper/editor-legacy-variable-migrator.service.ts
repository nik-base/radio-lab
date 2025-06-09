import { DOCUMENT } from '@angular/common';
import { inject, Injectable } from '@angular/core';
import { JSONContent } from '@tiptap/core';
import { isNil } from 'lodash-es';

import { VARIABLE_SOURCE, VARIABLE_TYPE } from '@app/constants';
import { isNotNil } from '@app/utils/functions/common.functions';
import { JsonService } from '@app/utils/services/json.service';

@Injectable({ providedIn: 'root' })
export class EditorLegacyVariableMigratorService {
  private readonly document: Document = inject(DOCUMENT);

  private readonly jsonService: JsonService = inject(JsonService);

  migrateHtml(html: string | null | undefined): string | undefined {
    if (isNil(html)) {
      return undefined;
    }

    const tempDiv: HTMLDivElement = this.document.createElement('div');

    tempDiv.innerHTML = html;

    const elementsToUpdate: NodeListOf<HTMLElement> = tempDiv.querySelectorAll(
      `[data-type="mention"]`
    );

    elementsToUpdate.forEach((element: HTMLElement): void => {
      element.classList.add('radio-mention');

      element.setAttribute('data-varsource', VARIABLE_SOURCE.Finding);

      element.setAttribute('data-vartype', VARIABLE_TYPE.MultiSelect);
    });

    return tempDiv.innerHTML;
  }

  migrateJson(json: string | null | undefined): JSONContent | null {
    if (isNil(json)) {
      return null;
    }

    const jsonContent: JSONContent =
      this.jsonService.parseSafe<JSONContent>(json);

    this.tryMigrateMentions(jsonContent);

    return jsonContent;
  }

  private tryMigrateMentions(node: JSONContent) {
    if (!node) {
      return;
    }

    // 1. Check the current node
    if (node.type === 'mention' && isNotNil(node.attrs)) {
      node.attrs = {
        ...node.attrs,
        varsource: VARIABLE_SOURCE.Finding,
        vartype: VARIABLE_TYPE.MultiSelect,
      };
    }

    // 2. If the node has content, recurse into its children
    if (node.content && Array.isArray(node.content)) {
      for (const childNode of node.content) {
        this.tryMigrateMentions(childNode);
      }
    }
  }
}
