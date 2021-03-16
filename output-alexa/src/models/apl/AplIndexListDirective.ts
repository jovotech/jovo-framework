import { IsInt, IsNotEmpty, IsString, Min } from '@jovotech/output';
import { AplDirective } from './AplDirective';

export class AplIndexListDirective<TYPE extends string> extends AplDirective<TYPE> {
  @IsString()
  @IsNotEmpty()
  listId: string;

  @IsInt()
  @Min(0)
  startIndex: number;
}
