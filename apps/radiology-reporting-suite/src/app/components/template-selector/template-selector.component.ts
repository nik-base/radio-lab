import { CommonModule } from '@angular/common';
import {
  Component,
  computed,
  inject,
  input,
  InputSignal,
  output,
  OutputEmitterRef,
  signal,
  Signal,
  WritableSignal,
} from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { isNil } from 'lodash-es';
import { ConfirmationService } from 'primeng/api';
import {
  AutoCompleteCompleteEvent,
  AutoCompleteModule,
  AutoCompleteSelectEvent,
} from 'primeng/autocomplete';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { FloatLabel } from 'primeng/floatlabel';

import { HostControlDirective } from '@app/directives/host-control.directive';
import { Template } from '@app/models/domain';
import { isNilOrEmpty, isNotNil } from '@app/utils/functions/common.functions';

@Component({
  selector: 'radio-template-selector',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AutoCompleteModule,
    FloatLabel,
    ConfirmDialog,
  ],
  hostDirectives: [HostControlDirective],
  providers: [ConfirmationService],
  templateUrl: './template-selector.component.html',
})
export class TemplateManagerListComponent {
  private readonly confirmationService: ConfirmationService =
    inject(ConfirmationService);

  readonly templates: InputSignal<ReadonlyArray<Template>> =
    input.required<ReadonlyArray<Template>>();

  readonly size: InputSignal<'small' | 'large' | undefined> = input<
    'small' | 'large' | undefined
  >();

  readonly placeholder: InputSignal<string> = input<string>('Template');

  readonly floatLabelMode: InputSignal<'over' | 'in' | 'on' | undefined> =
    input<'over' | 'in' | 'on' | undefined>();

  readonly shouldConfirmBeforeSelect: InputSignal<boolean> =
    input<boolean>(false);

  readonly confirmationMessage: InputSignal<string> = input<string>(
    'Are you sure you want to select this template?'
  );

  readonly selection: OutputEmitterRef<Template | null> =
    output<Template | null>();

  readonly hostControlDirective: HostControlDirective<Template | null> | null =
    inject(HostControlDirective, { optional: true });

  readonly innerFormControl: FormControl<Template | null> =
    new FormControl<Template | null>(null);

  protected readonly inputPlaceholder: Signal<string | undefined> = computed(
    () => (isNotNil(this.floatLabelMode()) ? undefined : this.placeholder())
  );

  protected readonly selectedTemplate: WritableSignal<Template | null> =
    signal<Template | null>(null);

  filteredTemplates: Template[] = [];

  onSelect(event: AutoCompleteSelectEvent): void {
    const template: Template | null = event.value as Template | null;

    if (
      this.shouldConfirmBeforeSelect() &&
      this.selectedTemplate() !== event.value
    ) {
      this.handleSelectionConfirmation(event.originalEvent, template);

      return;
    }

    this.handleSelection(template);
  }

  onBlur(event: Event): void {
    const selectedTemplate: Template | null = this.selectedTemplate();

    if (isNil(selectedTemplate)) {
      return;
    }

    const inputElement: HTMLInputElement | undefined =
      event.target as HTMLInputElement;

    if (!isNilOrEmpty(inputElement?.value)) {
      return;
    }

    this.getControl().setValue(selectedTemplate);
  }

  filterTemplate(event: AutoCompleteCompleteEvent): void {
    this.filteredTemplates = this.templates().filter(
      (template: Template): boolean =>
        template.name.toLowerCase().includes(event.query.toLowerCase())
    );
  }

  private handleSelectionConfirmation(
    event: Event,
    currentSelectedTemplate: Template | null
  ): void {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: this.confirmationMessage(),
      header: 'Confirmation',
      closable: true,
      closeOnEscape: true,
      icon: 'pi pi-exclamation-triangle',
      rejectButtonProps: {
        label: 'No',
        severity: 'secondary',
        outlined: true,
      },
      acceptButtonProps: {
        label: 'Yes',
      },
      accept: () => {
        this.handleSelection(currentSelectedTemplate);
      },
      reject: () => {
        this.getControl().setValue(this.selectedTemplate());
      },
    });
  }

  private handleSelection(template: Template | null) {
    this.selectedTemplate.set(template);

    this.selection.emit(template);
  }

  private getControl(): FormControl<Template | null> {
    return this.hostControlDirective?.control ?? this.innerFormControl;
  }
}
