import { CommonModule } from '@angular/common';
import { Component, inject, input, InputSignal } from '@angular/core';
import { PushPipe } from '@ngrx/component';
import { Store } from '@ngrx/store';
import { ConfirmationService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { FileUploadModule } from 'primeng/fileupload';
import { TooltipModule } from 'primeng/tooltip';
import { Observable, take, tap } from 'rxjs';

import { CHANGE_MODE } from '@app/constants';
import {
  Scope,
  SortOrderItem,
  SortOrderUpdate,
  Template,
} from '@app/models/domain';
import {
  EventData,
  ScopeCloneDialogData,
  ScopeCloneDialogOutput,
  ScopeManagerDialogData,
} from '@app/models/ui';
import { selectSelectedScope } from '@app/store/report-manager/domain/report-manager.feature';
import { ScopeUIActions } from '@app/store/report-manager/ui/actions/scope-ui.actions';
import { findNextSortOrder } from '@app/utils/functions/order.functions';

import { ScopeCloneDialogComponent } from '../scope-clone-dialog/scope-clone-dialog.component';
import { ScopeManagerDialogComponent } from '../scope-manager-dialog/scope-manager-dialog.component';
import { ScopeManagerListComponent } from '../scope-manager-list/scope-manager-list.component';

@Component({
  selector: 'radio-scope-manager',
  standalone: true,
  imports: [
    CommonModule,
    PushPipe,
    TooltipModule,
    ButtonModule,
    ConfirmPopupModule,
    FileUploadModule,
    ScopeManagerListComponent,
  ],
  providers: [DialogService, ConfirmationService],
  templateUrl: './scope-manager.component.html',
})
export class ScopeManagerComponent {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  private readonly store$: Store = inject(Store);

  private readonly dialogService: DialogService = inject(DialogService);

  private readonly confirmationService: ConfirmationService =
    inject(ConfirmationService);

  readonly scopes: InputSignal<Scope[]> = input.required<Scope[]>();

  readonly template: InputSignal<Template> = input.required<Template>();

  readonly selectedScope: Observable<Scope | null> =
    this.store$.select(selectSelectedScope);

  onChange(scope: Scope): void {
    this.store$.dispatch(ScopeUIActions.change({ scope }));
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
        tap((scope: Scope | null | undefined): void => {
          if (!scope) {
            return;
          }

          const nextSortOrder: number = findNextSortOrder(this.scopes());

          this.store$.dispatch(
            ScopeUIActions.create({
              scope: {
                ...scope,
                templateId: this.template().id,
                sortOrder: nextSortOrder,
              },
            })
          );
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
        tap((updatedScope: Scope | null | undefined): void => {
          if (!updatedScope) {
            return;
          }

          this.store$.dispatch(
            ScopeUIActions.update({
              scope: {
                ...updatedScope,
                id: scope.id,
                templateId: scope.templateId,
              },
            })
          );
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
        tap((cloneOutput: ScopeCloneDialogOutput | null | undefined): void => {
          if (!cloneOutput) {
            return;
          }

          this.store$.dispatch(
            ScopeUIActions.clone({
              scope: cloneOutput.scope,
              templateId: cloneOutput.template.id,
            })
          );
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
        this.store$.dispatch(ScopeUIActions.delete({ scope: eventData.data }));
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

    this.store$.dispatch(ScopeUIActions.reorder({ sortOrders }));
  }

  private openManagerDialog(
    header: string,
    data: ScopeManagerDialogData
  ): DynamicDialogRef {
    return this.dialogService.open(ScopeManagerDialogComponent, {
      header,
      width: '25rem',
      contentStyle: { overflow: 'auto' },
      baseZIndex: 3000,
      position: 'top',
      data,
    });
  }

  private openCloneDialog(
    header: string,
    data: ScopeCloneDialogData
  ): DynamicDialogRef {
    return this.dialogService.open(ScopeCloneDialogComponent, {
      header,
      width: '40rem',
      contentStyle: { overflow: 'auto' },
      baseZIndex: 3000,
      position: 'top',
      data,
    });
  }
}
