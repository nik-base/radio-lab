import { CommonModule } from '@angular/common';
import {
  Component,
  input,
  InputSignal,
  output,
  OutputEmitterRef,
} from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { ListboxChangeEvent, ListboxModule } from 'primeng/listbox';
import { TooltipModule } from 'primeng/tooltip';

import { Template } from '@app/models/domain';
import { EventData } from '@app/models/ui';

@Component({
  selector: 'radio-template-manager-list',
  standalone: true,
  imports: [CommonModule, ListboxModule, TooltipModule, ButtonModule],
  templateUrl: './template-manager-list.component.html',
})
export class TemplateManagerListComponent {
  readonly templates: InputSignal<Template[]> = input.required<Template[]>();

  readonly changed: OutputEmitterRef<Template> = output<Template>();

  readonly edit: OutputEmitterRef<Template> = output<Template>();

  readonly delete: OutputEmitterRef<EventData<Template>> =
    output<EventData<Template>>();

  readonly export: OutputEmitterRef<Template> = output<Template>();

  onChange($event: ListboxChangeEvent): void {
    this.changed.emit($event.value as Template);
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
