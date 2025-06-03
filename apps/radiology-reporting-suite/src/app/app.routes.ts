import { Type } from '@angular/core';
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
    loadComponent: () =>
      import('./report-manager/report-manager.component').then(
        (importEntity: {
          ReportManagerComponent: Type<ReportManagerComponent>;
        }) => importEntity.ReportManagerComponent
      ),
  },
];
