import { Component, inject } from '@angular/core';
import { isNil } from 'lodash-es';
import { ButtonModule } from 'primeng/button';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

import { VariablesManagerDialogData } from '@app/models/ui';
import { VariableStore } from '@app/store/report-manager/variable-store';

import { DialogLayoutComponent } from '../dialog-layout/dialog-layout.component';
import { VariablesManagerComponent } from '../variables-manager/variables-manager.component';

@Component({
  selector: 'radio-variables-manager-dialog',
  standalone: true,
  imports: [ButtonModule, DialogLayoutComponent, VariablesManagerComponent],
  templateUrl: './variables-manager-dialog.component.html',
})
export class VariablesManagerDialogComponent {
  private readonly dynamicDialogRef: DynamicDialogRef =
    inject(DynamicDialogRef);

  private readonly dynamicDialogConfig: DynamicDialogConfig<VariablesManagerDialogData> =
    inject(
      DynamicDialogConfig
    ) as DynamicDialogConfig<VariablesManagerDialogData>;

  protected readonly variableStore$: InstanceType<typeof VariableStore> =
    inject(VariableStore);

  protected dialogData!: VariablesManagerDialogData;

  constructor() {
    this.setDialogData();
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
