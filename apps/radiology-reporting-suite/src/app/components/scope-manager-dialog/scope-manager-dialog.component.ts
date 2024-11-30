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
import { Scope } from '@app/models/domain';
import { ScopeManagerDialogData } from '@app/models/ui/scope-manager-dialog-data.interface';
import { ChangeModes, FormGroupModel } from '@app/types';

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

  formGroup!: FormGroupModel<Scope>;

  constructor() {
    const data: ScopeManagerDialogData = this.dynamicDialogConfig
      .data as ScopeManagerDialogData;

    this.formGroup = this.createFormGroup(
      data.mode,
      data.templateId,
      data.scope
    );
  }

  close(): void {
    this.dynamicDialogRef.close();
  }

  save(): void {
    this.dynamicDialogRef.close(this.formGroup.getRawValue());
  }

  private createFormGroup(
    mode: ChangeModes = CHANGE_MODE.Create,
    templateId: string,
    scope?: Scope
  ): FormGroupModel<Scope> {
    const formGroup: FormGroup = new FormGroup({
      name: new FormControl<string | null>(scope?.name ?? null, {
        nonNullable: true,
        validators: [Validators.required.bind(this)],
      }),
      templateId: new FormControl<string | null>(
        scope?.templateId ?? templateId,
        {
          nonNullable: true,
        }
      ),
    });

    if (mode === CHANGE_MODE.Update) {
      formGroup.addControl(
        'id',
        new FormControl<string | null>(scope?.id ?? null, {
          nonNullable: true,
        })
      );
    }

    return formGroup as FormGroupModel<Scope>;
  }
}
