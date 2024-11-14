import { inject, Injectable } from '@angular/core';
import { isNil } from 'lodash';

import { EditorContentDto } from '@app/models/data';
import { EditorContent } from '@app/models/domain';
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
      json: this.jsonService.stringifySafe(editorContent.json),
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
      json: this.jsonService.parseSafe<object>(editorContent.json) ?? null,
    };
  }
}
