import { AbstractControl, ValidatorFn } from '@angular/forms';

import { EditorContent } from '@app/models/domain';
import { isNilOrEmpty } from '@app/utils/functions/common.functions';

export class EditorValidators {
  static required(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: string } | null => {
      const content: EditorContent | null =
        control.getRawValue() as EditorContent | null;

      const text: string | null | undefined = content?.text;

      return isNilOrEmpty(text) ? { required: 'Field is required' } : null;
    };
  }
}
