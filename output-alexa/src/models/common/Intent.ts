import { IsEnum, IsNotEmpty, IsObject, IsString, TransformMap, ValidateNested } from '@jovotech/output';
import { Slot } from './Slot';

export enum ConfirmationStatus {
  None = 'NONE',
  Confirmed = 'CONFIRMED',
  Denied = 'DENIED',
}

export class Intent {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEnum(ConfirmationStatus)
  confirmationStatus: ConfirmationStatus;

  @IsObject()
  @ValidateNested({ each: true })
  @TransformMap(Slot)
  slots: Record<string, Slot>;
}
