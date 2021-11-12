import { ArrayMaxSize, IsArray, IsNotEmpty, Type, ValidateNested } from '@jovotech/output';
import { IsString } from '@jovotech/output';
import { SLOT_TYPE_VALUES_MAX_SIZE } from '../../constants';
import { SlotTypeValue } from './SlotTypeValue';

export class SlotType {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsArray()
  @ArrayMaxSize(SLOT_TYPE_VALUES_MAX_SIZE)
  @ValidateNested({ each: true })
  @Type(() => SlotTypeValue)
  values!: SlotTypeValue[];
}
