import { TemplateBaseDto } from './template-base-dto.interface';

export interface TemplateDto extends TemplateBaseDto {
  readonly id: string;
}
