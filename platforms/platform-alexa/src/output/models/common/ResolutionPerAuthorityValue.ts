import { Type } from '@jovotech/output';
import { ValidateNested } from '@jovotech/output';
import { SlotValue } from './SlotValue';

export class ResolutionPerAuthorityValue {
  @ValidateNested()
  @Type(() => SlotValue)
  value!: SlotValue;
}
