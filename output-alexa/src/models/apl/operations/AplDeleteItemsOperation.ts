import { Equals, IsInt, Min } from '@jovotech/output';
import { AplOperation, AplOperationType } from '../AplOperation';

export class AplDeleteItemsOperation extends AplOperation<AplOperationType.DeleteItems> {
  @Equals(AplOperationType.DeleteItems)
  type: AplOperationType.DeleteItems;

  @IsInt()
  @Min(1)
  count: number;
}
