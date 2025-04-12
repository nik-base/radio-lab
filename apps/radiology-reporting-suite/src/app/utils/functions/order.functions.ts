import { isNil, maxBy, orderBy } from 'lodash-es';

import {
  Finding,
  FindingClassifier,
  FindingGroup,
  Scope,
  Template,
} from '@app/models/domain';

export function orderTemplates(templates: Template[]): Template[] {
  return orderBy(
    templates,
    (template: Template): number => template.sortOrder,
    'asc'
  );
}

export function orderScopes(scopes: Scope[]): Scope[] {
  return orderBy(scopes, (scope: Scope): number => scope.sortOrder, 'asc');
}

export function orderGroups(groups: FindingGroup[]): FindingGroup[] {
  return orderBy(
    groups,
    (group: FindingGroup): number => group.sortOrder,
    'asc'
  );
}

export function orderClassifiers(
  classifiers: FindingClassifier[]
): FindingClassifier[] {
  return orderBy(
    classifiers,
    (classifier: FindingClassifier): number => classifier.sortOrder,
    'asc'
  );
}

export function orderFindings(findings: Finding[]): Finding[] {
  return orderBy(
    findings,
    (finding: Finding): number => finding.sortOrder,
    'asc'
  );
}

export function findNextSortOrder(
  sortOrderItems: { sortOrder: number }[] | null | undefined
): number {
  if (isNil(sortOrderItems) || !sortOrderItems.length) {
    return 0;
  }

  const lastSortOrder: number | null =
    maxBy(
      sortOrderItems,
      (sortOrderItem: { sortOrder: number }): number => sortOrderItem.sortOrder
    )?.sortOrder ?? null;

  return isNil(lastSortOrder) ? 0 : lastSortOrder + 1;
}
