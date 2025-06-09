import { provideHttpClient } from '@angular/common/http';
import {
  ApplicationConfig,
  importProvidersFrom,
  provideZonelessChangeDetection,
} from '@angular/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideRouter } from '@angular/router';
import { MessageService } from 'primeng/api';
import { providePrimeNG } from 'primeng/config';

import { appRoutes } from './app.routes';
import { ReportDBModule } from './db/report-db.module';
import { ReportDBService } from './db/report-db.service';
import { ReportBaseService } from './services/report-base.service';
import { AURA_LIGHT_BLUE } from './themes/aura-light-blue.theme';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZonelessChangeDetection(),
    provideRouter(appRoutes),
    provideAnimationsAsync(),
    providePrimeNG({
      theme: {
        preset: AURA_LIGHT_BLUE,
        options: {
          darkModeSelector: 'none',
          cssLayer: {
            name: 'primeng',
            order: 'theme, base, primeng',
          },
        },
      },
    }),
    provideHttpClient(),
    importProvidersFrom(ReportDBModule),
    {
      provide: ReportBaseService,
      useExisting: ReportDBService,
    },
    MessageService,
  ],
};
