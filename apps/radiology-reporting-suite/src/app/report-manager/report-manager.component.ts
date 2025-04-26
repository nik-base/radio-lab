import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  Signal,
} from '@angular/core';
import { PushPipe } from '@ngrx/component';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { FindingManagerComponent } from '@app/components/finding-manager/finding-manager.component';
import { ScopeManagerComponent } from '@app/components/scope-manager/scope-manager.component';
import { TemplateManagerComponent } from '@app/components/template-manager/template-manager.component';
import { Finding, FindingGroup, Scope, Template } from '@app/models/domain';
import { ClassifierStore } from '@app/store/report-manager/classifier.store';
import {
  selectOrderedFindings,
  selectOrderedGroups,
  selectOrderedScopes,
  selectOrderedTemplates,
  selectSelectedGroup,
  selectSelectedScope,
  selectSelectedTemplate,
} from '@app/store/report-manager/domain/report-manager.feature';
import { GroupStore } from '@app/store/report-manager/group.store';
import { ScopeStore } from '@app/store/report-manager/scope.store';
import { TemplateStore } from '@app/store/report-manager/template.store';

import { ClassifierManagerComponent } from '../components/classifier-manager/classifier-manager.component';
import { GroupManagerComponent } from '../components/group-manager/group-manager.component';

@Component({
  selector: 'radio-report-manager',
  standalone: true,
  imports: [
    CommonModule,
    PushPipe,
    TemplateManagerComponent,
    ScopeManagerComponent,
    FindingManagerComponent,
    GroupManagerComponent,
    ClassifierManagerComponent,
  ],
  templateUrl: './report-manager.component.html',
  styleUrl: './report-manager.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [TemplateStore, ScopeStore, GroupStore, ClassifierStore],
})
export class ReportManagerComponent implements OnInit {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  private readonly store$: Store = inject(Store);

  readonly templateStore$: InstanceType<typeof TemplateStore> =
    inject(TemplateStore);

  readonly scopeStore$: InstanceType<typeof ScopeStore> = inject(ScopeStore);

  readonly groupStore$: InstanceType<typeof GroupStore> = inject(GroupStore);

  readonly classifierStore$: InstanceType<typeof ClassifierStore> =
    inject(ClassifierStore);

  readonly templates$: Observable<Template[]> = this.store$.select(
    selectOrderedTemplates
  );

  readonly scopes$: Observable<Scope[] | null> =
    this.store$.select(selectOrderedScopes);

  readonly groups: Signal<FindingGroup[] | null> =
    this.store$.selectSignal(selectOrderedGroups);

  readonly findings$: Observable<Finding[] | null> = this.store$.select(
    selectOrderedFindings
  );

  readonly selectedTemplate$: Observable<Template | null> = this.store$.select(
    selectSelectedTemplate
  );

  readonly selectedScope$: Observable<Scope | null> =
    this.store$.select(selectSelectedScope);

  readonly selectedGroup: Signal<FindingGroup | null> =
    this.store$.selectSignal(selectSelectedGroup);

  ngOnInit(): void {
    this.templateStore$.fetchAll();
  }
}
