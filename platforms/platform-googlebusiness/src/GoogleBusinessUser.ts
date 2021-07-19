import { JovoUser } from '@jovotech/framework';
import { GoogleBusinessResponse } from '@jovotech/output-googlebusiness';
import { GoogleBusiness } from './GoogleBusiness';
import { GoogleBusinessRequest } from './GoogleBusinessRequest';

export class GoogleBusinessUser extends JovoUser<
  GoogleBusinessRequest,
  GoogleBusinessResponse,
  GoogleBusiness
> {
  get id(): string {
    return this.jovo.$request.conversationId || 'GoogleBusinessUser';
  }
}
