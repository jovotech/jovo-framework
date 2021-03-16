import { PlatformOutput, Type } from '@jovotech/output';
import { GoogleAssistantOutputResponse } from './GoogleAssistantOutputResponse';

export class GoogleAssistantOutput extends PlatformOutput<GoogleAssistantOutputResponse> {
  @Type(() => GoogleAssistantOutputResponse)
  nativeResponse?: GoogleAssistantOutputResponse;
}
