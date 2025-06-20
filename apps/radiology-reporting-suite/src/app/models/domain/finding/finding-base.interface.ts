import { EditorContent } from '../editor-content.interface';

export interface FindingBase {
  readonly name: string;
  readonly sortOrder: number;
  readonly isNormal: boolean;
  readonly description: EditorContent;
  readonly impression: EditorContent | null;
  readonly recommendation: EditorContent | null;
}
