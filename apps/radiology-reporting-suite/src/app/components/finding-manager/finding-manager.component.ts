import { CommonModule } from '@angular/common';
import {
  Component,
  inject,
  input,
  InputSignal,
  signal,
  WritableSignal,
} from '@angular/core';
import { PushPipe } from '@ngrx/component';
import { Store } from '@ngrx/store';
import { ConfirmationService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { FileUploadModule } from 'primeng/fileupload';
import { TooltipModule } from 'primeng/tooltip';
import { Observable } from 'rxjs';

import { CHANGE_MODE } from '@app/constants';
import {
  Finding,
  Scope,
  SortOrderItem,
  SortOrderUpdate,
} from '@app/models/domain';
import { EventData } from '@app/models/ui';
import { selectGroups } from '@app/store/report-manager/domain/report-manager.feature';
import { FindingUIActions } from '@app/store/report-manager/ui/actions/finding-ui.actions';
import { ChangeModes } from '@app/types';

import { FindingManagerListComponent } from '../finding-manager-list/finding-manager-list.component';
import { ScopeManagerComponent } from '../finding-manager-view/finding-manager-view.component';

@Component({
  selector: 'radio-finding-manager',
  standalone: true,
  imports: [
    CommonModule,
    PushPipe,
    TooltipModule,
    ButtonModule,
    ConfirmPopupModule,
    FileUploadModule,
    FindingManagerListComponent,
    ScopeManagerComponent,
  ],
  providers: [ConfirmationService],
  templateUrl: './finding-manager.component.html',
})
export class FindingManagerComponent {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  private readonly store$: Store = inject(Store);

  private readonly confirmationService: ConfirmationService =
    inject(ConfirmationService);

  readonly findings: InputSignal<Finding[]> = input.required<Finding[]>();

  readonly scope: InputSignal<Scope> = input.required<Scope>();

  readonly mode: WritableSignal<ChangeModes | null> = signal(null);

  readonly selectedFinding: WritableSignal<Finding | null> = signal(null);

  readonly groups$: Observable<string[]> = this.store$.select(selectGroups);

  readonly ChangeModes: typeof CHANGE_MODE = CHANGE_MODE;

  onSave(finding: Finding, mode: ChangeModes): void {
    const selectedFinding: Finding | null = this.selectedFinding();

    const scope: Scope = this.scope();

    if (mode === CHANGE_MODE.Update && selectedFinding) {
      this.store$.dispatch(
        FindingUIActions.update({
          finding: { ...finding, id: selectedFinding.id, scopeId: scope.id },
        })
      );

      return;
    }

    this.store$.dispatch(
      FindingUIActions.create({ finding: { ...finding, scopeId: scope.id } })
    );

    this.mode.set(null);

    this.selectedFinding.set(null);
  }

  onCreate(): void {
    this.mode.set(CHANGE_MODE.Create);

    this.selectedFinding.set(null);

    this.store$.dispatch(FindingUIActions.change({ finding: null }));
  }

  onEdit(finding: Finding): void {
    this.mode.set(CHANGE_MODE.Update);

    this.selectedFinding.set(finding);

    this.store$.dispatch(FindingUIActions.change({ finding }));
  }

  onClone(finding: Finding): void {
    this.store$.dispatch(
      FindingUIActions.clone({
        finding,
      })
    );
  }

  onDelete(eventData: EventData<Finding>): void {
    this.confirmationService.confirm({
      target: eventData.event.target as EventTarget,
      message: 'Do you want to delete this finding?',
      icon: 'pi pi-info-circle',
      acceptButtonStyleClass: 'p-button-danger p-button-sm',
      accept: () => {
        this.store$.dispatch(
          FindingUIActions.delete({ finding: eventData.data })
        );
      },
    });
  }

  onReorder(findings: ReadonlyArray<Finding>): void {
    const sortOrders: SortOrderUpdate = {
      sortOrdersMap: findings.map(
        (finding: Finding, index: number): SortOrderItem => ({
          id: finding.id,
          sortOrder: index,
        })
      ),
    };

    this.store$.dispatch(FindingUIActions.reorder({ sortOrders }));
  }
}
