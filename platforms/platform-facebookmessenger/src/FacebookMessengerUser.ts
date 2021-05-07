import { JovoUser } from '@jovotech/framework';
import { FacebookMessengerResponse } from '@jovotech/output-facebookmessenger';
import { FacebookMessengerRequest } from './FacebookMessengerRequest';
import { MessengerBot } from './MessengerBot';

export class FacebookMessengerUser extends JovoUser<
  FacebookMessengerRequest,
  FacebookMessengerResponse,
  MessengerBot
> {
  get id(): string {
    return this.jovo.$request.messaging?.[0]?.sender?.id || 'FacebookMessengerUser';
  }
}
