import { PlatformOutputTemplate, Type } from '@jovotech/output';
import { GoogleAssistantResponse } from './GoogleAssistantResponse';

export class GoogleAssistantOutput extends PlatformOutputTemplate<GoogleAssistantResponse> {
  @Type(() => GoogleAssistantResponse)
  nativeResponse?: GoogleAssistantResponse;
}
