import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { PushPipe } from '@ngrx/component';
import { Store } from '@ngrx/store';
import { Observable, tap } from 'rxjs';

import { EditorContent, Template } from '@app/models/domain';
import { selectOrderedTemplates } from '@app/store/report-builder/domain/report-builder.feature';
import { ReportBuilderUIActions } from '@app/store/report-builder/ui/report-builder-ui.actions';

import { EditorComponent } from '../editor/editor.component';

@Component({
  selector: 'radio-report-builder',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, PushPipe, EditorComponent],
  templateUrl: './report-builder.component.html',
  styleUrl: './report-builder.component.scss',
})
export class ReportBuilderComponent implements OnInit {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  private readonly store$: Store = inject(Store);

  readonly templates$: Observable<Template[]> = this.store$.select(
    selectOrderedTemplates
  );

  readonly editorControl: FormControl<EditorContent | null> =
    new FormControl<EditorContent | null>(null);

  ngOnInit(): void {
    this.store$.dispatch(ReportBuilderUIActions.fetchTemplates());

    this.editorControl.setValue({
      html: '<b>Nikhil</b>',
      text: '',
      json: null,
    });

    this.editorControl.valueChanges.pipe(tap(console.log)).subscribe();
  }
}
