import { IsArray, IsBoolean, IsOptional, Type, ValidateNested } from '@jovotech/output';
import { GoogleAssistantLegacyResponse } from '../../GoogleAssistantLegacyResponse';
import { SystemIntent } from './common/SystemIntent';
import { OutputRichResponse } from './OutputRichResponse';
import { SimpleResponse } from './simple-response/SimpleResponse';

type PartialGoogleAssistantResponse = Partial<
  Omit<GoogleAssistantLegacyResponse, 'richResponse'>
> & {
  richResponse?: OutputRichResponse;
};

export class LegacyGoogleAssistantOutputTemplateResponse implements PartialGoogleAssistantResponse {
  [key: string]: unknown;

  @IsOptional()
  @IsBoolean()
  expectUserResponse?: boolean;

  @IsOptional()
  @ValidateNested()
  @Type(() => SystemIntent)
  systemIntent?: SystemIntent;

  @IsOptional()
  @ValidateNested()
  @Type(() => OutputRichResponse)
  richResponse?: OutputRichResponse;

  @IsOptional()
  @IsArray()
  @ValidateNested({
    each: true,
  })
  @Type(() => SimpleResponse)
  noInputPrompts?: SimpleResponse[];
}
