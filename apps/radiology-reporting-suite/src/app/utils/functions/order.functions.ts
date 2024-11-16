import { orderBy } from 'lodash-es';

import { Finding, Scope, Template } from '@app/models/domain';

export function orderTemplates(templates: Template[]): Template[] {
  return orderBy(
    templates,
    (template: Template): string => template.name.toLocaleLowerCase(),
    'asc'
  );
}

export function orderScopes(scopes: Scope[]): Scope[] {
  return orderBy(scopes, (scope: Scope): number => scope.sortOrder, 'asc');
}

export function orderFindings(findings: Finding[]): Finding[] {
  return orderBy(
    findings,
    (finding: Finding): number => finding.sortOrder,
    'asc'
  );
}
