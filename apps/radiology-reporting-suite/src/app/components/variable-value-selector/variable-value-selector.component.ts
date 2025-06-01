import {
  Component,
  computed,
  inject,
  input,
  InputSignal,
  model,
  ModelSignal,
  OnInit,
  output,
  OutputEmitterRef,
  Signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { FloatLabel } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { ListboxModule } from 'primeng/listbox';
import { SkeletonModule } from 'primeng/skeleton';

import { VariableValue } from '@app/models/domain';
import { ExistsInArrayPipe } from '@app/pipes/exists-in-array/exists-in-array.pipe';
import { FindIndexInArrayPipe } from '@app/pipes/find-index-in-arrray/find-index-in-array.pipe';
import { ReportBuilderVariableValueStore } from '@app/store/report-builder/report-builder-variable-value.store';
import { isNilOrEmpty, isNotNil } from '@app/utils/functions/common.functions';

@Component({
  selector: 'radio-variable-value-selector',
  standalone: true,
  imports: [
    FormsModule,
    InputTextModule,
    FloatLabel,
    SkeletonModule,
    ListboxModule,
    ButtonModule,
    ExistsInArrayPipe,
    FindIndexInArrayPipe,
  ],
  templateUrl: './variable-value-selector.component.html',
  styleUrls: ['./variable-value-selector.component.scss'],
})
export class VariableValueSelectorComponent implements OnInit {
  protected readonly variableValueStore$: InstanceType<
    typeof ReportBuilderVariableValueStore
  > = inject(ReportBuilderVariableValueStore);

  readonly variableId: InputSignal<string> = input.required<string>();

  readonly variableName: InputSignal<string> = input.required<string>();

  readonly cancelSelection: OutputEmitterRef<void> = output<void>();

  readonly selection: OutputEmitterRef<string | null> = output<string | null>();

  protected readonly mockValues: VariableValue[] = Array<VariableValue>(3).fill(
    {
      id: '',
      name: '',
      sortOrder: 0,
      variableId: '',
    }
  );

  protected readonly values: Signal<VariableValue[]> = computed(() => [
    ...(this.variableValueStore$.variableValues()(this.variableId())() ?? []),
  ]);

  protected readonly isSubmitDisabled: Signal<boolean> = computed(() => {
    if (this.variableValueStore$.isLoading()) {
      return true;
    }

    if (this.isManualEntry()) {
      return isNilOrEmpty(this.variableInputValue()?.trim());
    }

    return !this.variableSelectedValues().length;
  });

  protected readonly isManualEntry: Signal<boolean> = computed(
    () => !this.values().length
  );

  protected readonly variableInputValue: ModelSignal<string | undefined> =
    model<string>();

  protected readonly variableSelectedValues: ModelSignal<VariableValue[]> =
    model<VariableValue[]>([]);

  ngOnInit(): void {
    const variableId: string = this.variableId();

    const existingValues: ReadonlyArray<VariableValue> | null =
      this.variableValueStore$.variableValues()(variableId)();

    if (isNotNil(existingValues)) {
      return;
    }

    this.variableValueStore$.fetch({
      id: variableId,
      name: this.variableName(),
    });
  }

  close(): void {
    this.cancelSelection.emit();
  }

  submit(): void {
    if (this.isSubmitDisabled()) {
      return;
    }

    if (this.isManualEntry()) {
      this.selection.emit(this.variableInputValue() ?? null);

      return;
    }

    const values: VariableValue[] = this.variableSelectedValues();

    const formattedValue: string | null =
      this.formatSelectedVariableValues(values);

    this.selection.emit(formattedValue);
  }

  private formatSelectedVariableValues(values: VariableValue[]): string | null {
    if (!values.length) {
      return null;
    }

    if (values.length === 1) {
      return values[0].name;
    }

    const lastValue: string = values[values.length - 1].name;

    const valuesExceptLastList: VariableValue[] = values.slice(
      0,
      values.length - 1
    );

    const valuesExceptLast: string = valuesExceptLastList
      .map((value: VariableValue): string => value.name)
      .join(', ');

    return `${valuesExceptLast} and ${lastValue}`;
  }
}
