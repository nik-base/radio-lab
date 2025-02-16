import { CommonModule } from '@angular/common';
import { Component, inject, input, InputSignal } from '@angular/core';
import { Store } from '@ngrx/store';
import { ConfirmationService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { FileUploadModule } from 'primeng/fileupload';
import { TooltipModule } from 'primeng/tooltip';
import { tap } from 'rxjs';

import { CHANGE_MODE } from '@app/constants';
import {
  Scope,
  SortOrderItem,
  SortOrderUpdate,
  Template,
} from '@app/models/domain';
import { EventData } from '@app/models/ui';
import { ScopeManagerDialogData } from '@app/models/ui/scope-manger-dialog-data.interface';
import { ScopeUIActions } from '@app/store/report-manager/ui/actions/scope-ui.actions';

import { ScopeManagerDialogComponent } from '../scope-manager-dialog/scope-manager-dialog.component';
import { ScopeManagerListComponent } from '../scope-manager-list/scope-manager-list.component';

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

  onChange(scope: Scope): void {
    this.store$.dispatch(ScopeUIActions.change({ scope }));
  }

  onCreate(): void {
    const dialogRef: DynamicDialogRef = this.openManagerDialog(
      'Create New Scope',
      {
        mode: CHANGE_MODE.Create,
        templateId: this.template().id,
      }
    );

    dialogRef.onClose
      .pipe(
        tap((scope: Scope | null | undefined): void => {
          if (!scope) {
            return;
          }

          this.store$.dispatch(ScopeUIActions.create({ scope }));
        })
      )
      .subscribe();
  }

  onEdit(scope: Scope): void {
    const dialogRef: DynamicDialogRef = this.openManagerDialog('Edit Scope', {
      mode: CHANGE_MODE.Update,
      scope,
      templateId: scope.templateId,
    });

    dialogRef.onClose
      .pipe(
        tap((updatedScope: Scope | null | undefined): void => {
          if (!updatedScope) {
            return;
          }

          this.store$.dispatch(ScopeUIActions.update({ scope: updatedScope }));
        })
      )
      .subscribe();
  }

  onClone(scope: Scope): void {
    const dialogRef: DynamicDialogRef = this.openManagerDialog('Clone Scope', {
      mode: CHANGE_MODE.Update,
      templateId: this.template().id,
      scope,
    });

    dialogRef.onClose
      .pipe(
        tap((updatedScope: Scope | null | undefined): void => {
          if (!updatedScope) {
            return;
          }

          this.store$.dispatch(ScopeUIActions.update({ scope: updatedScope }));
        })
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
        (scope: Scope): SortOrderItem => ({
          id: scope.id,
          sortOrder: scope.sortOrder,
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
}
