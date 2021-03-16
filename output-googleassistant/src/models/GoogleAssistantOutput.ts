import { PlatformOutput, Type } from '@jovotech/output';
import { GoogleAssistantResponse } from './GoogleAssistantResponse';

export class GoogleAssistantOutput extends PlatformOutput<GoogleAssistantResponse> {
  @Type(() => GoogleAssistantResponse)
  nativeResponse?: GoogleAssistantResponse;
}
