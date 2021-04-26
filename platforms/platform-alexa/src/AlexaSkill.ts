import { Jovo } from '@jovotech/core';
import { AlexaResponse } from '@jovotech/output-alexa';
import { AlexaRequest } from './AlexaRequest';

export class AlexaSkill extends Jovo<AlexaRequest, AlexaResponse> {
  isNewSession(): boolean {
    return !!this.$request.session?.new;
  }
}
