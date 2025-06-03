/* eslint-disable @typescript-eslint/typedef */
import { TooltipOptions } from 'primeng/api';

import {
  FindingClassifierCreate,
  FindingGroupCreate,
} from '@app/models/domain';

export const APP_NOTIFICATION_TYPE = {
  Success: 'success',
  Error: 'error',
} as const;

export const CHANGE_MODE = {
  Create: 'create',
  Update: 'update',
} as const;

export const VARIABLE_SOURCE = {
  Finding: 'finding',
} as const;

export const VARIABLE_TYPE = {
  MultiSelect: 'multiselect',
} as const;

export const APP_TOOLTIP_OPTIONS = {
  showDelay: 300,
  hideDelay: 50,
  tooltipPosition: 'bottom',
} as const as TooltipOptions;

export const RADIO_DEFAULT_GROUP = {
  name: 'Uncategorized',
  sortOrder: 0,
  isDefault: true,
} as const satisfies Omit<FindingGroupCreate, 'scopeId'>;

export const RADIO_DEFAULT_CLASSIFIER = {
  name: 'Unclassified',
  sortOrder: 0,
  isDefault: true,
} as const satisfies Omit<FindingClassifierCreate, 'groupId' | 'scopeId'>;
