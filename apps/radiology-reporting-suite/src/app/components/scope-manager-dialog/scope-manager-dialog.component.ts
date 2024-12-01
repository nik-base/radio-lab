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
import { ScopeBase } from '@app/models/domain';
import { ScopeManagerDialogData } from '@app/models/ui/scope-manager-dialog-data.interface';
import { FormGroupModel } from '@app/types';

import { DialogLayoutComponent } from '../dialog-layout/dialog-layout.component';

@Component({
  selector: 'radio-scope-manager-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputTextModule,
    TooltipModule,
    ButtonModule,
    DialogLayoutComponent,
  ],
  templateUrl: './scope-manager-dialog.component.html',
})
export class ScopeManagerDialogComponent {
  private readonly dynamicDialogRef: DynamicDialogRef =
    inject(DynamicDialogRef);

  private readonly dynamicDialogConfig: DynamicDialogConfig =
    inject(DynamicDialogConfig);

  formGroup: FormGroupModel<ScopeBase> = this.createFormGroup();

  constructor() {
    const data: ScopeManagerDialogData = this.dynamicDialogConfig
      .data as ScopeManagerDialogData;

    if (data.mode === CHANGE_MODE.Update) {
      this.formGroup = this.createFormGroup(data.scope);
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

  private createFormGroup(scope?: ScopeBase): FormGroupModel<ScopeBase> {
    const formGroup: FormGroup = new FormGroup({
      name: new FormControl<string | null>(scope?.name ?? null, {
        nonNullable: true,
        validators: [Validators.required.bind(this)],
      }),
    });

    return formGroup as FormGroupModel<ScopeBase>;
  }
}
