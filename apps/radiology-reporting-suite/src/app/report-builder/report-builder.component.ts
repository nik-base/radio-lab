import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { PushPipe } from '@ngrx/component';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { Template } from '@app/models/domain';
import { selectOrderedTemplates } from '@app/store/report-builder/domain/report-builder.feature';
import { ReportBuilderUIActions } from '@app/store/report-builder/ui/report-builder-ui.actions';

import { EditorComponent } from '../editor/editor.component';

@Component({
  selector: 'radio-report-builder',
  standalone: true,
  imports: [CommonModule, PushPipe, EditorComponent],
  templateUrl: './report-builder.component.html',
  styleUrl: './report-builder.component.scss',
})
export class ReportBuilderComponent implements OnInit {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  private readonly store$: Store = inject(Store);

  readonly templates$: Observable<Template[]> = this.store$.select(
    selectOrderedTemplates
  );

  ngOnInit(): void {
    this.store$.dispatch(ReportBuilderUIActions.fetchTemplates());
  }
}
