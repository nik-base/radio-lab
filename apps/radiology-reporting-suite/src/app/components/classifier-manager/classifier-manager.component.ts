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
  FindingClassifier,
  FindingGroup,
  SortOrderItem,
  SortOrderUpdate,
} from '@app/models/domain';
import { CommonDialogData, EventData } from '@app/models/ui';
import { ClassifierStore } from '@app/store/report-manager/classifier.store';
import { isNotNil } from '@app/utils/functions/common.functions';
import { findNextSortOrder } from '@app/utils/functions/order.functions';

import { ClassifierManagerListComponent } from '../classifier-manager-list/classifier-manager-list.component';
import { CommonManagerDialogComponent } from '../common-manager-dialog/common-manager-dialog.component';
import { SortableListManagerLayoutComponent } from '../sortable-list-manager-layout/sortable-list-manager-layout.component';

@Component({
  selector: 'radio-classifier-manager',
  standalone: true,
  imports: [
    CommonModule,
    TooltipModule,
    ButtonModule,
    ConfirmPopupModule,
    FileUploadModule,
    ClassifierManagerListComponent,
    SortableListManagerLayoutComponent,
  ],
  providers: [DialogService, ConfirmationService],
  templateUrl: './classifier-manager.component.html',
})
export class ClassifierManagerComponent {
  readonly classifierStore$: InstanceType<typeof ClassifierStore> =
    inject(ClassifierStore);

  private readonly dialogService: DialogService = inject(DialogService);

  private readonly confirmationService: ConfirmationService =
    inject(ConfirmationService);

  readonly classifiers: InputSignal<FindingClassifier[]> =
    input.required<FindingClassifier[]>();

  readonly group: InputSignal<FindingGroup> = input.required<FindingGroup>();

  onChange(classifier: FindingClassifier | null): void {
    this.classifierStore$.change(classifier);
  }

  onCreate(): void {
    const dialogRef: DynamicDialogRef = this.openManagerDialog(
      'Create New Classifier',
      {
        mode: CHANGE_MODE.Create,
      }
    );

    dialogRef.onClose
      .pipe(
        filter<FindingClassifier>(isNotNil),
        tap((classifier: FindingClassifier): void => {
          const nextSortOrder: number = findNextSortOrder(this.classifiers());

          this.classifierStore$.create({
            ...classifier,
            scopeId: this.group().scopeId,
            groupId: this.group().id,
            sortOrder: nextSortOrder,
          });
        }),
        take(1)
      )
      .subscribe();
  }

  onEdit(classifier: FindingClassifier): void {
    const dialogRef: DynamicDialogRef = this.openManagerDialog(
      'Edit Classifier',
      {
        mode: CHANGE_MODE.Update,
        name: classifier.name,
      }
    );

    dialogRef.onClose
      .pipe(
        filter<FindingClassifier>(isNotNil),
        tap((updatedFindingClassifier: FindingClassifier): void => {
          this.classifierStore$.update({
            ...updatedFindingClassifier,
            id: classifier.id,
            sortOrder: classifier.sortOrder,
            scopeId: classifier.scopeId,
            groupId: classifier.groupId,
          });
        }),
        take(1)
      )
      .subscribe();
  }

  onDelete(eventData: EventData<FindingClassifier>): void {
    this.confirmationService.confirm({
      target: eventData.event.target as EventTarget,
      message: 'Do you want to delete this classifier and all its findings?',
      icon: 'pi pi-info-circle',
      acceptButtonStyleClass: 'p-button-danger p-button-sm',
      accept: () => {
        this.classifierStore$.delete(eventData.data);
      },
    });
  }

  onReorder(classifiers: ReadonlyArray<FindingClassifier>): void {
    const sortOrders: SortOrderUpdate = {
      sortOrdersMap: classifiers.map(
        (classifier: FindingClassifier, index: number): SortOrderItem => ({
          id: classifier.id,
          sortOrder: index,
        })
      ),
    };

    this.classifierStore$.reorder(sortOrders);
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
