import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';

import { FindingManagerComponent } from '@app/components/finding-manager/finding-manager.component';
import { ScopeManagerComponent } from '@app/components/scope-manager/scope-manager.component';
import { TemplateManagerComponent } from '@app/components/template-manager/template-manager.component';
import { ClassifierStore } from '@app/store/report-manager/classifier.store';
import { FindingStore } from '@app/store/report-manager/finding.store';
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
    TemplateManagerComponent,
    ScopeManagerComponent,
    FindingManagerComponent,
    GroupManagerComponent,
    ClassifierManagerComponent,
  ],
  templateUrl: './report-manager.component.html',
  styleUrl: './report-manager.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    TemplateStore,
    ScopeStore,
    GroupStore,
    ClassifierStore,
    FindingStore,
  ],
})
export class ReportManagerComponent implements OnInit {
  readonly templateStore$: InstanceType<typeof TemplateStore> =
    inject(TemplateStore);

  readonly scopeStore$: InstanceType<typeof ScopeStore> = inject(ScopeStore);

  readonly groupStore$: InstanceType<typeof GroupStore> = inject(GroupStore);

  readonly classifierStore$: InstanceType<typeof ClassifierStore> =
    inject(ClassifierStore);

  readonly findingStore$: InstanceType<typeof FindingStore> =
    inject(FindingStore);

  ngOnInit(): void {
    this.templateStore$.fetchAll();
  }
}
