import { ChangeModes } from '@app/types';

import { TemplateBase } from '../domain';

export interface TemplateManagerDialogData {
  readonly template?: TemplateBase;
  readonly mode: ChangeModes;
}
