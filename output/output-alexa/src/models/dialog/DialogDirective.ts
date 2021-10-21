import { IsOptional, Type, ValidateNested } from '@jovotech/output';
import { Intent } from '../common/Intent';
import { Directive } from '../Directive';

export class DialogDirective<TYPE extends string = string> extends Directive<TYPE> {
  @IsOptional()
  @ValidateNested()
  @Type(() => Intent)
  updatedIntent?: Intent;
}
