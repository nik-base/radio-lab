import { APP_NOTIFICATION_TYPE, CHANGE_MODE } from '@app/constants';

import { ValueOf } from './common.types';

export type AppNotificationTypes = ValueOf<typeof APP_NOTIFICATION_TYPE>;

export type ChangeModes = ValueOf<typeof CHANGE_MODE>;
