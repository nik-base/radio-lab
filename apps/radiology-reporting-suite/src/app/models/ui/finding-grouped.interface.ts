import { Finding } from '../domain';

export interface FindingGrouped {
  readonly group: string;
  readonly findings: Finding[];
}
