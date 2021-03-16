import { IsNotEmpty, IsString, Type, ValidateNested } from '@jovotech/output';
import { SlotTypeValueName } from './SlotTypeValueName';

export class SlotTypeValue {
  @IsString()
  @IsNotEmpty()
  id: string;

  @ValidateNested()
  @Type(() => SlotTypeValueName)
  name: SlotTypeValueName;
}
