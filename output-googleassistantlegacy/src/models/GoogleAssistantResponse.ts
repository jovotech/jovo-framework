import { IsOptional, IsBoolean, Type, ValidateNested, IsArray } from '@jovotech/output';
import { SystemIntent } from './common/SystemIntent';
import { RichResponse } from './RichResponse';
import { SimpleResponse } from './simple-response/SimpleResponse';

export class GoogleAssistantResponse {
  [key: string]: unknown;

  @IsOptional()
  @IsBoolean()
  expectUserResponse?: boolean;

  @IsOptional()
  @ValidateNested()
  @Type(() => SystemIntent)
  systemIntent?: SystemIntent;

  @ValidateNested()
  @Type(() => RichResponse)
  richResponse: RichResponse;

  @IsOptional()
  @IsArray()
  @ValidateNested({
    each: true,
  })
  @Type(() => SimpleResponse)
  noInputPrompts?: SimpleResponse[];
}
