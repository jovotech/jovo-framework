import { Jovo } from '@jovotech/framework';
import { GoogleAssistantResponse } from '@jovotech/output-googleassistant';
import { GoogleAssistantDevice } from './GoogleAssistantDevice';
import { GoogleAssistantPlatform } from './GoogleAssistantPlatform';
import { GoogleAssistantRequest } from './GoogleAssistantRequest';
import { GoogleAssistantUser } from './GoogleAssistantUser';

export class GoogleAssistant extends Jovo<
  GoogleAssistantRequest,
  GoogleAssistantResponse,
  GoogleAssistant,
  GoogleAssistantUser,
  GoogleAssistantDevice,
  GoogleAssistantPlatform
> {}
