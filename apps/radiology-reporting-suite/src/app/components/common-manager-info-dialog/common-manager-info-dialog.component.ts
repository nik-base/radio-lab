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
import { EditorComponent } from '@app/editor/editor.component';
import {
  EditorContent,
  FindingClassifierBase,
  FindingGroupBase,
} from '@app/models/domain';
import { CommonInfoDialogData } from '@app/models/ui';
import { FormGroupModel } from '@app/types';

import { DialogLayoutComponent } from '../dialog-layout/dialog-layout.component';
import { DynamicTemplateRendererComponent } from '../dialog-template-renderer/dialog-template-renderer.component';

@Component({
  selector: 'radio-common-manager-info-dialog',
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
  templateUrl: './common-manager-info-dialog.component.html',
})
export class CommonManagerInfoDialogComponent implements AfterViewInit {
  private readonly dynamicDialogRef: DynamicDialogRef =
    inject(DynamicDialogRef);

  private readonly dynamicDialogConfig: DynamicDialogConfig<CommonInfoDialogData> =
    inject(DynamicDialogConfig) as DynamicDialogConfig<CommonInfoDialogData>;

  protected readonly footer: Signal<TemplateRef<unknown>> =
    viewChild.required<TemplateRef<unknown>>('footer');

  formGroup: FormGroupModel<FindingGroupBase | FindingClassifierBase> =
    this.createFormGroup();

  constructor() {
    const data: CommonInfoDialogData = this.dynamicDialogConfig
      .data as CommonInfoDialogData;

    if (data.mode === CHANGE_MODE.Update) {
      this.formGroup = this.createFormGroup(data);
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

  private createFormGroup(
    data?: CommonInfoDialogData
  ): FormGroupModel<FindingGroupBase | FindingClassifierBase> {
    const formGroup: FormGroup = new FormGroup({
      name: new FormControl<string | null>(data?.name ?? null, {
        nonNullable: true,
        validators: [Validators.required.bind(this)],
      }),
      info: new FormControl<EditorContent | null>(data?.info ?? null),
    });

    return formGroup as FormGroupModel<
      FindingGroupBase | FindingClassifierBase
    >;
  }
}
