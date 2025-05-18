import {
  Component,
  computed,
  effect,
  inject,
  input,
  InputSignal,
  Signal,
} from '@angular/core';
import { ConfirmationService, TooltipOptions } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { ListboxModule } from 'primeng/listbox';
import { SkeletonModule } from 'primeng/skeleton';
import { TooltipModule } from 'primeng/tooltip';

import { APP_TOOLTIP_OPTIONS } from '@app/constants';
import { Finding, Variable } from '@app/models/domain';
import { FindingStore } from '@app/store/report-manager/finding.store';
import { VariableStore } from '@app/store/report-manager/variable-store';

@Component({
  selector: 'radio-variables-list',
  standalone: true,
  imports: [
    ListboxModule,
    ButtonModule,
    TooltipModule,
    ConfirmPopupModule,
    SkeletonModule,
  ],
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

  private readonly findingStore$: InstanceType<typeof FindingStore> =
    inject(FindingStore);

  protected readonly variables: Signal<Variable[]> = computed(() => {
    const allVariables: Variable[] = this.variableStore$.exceptVariables()(
      this.finding().id
    )();

    const findingsByScopeId: Finding[] =
      this.findingStore$.additionalData?.()?.findingsByScopeId ?? [];

    return allVariables.filter((variable: Variable): boolean =>
      findingsByScopeId.some(
        (finding: Finding) => finding.id === variable.entityId
      )
    );
  });

  protected readonly isLoading: Signal<boolean> = computed(() => {
    const isVariablesFetching: boolean = this.variableStore$.isFetching();

    const isFindingsByScopeIdFetching: boolean =
      this.findingStore$.isLoading() &&
      this.findingStore$.currentOperation() === 'fetchByScopeId';

    return isVariablesFetching || isFindingsByScopeIdFetching;
  });

  protected readonly mockVariables: Variable[] = Array<Variable>(3).fill({
    id: '',
    name: '',
    type: '',
    source: '',
    sortOrder: 0,
    entityId: '',
  });

  constructor() {
    this.effectFetchFindingsByScopeId();
  }

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

  private effectFetchFindingsByScopeId(): void {
    effect(() => {
      this.findingStore$.fetchByScopeId(this.finding().scopeId);
    });
  }
}
