import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { PushPipe } from '@ngrx/component';
import { Store } from '@ngrx/store';
import { PanelModule } from 'primeng/panel';
import { SplitterModule } from 'primeng/splitter';
import { Observable, tap } from 'rxjs';

import { ScopeListComponent } from '@app/components/scope-list/scope-list.component';
import { EditorValidators } from '@app/editor/validators/editor-validator';
import {
  EditorContent,
  Scope,
  Template,
  TemplateData,
} from '@app/models/domain';
import { FindingGrouped } from '@app/models/ui';
import {
  selectOrderedTemplateData,
  selectOrderedTemplates,
  selectScopeOrderedGroupedFindings,
} from '@app/store/report-builder/domain/report-builder.feature';
import { ReportBuilderUIActions } from '@app/store/report-builder/ui/report-builder-ui.actions';

import { FindingGroupedListComponent } from '../components/finding-grouped-list/finding-grouped-list.component';
import { TemplateManagerListComponent } from '../components/template-selector/template-selector.component';
import { EditorComponent } from '../editor/editor.component';

@Component({
  selector: 'radio-report-builder',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    PushPipe,
    SplitterModule,
    PanelModule,
    EditorComponent,
    ScopeListComponent,
    TemplateManagerListComponent,
    FindingGroupedListComponent,
  ],
  templateUrl: './report-builder.component.html',
  styleUrl: './report-builder.component.scss',
})
export class ReportBuilderComponent implements OnInit {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  private readonly store$: Store = inject(Store);

  readonly templates$: Observable<Template[]> = this.store$.select(
    selectOrderedTemplates
  );

  readonly templateData$: Observable<TemplateData | null> = this.store$.select(
    selectOrderedTemplateData
  );

  readonly groupedFindings$: Observable<FindingGrouped[]> = this.store$.select(
    selectScopeOrderedGroupedFindings
  );

  readonly editorControl: FormControl<EditorContent | null> =
    new FormControl<EditorContent | null>(null, [EditorValidators.required()]);

  ngOnInit(): void {
    this.store$.dispatch(ReportBuilderUIActions.load());

    this.editorControl.setValue({
      html: '<b>Nikhil</b>',
      text: 'Nikhil',
      json: null,
    });

    console.log(this.editorControl);

    this.editorControl.valueChanges
      .pipe(tap(() => console.log(this.editorControl)))
      .subscribe();
  }

  onSelectTemplate(template: Template | null): void {
    if (!template) {
      this.store$.dispatch(ReportBuilderUIActions.resetTemplateData());

      return;
    }

    this.store$.dispatch(
      ReportBuilderUIActions.fetchTemplateData({ templateId: template.id })
    );
  }

  onScopeChange(scope: Scope): void {
    this.store$.dispatch(ReportBuilderUIActions.setScope({ scope }));
  }
}
