import { IsNotEmpty, IsString, MaxLength } from '@jovotech/output';

export class UserNotification {
  @IsString()
  @IsNotEmpty()
  @MaxLength(30)
  title: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  text: string;
}
