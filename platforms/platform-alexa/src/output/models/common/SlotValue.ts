import { IsNotEmpty, IsString } from '@jovotech/output';

export class SlotValue {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @IsNotEmpty()
  id!: string;
}
