import { createFeature, createReducer, createSelector, on } from '@ngrx/store';
import { produce } from 'immer';
import { isNil, orderBy } from 'lodash';

import { ScopeData, Template, TemplateData } from '@app/models/domain';
import { Writable } from '@app/types';
import {
  orderFindings,
  orderTemplates,
} from '@app/utils/functions/order.functions';

import { ReportBuilderState } from './report-builder-state.interface';
import { ReportBuilderActions } from './report-builder.actions';

export const reportBuilderInitialState: ReportBuilderState = {
  templates: [],
  templateData: null,
};

// eslint-disable-next-line @typescript-eslint/typedef
export const reportBuilderFeature = createFeature({
  name: 'feature-builder',
  reducer: createReducer(
    reportBuilderInitialState,
    on(
      ReportBuilderActions.fetchTemplatesSuccess,
      (
        state: ReportBuilderState,
        {
          templates,
        }: ReturnType<typeof ReportBuilderActions.fetchTemplatesSuccess>
      ): ReportBuilderState =>
        produce(state, (draft: Writable<ReportBuilderState>) => {
          draft.templates = templates;
        })
    ),
    on(
      ReportBuilderActions.fetchTemplateDataSuccess,
      (
        state: ReportBuilderState,
        {
          template,
        }: ReturnType<typeof ReportBuilderActions.fetchTemplateDataSuccess>
      ): ReportBuilderState =>
        produce(state, (draft: Writable<ReportBuilderState>) => {
          draft.templateData = template;
        })
    ),
    on(
      ReportBuilderActions.resetTemplateData,
      (state: ReportBuilderState): ReportBuilderState =>
        produce(state, (draft: Writable<ReportBuilderState>) => {
          draft.templateData = null;
        })
    )
  ),

  // eslint-disable-next-line @typescript-eslint/typedef
  extraSelectors: ({ selectTemplates, selectTemplateData }) => ({
    selectOrderedTemplates: createSelector(
      selectTemplates,
      (templates: Template[]): Template[] => orderTemplates(templates)
    ),
    selectOrderedTemplateData: createSelector(
      selectTemplateData,
      (template: TemplateData | null): TemplateData | null => {
        if (isNil(template)) {
          return null;
        }

        const scopes: ScopeData[] = template.scopes.map(
          (scope: ScopeData): ScopeData => ({
            ...scope,
            findings: orderFindings(scope.findings),
          })
        );

        return {
          ...template,
          scopes: orderBy(
            scopes,
            (scope: ScopeData): number => scope.sortOrder,
            'asc'
          ),
        };
      }
    ),
  }),
});

// eslint-disable-next-line @typescript-eslint/typedef
export const {
  name,
  reducer,
  selectOrderedTemplates,
  selectOrderedTemplateData,
} = reportBuilderFeature;
