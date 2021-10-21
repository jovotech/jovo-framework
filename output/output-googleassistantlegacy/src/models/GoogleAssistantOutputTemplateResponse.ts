import { IsArray, IsBoolean, IsOptional, Type, ValidateNested } from '@jovotech/output';
import { SystemIntent } from './common/SystemIntent';
import { GoogleAssistantResponse } from './GoogleAssistantResponse';
import { OutputRichResponse } from './OutputRichResponse';
import { SimpleResponse } from './simple-response/SimpleResponse';

type PartialGoogleAssistantResponse = Partial<Omit<GoogleAssistantResponse, 'richResponse'>> & {
  richResponse?: OutputRichResponse;
};

export class GoogleAssistantOutputTemplateResponse implements PartialGoogleAssistantResponse {
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
