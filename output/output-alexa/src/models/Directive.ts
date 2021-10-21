import { IsNotEmpty, IsString } from '@jovotech/output';

export class Directive<TYPE extends string = string> {
  [key: string]: unknown;

  @IsString()
  @IsNotEmpty()
  type: TYPE;
}
