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
import { Scope } from '@app/models/domain';
import { EventData } from '@app/models/ui';
import { SortableListItem } from '@app/models/ui/sortable-list-item.interface';
import { SortableListMenuItem } from '@app/models/ui/sortable-list-menu-item.interface';

import { SortableListComponent } from '../sortable-list/sortable-list.component';

@Component({
  selector: 'radio-scope-manager-list',
  standalone: true,
  imports: [
    CommonModule,
    OrderListModule,
    TooltipModule,
    ButtonModule,
    MenuModule,
    SortableListComponent,
  ],
  styleUrls: ['./scope-manager-list.component.scss'],
  templateUrl: './scope-manager-list.component.html',
})
export class ScopeManagerListComponent {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  private readonly sortableListItemMapper: SortableListItemMapperService<Scope> =
    inject(SortableListItemMapperService);

  readonly scopes: InputSignal<Scope[]> = input.required<Scope[]>();

  readonly selectedScope: InputSignal<Scope | null> = input<Scope | null>(null);

  readonly isLoading: InputSignal<boolean> = input<boolean>(true);

  readonly changed: OutputEmitterRef<Scope | null> = output<Scope | null>();

  readonly edit: OutputEmitterRef<Scope> = output<Scope>();

  readonly delete: OutputEmitterRef<EventData<Scope>> =
    output<EventData<Scope>>();

  readonly clone: OutputEmitterRef<Scope> = output<Scope>();

  readonly reorder: OutputEmitterRef<ReadonlyArray<Scope>> =
    output<ReadonlyArray<Scope>>();

  readonly scopeItems: Signal<SortableListItem<Scope>[]> = computed(
    (): SortableListItem<Scope>[] =>
      this.sortableListItemMapper.mapToSortableListItems(this.scopes())
  );

  readonly selectedItem: Signal<SortableListItem<Scope> | null> = computed(
    () => {
      const selectedScope: Scope | null = this.selectedScope();

      if (isNil(selectedScope)) {
        return null;
      }

      return this.sortableListItemMapper.mapToSortableListItem(selectedScope);
    }
  );

  readonly menuItems: SortableListMenuItem<Scope>[] = [
    {
      label: 'Edit',
      icon: 'pi pi-pencil',
      command: (
        _: MenuItemCommandEvent,
        __: Event | null,
        item: SortableListItem<Scope>
      ): void => this.onEdit(item.value),
    },
    {
      label: 'Clone',
      icon: 'pi pi-clone',
      command: (
        _: MenuItemCommandEvent,
        __: Event | null,
        item: SortableListItem<Scope>
      ): void => this.onClone(item.value),
    },
    {
      label: 'Delete',
      icon: 'pi pi-trash',
      command: (
        menuEvent: MenuItemCommandEvent,
        originalEvent: Event | null,
        item: SortableListItem<Scope>
      ): void =>
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        this.onDelete(originalEvent ?? menuEvent.originalEvent!, item.value),
    },
  ];

  onChange(item: SortableListItem<Scope> | null): void {
    this.changed.emit(item?.value ?? null);
  }

  onEdit(scope: Scope): void {
    this.edit.emit(scope);
  }

  onDelete(event: Event, scope: Scope): void {
    this.delete.emit({
      event,
      data: scope,
    });
  }

  onClone(scope: Scope): void {
    this.clone.emit(scope);
  }

  onReorder(item: ReadonlyArray<SortableListItem<Scope>>): void {
    this.reorder.emit(
      this.sortableListItemMapper.mapFromSortableListItems(item)
    );
  }
}
