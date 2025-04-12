import {
  Finding,
  FindingClassifier,
  FindingGroup,
  Scope,
  Template,
} from '@app/models/domain';

export interface ReportManagerState {
  readonly templates: Template[];
  readonly selectedTemplate: Template | null;
  readonly scopes: Scope[] | null;
  readonly selectedScope: Scope | null;
  readonly groups: FindingGroup[] | null;
  readonly selectedGroup: FindingGroup | null;
  readonly classifiers: FindingClassifier[] | null;
  readonly selectedClassifier: FindingClassifier | null;
  readonly findings: Finding[] | null;
  readonly selectedFinding: Finding | null;
}
