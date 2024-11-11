import { ScopeBaseDto } from './scope-base-dto.interface';

export interface ScopeUpdateDto extends ScopeBaseDto {
  readonly id: string;
  readonly templateId: string;
}
