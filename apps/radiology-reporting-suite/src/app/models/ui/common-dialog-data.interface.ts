import { ChangeModes } from '@app/types';

import { DialogTemplateRendererData } from './dialog-template-renderer-data.interface';

export interface CommonDialogData extends DialogTemplateRendererData {
  readonly mode: ChangeModes;
  readonly name?: string;
}
