import { EnumLike, IsEnum, IsInt, Min } from '@jovotech/output';

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
  @Min(0)
  index: number;
}
