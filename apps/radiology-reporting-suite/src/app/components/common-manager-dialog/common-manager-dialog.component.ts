import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { InputTextModule } from 'primeng/inputtext';
import { TooltipModule } from 'primeng/tooltip';

import { CHANGE_MODE } from '@app/constants';
import { CommonDialogData } from '@app/models/ui';
import { FormGroupModel } from '@app/types';

import { DialogLayoutComponent } from '../dialog-layout/dialog-layout.component';

@Component({
  selector: 'radio-common-manager-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputTextModule,
    TooltipModule,
    ButtonModule,
    DialogLayoutComponent,
  ],
  templateUrl: './common-manager-dialog.component.html',
})
export class CommonManagerDialogComponent {
  private readonly dynamicDialogRef: DynamicDialogRef =
    inject(DynamicDialogRef);

  private readonly dynamicDialogConfig: DynamicDialogConfig<CommonDialogData> =
    inject(DynamicDialogConfig) as DynamicDialogConfig<CommonDialogData>;

  formGroup: FormGroupModel<{ name: string }> = this.createFormGroup();

  constructor() {
    const data: CommonDialogData = this.dynamicDialogConfig
      .data as CommonDialogData;

    if (data.mode === CHANGE_MODE.Update) {
      this.formGroup = this.createFormGroup(data.name);
    }
  }

  close(): void {
    this.dynamicDialogRef.close();
  }

  save(): void {
    if (!this.formGroup.valid) {
      return;
    }

    this.dynamicDialogRef.close(this.formGroup.getRawValue());
  }

  private createFormGroup(name?: string): FormGroupModel<{ name: string }> {
    const formGroup: FormGroup = new FormGroup({
      name: new FormControl<string | null>(name ?? null, {
        nonNullable: true,
        validators: [Validators.required.bind(this)],
      }),
    });

    return formGroup as FormGroupModel<{ name: string }>;
  }
}
