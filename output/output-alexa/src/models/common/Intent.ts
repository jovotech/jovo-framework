import {
  EnumLike,
  IsEnum,
  IsNotEmpty,
  IsObject,
  IsString,
  TransformMap,
  ValidateNested,
} from '@jovotech/output';
import { Slot } from './Slot';

export enum ConfirmationStatus {
  None = 'NONE',
  Confirmed = 'CONFIRMED',
  Denied = 'DENIED',
}

export type ConfirmationStatusLike = EnumLike<ConfirmationStatus>;

export class Intent {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEnum(ConfirmationStatus)
  confirmationStatus: ConfirmationStatusLike;

  @IsObject()
  @ValidateNested({ each: true })
  @TransformMap(() => Slot)
  slots: Record<string, Slot>;
}
