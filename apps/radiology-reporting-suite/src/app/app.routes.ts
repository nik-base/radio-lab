import { Route } from '@angular/router';

import { ReportBuilderComponent } from './report-builder/report-builder.component';
import { ReportManagerComponent } from './report-manager/report-manager.component';
export const appRoutes: Route[] = [
  {
    path: '',
    component: ReportBuilderComponent,
  },
  {
    path: 'manage',
    component: ReportManagerComponent,
  },
];
