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
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import {
  AutoCompleteCompleteEvent,
  AutoCompleteModule,
  AutoCompleteSelectEvent,
} from 'primeng/autocomplete';
import { FloatLabel } from 'primeng/floatlabel';

import { HostControlDirective } from '@app/directives/host-control.directive';
import { Template } from '@app/models/domain';
import { isNotNil } from '@app/utils/functions/common.functions';

@Component({
  selector: 'radio-template-selector',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, AutoCompleteModule, FloatLabel],
  hostDirectives: [HostControlDirective],
  templateUrl: './template-selector.component.html',
})
export class TemplateManagerListComponent {
  readonly templates: InputSignal<ReadonlyArray<Template>> =
    input.required<ReadonlyArray<Template>>();

  readonly size: InputSignal<'small' | 'large' | undefined> = input<
    'small' | 'large' | undefined
  >();

  readonly placeholder: InputSignal<string> = input<string>('Template');

  readonly floatLabelMode: InputSignal<'over' | 'in' | 'on' | undefined> =
    input<'over' | 'in' | 'on' | undefined>();

  readonly selection: OutputEmitterRef<Template | null> =
    output<Template | null>();

  readonly hostControlDirective: HostControlDirective<Template | null> | null =
    inject(HostControlDirective, { optional: true });

  readonly innerFormControl: FormControl<Template | null> =
    new FormControl<Template | null>(null);

  protected readonly inputPlaceholder: Signal<string | undefined> = computed(
    () => (isNotNil(this.floatLabelMode()) ? undefined : this.placeholder())
  );

  filteredTemplates: Template[] = [];

  onSelect(event: AutoCompleteSelectEvent): void {
    this.selection.emit(event.value as Template | null);
  }

  filterTemplate(event: AutoCompleteCompleteEvent): void {
    this.filteredTemplates = this.templates().filter(
      (template: Template): boolean =>
        template.name.toLowerCase().includes(event.query.toLowerCase())
    );
  }
}
