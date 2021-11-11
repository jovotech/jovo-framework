import { JovoUser } from '@jovotech/framework';
import { GoogleBusiness } from './GoogleBusiness';

export class GoogleBusinessUser extends JovoUser<GoogleBusiness> {
  get id(): string | undefined {
    return this.jovo.$request.conversationId;
  }
}
