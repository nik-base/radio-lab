import {
  ApplicationConfig,
  importProvidersFrom,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';

import { appRoutes } from './app.routes';
import { ReportDBModule } from './db/report-db.module';
import { ReportDBService } from './db/report-db.service';
import { ReportBaseService } from './services/report-base.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(appRoutes),
    importProvidersFrom(ReportDBModule),
    {
      provide: ReportBaseService,
      useExisting: ReportDBService,
    },
  ],
};
