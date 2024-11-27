import { FormControl, FormGroup } from '@angular/forms';

export type ValueOf<T> = T[keyof T];

export type FormGroupModel<T> = FormGroup<{
  [K in keyof T]: FormControl<T[K] | null>;
}>;
