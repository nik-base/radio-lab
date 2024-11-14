import { createFeature, createReducer, on } from '@ngrx/store';
import { produce } from 'immer';
import { isNil } from 'lodash';

import { Finding, Scope, SortOrderItem, Template } from '@app/models/domain';
import { Writable } from '@app/types';

import { ReportManagerFindingActions } from './actions/report-manager-finding.actions';
import { ReportManagerScopeActions } from './actions/report-manager-scope.actions';
import { ReportManagerTemplateActions } from './actions/report-manager-template.actions';
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
  reducer: createReducer(
    reportManagerInitialState,
    // Template Actions
    on(
      ReportManagerTemplateActions.fetchSuccess,
      (
        state: ReportManagerState,
        {
          templates,
        }: ReturnType<typeof ReportManagerTemplateActions.fetchSuccess>
      ): ReportManagerState =>
        produce(state, (draft: Writable<ReportManagerState>) => {
          draft.templates = templates;
        })
    ),
    on(
      ReportManagerTemplateActions.createSuccess,
      ReportManagerTemplateActions.importSuccess,
      (
        state: ReportManagerState,
        {
          template,
        }:
          | ReturnType<typeof ReportManagerTemplateActions.createSuccess>
          | ReturnType<typeof ReportManagerTemplateActions.importSuccess>
      ): ReportManagerState =>
        produce(state, (draft: Writable<ReportManagerState>) => {
          draft.templates = [...draft.templates, template];
        })
    ),
    on(
      ReportManagerTemplateActions.updateSuccess,
      (
        state: ReportManagerState,
        {
          template,
        }: ReturnType<typeof ReportManagerTemplateActions.updateSuccess>
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
      ReportManagerTemplateActions.deleteSuccess,
      (
        state: ReportManagerState,
        {
          template,
        }: ReturnType<typeof ReportManagerTemplateActions.deleteSuccess>
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
    // Scope Actions
    on(
      ReportManagerScopeActions.fetchSuccess,
      (
        state: ReportManagerState,
        { scopes }: ReturnType<typeof ReportManagerScopeActions.fetchSuccess>
      ): ReportManagerState =>
        produce(state, (draft: Writable<ReportManagerState>) => {
          draft.scopes = scopes;
        })
    ),
    on(
      ReportManagerScopeActions.createSuccess,
      (
        state: ReportManagerState,
        { scope }: ReturnType<typeof ReportManagerScopeActions.createSuccess>
      ): ReportManagerState =>
        produce(state, (draft: Writable<ReportManagerState>) => {
          draft.scopes = [...draft.scopes, scope];
        })
    ),
    on(
      ReportManagerScopeActions.updateSuccess,
      (
        state: ReportManagerState,
        { scope }: ReturnType<typeof ReportManagerScopeActions.updateSuccess>
      ): ReportManagerState =>
        produce(state, (draft: Writable<ReportManagerState>) => {
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
      ReportManagerScopeActions.deleteSuccess,
      (
        state: ReportManagerState,
        { scope }: ReturnType<typeof ReportManagerScopeActions.deleteSuccess>
      ): ReportManagerState =>
        produce(state, (draft: Writable<ReportManagerState>) => {
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
      ReportManagerScopeActions.reorderSuccess,
      (
        state: ReportManagerState,
        {
          sortOrders,
        }: ReturnType<typeof ReportManagerScopeActions.reorderSuccess>
      ): ReportManagerState =>
        produce(state, (draft: Writable<ReportManagerState>) => {
          draft.scopes.map((scope: Scope): Scope => {
            const newSortOrderItem: SortOrderItem | undefined =
              sortOrders.sortOrdersMap.find(
                (item: SortOrderItem): boolean => item.id === scope.id
              );

            if (isNil(newSortOrderItem)) {
              return scope;
            }

            return {
              ...scope,
              sortOrder: newSortOrderItem.sortOrder,
            };
          });
        })
    ),
    on(
      ReportManagerScopeActions.cloneSuccess,
      (
        state: ReportManagerState,
        {
          scope,
          templateId,
        }: ReturnType<typeof ReportManagerScopeActions.cloneSuccess>
      ): ReportManagerState =>
        produce(state, (draft: Writable<ReportManagerState>) => {
          if (scope.templateId !== templateId) {
            return;
          }

          draft.scopes = [...draft.scopes, scope];
        })
    ),
    // Finding Actions
    on(
      ReportManagerFindingActions.fetchSuccess,
      (
        state: ReportManagerState,
        {
          findings,
        }: ReturnType<typeof ReportManagerFindingActions.fetchSuccess>
      ): ReportManagerState =>
        produce(state, (draft: Writable<ReportManagerState>) => {
          draft.findings = findings;
        })
    ),
    on(
      ReportManagerFindingActions.createSuccess,
      ReportManagerFindingActions.cloneSuccess,
      (
        state: ReportManagerState,
        {
          finding,
        }:
          | ReturnType<typeof ReportManagerFindingActions.createSuccess>
          | ReturnType<typeof ReportManagerFindingActions.cloneSuccess>
      ): ReportManagerState =>
        produce(state, (draft: Writable<ReportManagerState>) => {
          draft.findings = [...draft.findings, finding];
        })
    ),
    on(
      ReportManagerFindingActions.updateSuccess,
      (
        state: ReportManagerState,
        {
          finding,
        }: ReturnType<typeof ReportManagerFindingActions.updateSuccess>
      ): ReportManagerState =>
        produce(state, (draft: Writable<ReportManagerState>) => {
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
      ReportManagerFindingActions.deleteSuccess,
      (
        state: ReportManagerState,
        {
          finding,
        }: ReturnType<typeof ReportManagerFindingActions.deleteSuccess>
      ): ReportManagerState =>
        produce(state, (draft: Writable<ReportManagerState>) => {
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
      ReportManagerFindingActions.reorderSuccess,
      (
        state: ReportManagerState,
        {
          sortOrders,
        }: ReturnType<typeof ReportManagerFindingActions.reorderSuccess>
      ): ReportManagerState =>
        produce(state, (draft: Writable<ReportManagerState>) => {
          draft.findings.map((finding: Finding): Finding => {
            const newSortOrderItem: SortOrderItem | undefined =
              sortOrders.sortOrdersMap.find(
                (item: SortOrderItem): boolean => item.id === finding.id
              );

            if (isNil(newSortOrderItem)) {
              return finding;
            }

            return {
              ...finding,
              sortOrder: newSortOrderItem.sortOrder,
            };
          });
        })
    )
  ),
});
