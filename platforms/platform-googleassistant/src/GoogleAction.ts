import { Jovo } from '@jovotech/framework';
import { GoogleAssistantResponse } from '@jovotech/output-googleassistant';
import { GoogleAssistantRequest } from './GoogleAssistantRequest';

export class GoogleAction extends Jovo<GoogleAssistantRequest, GoogleAssistantResponse> {
  hasScreenInterface(): boolean {
    return !!this.$request.device?.capabilities?.some(
      (capability) => capability === 'RICH_RESPONSE',
    );
  }
}
