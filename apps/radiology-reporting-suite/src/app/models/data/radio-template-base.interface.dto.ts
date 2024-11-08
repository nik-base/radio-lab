import { RTFEditorContentDto } from './rtf-editor-content.interface.dto';

export interface RadioTemplateBaseDto {
  readonly name: string;
  readonly protocol: RTFEditorContentDto;
  readonly patientInfo: RTFEditorContentDto | null;
}
