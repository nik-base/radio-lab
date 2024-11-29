import { Finding, Scope, Template } from '@app/models/domain';

export interface ReportManagerState {
  readonly templates: Template[];
  readonly selectedTemplate: Template | null;
  readonly scopes: Scope[] | null;
  readonly selectedScope: Scope | null;
  readonly findings: Finding[] | null;
  readonly selectedFinding: Finding | null;
}
