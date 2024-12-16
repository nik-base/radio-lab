import { createFeature, createReducer, createSelector, on } from '@ngrx/store';
import { produce } from 'immer';
import { isNil, minBy, orderBy } from 'lodash-es';

import { Finding, ScopeData, Template, TemplateData } from '@app/models/domain';
import { FindingGrouped } from '@app/models/ui';
import { Writable } from '@app/types';
import { isNilOrEmpty } from '@app/utils/functions/common.functions';
import {
  orderFindings,
  orderTemplates,
} from '@app/utils/functions/order.functions';

import { ReportBuilderState } from './report-builder-state.interface';
import { ReportBuilderActions } from './report-builder.actions';

export const reportBuilderInitialState: ReportBuilderState = {
  templates: [],
  templateData: null,
  selectedScope: null,
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
    ),
    on(
      ReportBuilderActions.setScope,
      (
        state: ReportBuilderState,
        { scope }: ReturnType<typeof ReportBuilderActions.setScope>
      ): ReportBuilderState =>
        produce(state, (draft: Writable<ReportBuilderState>) => {
          const selectedScope: ScopeData | null =
            draft.templateData?.scopes?.find(
              (item: ScopeData): boolean => item.id === scope.id
            ) ?? null;

          draft.selectedScope = selectedScope;
        })
    ),
    on(
      ReportBuilderActions.resetScope,
      (state: ReportBuilderState): ReportBuilderState =>
        produce(state, (draft: Writable<ReportBuilderState>) => {
          draft.selectedScope = null;
        })
    )
  ),

  // eslint-disable-next-line @typescript-eslint/typedef
  extraSelectors: ({
    selectTemplates,
    selectTemplateData,
    selectSelectedScope,
  }) => ({
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
    selectScopeOrderedGroupedFindings: createSelector(
      selectSelectedScope,
      (scope: ScopeData | null): FindingGrouped[] => {
        const groupedFindingsList: FindingGrouped[] =
          scope?.findings.reduce(
            (
              accumulator: FindingGrouped[],
              currentValue: Finding
            ): FindingGrouped[] => {
              const group: string = isNilOrEmpty(currentValue.group)
                ? 'Uncategorized'
                : currentValue.group;

              const existingGroup: FindingGrouped | undefined =
                accumulator.find(
                  (groupedFinding: FindingGrouped): boolean =>
                    groupedFinding.group === group
                );

              if (existingGroup) {
                existingGroup.findings.push(currentValue);
              } else {
                accumulator.push({
                  group,
                  findings: [currentValue],
                });
              }

              return accumulator;
            },
            [] as FindingGrouped[]
          ) ?? [];

        const groupedFindings: FindingGrouped[] = groupedFindingsList.map(
          (groupedFinding: FindingGrouped): FindingGrouped => {
            return {
              ...groupedFinding,
              findings: orderFindings(groupedFinding.findings),
            };
          }
        );

        const orderedGroupedFindings: FindingGrouped[] = orderBy(
          groupedFindings,
          (groupedFinding: FindingGrouped): number | undefined => {
            const minSortOrder: number | undefined = minBy(
              groupedFinding.findings,
              (finding: Finding): number => finding.sortOrder
            )?.sortOrder;

            return minSortOrder;
          },
          'asc'
        );

        return [
          ...orderedGroupedFindings,
          ...orderedGroupedFindings,
          ...orderedGroupedFindings,
          ...orderedGroupedFindings,
        ];
      }
    ),
    selectScopeOrderedNormalFindings: createSelector(
      selectSelectedScope,
      (scope: ScopeData | null): Finding[] => {
        const normalFindings: Finding[] =
          scope?.findings.filter(
            (finding: Finding): boolean => finding.isNormal
          ) ?? [];

        return orderBy(
          normalFindings,
          (finding: Finding): number => finding.sortOrder,
          'asc'
        );
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
  selectScopeOrderedGroupedFindings,
  selectScopeOrderedNormalFindings,
} = reportBuilderFeature;
