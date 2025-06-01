import {
  Component,
  DestroyRef,
  inject,
  input,
  InputSignal,
  OnInit,
  signal,
  Signal,
  viewChild,
  WritableSignal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  ControlEvent,
  FormControl,
  PristineChangeEvent,
  ReactiveFormsModule,
} from '@angular/forms';
import { isNil } from 'lodash-es';
import { Popover } from 'primeng/popover';
import { tap } from 'rxjs';

import { VariableValueSelectorComponent } from '@app/components/variable-value-selector/variable-value-selector.component';
import { EditorComponent } from '@app/editor/editor.component';
import { EditorMentionVariableClickEventData } from '@app/editor/models';
import { EditorContent, Template } from '@app/models/domain';
import { EditorFindingData } from '@app/models/ui';
import { ReportBuilderEditorStore } from '@app/store/report-builder/report-builder-editor.store';

@Component({
  selector: 'radio-report-builder-editor',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    EditorComponent,
    Popover,
    VariableValueSelectorComponent,
  ],
  templateUrl: './report-builder-editor.component.html',
})
export class ReportBuilderEditorComponent implements OnInit {
  protected readonly editorStore$: InstanceType<
    typeof ReportBuilderEditorStore
  > = inject(ReportBuilderEditorStore);

  readonly isLoading: InputSignal<boolean> = input<boolean>(true);

  protected readonly editor: Signal<EditorComponent> =
    viewChild.required<EditorComponent>('editor');

  readonly variableValueSelectorPopover: Signal<Popover> =
    viewChild.required<Popover>('variableValueSelectorPopover');

  protected readonly editorControl: FormControl<EditorContent | null> =
    new FormControl<EditorContent | null>(null);

  protected readonly currentVariableClickedData: WritableSignal<EditorMentionVariableClickEventData | null> =
    signal<EditorMentionVariableClickEventData | null>(null);

  readonly #destroyRef: DestroyRef = inject(DestroyRef);

  ngOnInit(): void {
    this.handleEditorValueChanges();
  }

  onVariableClick(variable: EditorMentionVariableClickEventData): void {
    this.currentVariableClickedData.set(variable);

    this.variableValueSelectorPopover().toggle(
      variable.event,
      variable.event.target
    );
  }

  onVariablePopoverHide(): void {
    this.currentVariableClickedData.set(null);
  }

  onVariablePopoverClose(): void {
    this.variableValueSelectorPopover().hide();

    this.onVariablePopoverHide();
  }

  onVariablePopoverValueSelected(value: string | null): void {
    const variable: EditorMentionVariableClickEventData | null =
      this.currentVariableClickedData();

    this.onVariablePopoverClose();

    if (isNil(value) || isNil(variable)) {
      return;
    }

    this.replaceReportVariableValue(variable, value);
  }

  insertReportProtocol(template: Template): void {
    this.editor().insertReportProtocol(template);
  }

  insertReportFinding(finding: EditorFindingData): void {
    this.editor().insertReportFinding(finding);
  }

  replaceReportVariableValue(
    variable: EditorMentionVariableClickEventData,
    value: string
  ): void {
    this.editor().replaceVariableValue({
      variableId: variable.id,
      variableName: variable.name,
      variableValue: value,
      variableNodePosition: variable.nodePos,
    });
  }

  reset(): void {
    this.editorControl.reset();
  }

  private handleEditorValueChanges(): void {
    this.editorControl.events
      .pipe(
        tap((event: ControlEvent): void => {
          if (event instanceof PristineChangeEvent) {
            this.editorStore$.setDirty(!event.pristine);
          }
        }),
        takeUntilDestroyed(this.#destroyRef)
      )
      .subscribe();
  }
}
