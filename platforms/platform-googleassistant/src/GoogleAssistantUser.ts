import { JovoUser } from '@jovotech/framework';
import { GoogleAssistant } from './GoogleAssistant';

export class GoogleAssistantUser extends JovoUser<GoogleAssistant> {
  get id(): string {
    return (
      (this.jovo.$request.user?.params as Record<'userId' | string, string> | undefined)?.userId ||
      'GoogleAssistantUser'
    );
  }
}
