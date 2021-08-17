import { Equals, IsInt, Min } from '@jovotech/output';
import { APL_OPERATION_COUNT_MIN } from '../../../constants';
import { AplOperation, AplOperationType } from '../AplOperation';

export class AplDeleteItemsOperation extends AplOperation<AplOperationType.DeleteItems> {
  @Equals(AplOperationType.DeleteItems)
  type: AplOperationType.DeleteItems;

  @IsInt()
  @Min(APL_OPERATION_COUNT_MIN)
  count: number;
}
