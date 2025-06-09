import { Finding } from '../domain';

import { DialogTemplateRendererData } from './dialog-template-renderer-data.interface';

export interface VariablesManagerDialogData extends DialogTemplateRendererData {
  readonly finding: Finding;
}
