import { IsNotEmpty, IsOptional, IsString, Type, ValidateNested } from '@jovotech/output';
import { SlotTypeValueName } from './SlotTypeValueName';

export class SlotTypeValue {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  id?: string;

  @ValidateNested()
  @Type(() => SlotTypeValueName)
  name!: SlotTypeValueName;
}
