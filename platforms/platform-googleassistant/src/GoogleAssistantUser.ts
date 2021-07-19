import { JovoUser } from '@jovotech/framework';
import { GoogleAssistantResponse } from '@jovotech/output-googleassistant';
import { GoogleAssistant } from './GoogleAssistant';
import { GoogleAssistantRequest } from './GoogleAssistantRequest';

export class GoogleAssistantUser extends JovoUser<
  GoogleAssistantRequest,
  GoogleAssistantResponse,
  GoogleAssistant
> {
  get id(): string {
    return (
      (this.jovo.$request.user?.params as Record<'userId' | string, string> | undefined)?.userId ||
      'GoogleAssistantUser'
    );
  }
}
