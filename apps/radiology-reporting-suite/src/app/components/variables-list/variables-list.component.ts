import {
  Component,
  computed,
  inject,
  input,
  InputSignal,
  Signal,
} from '@angular/core';
import { ConfirmationService, TooltipOptions } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { ListboxModule } from 'primeng/listbox';
import { TooltipModule } from 'primeng/tooltip';

import { APP_TOOLTIP_OPTIONS } from '@app/constants';
import { Finding, Variable } from '@app/models/domain';
import { VariableStore } from '@app/store/report-manager/variable-store';

@Component({
  selector: 'radio-variables-list',
  standalone: true,
  imports: [ListboxModule, ButtonModule, TooltipModule, ConfirmPopupModule],
  providers: [ConfirmationService],
  templateUrl: './variables-list.component.html',
})
export class VariablesListComponent {
  private readonly confirmationService: ConfirmationService =
    inject(ConfirmationService);

  protected readonly tooltipOptions: TooltipOptions = APP_TOOLTIP_OPTIONS;

  readonly finding: InputSignal<Finding> = input.required<Finding>();

  protected readonly variableStore$: InstanceType<typeof VariableStore> =
    inject(VariableStore);

  protected readonly variables: Signal<Variable[]> = computed(() =>
    this.variableStore$.exceptVariables()(this.finding().id)()
  );

  onCopy(variable: Variable): void {
    this.variableStore$.clone({ variable, entityId: this.finding().id });
  }

  onDelete(event: Event, variable: Variable): void {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: `Do you want to delete this variable from finding "${this.finding().name}"? If the variable is used in finding content, the variable will become unusable.`,
      icon: 'pi pi-info-circle',
      acceptButtonStyleClass: 'p-button-danger p-button-sm',
      accept: () => {
        this.variableStore$.delete(variable);
      },
    });
  }
}
