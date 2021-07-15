import { JovoUser } from '@jovotech/framework';
import { FacebookMessengerResponse } from '@jovotech/output-facebookmessenger';
import { FacebookMessenger } from './FacebookMessenger';
import { FacebookMessengerRequest } from './FacebookMessengerRequest';

export class FacebookMessengerUser extends JovoUser<
  FacebookMessengerRequest,
  FacebookMessengerResponse,
  FacebookMessenger
> {
  get id(): string {
    return this.jovo.$request.messaging?.[0]?.sender?.id || 'FacebookMessengerUser';
  }
}
