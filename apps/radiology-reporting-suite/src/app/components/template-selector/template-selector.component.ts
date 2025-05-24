import { CommonModule } from '@angular/common';
import {
  Component,
  inject,
  input,
  InputSignal,
  output,
  OutputEmitterRef,
} from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import {
  AutoCompleteCompleteEvent,
  AutoCompleteModule,
  AutoCompleteSelectEvent,
} from 'primeng/autocomplete';

import { HostControlDirective } from '@app/directives/host-control.directive';
import { Template } from '@app/models/domain';

@Component({
  selector: 'radio-template-selector',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, AutoCompleteModule],
  hostDirectives: [HostControlDirective],
  templateUrl: './template-selector.component.html',
})
export class TemplateManagerListComponent {
  readonly templates: InputSignal<ReadonlyArray<Template>> =
    input.required<ReadonlyArray<Template>>();

  readonly select: OutputEmitterRef<Template | null> =
    output<Template | null>();

  readonly hostControlDirective: HostControlDirective<Template | null> | null =
    inject(HostControlDirective, { optional: true });

  readonly innerFormControl: FormControl<Template | null> =
    new FormControl<Template | null>(null);

  filteredTemplates: Template[] = [];

  onSelect(event: AutoCompleteSelectEvent): void {
    this.select.emit(event.value as Template | null);
  }

  filterTemplate(event: AutoCompleteCompleteEvent): void {
    this.filteredTemplates = this.templates().filter(
      (template: Template): boolean =>
        template.name.toLowerCase().includes(event.query.toLowerCase())
    );
  }
}
