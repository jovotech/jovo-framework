import { IsInt, IsNotEmpty, IsString, Min } from '@jovotech/output';
import { APL_INDEX_MIN } from '../../constants';
import { AplDirective } from './AplDirective';

export class AplIndexListDirective<TYPE extends string> extends AplDirective<TYPE> {
  @IsString()
  @IsNotEmpty()
  listId: string;

  @IsInt()
  @Min(APL_INDEX_MIN)
  startIndex: number;
}
