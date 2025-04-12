import { CommonModule } from '@angular/common';
import {
  Component,
  effect,
  input,
  InputSignal,
  output,
  OutputEmitterRef,
  untracked,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  AutoCompleteCompleteEvent,
  AutoCompleteModule,
} from 'primeng/autocomplete';
import { ButtonModule } from 'primeng/button';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputSwitchModule } from 'primeng/inputswitch';
import { InputTextModule } from 'primeng/inputtext';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { TooltipModule } from 'primeng/tooltip';

import { CHANGE_MODE } from '@app/constants';
import { EditorComponent } from '@app/editor/editor.component';
import { EditorValidators } from '@app/editor/validators/editor-validator';
import { EditorContent, Finding, FindingBase } from '@app/models/domain';
import { ChangeModes, FormGroupModel } from '@app/types';

@Component({
  selector: 'radio-finding-manager-view',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TooltipModule,
    ButtonModule,
    InputTextModule,
    InputSwitchModule,
    ScrollPanelModule,
    FloatLabelModule,
    AutoCompleteModule,
    EditorComponent,
  ],
  templateUrl: './finding-manager-view.component.html',
})
export class ScopeManagerComponent {
  readonly finding: InputSignal<Finding | null> = input<Finding | null>(null);

  readonly mode: InputSignal<ChangeModes> = input<ChangeModes>(
    CHANGE_MODE.Update
  );

  readonly groups: InputSignal<string[]> = input<string[]>([]);

  readonly save: OutputEmitterRef<Finding> = output<Finding>();

  readonly formGroup: FormGroupModel<FindingBase> = this.createFormGroup();

  readonly ChangeModes: typeof CHANGE_MODE = CHANGE_MODE;

  filteredGroups: string[] = [];

  constructor() {
    this.createSetFormValuesEffect();
  }

  onSave(): void {
    if (!this.formGroup.valid) {
      return;
    }

    this.save.emit(this.getFinding());
  }

  filterGroups(event: AutoCompleteCompleteEvent): void {
    this.filteredGroups = this.groups().filter((group: string): boolean =>
      group.toLowerCase().includes(event.query.toLowerCase())
    );
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

    //this.formGroup.get('group')?.setValue(finding.groupId);

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
      group: new FormControl<string | null>(null),
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
}
