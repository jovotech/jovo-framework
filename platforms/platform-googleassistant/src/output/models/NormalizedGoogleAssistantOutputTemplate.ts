import { NormalizedPlatformOutputTemplate, Type } from '@jovotech/output';
import { GoogleAssistantResponse } from '../../GoogleAssistantResponse';

export class NormalizedGoogleAssistantOutputTemplate extends NormalizedPlatformOutputTemplate<GoogleAssistantResponse> {
  @Type(() => GoogleAssistantResponse)
  nativeResponse?: GoogleAssistantResponse;
}
