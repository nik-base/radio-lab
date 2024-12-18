import { inject, Injectable } from '@angular/core';
import { JSONContent } from '@tiptap/core';
import { isNil } from 'lodash-es';

import { EditorContentDto } from '@app/models/data';
import { EditorContent } from '@app/models/domain';
import { isNilOrEmpty } from '@app/utils/functions/common.functions';
import { JsonService } from '@app/utils/services/json.service';

@Injectable({ providedIn: 'root' })
export class EditorContentMapperService {
  private readonly jsonService: JsonService = inject(JsonService);

  mapToDto(editorContent: EditorContent): EditorContentDto;
  mapToDto(editorContent: null | undefined): null | undefined;
  mapToDto(editorContent: EditorContent | null): EditorContentDto | null;
  mapToDto(
    editorContent: EditorContent | undefined
  ): EditorContentDto | undefined;
  mapToDto(
    editorContent: EditorContent | null | undefined
  ): EditorContentDto | null | undefined {
    if (isNil(editorContent)) {
      return editorContent;
    }

    return {
      text: editorContent.text,
      html: editorContent.html,
      json: isNil(editorContent.json)
        ? null
        : this.jsonService.stringifySafe(editorContent.json),
    };
  }

  mapFromDto(editorContent: EditorContentDto): EditorContent;
  mapFromDto(editorContent: null | undefined): null | undefined;
  mapFromDto(editorContent: EditorContentDto | null): EditorContent | null;
  mapFromDto(
    editorContent: EditorContentDto | undefined
  ): EditorContent | undefined;
  mapFromDto(
    editorContent: EditorContentDto | null | undefined
  ): EditorContent | null | undefined {
    if (isNil(editorContent)) {
      return editorContent;
    }

    return {
      text: editorContent.text,
      html: editorContent.html,
      json: isNilOrEmpty(editorContent.json)
        ? null
        : (this.jsonService.parseSafe<JSONContent>(editorContent.json) ?? null),
    };
  }
}
