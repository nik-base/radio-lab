import { ChangeModes } from '@app/types';

import { ScopeBase } from '../domain';

export interface ScopeManagerDialogData {
  readonly scope?: ScopeBase;
  readonly mode: ChangeModes;
}
