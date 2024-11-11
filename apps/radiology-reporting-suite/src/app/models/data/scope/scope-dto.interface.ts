import { ScopeBaseDto } from './scope-base-dto.interface';

export interface ScopeDto extends ScopeBaseDto {
  readonly id: string;
  readonly templateId: string;
}
