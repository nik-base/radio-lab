import {
  Component,
  DestroyRef,
  inject,
  input,
  InputSignal,
  OnInit,
  Signal,
  viewChild,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  ControlEvent,
  FormControl,
  PristineChangeEvent,
  ReactiveFormsModule,
} from '@angular/forms';
import { tap } from 'rxjs';

import { EditorComponent } from '@app/editor/editor.component';
import { EditorContent, Template } from '@app/models/domain';
import { EditorFindingData } from '@app/models/ui';
import { ReportBuilderEditorStore } from '@app/store/report-builder/report-builder-editor.store';

@Component({
  selector: 'radio-report-builder-editor',
  standalone: true,
  imports: [ReactiveFormsModule, EditorComponent],
  templateUrl: './report-builder-editor.component.html',
})
export class ReportBuilderEditorComponent implements OnInit {
  protected readonly editorStore$: InstanceType<
    typeof ReportBuilderEditorStore
  > = inject(ReportBuilderEditorStore);

  readonly isLoading: InputSignal<boolean> = input<boolean>(true);

  protected readonly editor: Signal<EditorComponent> =
    viewChild.required<EditorComponent>('editor');

  protected readonly editorControl: FormControl<EditorContent | null> =
    new FormControl<EditorContent | null>(null);

  readonly #destroyRef: DestroyRef = inject(DestroyRef);

  ngOnInit(): void {
    this.handleEditorValueChanges();
  }

  insertReportProtocol(template: Template): void {
    this.editor().insertReportProtocol(template);
  }

  insertReportFinding(finding: EditorFindingData): void {
    this.editor().insertReportFinding(finding);
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
