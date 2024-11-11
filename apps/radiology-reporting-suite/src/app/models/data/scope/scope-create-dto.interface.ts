import { ScopeBaseDto } from './scope-base-dto.interface';

export interface ScopeCreateDto extends ScopeBaseDto {
  readonly templateId: string;
}
