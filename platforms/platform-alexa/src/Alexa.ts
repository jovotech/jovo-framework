import { Jovo } from '@jovotech/framework';
import { AlexaResponse } from '@jovotech/output-alexa';
import { AlexaRequest } from './AlexaRequest';

export class Alexa extends Jovo<AlexaRequest, AlexaResponse> {
  getSkillId(): string | undefined {
    return (
      this.$request.session?.application?.applicationId ||
      this.$request.context?.System?.application?.applicationId
    );
  }
}
