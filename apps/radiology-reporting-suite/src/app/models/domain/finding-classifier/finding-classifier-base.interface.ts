import { EditorContent } from '../editor-content.interface';

export interface FindingClassifierBase {
  readonly name: string;
  readonly sortOrder: number;
  readonly isDefault: boolean;
  readonly info: EditorContent | null;
}
