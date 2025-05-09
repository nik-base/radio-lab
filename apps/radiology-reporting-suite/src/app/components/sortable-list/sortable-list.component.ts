import { CommonModule } from '@angular/common';
import {
  Component,
  input,
  InputSignal,
  output,
  OutputEmitterRef,
  signal,
  WritableSignal,
} from '@angular/core';
import { MenuItem, MenuItemCommandEvent, TooltipOptions } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ListboxModule } from 'primeng/listbox';
import { Menu, MenuModule } from 'primeng/menu';
import { OrderListModule } from 'primeng/orderlist';
import { TooltipModule } from 'primeng/tooltip';

import { SortableListItem } from '@app/models/ui/sortable-list-item.interface';
import { SortableListMenuItem } from '@app/models/ui/sortable-list-menu-item.interface';

@Component({
  selector: 'radio-sortable-list',
  standalone: true,
  imports: [
    CommonModule,
    ListboxModule,
    TooltipModule,
    ButtonModule,
    MenuModule,
    OrderListModule,
  ],
  templateUrl: './sortable-list.component.html',
  styleUrls: ['./sortable-list.component.scss'],
})
export class SortableListComponent<T> {
  readonly items: InputSignal<SortableListItem<T>[]> =
    input.required<SortableListItem<T>[]>();

  readonly selectedItem: InputSignal<SortableListItem<T> | null> =
    input<SortableListItem<T> | null>(null);

  readonly menuItems: InputSignal<ReadonlyArray<SortableListMenuItem<T>>> =
    input<ReadonlyArray<SortableListMenuItem<T>>>([]);

  readonly emptyMessage: InputSignal<string> = input<string>('No items found.');

  readonly headerLabel: InputSignal<string | undefined> = input<string>();

  readonly changed: OutputEmitterRef<SortableListItem<T> | null> =
    output<SortableListItem<T> | null>();

  readonly reorder: OutputEmitterRef<ReadonlyArray<SortableListItem<T>>> =
    output<ReadonlyArray<SortableListItem<T>>>();

  dynamicMenuItems: WritableSignal<MenuItem[]> = signal([]);

  currentMenuEvent: Event | null = null;

  readonly tooltipOptions: TooltipOptions = {
    showDelay: 300,
    hideDelay: 50,
  };

  showMoreMenu(item: SortableListItem<T>): void {
    const menuItems: MenuItem[] = this.menuItems().map(
      (menuItem: SortableListMenuItem<T>): MenuItem =>
        this.mapSortableListMenuItem(menuItem, this.currentMenuEvent, item)
    );

    this.dynamicMenuItems.set(menuItems);
  }

  onSelect(item: SortableListItem<T>): void {
    this.changed.emit(item);
  }

  onReorder(): void {
    this.reorder.emit(this.items());
  }

  onMore(event: Event, menu: Menu): void {
    this.currentMenuEvent = event;

    menu.toggle(event);
  }

  private mapSortableListMenuItem(
    menuItem: SortableListMenuItem<T>,
    currentMenuEvent: Event | null,
    item: SortableListItem<T>
  ): MenuItem {
    return {
      label: menuItem.label,
      icon: menuItem.icon,
      command: (menuEvent: MenuItemCommandEvent): void =>
        menuItem.command(menuEvent, currentMenuEvent, item),
    };
  }
}
