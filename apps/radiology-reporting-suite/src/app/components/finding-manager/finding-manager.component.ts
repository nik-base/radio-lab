import { CommonModule } from '@angular/common';
import {
  Component,
  effect,
  inject,
  input,
  InputSignal,
  signal,
  untracked,
  WritableSignal,
} from '@angular/core';
import { isNil } from 'lodash-es';
import { ConfirmationService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { FileUploadModule } from 'primeng/fileupload';
import { PanelModule } from 'primeng/panel';
import { TooltipModule } from 'primeng/tooltip';
import { filter, take, tap } from 'rxjs';

import { CHANGE_MODE } from '@app/constants';
import {
  Finding,
  FindingClassifier,
  FindingGroup,
  Scope,
  SortOrderItem,
  SortOrderUpdate,
} from '@app/models/domain';
import {
  EventData,
  FindingCloneDialogData,
  FindingCloneDialogOutput,
} from '@app/models/ui';
import { FindingStore } from '@app/store/report-manager/finding.store';
import { ChangeModes } from '@app/types';
import { isNotNil } from '@app/utils/functions/common.functions';
import { findNextSortOrder } from '@app/utils/functions/order.functions';

import { FindingCloneDialogComponent } from '../finding-clone-dialog/finding-clone-dialog.component';
import { FindingManagerListComponent } from '../finding-manager-list/finding-manager-list.component';
import { FindingManagerViewComponent } from '../finding-manager-view/finding-manager-view.component';
import { SortableListManagerLayoutComponent } from '../sortable-list-manager-layout/sortable-list-manager-layout.component';

@Component({
  selector: 'radio-finding-manager',
  standalone: true,
  imports: [
    CommonModule,
    TooltipModule,
    ButtonModule,
    ConfirmPopupModule,
    FileUploadModule,
    PanelModule,
    FindingManagerListComponent,
    SortableListManagerLayoutComponent,
    FindingManagerListComponent,
    FindingManagerViewComponent,
  ],
  providers: [ConfirmationService, DialogService],
  templateUrl: './finding-manager.component.html',
  styleUrls: ['./finding-manager.component.scss'],
})
export class FindingManagerComponent {
  protected readonly findingStore$: InstanceType<typeof FindingStore> =
    inject(FindingStore);

  private readonly confirmationService: ConfirmationService =
    inject(ConfirmationService);

  private readonly dialogService: DialogService = inject(DialogService);

  readonly findings: InputSignal<Finding[]> = input.required<Finding[]>();

  readonly classifier: InputSignal<FindingClassifier> =
    input.required<FindingClassifier>();

  readonly group: InputSignal<FindingGroup> = input.required<FindingGroup>();

  readonly scope: InputSignal<Scope> = input.required<Scope>();

  readonly mode: WritableSignal<ChangeModes | null> = signal(null);

  readonly ChangeModes: typeof CHANGE_MODE = CHANGE_MODE;

  constructor() {
    effect(() => {
      this.findingStore$.orderedList();

      if (isNil(this.findingStore$.current())) {
        untracked(() => this.mode.set(null));
      }
    });
  }

  onChange(finding: Finding | null): void {
    this.findingStore$.change(finding);

    if (isNotNil(finding)) {
      this.onEdit(finding);
    }
  }

  onSave(
    finding: Finding,
    mode: ChangeModes,
    storeSelectedFinding: Finding | null = null
  ): void {
    const selectedFinding: Finding | null = this.findingStore$.current();

    const classifier: FindingClassifier = this.classifier();

    if (mode === CHANGE_MODE.Update && selectedFinding) {
      this.findingStore$.update({
        ...finding,
        id: selectedFinding.id,
        classifierId: classifier.id,
        groupId: classifier.groupId,
        scopeId: classifier.scopeId,
        sortOrder: storeSelectedFinding?.sortOrder ?? selectedFinding.sortOrder,
      });

      this.mode.set(null);

      this.findingStore$.change(null);

      return;
    }

    const nextSortOrder: number = findNextSortOrder(this.findings());

    this.findingStore$.create({
      ...finding,
      classifierId: classifier.id,
      groupId: classifier.groupId,
      scopeId: classifier.scopeId,
      sortOrder: nextSortOrder,
    });

    this.mode.set(null);

    this.findingStore$.change(null);
  }

  onCancel(): void {
    this.mode.set(null);

    this.findingStore$.change(null);
  }

  onCreate(): void {
    this.findingStore$.change(null);

    // Ensuring effect in constructor is ran first
    setTimeout(() => {
      this.mode.set(CHANGE_MODE.Create);
    }, 0);
  }

  onEdit(finding: Finding): void {
    this.mode.set(CHANGE_MODE.Update);

    this.findingStore$.change(finding);
  }

  onClone(finding: Finding): void {
    const dialogRef: DynamicDialogRef = this.openCloneDialog('Clone Finding', {
      finding: finding,
      scope: this.scope(),
      group: this.group(),
      classifier: this.classifier(),
    });

    dialogRef.onClose
      .pipe(
        filter<FindingCloneDialogOutput>(isNotNil),
        tap((cloneOutput: FindingCloneDialogOutput): void => {
          this.findingStore$.clone({
            finding: cloneOutput.finding,
            groupId: cloneOutput.group.id,
            classifierId: cloneOutput.classifier.id,
          });
        }),
        take(1)
      )
      .subscribe();
  }

  onDelete(eventData: EventData<Finding>): void {
    this.confirmationService.confirm({
      target: eventData.event.target as EventTarget,
      message: 'Do you want to delete this finding?',
      icon: 'pi pi-info-circle',
      acceptButtonStyleClass: 'p-button-danger p-button-sm',
      accept: () => {
        this.findingStore$.delete(eventData.data);
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

    this.findingStore$.reorder(sortOrders);
  }

  private openCloneDialog(
    header: string,
    data: FindingCloneDialogData
  ): DynamicDialogRef {
    return this.dialogService.open(FindingCloneDialogComponent, {
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
