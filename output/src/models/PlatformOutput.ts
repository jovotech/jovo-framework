import { IsOptional, ValidateNested } from '..';
import { GenericOutputBase } from './GenericOutputBase';

export class PlatformOutput<
  Response extends Record<string, unknown> = Record<string, unknown>
> extends GenericOutputBase {
  @IsOptional()
  @ValidateNested()
  nativeResponse?: Response;
}
