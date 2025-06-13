import { FindingGroup, Scope } from '../domain';

export interface GroupCloneDialogOutput {
  readonly group: FindingGroup;
  readonly scope: Scope;
}
