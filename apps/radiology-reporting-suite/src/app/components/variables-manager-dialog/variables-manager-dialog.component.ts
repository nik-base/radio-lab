import {
  AfterViewInit,
  Component,
  inject,
  Signal,
  TemplateRef,
  viewChild,
} from '@angular/core';
import { isNil } from 'lodash-es';
import { ButtonModule } from 'primeng/button';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

import { VariablesManagerDialogData } from '@app/models/ui';
import { VariableStore } from '@app/store/report-manager/variable-store';

import { DialogLayoutComponent } from '../dialog-layout/dialog-layout.component';
import { DynamicTemplateRendererComponent } from '../dialog-template-renderer/dialog-template-renderer.component';
import { VariablesManagerComponent } from '../variables-manager/variables-manager.component';

@Component({
  selector: 'radio-variables-manager-dialog',
  standalone: true,
  imports: [ButtonModule, DialogLayoutComponent, VariablesManagerComponent],
  templateUrl: './variables-manager-dialog.component.html',
})
export class VariablesManagerDialogComponent implements AfterViewInit {
  private readonly dynamicDialogRef: DynamicDialogRef =
    inject(DynamicDialogRef);

  private readonly dynamicDialogConfig: DynamicDialogConfig<VariablesManagerDialogData> =
    inject(
      DynamicDialogConfig
    ) as DynamicDialogConfig<VariablesManagerDialogData>;

  protected readonly variableStore$: InstanceType<typeof VariableStore> =
    inject(VariableStore);

  protected readonly footer: Signal<TemplateRef<unknown>> =
    viewChild.required<TemplateRef<unknown>>('footer');

  protected dialogData!: VariablesManagerDialogData;

  constructor() {
    this.setDialogData();
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

  private setDialogData(): void {
    if (isNil(this.dynamicDialogConfig.data)) {
      return;
    }

    this.dialogData = this.dynamicDialogConfig.data;
  }
}
