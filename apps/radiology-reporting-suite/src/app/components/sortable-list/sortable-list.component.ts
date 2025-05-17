import { CommonModule } from '@angular/common';
import {
  Component,
  input,
  InputSignal,
  output,
  OutputEmitterRef,
  Signal,
  signal,
  WritableSignal,
} from '@angular/core';
import { MenuItem, MenuItemCommandEvent, TooltipOptions } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ListboxModule } from 'primeng/listbox';
import { Menu, MenuModule } from 'primeng/menu';
import { OrderListModule } from 'primeng/orderlist';
import { SkeletonModule } from 'primeng/skeleton';
import { TooltipModule } from 'primeng/tooltip';

import { APP_TOOLTIP_OPTIONS } from '@app/constants';
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
    SkeletonModule,
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

  readonly isLoading: InputSignal<boolean> = input<boolean>(true);

  readonly changed: OutputEmitterRef<SortableListItem<T> | null> =
    output<SortableListItem<T> | null>();

  readonly reorder: OutputEmitterRef<ReadonlyArray<SortableListItem<T>>> =
    output<ReadonlyArray<SortableListItem<T>>>();

  protected readonly mockItems: Signal<number[]> = signal(
    Array(5).fill({ label: '', id: '', disableMore: true })
  );

  dynamicMenuItems: WritableSignal<MenuItem[]> = signal([]);

  currentMenuEvent: Event | null = null;

  protected readonly tooltipOptions: TooltipOptions = APP_TOOLTIP_OPTIONS;

  showMoreMenu(item: SortableListItem<T>): void {
    const menuItems: MenuItem[] = this.menuItems().map(
      (menuItem: SortableListMenuItem<T>): MenuItem =>
        this.mapSortableListMenuItem(menuItem, this.currentMenuEvent, item)
    );

    this.dynamicMenuItems.set(menuItems);
  }

  onSelect(item: SortableListItem<T>, event: MouseEvent): void {
    const element: HTMLElement | undefined = event?.target as HTMLElement;

    const classList: DOMTokenList = element?.classList ?? [];

    if (
      classList.contains('list-item-menu-button') ||
      classList.contains('pi-ellipsis-v')
    ) {
      return;
    }

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
