import { createActionGroup, emptyProps } from '@ngrx/store';

// eslint-disable-next-line @typescript-eslint/typedef
export const ReportManagerUIActions = createActionGroup({
  source: 'Report Manager UI',
  events: {
    Load: emptyProps(),
  },
});
