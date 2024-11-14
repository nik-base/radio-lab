import { createActionGroup, props } from '@ngrx/store';

import { ApplicationNotification } from '@app/models/ui';

// eslint-disable-next-line @typescript-eslint/typedef
export const ApplicationUIActions = createActionGroup({
  source: 'Application UI',
  events: {
    Notify: props<{ readonly notification: ApplicationNotification }>(),
  },
});
