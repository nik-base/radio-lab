import { TemplateBaseDto } from './template-base-dto.interface';

export interface TemplateUpdateDto extends TemplateBaseDto {
  readonly id: string;
}
