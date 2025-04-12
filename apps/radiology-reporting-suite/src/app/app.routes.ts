import { Route } from '@angular/router';
import { provideEffects } from '@ngrx/effects';
import { provideState } from '@ngrx/store';

import { ReportBuilderComponent } from './report-builder/report-builder.component';
import { ReportManagerComponent } from './report-manager/report-manager.component';
import { ReportBuilderDataEffects } from './store/report-builder/data/report-builder-data.effects';
import { ReportBuilderEffects } from './store/report-builder/domain/report-builder.effects';
import { reportBuilderFeature } from './store/report-builder/domain/report-builder.feature';
import { ReportBuilderUIEffects } from './store/report-builder/ui/report-builder-ui.effects';
import { ClassifierDataEffects } from './store/report-manager/data/effects/classifier-data.effects';
import { FindingDataEffects } from './store/report-manager/data/effects/finding-data.effects';
import { GroupDataEffects } from './store/report-manager/data/effects/group-data.effects';
import { ScopeDataEffects } from './store/report-manager/data/effects/scope-data.effects';
import { TemplateDataEffects } from './store/report-manager/data/effects/template-data.effects';
import { ClassifierEffects } from './store/report-manager/domain/effects/classifier.effects';
import { FindingEffects } from './store/report-manager/domain/effects/finding.effects';
import { GroupEffects } from './store/report-manager/domain/effects/group.effects';
import { ScopeEffects } from './store/report-manager/domain/effects/scope.effects';
import { TemplateEffects } from './store/report-manager/domain/effects/template.effects';
import { reportManagerFeature } from './store/report-manager/domain/report-manager.feature';
import { ClassifierUIEffects } from './store/report-manager/ui/effects/classifier-ui.effects';
import { FindingUIEffects } from './store/report-manager/ui/effects/finding-ui.effects';
import { GroupUIEffects } from './store/report-manager/ui/effects/group-ui.effects';
import { ReportManagerUIEffects } from './store/report-manager/ui/effects/report-manager-ui.effects';
import { ScopeUIEffects } from './store/report-manager/ui/effects/scope-ui.effects';
import { TemplateUIEffects } from './store/report-manager/ui/effects/template-ui.effects';

export const appRoutes: Route[] = [
  {
    path: '',
    component: ReportBuilderComponent,
    providers: [
      provideState(reportBuilderFeature),
      provideEffects(
        ReportBuilderUIEffects,
        ReportBuilderEffects,
        ReportBuilderDataEffects
      ),
    ],
  },
  {
    path: 'manage',
    component: ReportManagerComponent,
    providers: [
      provideState(reportManagerFeature),
      provideEffects(
        ReportManagerUIEffects,
        TemplateUIEffects,
        TemplateEffects,
        TemplateDataEffects,
        ScopeUIEffects,
        ScopeEffects,
        ScopeDataEffects,
        GroupDataEffects,
        GroupEffects,
        GroupUIEffects,
        ClassifierDataEffects,
        ClassifierEffects,
        ClassifierUIEffects,
        FindingUIEffects,
        FindingEffects,
        FindingDataEffects
      ),
    ],
  },
];
