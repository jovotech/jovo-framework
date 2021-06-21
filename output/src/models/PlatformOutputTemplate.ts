import { IsOptional, ValidateNested } from '..';
import { OutputTemplateBase } from './OutputTemplateBase';

export class PlatformOutputTemplate<
  RESPONSE extends Record<string, unknown> = Record<string, unknown>,
> extends OutputTemplateBase {
  @IsOptional()
  @ValidateNested()
  nativeResponse?: RESPONSE;
}
