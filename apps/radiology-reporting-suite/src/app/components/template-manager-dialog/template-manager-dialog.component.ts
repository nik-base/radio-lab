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
import { EditorComponent } from '@app/editor/editor.component';
import { EditorValidators } from '@app/editor/validators/editor-validator';
import { EditorContent, Template } from '@app/models/domain';
import { TemplateDialogData } from '@app/models/ui';
import { ChangeModes, FormGroupModel } from '@app/types';

@Component({
  selector: 'radio-template-manager-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputTextModule,
    TooltipModule,
    ButtonModule,
    EditorComponent,
  ],
  templateUrl: './template-manager-dialog.component.html',
})
export class TemplateManagerDialogComponent {
  private readonly dynamicDialogRef: DynamicDialogRef =
    inject(DynamicDialogRef);

  private readonly dynamicDialogConfig: DynamicDialogConfig =
    inject(DynamicDialogConfig);

  formGroup: FormGroupModel<Template> = this.createFormGroup();

  constructor() {
    const data: TemplateDialogData = this.dynamicDialogConfig
      .data as TemplateDialogData;

    if (data.mode === CHANGE_MODE.Update) {
      this.formGroup = this.createFormGroup(CHANGE_MODE.Update, data.template);
    }
  }

  close(): void {
    this.dynamicDialogRef.close();
  }

  save(): void {
    this.dynamicDialogRef.close(this.formGroup.getRawValue());
  }

  private createFormGroup(
    mode: ChangeModes = CHANGE_MODE.Create,
    template?: Template
  ): FormGroupModel<Template> {
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

    if (mode === CHANGE_MODE.Update) {
      formGroup.addControl(
        'id',
        new FormControl<string | null>(template?.id ?? null, {
          nonNullable: true,
        })
      );
    }

    return formGroup as FormGroupModel<Template>;
  }
}
