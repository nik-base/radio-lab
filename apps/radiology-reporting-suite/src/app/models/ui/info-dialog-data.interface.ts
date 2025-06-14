import { EditorContent } from '../domain';

import { DialogTemplateRendererData } from './dialog-template-renderer-data.interface';

export interface InfoDialogData extends DialogTemplateRendererData {
  readonly name: string;
  readonly info: EditorContent;
}
