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

import { ScopeManagerComponent } from '@app/components/scope-manager/scope-manager.component';
import { TemplateManagerComponent } from '@app/components/template-manager/template-manager.component';
import { Scope, Template } from '@app/models/domain';
import {
  selectOrderedScopes,
  selectOrderedTemplates,
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

  readonly selectedTemplate$: Observable<Template | null> = this.store$.select(
    selectSelectedTemplate
  );

  ngOnInit(): void {
    this.store$.dispatch(ReportManagerUIActions.load());
  }
}
