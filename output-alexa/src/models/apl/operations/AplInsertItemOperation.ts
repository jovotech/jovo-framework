import { Equals, IsObject } from '@jovotech/output';
import { AplOperation, AplOperationType } from '../AplOperation';

export class AplInsertItemOperation extends AplOperation<AplOperationType.InsertItem> {
  @Equals(AplOperationType.InsertItem)
  type: AplOperationType.InsertItem;

  @IsObject()
  item: Record<string, unknown>;
}
