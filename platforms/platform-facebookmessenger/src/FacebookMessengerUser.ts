import { JovoUser } from '@jovotech/framework';
import { FacebookMessenger } from './FacebookMessenger';

export class FacebookMessengerUser extends JovoUser<FacebookMessenger> {
  get id(): string | undefined {
    return this.jovo.$request.messaging?.[0]?.sender?.id;
  }
}
