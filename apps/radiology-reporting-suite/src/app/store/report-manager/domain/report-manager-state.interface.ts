import { Finding, Scope, Template } from '@app/models/domain';

export interface ReportManagerState {
  readonly templates: Template[];
  readonly scopes: Scope[] | null;
  readonly findings: Finding[] | null;
  readonly groups: string[];
}
