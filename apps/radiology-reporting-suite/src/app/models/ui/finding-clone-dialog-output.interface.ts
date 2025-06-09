import { Finding, FindingClassifier, FindingGroup } from '../domain';

export interface FindingCloneDialogOutput {
  readonly finding: Finding;
  readonly group: FindingGroup;
  readonly classifier: FindingClassifier;
}
