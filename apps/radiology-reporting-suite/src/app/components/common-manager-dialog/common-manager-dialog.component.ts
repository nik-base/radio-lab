import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  inject,
  Signal,
  TemplateRef,
  viewChild,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { isNil } from 'lodash-es';
import { ButtonModule } from 'primeng/button';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { TooltipModule } from 'primeng/tooltip';

import { CHANGE_MODE } from '@app/constants';
import { CommonDialogData } from '@app/models/ui';
import { FormGroupModel } from '@app/types';

import { DialogLayoutComponent } from '../dialog-layout/dialog-layout.component';
import { DynamicTemplateRendererComponent } from '../dialog-template-renderer/dialog-template-renderer.component';

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
    MessageModule,
  ],
  templateUrl: './common-manager-dialog.component.html',
})
export class CommonManagerDialogComponent implements AfterViewInit {
  private readonly dynamicDialogRef: DynamicDialogRef =
    inject(DynamicDialogRef);

  private readonly dynamicDialogConfig: DynamicDialogConfig<CommonDialogData> =
    inject(DynamicDialogConfig) as DynamicDialogConfig<CommonDialogData>;

  protected readonly footer: Signal<TemplateRef<unknown>> =
    viewChild.required<TemplateRef<unknown>>('footer');

  formGroup: FormGroupModel<{ name: string }> = this.createFormGroup();

  constructor() {
    const data: CommonDialogData = this.dynamicDialogConfig
      .data as CommonDialogData;

    if (data.mode === CHANGE_MODE.Update) {
      this.formGroup = this.createFormGroup(data.name);
    }
  }

  ngAfterViewInit(): void {
    if (isNil(this.dynamicDialogConfig.data)) {
      return;
    }

    // Defer the assignment of 'templateToRender' to the next microtask
    // to prevent ExpressionChangedAfterItHasBeenCheckedError.
    queueMicrotask(() => {
      this.dynamicDialogConfig.templates = {
        footer: DynamicTemplateRendererComponent,
      };

      if (this.dynamicDialogConfig.data) {
        this.dynamicDialogConfig.data.templateToRender = this.footer();
      }
    });
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
