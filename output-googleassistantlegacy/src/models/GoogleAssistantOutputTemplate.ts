import { PlatformOutputTemplate, Type } from '@jovotech/output';
import { GoogleAssistantOutputTemplateResponse } from './GoogleAssistantOutputTemplateResponse';

export class GoogleAssistantOutputTemplate extends PlatformOutputTemplate<GoogleAssistantOutputTemplateResponse> {
  @Type(() => GoogleAssistantOutputTemplateResponse)
  nativeResponse?: GoogleAssistantOutputTemplateResponse;
}
