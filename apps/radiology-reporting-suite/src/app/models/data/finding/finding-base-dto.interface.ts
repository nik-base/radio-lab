import { EditorContentDto } from '../editor-content-dto.interface';

export interface FindingBaseDto {
  readonly name: string;
  readonly sortOrder: number;
  readonly isNormal: boolean;
  readonly description: EditorContentDto;
  readonly impression: EditorContentDto | null;
  readonly recommendation: EditorContentDto | null;
}
