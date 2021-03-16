import { PlatformOutputTemplate, Type } from '@jovotech/output';
import { GoogleAssistantOutputResponse } from './GoogleAssistantOutputResponse';

export class GoogleAssistantOutput extends PlatformOutputTemplate<GoogleAssistantOutputResponse> {
  @Type(() => GoogleAssistantOutputResponse)
  nativeResponse?: GoogleAssistantOutputResponse;
}
