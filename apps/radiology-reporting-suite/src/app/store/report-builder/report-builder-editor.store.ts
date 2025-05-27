import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';

import { ReportBuilderEditorStoreState } from './report-builder-editor-store-state.interface';

const initialState: ReportBuilderEditorStoreState = {
  isDirty: false,
};

// eslint-disable-next-line @typescript-eslint/typedef
export const ReportBuilderEditorStore = signalStore(
  withState(initialState),

  withMethods(
    (
      // eslint-disable-next-line @typescript-eslint/typedef
      store
    ) => ({
      setDirty(isDirty: boolean): void {
        patchState(store, { isDirty });
      },
    })
  )
);
