import { ChangeModes } from '@app/types';

import { Template } from '../domain';

import { DialogTemplateRendererData } from './dialog-template-renderer-data.interface';

export interface TemplateManagerDialogData extends DialogTemplateRendererData {
  readonly template?: Template;
  readonly mode: ChangeModes;
}
