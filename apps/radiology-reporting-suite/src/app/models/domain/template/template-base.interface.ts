import { EditorContent } from '../editor-content.interface';

export interface TemplateBase {
  readonly name: string;
  readonly protocol: EditorContent;
  readonly patientInfo: EditorContent | null;
}
