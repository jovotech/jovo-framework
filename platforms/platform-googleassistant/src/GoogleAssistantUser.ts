import { JovoUser } from '@jovotech/framework';
import { GoogleAssistantResponse } from '@jovotech/output-googleassistant';
import { GoogleAction } from './GoogleAction';
import { GoogleAssistantRequest } from './GoogleAssistantRequest';

export class GoogleAssistantUser extends JovoUser<
  GoogleAssistantRequest,
  GoogleAssistantResponse,
  GoogleAction
> {
  get id(): string {
    return (
      (this.jovo.$request.user?.params as Record<'userId' | string, string> | undefined)?.userId ||
      'GoogleAssistantUser'
    );
  }
}
