import { PlatformOutputTemplate, Type } from '@jovotech/output';
import { FacebookMessengerOutputResponse } from './FacebookMessengerOutputResponse';

export class FacebookMessengerOutput extends PlatformOutputTemplate<FacebookMessengerOutputResponse> {
  @Type(() => FacebookMessengerOutputResponse)
  nativeResponse?: FacebookMessengerOutputResponse;
}
