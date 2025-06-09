export interface EditorMentionVariableClickEventData {
  readonly id: string;
  readonly name: string;
  readonly source?: string;
  readonly type?: string;
  readonly nodePos: number;
  readonly event: MouseEvent;
}
