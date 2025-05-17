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
  Scope,
  SortOrderItem,
  SortOrderUpdate,
  Template,
} from '@app/models/domain';
import {
  CommonDialogData,
  EventData,
  ScopeCloneDialogData,
  ScopeCloneDialogOutput,
  ScopeManagerDialogData,
} from '@app/models/ui';
import { ScopeStore } from '@app/store/report-manager/scope.store';
import { isNotNil } from '@app/utils/functions/common.functions';
import { findNextSortOrder } from '@app/utils/functions/order.functions';

import { CommonManagerDialogComponent } from '../common-manager-dialog/common-manager-dialog.component';
import { ScopeCloneDialogComponent } from '../scope-clone-dialog/scope-clone-dialog.component';
import { ScopeManagerListComponent } from '../scope-manager-list/scope-manager-list.component';
import { SortableListManagerLayoutComponent } from '../sortable-list-manager-layout/sortable-list-manager-layout.component';

@Component({
  selector: 'radio-scope-manager',
  standalone: true,
  imports: [
    CommonModule,
    TooltipModule,
    ButtonModule,
    ConfirmPopupModule,
    FileUploadModule,
    ScopeManagerListComponent,
    SortableListManagerLayoutComponent,
  ],
  providers: [DialogService, ConfirmationService],
  templateUrl: './scope-manager.component.html',
})
export class ScopeManagerComponent {
  protected readonly scopeStore$: InstanceType<typeof ScopeStore> =
    inject(ScopeStore);

  private readonly dialogService: DialogService = inject(DialogService);

  private readonly confirmationService: ConfirmationService =
    inject(ConfirmationService);

  readonly scopes: InputSignal<Scope[]> = input.required<Scope[]>();

  readonly template: InputSignal<Template> = input.required<Template>();

  onChange(scope: Scope | null): void {
    this.scopeStore$.change(scope);
  }

  onCreate(): void {
    const dialogRef: DynamicDialogRef = this.openManagerDialog(
      'Create New Scope',
      {
        mode: CHANGE_MODE.Create,
      }
    );

    dialogRef.onClose
      .pipe(
        filter<Scope>(isNotNil),
        tap((scope: Scope): void => {
          const nextSortOrder: number = findNextSortOrder(this.scopes());

          this.scopeStore$.createWithGroup({
            ...scope,
            templateId: this.template().id,
            sortOrder: nextSortOrder,
          });
        }),
        take(1)
      )
      .subscribe();
  }

  onEdit(scope: Scope): void {
    const dialogRef: DynamicDialogRef = this.openManagerDialog('Edit Scope', {
      mode: CHANGE_MODE.Update,
      scope,
    });

    dialogRef.onClose
      .pipe(
        filter<Scope>(isNotNil),
        tap((updatedScope: Scope): void => {
          this.scopeStore$.update({
            ...updatedScope,
            id: scope.id,
            sortOrder: scope.sortOrder,
            templateId: scope.templateId,
          });
        }),
        take(1)
      )
      .subscribe();
  }

  onClone(scope: Scope): void {
    const dialogRef: DynamicDialogRef = this.openCloneDialog('Clone Scope', {
      scope: scope,
      template: this.template(),
    });

    dialogRef.onClose
      .pipe(
        filter<ScopeCloneDialogOutput>(isNotNil),
        tap((cloneOutput: ScopeCloneDialogOutput): void => {
          this.scopeStore$.clone({
            scope: cloneOutput.scope,
            templateId: cloneOutput.template.id,
          });
        }),
        take(1)
      )
      .subscribe();
  }

  onDelete(eventData: EventData<Scope>): void {
    this.confirmationService.confirm({
      target: eventData.event.target as EventTarget,
      message: 'Do you want to delete this scope and all its findings?',
      icon: 'pi pi-info-circle',
      acceptButtonStyleClass: 'p-button-danger p-button-sm',
      accept: () => {
        this.scopeStore$.delete(eventData.data);
      },
    });
  }

  onReorder(scopes: ReadonlyArray<Scope>): void {
    const sortOrders: SortOrderUpdate = {
      sortOrdersMap: scopes.map(
        (scope: Scope, index: number): SortOrderItem => ({
          id: scope.id,
          sortOrder: index,
        })
      ),
    };

    this.scopeStore$.reorder(sortOrders);
  }

  private openManagerDialog(
    header: string,
    data: ScopeManagerDialogData
  ): DynamicDialogRef {
    return this.dialogService.open(CommonManagerDialogComponent, {
      header,
      modal: true,
      closable: true,
      width: '25rem',
      contentStyle: { overflow: 'auto' },
      baseZIndex: 3000,
      position: 'top',
      data: {
        mode: data.mode,
        name: data.scope?.name,
      } satisfies CommonDialogData,
    });
  }

  private openCloneDialog(
    header: string,
    data: ScopeCloneDialogData
  ): DynamicDialogRef {
    return this.dialogService.open(ScopeCloneDialogComponent, {
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
