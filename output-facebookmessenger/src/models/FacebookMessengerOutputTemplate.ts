import { PlatformOutputTemplate, Type } from '@jovotech/output';
import { FacebookMessengerOutputTemplateResponse } from './FacebookMessengerOutputTemplateResponse';

export class FacebookMessengerOutputTemplate extends PlatformOutputTemplate<FacebookMessengerOutputTemplateResponse> {
  @Type(() => FacebookMessengerOutputTemplateResponse)
  nativeResponse?: FacebookMessengerOutputTemplateResponse;
}
