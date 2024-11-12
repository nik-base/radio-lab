import { createFeature, createReducer } from '@ngrx/store';

import { ReportManagerState } from './report-manager-state.interface';

export const reportManagerInitialState: ReportManagerState = {
  templates: [],
  scopes: [],
  findings: [],
  groups: [],
};

// eslint-disable-next-line @typescript-eslint/typedef
export const reportManagerFeature = createFeature({
  name: 'feature-manager',
  reducer: createReducer(reportManagerInitialState),
});
