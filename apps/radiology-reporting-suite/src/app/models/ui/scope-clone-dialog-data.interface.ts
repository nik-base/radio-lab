import { Scope, Template } from '../domain';

import { DialogTemplateRendererData } from './dialog-template-renderer-data.interface';

export interface ScopeCloneDialogData extends DialogTemplateRendererData {
  readonly scope: Scope;
  readonly template: Template;
}
