import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  inject,
  Signal,
  TemplateRef,
  viewChild,
} from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { isNil } from 'lodash-es';
import { ButtonModule } from 'primeng/button';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { TooltipModule } from 'primeng/tooltip';

import { EditorContent } from '@app/models/domain';
import { InfoDialogData } from '@app/models/ui';

import { EditorComponent } from '../../editor/editor.component';
import { DialogLayoutComponent } from '../dialog-layout/dialog-layout.component';
import { DynamicTemplateRendererComponent } from '../dialog-template-renderer/dialog-template-renderer.component';

@Component({
  selector: 'radio-info-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputTextModule,
    TooltipModule,
    ButtonModule,
    DialogLayoutComponent,
    MessageModule,
    EditorComponent,
  ],
  templateUrl: './info-dialog.component.html',
})
export class InfoDialogComponent implements AfterViewInit {
  private readonly dynamicDialogRef: DynamicDialogRef =
    inject(DynamicDialogRef);

  private readonly dynamicDialogConfig: DynamicDialogConfig<InfoDialogData> =
    inject(DynamicDialogConfig) as DynamicDialogConfig<InfoDialogData>;

  protected readonly footer: Signal<TemplateRef<unknown>> =
    viewChild.required<TemplateRef<unknown>>('footer');

  protected readonly infoControl: FormControl<EditorContent | null> =
    new FormControl<EditorContent | null>(null);

  ngAfterViewInit(): void {
    if (isNil(this.dynamicDialogConfig.data)) {
      return;
    }

    const info: EditorContent | null = this.dynamicDialogConfig.data.info;

    this.infoControl.setValue(info);

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
}
