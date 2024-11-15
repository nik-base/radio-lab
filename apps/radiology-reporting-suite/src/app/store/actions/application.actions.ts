import { createActionGroup, props } from '@ngrx/store';

import { ApplicationError } from '@app/models/domain';

// eslint-disable-next-line @typescript-eslint/typedef
export const ApplicationActions = createActionGroup({
  source: 'Application',
  events: {
    Error: props<{ readonly error: ApplicationError }>(),
  },
});
