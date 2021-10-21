import { IsEnum, ValidateNested, Type } from '@jovotech/output';
import { CheckInInfo } from './CheckInInfo';
import { CurbsideInfo } from './CurbsideInfo';

export enum PickupType {
  Unspecified = 'UNSPECIFIED',
  InStore = 'INSTORE',
  CurbSide = 'CURBSIDE',
}

export class PickupInfo {
  @IsEnum(PickupType)
  pickupType: PickupType;

  @ValidateNested()
  @Type(() => CurbsideInfo)
  curbsideInfo: CurbsideInfo;

  @ValidateNested({
    each: true,
  })
  @Type(() => CheckInInfo)
  checkInInfo: CheckInInfo[];
}
