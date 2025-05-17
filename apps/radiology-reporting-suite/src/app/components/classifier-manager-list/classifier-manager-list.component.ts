import { CommonModule } from '@angular/common';
import {
  Component,
  computed,
  inject,
  input,
  InputSignal,
  output,
  OutputEmitterRef,
  Signal,
} from '@angular/core';
import { isNil } from 'lodash-es';
import { MenuItemCommandEvent } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { MenuModule } from 'primeng/menu';
import { OrderListModule } from 'primeng/orderlist';
import { TooltipModule } from 'primeng/tooltip';

import { SortableListItemMapperService } from '@app/mapper/sortable-list-item-mapper.service';
import { FindingClassifier } from '@app/models/domain';
import { EventData } from '@app/models/ui';
import { SortableListItem } from '@app/models/ui/sortable-list-item.interface';
import { SortableListMenuItem } from '@app/models/ui/sortable-list-menu-item.interface';

import { SortableListComponent } from '../sortable-list/sortable-list.component';

@Component({
  selector: 'radio-classifier-manager-list',
  standalone: true,
  imports: [
    CommonModule,
    OrderListModule,
    TooltipModule,
    ButtonModule,
    MenuModule,
    SortableListComponent,
  ],
  templateUrl: './classifier-manager-list.component.html',
})
export class ClassifierManagerListComponent {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  private readonly sortableListItemMapper: SortableListItemMapperService<FindingClassifier> =
    inject(SortableListItemMapperService);

  readonly classifiers: InputSignal<FindingClassifier[]> =
    input.required<FindingClassifier[]>();

  readonly selectedClassifier: InputSignal<FindingClassifier | null> =
    input<FindingClassifier | null>(null);

  readonly isLoading: InputSignal<boolean> = input<boolean>(true);

  readonly changed: OutputEmitterRef<FindingClassifier | null> =
    output<FindingClassifier | null>();

  readonly edit: OutputEmitterRef<FindingClassifier> =
    output<FindingClassifier>();

  readonly delete: OutputEmitterRef<EventData<FindingClassifier>> =
    output<EventData<FindingClassifier>>();

  readonly reorder: OutputEmitterRef<ReadonlyArray<FindingClassifier>> =
    output<ReadonlyArray<FindingClassifier>>();

  readonly classifierItems: Signal<SortableListItem<FindingClassifier>[]> =
    computed((): SortableListItem<FindingClassifier>[] =>
      this.sortableListItemMapper.mapToSortableListItems(this.classifiers())
    );

  readonly selectedItem: Signal<SortableListItem<FindingClassifier> | null> =
    computed(() => {
      const selectedClassifier: FindingClassifier | null =
        this.selectedClassifier();

      if (isNil(selectedClassifier)) {
        return null;
      }

      return this.sortableListItemMapper.mapToSortableListItem(
        selectedClassifier
      );
    });

  readonly menuItems: SortableListMenuItem<FindingClassifier>[] = [
    {
      label: 'Edit',
      icon: 'pi pi-pencil',
      command: (
        _: MenuItemCommandEvent,
        __: Event | null,
        item: SortableListItem<FindingClassifier>
      ): void => this.onEdit(item.value),
    },
    {
      label: 'Delete',
      icon: 'pi pi-trash',
      command: (
        menuEvent: MenuItemCommandEvent,
        originalEvent: Event | null,
        item: SortableListItem<FindingClassifier>
      ): void =>
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        this.onDelete(originalEvent ?? menuEvent.originalEvent!, item.value),
    },
  ];

  onChange(item: SortableListItem<FindingClassifier> | null): void {
    this.changed.emit(item?.value ?? null);
  }

  onEdit(classifier: FindingClassifier): void {
    this.edit.emit(classifier);
  }

  onDelete(event: Event, classifier: FindingClassifier): void {
    this.delete.emit({
      event,
      data: classifier,
    });
  }

  onReorder(item: ReadonlyArray<SortableListItem<FindingClassifier>>): void {
    this.reorder.emit(
      this.sortableListItemMapper.mapFromSortableListItems(item)
    );
  }
}
