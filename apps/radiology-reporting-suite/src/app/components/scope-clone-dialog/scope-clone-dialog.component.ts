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

import { Template } from '@app/models/domain';
import { ScopeCloneDialogData, ScopeCloneDialogOutput } from '@app/models/ui';
import { TemplateStore } from '@app/store/report-manager/template.store';

import { DialogLayoutComponent } from '../dialog-layout/dialog-layout.component';
import { TemplateManagerListComponent } from '../template-selector/template-selector.component';

@Component({
  selector: 'radio-scope-clone-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputTextModule,
    TooltipModule,
    ButtonModule,
    DialogLayoutComponent,
    TemplateManagerListComponent,
  ],
  templateUrl: './scope-clone-dialog.component.html',
})
export class ScopeCloneDialogComponent {
  protected readonly templateStore$: InstanceType<typeof TemplateStore> =
    inject(TemplateStore);

  private readonly dynamicDialogRef: DynamicDialogRef =
    inject(DynamicDialogRef);

  private readonly dynamicDialogConfig: DynamicDialogConfig<ScopeCloneDialogData> =
    inject(DynamicDialogConfig) as DynamicDialogConfig<ScopeCloneDialogData>;

  formGroup!: FormGroup;

  readonly data!: ScopeCloneDialogData;

  constructor() {
    const data: ScopeCloneDialogData = this.dynamicDialogConfig
      .data as ScopeCloneDialogData;

    this.data = data;

    this.formGroup = this.createFormGroup(data);
  }

  close(): void {
    this.dynamicDialogRef.close();
  }

  clone(): void {
    this.dynamicDialogRef.close({
      scope: this.data.scope,
      template: this.formGroup.get('template')?.value as Template,
    } satisfies ScopeCloneDialogOutput);
  }

  private createFormGroup(data: ScopeCloneDialogData): FormGroup {
    const formGroup: FormGroup = new FormGroup({
      template: new FormControl<Template>(data.template, {
        nonNullable: true,
        validators: [Validators.required.bind(this)],
      }),
    });

    return formGroup;
  }
}
