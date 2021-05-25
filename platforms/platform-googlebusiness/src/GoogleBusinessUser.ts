import { JovoUser } from '@jovotech/framework';
import { GoogleBusinessResponse } from '@jovotech/output-googlebusiness';
import { GoogleBusinessBot } from './GoogleBusinessBot';
import { GoogleBusinessRequest } from './GoogleBusinessRequest';

export class GoogleBusinessUser extends JovoUser<
  GoogleBusinessRequest,
  GoogleBusinessResponse,
  GoogleBusinessBot
> {
  get id(): string {
    return this.jovo.$request.conversationId || 'GoogleBusinessUser';
  }
}
