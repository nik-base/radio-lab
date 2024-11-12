import { FindingDto, ScopeDto, TemplateDto } from '../../../models/data';

export interface ReportManagerState {
  readonly templates: TemplateDto[];
  readonly scopes: ScopeDto[];
  readonly findings: FindingDto[];
  readonly groups: string[];
}
