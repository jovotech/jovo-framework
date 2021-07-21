import { JovoUser } from '@jovotech/framework';
import { FacebookMessengerResponse } from '@jovotech/output-facebookmessenger';
import { FacebookMessengerRequest } from './FacebookMessengerRequest';
import { FacebookMessenger } from './FacebookMessenger';

export class FacebookMessengerUser extends JovoUser<
  FacebookMessengerRequest,
  FacebookMessengerResponse,
  FacebookMessenger
> {
  get id(): string {
    return this.jovo.$request.messaging?.[0]?.sender?.id || 'FacebookMessengerUser';
  }
}
