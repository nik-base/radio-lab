import { Component, inject } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

import { VariablesManagerDialogData } from '@app/models/ui';
import { VariableStore } from '@app/store/report-manager/variable-store';
import { isNotNil } from '@app/utils/functions/common.functions';

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
    if (isNotNil(this.dynamicDialogConfig.data)) {
      this.dialogData = this.dynamicDialogConfig.data;
    }
  }

  close(): void {
    this.variableStore$.reset();

    this.dynamicDialogRef.close();
  }
}
