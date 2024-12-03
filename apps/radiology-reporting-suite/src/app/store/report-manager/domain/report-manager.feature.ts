import { createFeature, createReducer, createSelector, on } from '@ngrx/store';
import { produce } from 'immer';
import { isNil, orderBy, uniq } from 'lodash-es';

import { Finding, Scope, SortOrderItem, Template } from '@app/models/domain';
import { Writable } from '@app/types';
import { isNotNil } from '@app/utils/functions/common.functions';
import {
  orderFindings,
  orderScopes,
  orderTemplates,
} from '@app/utils/functions/order.functions';

import { FindingActions } from './actions/finding.actions';
import { ScopeActions } from './actions/scope.actions';
import { TemplateActions } from './actions/template.actions';
import { ReportManagerState } from './report-manager-state.interface';

export const reportManagerInitialState: ReportManagerState = {
  templates: [],
  selectedTemplate: null,
  scopes: null,
  selectedScope: null,
  findings: null,
  selectedFinding: null,
};

// eslint-disable-next-line @typescript-eslint/typedef
export const reportManagerFeature = createFeature({
  name: 'feature-manager',
  reducer: createReducer(
    reportManagerInitialState,
    // Template Actions
    on(
      TemplateActions.fetchSuccess,
      (
        state: ReportManagerState,
        { templates }: ReturnType<typeof TemplateActions.fetchSuccess>
      ): ReportManagerState =>
        produce(state, (draft: Writable<ReportManagerState>) => {
          draft.templates = templates;
        })
    ),
    on(
      TemplateActions.createSuccess,
      TemplateActions.importSuccess,
      (
        state: ReportManagerState,
        {
          template,
        }:
          | ReturnType<typeof TemplateActions.createSuccess>
          | ReturnType<typeof TemplateActions.importSuccess>
      ): ReportManagerState =>
        produce(state, (draft: Writable<ReportManagerState>) => {
          draft.templates = [...draft.templates, template];
        })
    ),
    on(
      TemplateActions.updateSuccess,
      (
        state: ReportManagerState,
        { template }: ReturnType<typeof TemplateActions.updateSuccess>
      ): ReportManagerState =>
        produce(state, (draft: Writable<ReportManagerState>) => {
          const index: number = draft.templates.findIndex(
            (item: Template): boolean => item.id === template.id
          );

          if (index === -1) {
            return;
          }

          draft.templates[index] = template;
        })
    ),
    on(
      TemplateActions.deleteSuccess,
      (
        state: ReportManagerState,
        { template }: ReturnType<typeof TemplateActions.deleteSuccess>
      ): ReportManagerState =>
        produce(state, (draft: Writable<ReportManagerState>) => {
          const index: number = draft.templates.findIndex(
            (item: Template): boolean => item.id === template.id
          );

          if (index === -1) {
            return;
          }

          draft.templates.splice(index, 1);
        })
    ),
    on(
      TemplateActions.setSelected,
      (
        state: ReportManagerState,
        { template }: ReturnType<typeof TemplateActions.setSelected>
      ): ReportManagerState =>
        produce(state, (draft: Writable<ReportManagerState>) => {
          draft.selectedTemplate = template;
        })
    ),
    on(
      TemplateActions.reset,
      (state: ReportManagerState): ReportManagerState =>
        produce(state, (draft: Writable<ReportManagerState>) => {
          draft.selectedTemplate = null;
        })
    ),
    // Scope Actions
    on(
      ScopeActions.fetchSuccess,
      (
        state: ReportManagerState,
        { scopes }: ReturnType<typeof ScopeActions.fetchSuccess>
      ): ReportManagerState =>
        produce(state, (draft: Writable<ReportManagerState>) => {
          draft.scopes = scopes;
        })
    ),
    on(
      ScopeActions.createSuccess,
      (
        state: ReportManagerState,
        { scope }: ReturnType<typeof ScopeActions.createSuccess>
      ): ReportManagerState =>
        produce(state, (draft: Writable<ReportManagerState>) => {
          if (isNil(draft.scopes)) {
            return;
          }

          draft.scopes = [...draft.scopes, scope];
        })
    ),
    on(
      ScopeActions.updateSuccess,
      (
        state: ReportManagerState,
        { scope }: ReturnType<typeof ScopeActions.updateSuccess>
      ): ReportManagerState =>
        produce(state, (draft: Writable<ReportManagerState>) => {
          if (isNil(draft.scopes)) {
            return;
          }

          const index: number = draft.scopes.findIndex(
            (item: Scope): boolean => item.id === scope.id
          );

          if (index === -1) {
            return;
          }

          draft.scopes[index] = scope;
        })
    ),
    on(
      ScopeActions.deleteSuccess,
      (
        state: ReportManagerState,
        { scope }: ReturnType<typeof ScopeActions.deleteSuccess>
      ): ReportManagerState =>
        produce(state, (draft: Writable<ReportManagerState>) => {
          if (isNil(draft.scopes)) {
            return;
          }

          const index: number = draft.scopes.findIndex(
            (item: Scope): boolean => item.id === scope.id
          );

          if (index === -1) {
            return;
          }

          draft.scopes.splice(index, 1);
        })
    ),
    on(
      ScopeActions.reorderSuccess,
      (
        state: ReportManagerState,
        { sortOrders }: ReturnType<typeof ScopeActions.reorderSuccess>
      ): ReportManagerState =>
        produce(state, (draft: Writable<ReportManagerState>) => {
          if (isNil(draft.scopes)) {
            return;
          }

          for (const scope of draft.scopes) {
            const newSortOrderItem: SortOrderItem | undefined =
              sortOrders.sortOrdersMap.find(
                (item: SortOrderItem): boolean => item.id === scope.id
              );

            if (!isNil(newSortOrderItem)) {
              scope.sortOrder = newSortOrderItem.sortOrder;

              if (draft.selectedScope && draft.selectedScope.id === scope.id) {
                draft.selectedScope.sortOrder = newSortOrderItem.sortOrder;
              }
            }
          }
        })
    ),
    on(
      ScopeActions.cloneSuccess,
      (
        state: ReportManagerState,
        {
          originalScope,
          scope,
          templateId,
        }: ReturnType<typeof ScopeActions.cloneSuccess>
      ): ReportManagerState =>
        produce(state, (draft: Writable<ReportManagerState>) => {
          if (isNil(draft.scopes)) {
            return;
          }

          if (originalScope.templateId !== templateId) {
            return;
          }

          draft.scopes = [...draft.scopes, scope];
        })
    ),
    on(
      ScopeActions.setSelected,
      (
        state: ReportManagerState,
        { scope }: ReturnType<typeof ScopeActions.setSelected>
      ): ReportManagerState =>
        produce(state, (draft: Writable<ReportManagerState>) => {
          draft.selectedScope = scope;
        })
    ),
    on(
      ScopeActions.reset,
      (state: ReportManagerState): ReportManagerState =>
        produce(state, (draft: Writable<ReportManagerState>) => {
          draft.scopes = null;
          draft.selectedScope = null;
        })
    ),
    // Finding Actions
    on(
      FindingActions.fetchSuccess,
      (
        state: ReportManagerState,
        { findings }: ReturnType<typeof FindingActions.fetchSuccess>
      ): ReportManagerState =>
        produce(state, (draft: Writable<ReportManagerState>) => {
          draft.findings = findings;
        })
    ),
    on(
      FindingActions.createSuccess,
      FindingActions.cloneSuccess,
      (
        state: ReportManagerState,
        {
          finding,
        }:
          | ReturnType<typeof FindingActions.createSuccess>
          | ReturnType<typeof FindingActions.cloneSuccess>
      ): ReportManagerState =>
        produce(state, (draft: Writable<ReportManagerState>) => {
          if (isNil(draft.findings)) {
            return;
          }

          draft.findings = [...draft.findings, finding];
        })
    ),
    on(
      FindingActions.updateSuccess,
      (
        state: ReportManagerState,
        { finding }: ReturnType<typeof FindingActions.updateSuccess>
      ): ReportManagerState =>
        produce(state, (draft: Writable<ReportManagerState>) => {
          if (isNil(draft.findings)) {
            return;
          }

          const index: number = draft.findings.findIndex(
            (item: Finding): boolean => item.id === finding.id
          );

          if (index === -1) {
            return;
          }

          draft.findings[index] = finding;
        })
    ),
    on(
      FindingActions.deleteSuccess,
      (
        state: ReportManagerState,
        { finding }: ReturnType<typeof FindingActions.deleteSuccess>
      ): ReportManagerState =>
        produce(state, (draft: Writable<ReportManagerState>) => {
          if (isNil(draft.findings)) {
            return;
          }

          const index: number = draft.findings.findIndex(
            (item: Finding): boolean => item.id === finding.id
          );

          if (index === -1) {
            return;
          }

          draft.findings.splice(index, 1);
        })
    ),
    on(
      FindingActions.reorderSuccess,
      (
        state: ReportManagerState,
        { sortOrders }: ReturnType<typeof FindingActions.reorderSuccess>
      ): ReportManagerState =>
        produce(state, (draft: Writable<ReportManagerState>) => {
          if (isNil(draft.findings)) {
            return;
          }

          for (const finding of draft.findings) {
            const newSortOrderItem: SortOrderItem | undefined =
              sortOrders.sortOrdersMap.find(
                (item: SortOrderItem): boolean => item.id === finding.id
              );

            if (!isNil(newSortOrderItem)) {
              finding.sortOrder = newSortOrderItem.sortOrder;

              if (
                draft.selectedFinding &&
                draft.selectedFinding.id === finding.id
              ) {
                draft.selectedFinding.sortOrder = newSortOrderItem.sortOrder;
              }
            }
          }
        })
    ),
    on(
      FindingActions.setSelected,
      (
        state: ReportManagerState,
        { finding }: ReturnType<typeof FindingActions.setSelected>
      ): ReportManagerState =>
        produce(state, (draft: Writable<ReportManagerState>) => {
          draft.selectedFinding = finding;
        })
    ),
    on(
      FindingActions.reset,
      (state: ReportManagerState): ReportManagerState =>
        produce(state, (draft: Writable<ReportManagerState>) => {
          draft.findings = null;
          draft.selectedFinding = null;
        })
    )
  ),
  // eslint-disable-next-line @typescript-eslint/typedef
  extraSelectors: ({ selectTemplates, selectScopes, selectFindings }) => ({
    selectOrderedTemplates: createSelector(
      selectTemplates,
      (templates: Template[]): Template[] => orderTemplates(templates)
    ),
    selectOrderedScopes: createSelector(
      selectScopes,
      (scopes: Scope[] | null): Scope[] | null =>
        isNil(scopes) ? null : orderScopes(scopes)
    ),
    selectOrderedFindings: createSelector(
      selectFindings,
      (findings: Finding[] | null): Finding[] | null =>
        isNil(findings) ? null : orderFindings(findings)
    ),
    selectGroups: createSelector(
      selectFindings,
      (findings: Finding[] | null): string[] => {
        if (isNil(findings)) {
          return [];
        }

        const groups: string[] = uniq(
          findings
            .map((finding: Finding): string | null => finding.group)
            .filter(isNotNil)
        );

        return orderBy(
          groups,
          (group: string): string => group.toLocaleLowerCase(),
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
  selectOrderedScopes,
  selectOrderedFindings,
  selectGroups,
  selectSelectedTemplate,
  selectSelectedScope,
  selectSelectedFinding,
} = reportManagerFeature;
