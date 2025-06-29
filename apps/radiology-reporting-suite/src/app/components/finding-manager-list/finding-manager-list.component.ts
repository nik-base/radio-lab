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
import { OrderListModule } from 'primeng/orderlist';
import { TooltipModule } from 'primeng/tooltip';

import { SortableListItemMapperService } from '@app/mapper/sortable-list-item-mapper.service';
import { Finding } from '@app/models/domain';
import {
  EventData,
  SortableListItem,
  SortableListMenuItem,
} from '@app/models/ui';

import { SortableListComponent } from '../sortable-list/sortable-list.component';

@Component({
  selector: 'radio-finding-manager-list',
  standalone: true,
  imports: [
    CommonModule,
    OrderListModule,
    TooltipModule,
    ButtonModule,
    SortableListComponent,
  ],
  templateUrl: './finding-manager-list.component.html',
})
export class FindingManagerListComponent {
  private readonly sortableListItemMapper: SortableListItemMapperService<Finding> =
    inject(
      SortableListItemMapperService
    ) as SortableListItemMapperService<Finding>;

  readonly findings: InputSignal<Finding[]> = input.required<Finding[]>();

  readonly selectedFinding: InputSignal<Finding | null> = input<Finding | null>(
    null
  );

  readonly isLoading: InputSignal<boolean> = input<boolean>(true);

  readonly changed: OutputEmitterRef<Finding | null> = output<Finding | null>();

  readonly delete: OutputEmitterRef<EventData<Finding>> =
    output<EventData<Finding>>();

  readonly clone: OutputEmitterRef<Finding> = output<Finding>();

  readonly reorder: OutputEmitterRef<ReadonlyArray<Finding>> =
    output<ReadonlyArray<Finding>>();

  readonly findingItems: Signal<SortableListItem<Finding>[]> = computed(
    (): SortableListItem<Finding>[] =>
      this.sortableListItemMapper.mapToSortableListItems(this.findings())
  );

  readonly selectedItem: Signal<SortableListItem<Finding> | null> = computed(
    () => {
      const selected: Finding | null = this.selectedFinding();

      if (isNil(selected)) {
        return null;
      }

      return this.sortableListItemMapper.mapToSortableListItem(selected);
    }
  );

  readonly menuItems: SortableListMenuItem<Finding>[] = [
    {
      label: 'Clone',
      icon: 'pi pi-clone',
      command: (
        _: MenuItemCommandEvent,
        __: Event | null,
        item: SortableListItem<Finding>
      ): void => this.onClone(item.value),
    },
    {
      label: 'Delete',
      icon: 'pi pi-trash',
      command: (
        menuEvent: MenuItemCommandEvent,
        originalEvent: Event | null,
        item: SortableListItem<Finding>
      ): void => {
        if (originalEvent) {
          return this.onDelete(originalEvent, item.value);
        }

        if (menuEvent.originalEvent) {
          return this.onDelete(menuEvent.originalEvent, item.value);
        }
      },
    },
  ];

  onChange(item: SortableListItem<Finding> | null): void {
    this.changed.emit(item?.value ?? null);
  }

  onDelete(event: Event, finding: Finding): void {
    this.delete.emit({
      event,
      data: finding,
    });
  }

  onClone(finding: Finding): void {
    this.clone.emit(finding);
  }

  onReorder(item: ReadonlyArray<SortableListItem<Finding>>): void {
    this.reorder.emit(
      this.sortableListItemMapper.mapFromSortableListItems(item)
    );
  }
}
