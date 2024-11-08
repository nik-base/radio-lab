import { RTFEditorContentDto } from './rtf-editor-content.interface.dto';

export interface RadioFindingDetailsBaseDto {
  readonly name: string;
  readonly group: string | null;
  readonly sortOrder: number;
  readonly isNormal: boolean;
  readonly description: RTFEditorContentDto;
  readonly impression: RTFEditorContentDto | null;
  readonly recommendation: RTFEditorContentDto | null;
}
