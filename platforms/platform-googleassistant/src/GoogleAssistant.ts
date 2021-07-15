import { Jovo } from '@jovotech/framework';
import { GoogleAssistantResponse } from '@jovotech/output-googleassistant';
import { GoogleAssistantRequest } from './GoogleAssistantRequest';

export class GoogleAssistant extends Jovo<GoogleAssistantRequest, GoogleAssistantResponse> {}
