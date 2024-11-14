import { Finding, Scope, Template } from '@app/models/domain';

export interface ReportManagerState {
  readonly templates: Template[];
  readonly scopes: Scope[];
  readonly findings: Finding[];
  readonly groups: string[];
}
