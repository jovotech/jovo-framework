import { Jovo } from 'jovo-core';
import _get = require('lodash.get');
import { DialogflowUser } from '../../DialogflowUser';

export class GenesysUser extends DialogflowUser {
  constructor(jovo: Jovo) {
    super(jovo);
  }

  getAccessToken(): string | undefined {
    return undefined;
  }

  getId(): string {
    // the original Payload does not come with a id like Caller-ID.
    // TODO: A call to the Genesys API can get us caller ID
    // purecloud-platform-client-v2.ConversationsApi.getAnalyticsConversationDetails(conversationId);
    // ani: response.participants[0].sessions[0].ani
    return "GenericGenesysUser"
  }

  getNoInputLimit(): number | undefined {
    return _get(this.jovo.$request, 'originalDetectIntentRequest.payload.Genesys-No-Input-Limit');
  }

  getConversationId(): number | undefined {
    return _get(this.jovo.$request, 'originalDetectIntentRequest.payload.Genesys-Conversation-Id');
  }

  getNoInputCount(): number | undefined {
    return _get(this.jovo.$request, 'originalDetectIntentRequest.payload.Genesys-No-Input-Count');
  }
}
