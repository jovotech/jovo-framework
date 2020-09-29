import { Jovo } from 'jovo-core';
import _get = require('lodash.get');
import { DialogflowUser } from '../../DialogflowUser';

export class DialogflowPhoneGatewayUser extends DialogflowUser {
  constructor(jovo: Jovo) {
    super(jovo);
  }

  getAccessToken(): string | undefined {
    return undefined;
  }

  getId(): string {
    // Use the incoming phone number as the User ID.  For Dialogflow Phone Gateway free tier, this will always be "REDACTED_IN_STANDARD_TIER_AGENT"
    return _get(this.jovo.$request, 'originalDetectIntentRequest.payload.telephony.caller_id');
  }
}
