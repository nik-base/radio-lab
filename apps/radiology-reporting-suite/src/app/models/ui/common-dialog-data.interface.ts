import { ChangeModes } from '@app/types';

export interface CommonDialogData {
  readonly mode: ChangeModes;
  readonly name?: string;
}
