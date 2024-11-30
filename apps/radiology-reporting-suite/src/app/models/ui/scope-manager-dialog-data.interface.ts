import { ChangeModes } from '@app/types';

import { Scope } from '../domain';

export interface ScopeManagerDialogData {
  readonly scope?: Scope;
  readonly templateId: string;
  readonly mode: ChangeModes;
}
