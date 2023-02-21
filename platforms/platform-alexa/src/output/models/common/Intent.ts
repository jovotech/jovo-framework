import { EnumLike } from '@jovotech/framework';
import {
  IsEnum,
  IsNotEmpty,
  IsObject,
  IsString,
  TransformMap,
  ValidateNested,
} from '@jovotech/output';
import { Slot } from './Slot';
import { ConfirmationStatus, ConfirmationStatusLike } from '../index';

export class Intent {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsEnum(ConfirmationStatus)
  confirmationStatus!: ConfirmationStatusLike;

  @IsObject()
  @ValidateNested({ each: true })
  @TransformMap(() => Slot)
  slots!: Record<string, Slot>;
}
