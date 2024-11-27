import { ChangeModes } from '@app/types';

import { Template } from '../domain';

export interface TemplateDialogData {
  readonly template?: Template;
  readonly mode: ChangeModes;
}
