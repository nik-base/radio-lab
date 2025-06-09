import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, TemplateRef } from '@angular/core';
import { isNil } from 'lodash-es';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';

import { DialogTemplateRendererData } from '@app/models/ui';

@Component({
  selector: 'radio-dialog-template-renderer',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (template) {
      <ng-container [ngTemplateOutlet]="template"> </ng-container>
    }
  `,
})
export class DynamicTemplateRendererComponent implements OnInit {
  private readonly dynamicDialogConfig: DynamicDialogConfig<DialogTemplateRendererData> =
    inject(
      DynamicDialogConfig
    ) as DynamicDialogConfig<DialogTemplateRendererData>;

  protected template: TemplateRef<unknown> | undefined;

  ngOnInit() {
    if (isNil(this.dynamicDialogConfig?.data?.templateToRender)) {
      return;
    }

    this.template = this.dynamicDialogConfig.data.templateToRender;
  }
}
