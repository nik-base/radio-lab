import { FindingGroup, Scope } from '../domain';

import { DialogTemplateRendererData } from './dialog-template-renderer-data.interface';

export interface GroupCloneDialogData extends DialogTemplateRendererData {
  readonly group: FindingGroup;
  readonly scope: Scope;
}
