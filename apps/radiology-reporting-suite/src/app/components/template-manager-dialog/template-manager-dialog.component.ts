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
import { MessageModule } from 'primeng/message';
import { TooltipModule } from 'primeng/tooltip';

import { CHANGE_MODE } from '@app/constants';
import { EditorComponent } from '@app/editor/editor.component';
import { EditorValidators } from '@app/editor/validators/editor-validator';
import { EditorContent, TemplateBase } from '@app/models/domain';
import { TemplateManagerDialogData } from '@app/models/ui';
import { FormGroupModel } from '@app/types';

import { DialogLayoutComponent } from '../dialog-layout/dialog-layout.component';

@Component({
  selector: 'radio-template-manager-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputTextModule,
    TooltipModule,
    ButtonModule,
    MessageModule,
    EditorComponent,
    DialogLayoutComponent,
  ],
  templateUrl: './template-manager-dialog.component.html',
})
export class TemplateManagerDialogComponent {
  private readonly dynamicDialogRef: DynamicDialogRef =
    inject(DynamicDialogRef);

  private readonly dynamicDialogConfig: DynamicDialogConfig<TemplateManagerDialogData> =
    inject(
      DynamicDialogConfig
    ) as DynamicDialogConfig<TemplateManagerDialogData>;

  formGroup: FormGroupModel<TemplateBase> = this.createFormGroup();

  constructor() {
    const data: TemplateManagerDialogData = this.dynamicDialogConfig
      .data as TemplateManagerDialogData;

    if (data.mode === CHANGE_MODE.Update) {
      this.formGroup = this.createFormGroup(data.template);
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

  private createFormGroup(
    template?: TemplateBase
  ): FormGroupModel<TemplateBase> {
    const formGroup: FormGroup = new FormGroup({
      name: new FormControl<string | null>(template?.name ?? null, {
        nonNullable: true,
        validators: [Validators.required.bind(this)],
      }),
      protocol: new FormControl<EditorContent | null>(
        template?.protocol ?? null,
        {
          nonNullable: true,
          validators: [EditorValidators.required()],
        }
      ),
      patientInfo: new FormControl<EditorContent | null>(
        template?.patientInfo ?? null
      ),
    });

    return formGroup as FormGroupModel<TemplateBase>;
  }
}
