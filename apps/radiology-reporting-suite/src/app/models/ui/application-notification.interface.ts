import { APP_NOTIFICATION_TYPE } from '@app/constants';
import { ValueOf } from '@app/types';

export interface ApplicationNotification {
  readonly title: string;
  readonly message: string;
  readonly type: ValueOf<typeof APP_NOTIFICATION_TYPE>;
}
