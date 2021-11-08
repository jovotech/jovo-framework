import {
  IsArray,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsObject,
  IsString,
  MaxLength,
  Type,
  ValidateNested,
} from '@jovotech/output';
import { USER_STATUS_LABEL_MAX_LENGTH } from '../../constants';
import { Location } from './Location';
import { StaffFacilitator } from './StaffFacilitator';
import { Time } from './Time';

export enum ReservationStatus {
  Unspecified = 'RESERVATION_STATUS_UNSPECIFIED',
  Pending = 'PENDING',
  Confirmed = 'CONFIRMED',
  Cancelled = 'CANCELLED',
  Fulfilled = 'FULFILLED',
  ChangeRequested = 'CHANGE_REQUESTED',
  Rejected = 'REJECTED',
}

export enum ReservationType {
  Unspecified = 'RESERVATION_TYPE_UNSPECIFIED',
  Restaurant = 'RESTAURANT',
  Hairdresser = 'HAIRDRESSER',
}

export class ReservationItemExtension {
  @IsEnum(ReservationStatus)
  status!: ReservationStatus;

  @IsString()
  @IsNotEmpty()
  @MaxLength(USER_STATUS_LABEL_MAX_LENGTH)
  userVisibleStatusLabel!: string;

  @IsEnum(ReservationType)
  type!: ReservationType;

  @ValidateNested()
  @Type(() => Time)
  reservationTime!: Time;

  @ValidateNested()
  @Type(() => Time)
  userAcceptableTimeRange!: Time;

  @IsString()
  @IsNotEmpty()
  confirmationCode!: string;

  @IsInt()
  partySize!: number;

  @IsArray()
  @ValidateNested({
    each: true,
  })
  @Type(() => StaffFacilitator)
  staffFacilitators!: StaffFacilitator[];

  @ValidateNested()
  @Type(() => Location)
  location!: Location;

  @IsObject()
  extension?: Record<string | '@type', string | number>;
}
