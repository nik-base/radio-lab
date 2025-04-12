import { createFeature, createReducer, createSelector, on } from '@ngrx/store';
import { produce } from 'immer';
import { isNil, orderBy, uniq } from 'lodash-es';

import {
  Finding,
  FindingClassifier,
  FindingGroup,
  Scope,
  SortOrderItem,
  Template,
} from '@app/models/domain';
import { Writable } from '@app/types';
import { isNotNil } from '@app/utils/functions/common.functions';
import {
  orderClassifiers,
  orderFindings,
  orderGroups,
  orderScopes,
  orderTemplates,
} from '@app/utils/functions/order.functions';

import { ClassifierActions } from './actions/classifier.actions';
import { FindingActions } from './actions/finding.actions';
import { GroupActions } from './actions/group.actions';
import { ScopeActions } from './actions/scope.actions';
import { TemplateActions } from './actions/template.actions';
import { ReportManagerState } from './report-manager-state.interface';

export const reportManagerInitialState: ReportManagerState = {
  templates: [],
  selectedTemplate: null,
  scopes: null,
  selectedScope: null,
  groups: null,
  selectedGroup: null,
  classifiers: null,
  selectedClassifier: null,
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
    // Group Actions
    on(
      GroupActions.fetchSuccess,
      (
        state: ReportManagerState,
        { groups }: ReturnType<typeof GroupActions.fetchSuccess>
      ): ReportManagerState =>
        produce(state, (draft: Writable<ReportManagerState>) => {
          draft.groups = groups;
        })
    ),
    on(
      GroupActions.createSuccess,
      (
        state: ReportManagerState,
        { group }: ReturnType<typeof GroupActions.createSuccess>
      ): ReportManagerState =>
        produce(state, (draft: Writable<ReportManagerState>) => {
          if (isNil(draft.groups)) {
            return;
          }

          draft.groups = [...draft.groups, group];
        })
    ),
    on(
      GroupActions.updateSuccess,
      (
        state: ReportManagerState,
        { group }: ReturnType<typeof GroupActions.updateSuccess>
      ): ReportManagerState =>
        produce(state, (draft: Writable<ReportManagerState>) => {
          if (isNil(draft.groups)) {
            return;
          }

          const index: number = draft.groups.findIndex(
            (item: FindingGroup): boolean => item.id === group.id
          );

          if (index === -1) {
            return;
          }

          draft.groups[index] = group;
        })
    ),
    on(
      GroupActions.deleteSuccess,
      (
        state: ReportManagerState,
        { group }: ReturnType<typeof GroupActions.deleteSuccess>
      ): ReportManagerState =>
        produce(state, (draft: Writable<ReportManagerState>) => {
          if (isNil(draft.groups)) {
            return;
          }

          const index: number = draft.groups.findIndex(
            (item: FindingGroup): boolean => item.id === group.id
          );

          if (index === -1) {
            return;
          }

          draft.groups.splice(index, 1);
        })
    ),
    on(
      GroupActions.reorderSuccess,
      (
        state: ReportManagerState,
        { sortOrders }: ReturnType<typeof GroupActions.reorderSuccess>
      ): ReportManagerState =>
        produce(state, (draft: Writable<ReportManagerState>) => {
          if (isNil(draft.groups)) {
            return;
          }

          for (const group of draft.groups) {
            const newSortOrderItem: SortOrderItem | undefined =
              sortOrders.sortOrdersMap.find(
                (item: SortOrderItem): boolean => item.id === group.id
              );

            if (!isNil(newSortOrderItem)) {
              group.sortOrder = newSortOrderItem.sortOrder;

              if (draft.selectedGroup && draft.selectedGroup.id === group.id) {
                draft.selectedGroup.sortOrder = newSortOrderItem.sortOrder;
              }
            }
          }
        })
    ),
    on(
      GroupActions.setSelected,
      (
        state: ReportManagerState,
        { group }: ReturnType<typeof GroupActions.setSelected>
      ): ReportManagerState =>
        produce(state, (draft: Writable<ReportManagerState>) => {
          draft.selectedGroup = group;
        })
    ),
    on(
      GroupActions.reset,
      (state: ReportManagerState): ReportManagerState =>
        produce(state, (draft: Writable<ReportManagerState>) => {
          draft.groups = null;
          draft.selectedGroup = null;
        })
    ),
    // Classifier Actions
    on(
      ClassifierActions.fetchSuccess,
      (
        state: ReportManagerState,
        { classifiers }: ReturnType<typeof ClassifierActions.fetchSuccess>
      ): ReportManagerState =>
        produce(state, (draft: Writable<ReportManagerState>) => {
          draft.classifiers = classifiers;
        })
    ),
    on(
      ClassifierActions.createSuccess,
      (
        state: ReportManagerState,
        { classifier }: ReturnType<typeof ClassifierActions.createSuccess>
      ): ReportManagerState =>
        produce(state, (draft: Writable<ReportManagerState>) => {
          if (isNil(draft.classifiers)) {
            return;
          }

          draft.classifiers = [...draft.classifiers, classifier];
        })
    ),
    on(
      ClassifierActions.updateSuccess,
      (
        state: ReportManagerState,
        { classifier }: ReturnType<typeof ClassifierActions.updateSuccess>
      ): ReportManagerState =>
        produce(state, (draft: Writable<ReportManagerState>) => {
          if (isNil(draft.classifiers)) {
            return;
          }

          const index: number = draft.classifiers.findIndex(
            (item: FindingClassifier): boolean => item.id === classifier.id
          );

          if (index === -1) {
            return;
          }

          draft.classifiers[index] = classifier;
        })
    ),
    on(
      ClassifierActions.deleteSuccess,
      (
        state: ReportManagerState,
        { classifier }: ReturnType<typeof ClassifierActions.deleteSuccess>
      ): ReportManagerState =>
        produce(state, (draft: Writable<ReportManagerState>) => {
          if (isNil(draft.classifiers)) {
            return;
          }

          const index: number = draft.classifiers.findIndex(
            (item: FindingClassifier): boolean => item.id === classifier.id
          );

          if (index === -1) {
            return;
          }

          draft.classifiers.splice(index, 1);
        })
    ),
    on(
      ClassifierActions.reorderSuccess,
      (
        state: ReportManagerState,
        { sortOrders }: ReturnType<typeof ClassifierActions.reorderSuccess>
      ): ReportManagerState =>
        produce(state, (draft: Writable<ReportManagerState>) => {
          if (isNil(draft.classifiers)) {
            return;
          }

          for (const classifier of draft.classifiers) {
            const newSortOrderItem: SortOrderItem | undefined =
              sortOrders.sortOrdersMap.find(
                (item: SortOrderItem): boolean => item.id === classifier.id
              );

            if (!isNil(newSortOrderItem)) {
              classifier.sortOrder = newSortOrderItem.sortOrder;

              if (
                draft.selectedClassifier &&
                draft.selectedClassifier.id === classifier.id
              ) {
                draft.selectedClassifier.sortOrder = newSortOrderItem.sortOrder;
              }
            }
          }
        })
    ),
    on(
      ClassifierActions.setSelected,
      (
        state: ReportManagerState,
        { classifier }: ReturnType<typeof ClassifierActions.setSelected>
      ): ReportManagerState =>
        produce(state, (draft: Writable<ReportManagerState>) => {
          draft.selectedClassifier = classifier;
        })
    ),
    on(
      ClassifierActions.reset,
      (state: ReportManagerState): ReportManagerState =>
        produce(state, (draft: Writable<ReportManagerState>) => {
          draft.classifiers = null;
          draft.selectedClassifier = null;
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
  extraSelectors: ({
    selectTemplates,
    selectScopes,
    selectGroups,
    selectClassifiers,
    selectFindings,
  }) => ({
    selectOrderedTemplates: createSelector(
      selectTemplates,
      (templates: Template[]): Template[] => orderTemplates(templates)
    ),
    selectOrderedScopes: createSelector(
      selectScopes,
      (scopes: Scope[] | null): Scope[] | null =>
        isNil(scopes) ? null : orderScopes(scopes)
    ),
    selectOrderedGroups: createSelector(
      selectGroups,
      (groups: FindingGroup[] | null): FindingGroup[] | null =>
        isNil(groups) ? null : orderGroups(groups)
    ),
    selectOrderedClassifiers: createSelector(
      selectClassifiers,
      (classifiers: FindingClassifier[] | null): FindingGroup[] | null =>
        isNil(classifiers) ? null : orderClassifiers(classifiers)
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
            .map((finding: Finding): string | null => finding.groupId)
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
  selectOrderedGroups,
  selectOrderedClassifiers,
  selectOrderedFindings,
  selectGroups,
  selectSelectedTemplate,
  selectSelectedScope,
  selectSelectedGroup,
  selectSelectedClassifier,
  selectSelectedFinding,
} = reportManagerFeature;
