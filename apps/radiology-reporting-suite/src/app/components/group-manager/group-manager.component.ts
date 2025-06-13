import { CommonModule } from '@angular/common';
import { Component, inject, input, InputSignal } from '@angular/core';
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
import {
  CommonDialogData,
  EventData,
  GroupCloneDialogData,
  GroupCloneDialogOutput,
} from '@app/models/ui';
import { GroupStore } from '@app/store/report-manager/group.store';
import { isNotNil } from '@app/utils/functions/common.functions';
import { findNextSortOrder } from '@app/utils/functions/order.functions';

import { CommonManagerDialogComponent } from '../common-manager-dialog/common-manager-dialog.component';
import { GroupCloneDialogComponent } from '../group-clone-dialog/group-clone-dialog.component';
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
  protected readonly groupStore$: InstanceType<typeof GroupStore> =
    inject(GroupStore);

  private readonly dialogService: DialogService = inject(DialogService);

  private readonly confirmationService: ConfirmationService =
    inject(ConfirmationService);

  readonly groups: InputSignal<FindingGroup[]> =
    input.required<FindingGroup[]>();

  readonly scope: InputSignal<Scope> = input.required<Scope>();

  onChange(group: FindingGroup | null): void {
    this.groupStore$.change(group);
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

          this.groupStore$.createWithClassifer({
            ...group,
            scopeId: this.scope().id,
            sortOrder: nextSortOrder,
          });
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
          this.groupStore$.update({
            ...updatedFindingGroup,
            id: group.id,
            sortOrder: group.sortOrder,
            scopeId: group.scopeId,
          });
        }),
        take(1)
      )
      .subscribe();
  }

  onClone(group: FindingGroup): void {
    const dialogRef: DynamicDialogRef = this.openCloneDialog('Clone Group', {
      group: group,
      scope: this.scope(),
    });

    dialogRef.onClose
      .pipe(
        filter<GroupCloneDialogOutput>(isNotNil),
        tap((cloneOutput: GroupCloneDialogOutput): void => {
          this.groupStore$.clone({
            group: cloneOutput.group,
            scopeId: cloneOutput.scope.id,
          });
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
        this.groupStore$.delete(eventData.data);
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

    this.groupStore$.reorder(sortOrders);
  }

  private openManagerDialog(
    header: string,
    data: CommonDialogData
  ): DynamicDialogRef {
    return this.dialogService.open(CommonManagerDialogComponent, {
      header,
      modal: true,
      closable: true,
      width: '25rem',
      contentStyle: { overflow: 'auto' },
      baseZIndex: 3000,
      position: 'top',
      data,
    });
  }

  private openCloneDialog(
    header: string,
    data: GroupCloneDialogData
  ): DynamicDialogRef {
    return this.dialogService.open(GroupCloneDialogComponent, {
      header,
      modal: true,
      closable: true,
      width: '40rem',
      contentStyle: { overflow: 'auto' },
      baseZIndex: 3000,
      position: 'top',
      data,
    });
  }
}
