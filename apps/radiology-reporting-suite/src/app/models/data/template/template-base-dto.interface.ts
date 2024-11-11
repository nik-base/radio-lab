import { EditorContentDto } from '../editor-content-dto.interface';

export interface TemplateBaseDto {
  readonly name: string;
  readonly protocol: EditorContentDto;
  readonly patientInfo: EditorContentDto | null;
}
