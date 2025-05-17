import { CommonModule } from '@angular/common';
import {
  Component,
  effect,
  inject,
  input,
  InputSignal,
  NgZone,
  signal,
  untracked,
  WritableSignal,
} from '@angular/core';
import { isNil } from 'lodash';
import { ConfirmationService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { FileUploadModule } from 'primeng/fileupload';
import { PanelModule } from 'primeng/panel';
import { TooltipModule } from 'primeng/tooltip';
import { take, tap } from 'rxjs';

import { CHANGE_MODE } from '@app/constants';
import {
  Finding,
  FindingClassifier,
  SortOrderItem,
  SortOrderUpdate,
} from '@app/models/domain';
import { EventData } from '@app/models/ui';
import { FindingStore } from '@app/store/report-manager/finding.store';
import { ChangeModes } from '@app/types';
import { isNotNil } from '@app/utils/functions/common.functions';
import { findNextSortOrder } from '@app/utils/functions/order.functions';

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
  providers: [ConfirmationService],
  templateUrl: './finding-manager.component.html',
  styleUrls: ['./finding-manager.component.scss'],
})
export class FindingManagerComponent {
  protected readonly findingStore$: InstanceType<typeof FindingStore> =
    inject(FindingStore);

  private readonly confirmationService: ConfirmationService =
    inject(ConfirmationService);

  private readonly ngZone: NgZone = inject(NgZone);

  readonly findings: InputSignal<Finding[]> = input.required<Finding[]>();

  readonly classifier: InputSignal<FindingClassifier> =
    input.required<FindingClassifier>();

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
    this.ngZone.onMicrotaskEmpty
      .pipe(
        tap(() => {
          this.mode.set(CHANGE_MODE.Create);
        }),
        take(1)
      )
      .subscribe();
  }

  onEdit(finding: Finding): void {
    this.mode.set(CHANGE_MODE.Update);

    this.findingStore$.change(finding);
  }

  onClone(finding: Finding): void {
    this.findingStore$.clone(finding);
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
}
