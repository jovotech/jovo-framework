import { PlatformOutputTemplate, Type } from '@jovotech/output';
import { GoogleAssistantResponse } from './GoogleAssistantResponse';

export class GoogleAssistantOutputTemplate extends PlatformOutputTemplate<GoogleAssistantResponse> {
  @Type(() => GoogleAssistantResponse)
  nativeResponse?: GoogleAssistantResponse;
}
