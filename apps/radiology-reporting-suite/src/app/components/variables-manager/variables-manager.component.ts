import { Component, inject, input, InputSignal } from '@angular/core';

import { Finding } from '@app/models/domain';
import { VariableStore } from '@app/store/report-manager/variable-store';

import { VariableManagerComponent } from '../variable-manager/variable-manager.component';
import { VariableValueManagerComponent } from '../variable-value-manager/variable-value-manager.component';
import { VariablesListComponent } from '../variables-list/variables-list.component';

@Component({
  selector: 'radio-variables-manager',
  standalone: true,
  imports: [
    VariableManagerComponent,
    VariableValueManagerComponent,
    VariablesListComponent,
  ],
  templateUrl: './variables-manager.component.html',
})
export class VariablesManagerComponent {
  readonly finding: InputSignal<Finding> = input.required<Finding>();

  protected readonly variableStore$: InstanceType<typeof VariableStore> =
    inject(VariableStore);
}
