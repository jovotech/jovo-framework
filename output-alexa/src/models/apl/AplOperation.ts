import { IsEnum, IsInt, Min } from '@jovotech/output';

export enum AplOperationType {
  InsertItem = 'InsertItem',
  InsertItems = 'InsertMultipleItems',
  SetItem = 'SetItem',
  DeleteItem = 'DeleteItem',
  DeleteItems = 'DeleteMultipleItems',
}

export class AplOperation<TYPE extends AplOperationType = AplOperationType> {
  @IsEnum(AplOperationType)
  type: TYPE;

  @IsInt()
  @Min(0)
  index: number;
}
