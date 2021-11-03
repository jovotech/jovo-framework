import { AsyncJovo, AxiosResponse } from '@jovotech/framework';
import { FacebookMessengerResponse } from '@jovotech/output-facebookmessenger';
import { FacebookMessengerDevice } from './FacebookMessengerDevice';
import { FacebookMessengerPlatform } from './FacebookMessengerPlatform';
import { FacebookMessengerRequest } from './FacebookMessengerRequest';
import { FacebookMessengerUser } from './FacebookMessengerUser';
import { SendMessageResult } from './interfaces';

export class FacebookMessenger extends AsyncJovo<
  FacebookMessengerRequest,
  FacebookMessengerResponse,
  FacebookMessenger,
  FacebookMessengerUser,
  FacebookMessengerDevice,
  FacebookMessengerPlatform
> {
  protected sendResponse(
    response: FacebookMessengerResponse,
  ): Promise<AxiosResponse<SendMessageResult>> {
    return this.$platform.sendData<SendMessageResult>(response);
  }
}
