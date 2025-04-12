import { CommonModule } from '@angular/common';
import { Component, inject, input, InputSignal, Signal } from '@angular/core';
import { Store } from '@ngrx/store';
import { isNil } from 'lodash-es';
import { ConfirmationService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { FileUploadModule } from 'primeng/fileupload';
import { TooltipModule } from 'primeng/tooltip';
import { filter, take, tap } from 'rxjs';

import { CHANGE_MODE } from '@app/constants';
import {
  FindingGroup,
  Scope,
  SortOrderItem,
  SortOrderUpdate,
} from '@app/models/domain';
import { CommonDialogData, EventData } from '@app/models/ui';
import { selectSelectedGroup } from '@app/store/report-manager/domain/report-manager.feature';
import { GroupUIActions } from '@app/store/report-manager/ui/actions/group-ui.actions';
import { isNotNil } from '@app/utils/functions/common.functions';
import { findNextSortOrder } from '@app/utils/functions/order.functions';

import { CommonManagerDialogComponent } from '../common-manager-dialog/common-manager-dialog.component';
import { GroupManagerListComponent } from '../group-manager-list/group-manager-list.component';
import { SortableListManagerLayoutComponent } from '../sortable-list-manager-layout/sortable-list-manager-layout.component';

@Component({
  selector: 'radio-group-manager',
  standalone: true,
  imports: [
    CommonModule,
    TooltipModule,
    ButtonModule,
    ConfirmPopupModule,
    FileUploadModule,
    GroupManagerListComponent,
    SortableListManagerLayoutComponent,
  ],
  providers: [DialogService, ConfirmationService],
  templateUrl: './group-manager.component.html',
})
export class GroupManagerComponent {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  private readonly store$: Store = inject(Store);

  private readonly dialogService: DialogService = inject(DialogService);

  private readonly confirmationService: ConfirmationService =
    inject(ConfirmationService);

  readonly groups: InputSignal<FindingGroup[]> =
    input.required<FindingGroup[]>();

  readonly scope: InputSignal<Scope> = input.required<Scope>();

  readonly selectedGroup: Signal<FindingGroup | null> =
    this.store$.selectSignal(selectSelectedGroup);

  onChange(group: FindingGroup | null): void {
    if (isNil(group)) {
      this.store$.dispatch(GroupUIActions.reset());
      return;
    }

    this.store$.dispatch(GroupUIActions.change({ group }));
  }

  onCreate(): void {
    const dialogRef: DynamicDialogRef = this.openManagerDialog(
      'Create New Group',
      {
        mode: CHANGE_MODE.Create,
      }
    );

    dialogRef.onClose
      .pipe(
        filter<FindingGroup>(isNotNil),
        tap((group: FindingGroup): void => {
          const nextSortOrder: number = findNextSortOrder(this.groups());

          this.store$.dispatch(
            GroupUIActions.create({
              group: {
                ...group,
                scopeId: this.scope().id,
                sortOrder: nextSortOrder,
              },
            })
          );
        }),
        take(1)
      )
      .subscribe();
  }

  onEdit(group: FindingGroup): void {
    const dialogRef: DynamicDialogRef = this.openManagerDialog('Edit Group', {
      mode: CHANGE_MODE.Update,
      name: group.name,
    });

    dialogRef.onClose
      .pipe(
        filter<FindingGroup>(isNotNil),
        tap((updatedFindingGroup: FindingGroup): void => {
          this.store$.dispatch(
            GroupUIActions.update({
              group: {
                ...updatedFindingGroup,
                id: group.id,
                sortOrder: group.sortOrder,
                scopeId: group.scopeId,
              },
            })
          );
        }),
        take(1)
      )
      .subscribe();
  }

  onDelete(eventData: EventData<FindingGroup>): void {
    this.confirmationService.confirm({
      target: eventData.event.target as EventTarget,
      message: 'Do you want to delete this group and all its findings?',
      icon: 'pi pi-info-circle',
      acceptButtonStyleClass: 'p-button-danger p-button-sm',
      accept: () => {
        this.store$.dispatch(GroupUIActions.delete({ group: eventData.data }));
      },
    });
  }

  onReorder(groups: ReadonlyArray<FindingGroup>): void {
    const sortOrders: SortOrderUpdate = {
      sortOrdersMap: groups.map(
        (group: FindingGroup, index: number): SortOrderItem => ({
          id: group.id,
          sortOrder: index,
        })
      ),
    };

    this.store$.dispatch(GroupUIActions.reorder({ sortOrders }));
  }

  private openManagerDialog(
    header: string,
    data: CommonDialogData
  ): DynamicDialogRef {
    return this.dialogService.open(CommonManagerDialogComponent, {
      header,
      width: '25rem',
      contentStyle: { overflow: 'auto' },
      baseZIndex: 3000,
      position: 'top',
      data,
    });
  }
}
