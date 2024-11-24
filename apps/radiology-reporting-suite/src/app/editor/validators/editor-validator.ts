import { AbstractControl, ValidatorFn } from '@angular/forms';
import { isEmpty } from 'lodash';

import { EditorContent } from '@app/models/domain';

export class EditorValidators {
  static required(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: string } | null => {
      const content: EditorContent | null =
        control.getRawValue() as EditorContent | null;

      const text: string | null | undefined = content?.text;

      return isEmpty(text) ? { required: 'Field is required' } : null;
    };
  }
}
