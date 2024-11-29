import { ChangeModes } from '@app/types';

import { Template } from '../domain';

export interface TemplateManagerDialogData {
  readonly template?: Template;
  readonly mode: ChangeModes;
}
