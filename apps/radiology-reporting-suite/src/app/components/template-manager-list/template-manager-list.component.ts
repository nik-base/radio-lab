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
import { ListboxModule } from 'primeng/listbox';
import { MenuModule } from 'primeng/menu';
import { TooltipModule } from 'primeng/tooltip';

import { SortableListItemMapperService } from '@app/mapper/sortable-list-item-mapper.service';
import { Template } from '@app/models/domain';
import { EventData } from '@app/models/ui';
import { SortableListItem } from '@app/models/ui/sortable-list-item.interface';
import { SortableListMenuItem } from '@app/models/ui/sortable-list-menu-item.interface';

import { SortableListComponent } from '../sortable-list/sortable-list.component';

@Component({
  selector: 'radio-template-manager-list',
  standalone: true,
  imports: [
    CommonModule,
    ListboxModule,
    TooltipModule,
    ButtonModule,
    MenuModule,
    SortableListComponent,
  ],
  templateUrl: './template-manager-list.component.html',
})
export class TemplateManagerListComponent {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  private readonly sortableListItemMapper: SortableListItemMapperService<Template> =
    inject(SortableListItemMapperService);

  readonly templates: InputSignal<Template[]> = input.required<Template[]>();

  readonly selectedTemplate: InputSignal<Template | null> =
    input<Template | null>(null);

  readonly changed: OutputEmitterRef<Template | null> =
    output<Template | null>();

  readonly reorder: OutputEmitterRef<ReadonlyArray<Template>> =
    output<ReadonlyArray<Template>>();

  readonly edit: OutputEmitterRef<Template> = output<Template>();

  readonly delete: OutputEmitterRef<EventData<Template>> =
    output<EventData<Template>>();

  readonly export: OutputEmitterRef<Template> = output<Template>();

  readonly templateItems: Signal<SortableListItem<Template>[]> = computed(
    (): SortableListItem<Template>[] =>
      this.sortableListItemMapper.mapToSortableListItems(this.templates())
  );

  readonly selectedItem: Signal<SortableListItem<Template> | null> = computed(
    () => {
      const selectedTemplate: Template | null = this.selectedTemplate();

      if (isNil(selectedTemplate)) {
        return null;
      }

      return this.sortableListItemMapper.mapToSortableListItem(
        selectedTemplate
      );
    }
  );

  readonly menuItems: SortableListMenuItem<Template>[] = [
    {
      label: 'Edit',
      icon: 'pi pi-pencil',
      command: (
        _: MenuItemCommandEvent,
        __: Event | null,
        item: SortableListItem<Template>
      ): void => this.onEdit(item.value),
    },
    {
      label: 'Export',
      icon: 'pi pi-download',
      command: (
        _: MenuItemCommandEvent,
        __: Event | null,
        item: SortableListItem<Template>
      ): void => this.onExport(item.value),
    },
    {
      label: 'Delete',
      icon: 'pi pi-trash',
      command: (
        menuEvent: MenuItemCommandEvent,
        originalEvent: Event | null,
        item: SortableListItem<Template>
      ): void =>
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        this.onDelete(originalEvent ?? menuEvent.originalEvent!, item.value),
    },
  ];

  onChange(item: SortableListItem<Template> | null): void {
    this.changed.emit(item?.value ?? null);
  }

  onReorder(item: ReadonlyArray<SortableListItem<Template>>): void {
    this.reorder.emit(
      this.sortableListItemMapper.mapFromSortableListItems(item)
    );
  }

  onEdit(template: Template): void {
    this.edit.emit(template);
  }

  onDelete(event: Event, template: Template): void {
    this.delete.emit({
      event,
      data: template,
    });
  }

  onExport(template: Template): void {
    this.export.emit(template);
  }
}
