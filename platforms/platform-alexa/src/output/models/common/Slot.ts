import { IsEnum, IsNotEmpty, IsOptional, IsString, Type, ValidateNested } from '@jovotech/output';
import { Resolutions } from './Resolutions';
import { EnumLike } from '@jovotech/common';

export enum SlotConfirmationStatus {
  None = 'NONE',
  Confirmed = 'CONFIRMED',
  Denied = 'DENIED',
}

export type SlotConfirmationStatusLike = EnumLike<SlotConfirmationStatus>;

export class Slot {
  [key: string]: unknown;

  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @IsNotEmpty()
  value!: string;

  @IsEnum(SlotConfirmationStatus)
  confirmationStatus!: SlotConfirmationStatusLike;

  @IsOptional()
  @ValidateNested()
  @Type(() => Resolutions)
  resolutions?: Resolutions;
}
