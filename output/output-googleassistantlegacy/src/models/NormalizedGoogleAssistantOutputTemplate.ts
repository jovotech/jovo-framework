import { NormalizedPlatformOutputTemplate, Type } from '@jovotech/output';
import { GoogleAssistantOutputTemplateResponse } from './GoogleAssistantOutputTemplateResponse';

export class NormalizedGoogleAssistantOutputTemplate extends NormalizedPlatformOutputTemplate<GoogleAssistantOutputTemplateResponse> {
  @Type(() => GoogleAssistantOutputTemplateResponse)
  nativeResponse?: GoogleAssistantOutputTemplateResponse;
}
