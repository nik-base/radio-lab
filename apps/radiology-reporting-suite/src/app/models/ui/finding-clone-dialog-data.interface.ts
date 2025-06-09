import { Finding, FindingClassifier, FindingGroup, Scope } from '../domain';

import { DialogTemplateRendererData } from './dialog-template-renderer-data.interface';

export interface FindingCloneDialogData extends DialogTemplateRendererData {
  readonly scope: Scope;
  readonly finding: Finding;
  readonly group: FindingGroup;
  readonly classifier: FindingClassifier;
}
