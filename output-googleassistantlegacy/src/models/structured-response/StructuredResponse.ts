import { Type, ValidateNested } from '@jovotech/output';
import { OrderUpdate } from './OrderUpdate';

export class StructuredResponse {
  @ValidateNested()
  @Type(() => OrderUpdate)
  orderUpdateV3: OrderUpdate;
}
