import { EditorContentDto } from '../editor-content-dto.interface';

export interface FindingClassifierBaseDto {
  readonly name: string;
  readonly sortOrder: number;
  readonly isDefault: boolean;
  readonly info: EditorContentDto | null;
}
