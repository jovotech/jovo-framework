import { IsNotEmpty, IsString, MaxLength } from '@jovotech/output';
import {
  USER_NOTIFICATION_TEXT_MAX_LENGTH,
  USER_NOTIFICATION_TITLE_MAX_LENGTH,
} from '../../constants';

export class UserNotification {
  @IsString()
  @IsNotEmpty()
  @MaxLength(USER_NOTIFICATION_TITLE_MAX_LENGTH)
  title!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(USER_NOTIFICATION_TEXT_MAX_LENGTH)
  text!: string;
}
