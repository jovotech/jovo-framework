import { EnumLike, IsEnum, IsInt, Min } from '@jovotech/output';
import { APL_INDEX_MIN } from '../../constants';

export enum AplOperationType {
  InsertItem = 'InsertItem',
  InsertItems = 'InsertMultipleItems',
  SetItem = 'SetItem',
  DeleteItem = 'DeleteItem',
  DeleteItems = 'DeleteMultipleItems',
}

export type AplOperationTypeLike = EnumLike<AplOperationType>;

export class AplOperation<TYPE extends AplOperationTypeLike = AplOperationTypeLike> {
  @IsEnum(AplOperationType)
  type: TYPE;

  @IsInt()
  @Min(APL_INDEX_MIN)
  index: number;
}
