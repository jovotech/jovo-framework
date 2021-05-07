import { Jovo } from '@jovotech/framework';
import { GoogleAssistantResponse } from '@jovotech/output-googleassistant';
import { GoogleAssistantRequest } from './GoogleAssistantRequest';

export class GoogleAction extends Jovo<GoogleAssistantRequest, GoogleAssistantResponse> {
  isNewSession(): boolean {
    return !this.$request.session?.params;
  }
}
