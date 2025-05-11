import { TooltipOptions } from 'primeng/api';

// eslint-disable-next-line @typescript-eslint/typedef
export const APP_NOTIFICATION_TYPE = {
  Success: 'success',
  Error: 'error',
} as const;

// eslint-disable-next-line @typescript-eslint/typedef
export const CHANGE_MODE = {
  Create: 'create',
  Update: 'update',
} as const;

// eslint-disable-next-line @typescript-eslint/typedef
export const VARIABLE_SOURCE = {
  Finding: 'finding',
} as const;

// eslint-disable-next-line @typescript-eslint/typedef
export const VARIABLE_TYPE = {
  MultiSelect: 'multiSelect',
} as const;

// eslint-disable-next-line @typescript-eslint/typedef
export const APP_TOOLTIP_OPTIONS = {
  showDelay: 300,
  hideDelay: 50,
  tooltipPosition: 'bottom',
} as TooltipOptions;
