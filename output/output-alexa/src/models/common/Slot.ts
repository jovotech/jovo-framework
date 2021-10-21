import { IsEnum, IsNotEmpty, IsOptional, IsString, Type, ValidateNested } from '@jovotech/output';
import { ConfirmationStatus, ConfirmationStatusLike } from './Intent';
import { Resolutions } from './Resolutions';

export class Slot {
  [key: string]: unknown;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  value: string;

  @IsEnum(ConfirmationStatus)
  confirmationStatus: ConfirmationStatusLike;

  @IsOptional()
  @ValidateNested()
  @Type(() => Resolutions)
  resolutions?: Resolutions;
}
