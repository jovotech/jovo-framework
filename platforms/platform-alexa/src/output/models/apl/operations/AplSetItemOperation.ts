import { Equals, IsObject } from '@jovotech/output';
import { AplOperation, AplOperationType } from '../AplOperation';

export class AplSetItemOperation extends AplOperation<AplOperationType.SetItem> {
  @Equals('AplOperationType.SetItem')
  type!: AplOperationType.SetItem;

  @IsObject()
  item!: Record<string, unknown>;
}
