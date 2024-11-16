import {
  ApplicationConfig,
  importProvidersFrom,
  isDevMode,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideEffects } from '@ngrx/effects';
import { provideStore } from '@ngrx/store';
import { provideStoreDevtools } from '@ngrx/store-devtools';

import { appRoutes } from './app.routes';
import { ReportDBModule } from './db/report-db.module';
import { ReportDBService } from './db/report-db.service';
import { ReportBaseService } from './services/report-base.service';
import { ApplicationUIEffects } from './store/effects/application-ui.effects';
import { ApplicationEffects } from './store/effects/application.effects';

export const appConfig: ApplicationConfig = {
  providers: [
    provideStore(),
    provideStoreDevtools({ logOnly: !isDevMode() }),
    provideEffects(ApplicationUIEffects, ApplicationEffects),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(appRoutes),
    importProvidersFrom(ReportDBModule),
    {
      provide: ReportBaseService,
      useExisting: ReportDBService,
    },
  ],
};
