import { Route } from '@angular/router';

import { ReportBuilderComponent } from './report-builder/report-builder.component';

export const appRoutes: Route[] = [
  {
    path: '',
    component: ReportBuilderComponent,
  },
  {
    path: 'manage',
    loadComponent: () =>
      import('./report-manager/report-manager.component').then(
        // eslint-disable-next-line @typescript-eslint/typedef
        (m) => m.ReportManagerComponent
      ),
  },
];
