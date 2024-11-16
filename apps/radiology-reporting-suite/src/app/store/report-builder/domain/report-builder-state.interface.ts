import { Template, TemplateData } from '@app/models/domain';

export interface ReportBuilderState {
  readonly templates: Template[];
  readonly templateData: TemplateData | null;
}
