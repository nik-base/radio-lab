import { Pipe, PipeTransform } from '@angular/core';

import { EditorContent } from '@app/models/domain';
import { isNilOrEmpty } from '@app/utils/functions/common.functions';

@Pipe({
  name: 'editorHasValue',
})
export class EditorHasValuePipe implements PipeTransform {
  transform(editorContent: EditorContent | null | undefined): boolean {
    return !isNilOrEmpty(editorContent?.text?.trim());
  }
}
