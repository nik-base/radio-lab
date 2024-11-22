import {
  ChangeDetectorRef,
  Directive,
  forwardRef,
  inject,
  Injector,
  OnInit,
} from '@angular/core';
import {
  AbstractControl,
  ControlValueAccessor,
  FormControl,
  FormControlDirective,
  FormControlName,
  FormGroupDirective,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  NgControl,
  NgModel,
  ValidationErrors,
  Validator,
} from '@angular/forms';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { isNil } from 'lodash';
import { filter, tap } from 'rxjs';

@UntilDestroy()
@Directive({
  selector: '[radioHostControl]',
  standalone: true,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => HostControlDirective),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => HostControlDirective),
      multi: true,
    },
  ],
})
export class HostControlDirective<TValue = unknown>
  implements ControlValueAccessor, OnInit, Validator
{
  control!: FormControl<TValue>;

  private readonly injector: Injector = inject(Injector);

  private readonly changeDetectorRef: ChangeDetectorRef =
    inject(ChangeDetectorRef);

  ngOnInit(): void {
    this.initControl();
  }

  writeValue(): void {
    // write value;
  }

  registerOnChange(): void {
    // register on change
  }

  registerOnTouched(): void {
    // register on touched
  }

  registerOnValidatorChange(): void {
    // register on validator change
  }

  validate(
    control: AbstractControl<unknown, unknown>
  ): ValidationErrors | null {
    if (control.invalid) {
      return control.errors;
    }

    return null;
  }

  isControlInvalid(): boolean {
    return !!this.control?.invalid;
  }

  getValidationErrors(): ValidationErrors | null {
    return this.control?.errors ?? null;
  }

  private initControl(): void {
    const ngControl: NgControl | null = this.injector.get(NgControl, null, {
      self: true,
      optional: true,
    });

    if (isNil(ngControl)) {
      return;
    }

    this.assignControl(ngControl);

    this.markControl();
  }

  private assignControl(ngControl: NgControl): void {
    if (ngControl instanceof NgModel) {
      this.control = this.getNgModel(ngControl);
      this.handleNgModel(ngControl);
    } else if (ngControl instanceof FormControlDirective) {
      this.control = this.getFormControl(ngControl);
    } else if (ngControl instanceof FormControlName) {
      this.control = this.getFormGroupControl(ngControl);
    } else {
      this.control = this.getNewControl();
    }
  }

  private getNewControl(): FormControl<TValue> {
    return new FormControl() as FormControl<TValue>;
  }

  private getFormGroupControl(ngControl: FormControlName): FormControl<TValue> {
    return this.injector
      .get(FormGroupDirective)
      .getControl(ngControl) as FormControl<TValue>;
  }

  private getFormControl(ngControl: FormControlDirective): FormControl<TValue> {
    return ngControl.control as FormControl<TValue>;
  }

  private getNgModel(ngControl: NgModel): FormControl<TValue> {
    return ngControl.control as FormControl<TValue>;
  }

  private handleNgModel(ngControl: NgModel): void {
    ngControl.control.valueChanges
      .pipe(
        filter(
          (value: TValue): boolean =>
            typeof value !== 'undefined' &&
            (ngControl.model !== value || ngControl.viewModel !== value)
        ),
        tap((value: TValue): void => {
          ngControl.viewToModelUpdate(value);
        }),
        untilDestroyed(this)
      )
      .subscribe();
  }

  private markControl() {
    this.control.statusChanges
      ?.pipe(
        tap((): void => {
          this.markForCheck();
        }),
        untilDestroyed(this)
      )
      .subscribe();
  }

  private markForCheck(): void {
    this.changeDetectorRef.markForCheck();
  }
}
