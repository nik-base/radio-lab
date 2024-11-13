import { TemplateBase } from './template-base.interface';

export interface TemplateUpdate extends TemplateBase {
  readonly id: string;
}
