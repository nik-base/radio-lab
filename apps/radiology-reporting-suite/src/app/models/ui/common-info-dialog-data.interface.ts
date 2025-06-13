import { ChangeModes } from '@app/types';

import { EditorContent } from '../domain';

import { DialogTemplateRendererData } from './dialog-template-renderer-data.interface';

export interface CommonInfoDialogData extends DialogTemplateRendererData {
  readonly mode: ChangeModes;
  readonly name?: string;
  readonly info?: EditorContent | null;
}
