import { CommonModule } from '@angular/common';
import {
  Component,
  computed,
  effect,
  inject,
  input,
  InputSignal,
  output,
  OutputEmitterRef,
  signal,
  Signal,
  untracked,
  viewChild,
  WritableSignal,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { isNil } from 'lodash-es';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { Popover, PopoverModule } from 'primeng/popover';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { ToggleSwitch } from 'primeng/toggleswitch';
import { TooltipModule } from 'primeng/tooltip';

import { CHANGE_MODE } from '@app/constants';
import { EditorComponent } from '@app/editor/editor.component';
import { EditorMentionVariableClickEventData } from '@app/editor/models';
import { EditorValidators } from '@app/editor/validators/editor-validator';
import {
  EditorContent,
  Finding,
  FindingBase,
  Variable,
  VariableValue,
} from '@app/models/domain';
import { VariablesManagerDialogData } from '@app/models/ui';
import { VariableStore } from '@app/store/report-manager/variable-store';
import { VariableValueStore } from '@app/store/report-manager/variable-value.store';
import { ChangeModes, FormGroupModel } from '@app/types';
import { isNotNil } from '@app/utils/functions/common.functions';

import { VariableValuesViewerComponent } from '../variable-values-viewer/variable-values-viewer.component';
import { VariablesManagerDialogComponent } from '../variables-manager-dialog/variables-manager-dialog.component';

@Component({
  selector: 'radio-finding-manager-view',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TooltipModule,
    ButtonModule,
    InputTextModule,
    ToggleSwitch,
    ScrollPanelModule,
    PopoverModule,
    DividerModule,
    FloatLabelModule,
    MessageModule,
    EditorComponent,
    VariableValuesViewerComponent,
  ],
  providers: [DialogService],
  templateUrl: './finding-manager-view.component.html',
})
export class FindingManagerViewComponent {
  private readonly dialogService: DialogService = inject(DialogService);

  private readonly variableStore$: InstanceType<typeof VariableStore> =
    inject(VariableStore);

  protected readonly variableValueStore$: InstanceType<
    typeof VariableValueStore
  > = inject(VariableValueStore);

  readonly finding: InputSignal<Finding | null> = input<Finding | null>(null);

  readonly mode: InputSignal<ChangeModes> = input<ChangeModes>(
    CHANGE_MODE.Update
  );

  readonly save: OutputEmitterRef<Finding> = output<Finding>();

  readonly canceled: OutputEmitterRef<void> = output<void>();

  readonly variableValueViewerPopover: Signal<Popover> =
    viewChild.required<Popover>('variableValueViewerPopover');

  protected readonly variables: Signal<Variable[]> = computed(() => {
    const finding: Finding | null = this.finding();

    if (isNil(finding)) {
      return [];
    }

    return this.variableStore$.variables()(finding.id)();
  });

  protected readonly variableValues: Signal<VariableValue[]> = computed(() => {
    if (this.isVariableValuesLoading()) {
      return [];
    }

    return this.variableValueStore$.orderedList();
  });

  protected readonly isVariableValuesLoading: Signal<boolean> = computed(() => {
    return (
      this.variableValueStore$.isLoading() ||
      isNil(this.currentVariableId()) ||
      this.currentVariableId() !==
        this.variableValueStore$.additionalData?.()?.inProgressFetchVariableId
    );
  });

  readonly formGroup: FormGroupModel<FindingBase> = this.createFormGroup();

  readonly ChangeModes: typeof CHANGE_MODE = CHANGE_MODE;

  private readonly currentVariableId: WritableSignal<string | null> = signal<
    string | null
  >(null);

  constructor() {
    this.createSetFormValuesEffect();

    this.effectVariableFetchAll();

    this.effectFetchVariableValue();
  }

  onVariableClick(eventData: EditorMentionVariableClickEventData): void {
    if (!this.variableValueViewerPopover().overlayVisible) {
      this.currentVariableId.set(eventData.id);
    }

    this.variableValueViewerPopover().toggle(
      eventData.event,
      eventData.event.target
    );
  }

  onVariablePopoverHide(): void {
    this.currentVariableId.set(null);
  }

  onManageVariables(): void {
    const finding: Finding | null = this.finding();

    if (isNil(finding)) {
      return;
    }

    this.openManageVariablesDialog('Manage Variables', {
      finding,
    });
  }

  onSave(): void {
    if (!this.formGroup.valid) {
      return;
    }

    this.save.emit(this.getFinding());
  }

  onCancel(): void {
    this.canceled.emit();
  }

  private effectFetchVariableValue(): void {
    effect(() => {
      const variableId: string | null = this.currentVariableId();

      if (isNotNil(variableId)) {
        this.variableValueStore$.fetchAll({ id: variableId });
      } else {
        this.variableValueStore$.reset();
      }
    });
  }

  private effectVariableFetchAll(): void {
    effect((): void => {
      const finding: Finding | null = this.finding();

      if (isNil(finding)) {
        return;
      }

      untracked(() => {
        this.variableStore$.fetchAll({
          id: finding.id,
        });
      });
    });
  }

  private createSetFormValuesEffect(): void {
    effect(() => {
      const finding: Finding | null = this.finding();

      untracked(() => this.setFormValues(this.mode(), finding));
    });
  }

  private setFormValues(mode: ChangeModes, finding: Finding | null): void {
    if (mode === CHANGE_MODE.Create || !finding) {
      return;
    }

    this.formGroup.get('name')?.setValue(finding.name);

    this.formGroup.get('isNormal')?.setValue(finding.isNormal);

    this.formGroup.get('description')?.setValue(finding.description);

    this.formGroup.get('impression')?.setValue(finding.impression);

    this.formGroup.get('recommendation')?.setValue(finding.recommendation);
  }

  private getFinding(): Finding {
    if (this.mode() === CHANGE_MODE.Create) {
      return this.formGroup.getRawValue() as Finding;
    }

    return {
      ...this.formGroup.getRawValue(),
      id: this.finding()?.id,
    } as Finding;
  }

  private createFormGroup(): FormGroupModel<FindingBase> {
    const formGroup: FormGroup = new FormGroup({
      name: new FormControl<string | null>(null, {
        nonNullable: true,
        validators: [Validators.required.bind(this)],
      }),
      isNormal: new FormControl<boolean>(false),
      description: new FormControl<EditorContent | null>(null, {
        nonNullable: true,
        validators: [EditorValidators.required()],
      }),
      impression: new FormControl<EditorContent | null>(null),
      recommendation: new FormControl<EditorContent | null>(null),
    });

    return formGroup as FormGroupModel<FindingBase>;
  }

  private openManageVariablesDialog(
    header: string,
    data: VariablesManagerDialogData
  ): DynamicDialogRef {
    return this.dialogService.open(VariablesManagerDialogComponent, {
      header,
      modal: true,
      closable: true,
      width: '80%',
      contentStyle: { overflow: 'auto' },
      baseZIndex: 3000,
      position: 'top',
      data,
    });
  }
}
