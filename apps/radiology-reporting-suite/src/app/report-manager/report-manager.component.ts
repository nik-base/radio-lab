import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { PushPipe } from '@ngrx/component';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { FindingManagerComponent } from '@app/components/finding-manager/finding-manager.component';
import { ScopeManagerComponent } from '@app/components/scope-manager/scope-manager.component';
import { TemplateManagerComponent } from '@app/components/template-manager/template-manager.component';
import { Finding, Scope, Template } from '@app/models/domain';
import {
  selectOrderedFindings,
  selectOrderedScopes,
  selectOrderedTemplates,
  selectSelectedScope,
  selectSelectedTemplate,
} from '@app/store/report-manager/domain/report-manager.feature';
import { ReportManagerUIActions } from '@app/store/report-manager/ui/actions/report-manager-ui.actions';

@Component({
  selector: 'radio-report-manager',
  standalone: true,
  imports: [
    CommonModule,
    PushPipe,
    TemplateManagerComponent,
    ScopeManagerComponent,
    FindingManagerComponent,
  ],
  templateUrl: './report-manager.component.html',
  styleUrl: './report-manager.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReportManagerComponent implements OnInit {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  private readonly store$: Store = inject(Store);

  readonly templates$: Observable<Template[]> = this.store$.select(
    selectOrderedTemplates
  );

  readonly scopes$: Observable<Scope[] | null> =
    this.store$.select(selectOrderedScopes);

  readonly findings$: Observable<Finding[] | null> = this.store$.select(
    selectOrderedFindings
  );

  readonly selectedTemplate$: Observable<Template | null> = this.store$.select(
    selectSelectedTemplate
  );

  readonly selectedScope$: Observable<Scope | null> =
    this.store$.select(selectSelectedScope);

  ngOnInit(): void {
    this.store$.dispatch(ReportManagerUIActions.load());
  }
}
