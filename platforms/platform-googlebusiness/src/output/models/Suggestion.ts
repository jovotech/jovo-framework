import { QuickReplyValue, Type } from '@jovotech/output';
import { IsValidSuggestionObject } from '../decorators/validation/IsValidSuggestionObject';
import { AuthenticationRequest } from './suggestion/AuthenticationRequest';
import { LiveAgentRequest } from './suggestion/LiveAgentRequest';
import { SuggestedAction } from './suggestion/SuggestedAction';
import { SuggestedReply } from './suggestion/SuggestedReply';

export class Suggestion {
  @IsValidSuggestionObject()
  @Type(() => SuggestedReply)
  reply?: SuggestedReply;

  @IsValidSuggestionObject()
  @Type(() => SuggestedAction)
  action?: SuggestedAction;

  @IsValidSuggestionObject()
  @Type(() => LiveAgentRequest)
  liveAgentRequest?: LiveAgentRequest;

  @IsValidSuggestionObject()
  @Type(() => AuthenticationRequest)
  authenticationRequest?: AuthenticationRequest;

  toQuickReply?(): QuickReplyValue {
    return {
      text: this.reply?.text || this.action?.text || '',
      value: this.reply?.postbackData || this.action?.postbackData,
    };
  }
}
