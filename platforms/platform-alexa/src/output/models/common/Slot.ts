import { IsEnum, IsNotEmpty, IsOptional, IsString, Type, ValidateNested } from '@jovotech/output';
import { Resolutions } from './Resolutions';
import { ConfirmationStatus, ConfirmationStatusLike } from '../index';

export class Slot {
  [key: string]: unknown;

  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @IsNotEmpty()
  value!: string;

  @IsEnum(ConfirmationStatus)
  confirmationStatus!: ConfirmationStatusLike;

  @IsOptional()
  @ValidateNested()
  @Type(() => Resolutions)
  resolutions?: Resolutions;
}
