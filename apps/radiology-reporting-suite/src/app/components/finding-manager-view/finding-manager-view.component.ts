import { CommonModule } from '@angular/common';
import {
  Component,
  computed,
  input,
  InputSignal,
  output,
  OutputEmitterRef,
  Signal,
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

  readonly formGroup: Signal<FormGroupModel<FindingBase>> = computed(() => {
    const finding: Finding | null = this.finding();

    if (this.mode() === CHANGE_MODE.Create || !finding) {
      return this.createFormGroup();
    }

    return this.createFormGroup(finding);
  });

  readonly ChangeModes: typeof CHANGE_MODE = CHANGE_MODE;

  filteredGroups: string[] = [];

  onSave(): void {
    if (!this.formGroup().valid) {
      return;
    }

    this.save.emit(this.getFinding());
  }

  filterGroups(event: AutoCompleteCompleteEvent): void {
    this.filteredGroups = this.groups().filter((group: string): boolean =>
      group.toLowerCase().includes(event.query.toLowerCase())
    );
  }

  private getFinding(): Finding {
    if (this.mode() === CHANGE_MODE.Create) {
      return this.formGroup().getRawValue() as Finding;
    }

    return {
      ...this.formGroup().getRawValue(),
      id: this.finding()?.id,
    } as Finding;
  }

  private createFormGroup(finding?: FindingBase): FormGroupModel<FindingBase> {
    const formGroup: FormGroup = new FormGroup({
      name: new FormControl<string | null>(finding?.name ?? null, {
        nonNullable: true,
        validators: [Validators.required.bind(this)],
      }),
      group: new FormControl<string | null>(finding?.group ?? null),
      isNormal: new FormControl<boolean>(finding?.isNormal ?? false),
      description: new FormControl<EditorContent | null>(
        finding?.description ?? null,
        {
          nonNullable: true,
          validators: [EditorValidators.required()],
        }
      ),
      impression: new FormControl<EditorContent | null>(
        finding?.impression ?? null
      ),
      recommendation: new FormControl<EditorContent | null>(
        finding?.recommendation ?? null
      ),
    });

    return formGroup as FormGroupModel<FindingBase>;
  }
}
