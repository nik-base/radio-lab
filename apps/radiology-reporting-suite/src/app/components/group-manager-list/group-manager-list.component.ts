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
import { FindingGroup } from '@app/models/domain';
import { EventData } from '@app/models/ui';
import { SortableListItem } from '@app/models/ui/sortable-list-item.interface';
import { SortableListMenuItem } from '@app/models/ui/sortable-list-menu-item.interface';

import { SortableListComponent } from '../sortable-list/sortable-list.component';

@Component({
  selector: 'radio-group-manager-list',
  standalone: true,
  imports: [
    CommonModule,
    OrderListModule,
    TooltipModule,
    ButtonModule,
    MenuModule,
    SortableListComponent,
  ],
  templateUrl: './group-manager-list.component.html',
})
export class GroupManagerListComponent {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  private readonly sortableListItemMapper: SortableListItemMapperService<FindingGroup> =
    inject(SortableListItemMapperService);

  readonly groups: InputSignal<FindingGroup[]> =
    input.required<FindingGroup[]>();

  readonly selectedGroup: InputSignal<FindingGroup | null> =
    input<FindingGroup | null>(null);

  readonly changed: OutputEmitterRef<FindingGroup | null> =
    output<FindingGroup | null>();

  readonly edit: OutputEmitterRef<FindingGroup> = output<FindingGroup>();

  readonly delete: OutputEmitterRef<EventData<FindingGroup>> =
    output<EventData<FindingGroup>>();

  readonly reorder: OutputEmitterRef<ReadonlyArray<FindingGroup>> =
    output<ReadonlyArray<FindingGroup>>();

  readonly groupItems: Signal<SortableListItem<FindingGroup>[]> = computed(
    (): SortableListItem<FindingGroup>[] =>
      this.sortableListItemMapper.mapToSortableListItems(this.groups())
  );

  readonly selectedItem: Signal<SortableListItem<FindingGroup> | null> =
    computed(() => {
      const selectedGroup: FindingGroup | null = this.selectedGroup();

      if (isNil(selectedGroup)) {
        return null;
      }

      return this.sortableListItemMapper.mapToSortableListItem(selectedGroup);
    });

  readonly menuItems: SortableListMenuItem<FindingGroup>[] = [
    {
      label: 'Edit',
      icon: 'pi pi-pencil',
      command: (
        _: MenuItemCommandEvent,
        __: Event | null,
        item: SortableListItem<FindingGroup>
      ): void => this.onEdit(item.value),
    },
    {
      label: 'Delete',
      icon: 'pi pi-trash',
      command: (
        menuEvent: MenuItemCommandEvent,
        originalEvent: Event | null,
        item: SortableListItem<FindingGroup>
      ): void =>
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        this.onDelete(originalEvent ?? menuEvent.originalEvent!, item.value),
    },
  ];

  onChange(item: SortableListItem<FindingGroup> | null): void {
    this.changed.emit(item?.value ?? null);
  }

  onEdit(group: FindingGroup): void {
    this.edit.emit(group);
  }

  onDelete(event: Event, group: FindingGroup): void {
    this.delete.emit({
      event,
      data: group,
    });
  }

  onReorder(item: ReadonlyArray<SortableListItem<FindingGroup>>): void {
    this.reorder.emit(
      this.sortableListItemMapper.mapFromSortableListItems(item)
    );
  }
}
