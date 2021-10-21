import { IsEnum } from '@jovotech/output';

export enum CheckInType {
  Unspecified = 'CHECK_IN_TYPE_UNSPECIFIED',
  Email = 'EMAIL',
  Sms = 'SMS',
}

export class CheckInInfo {
  @IsEnum(CheckInType)
  checkInType: CheckInType;
}
