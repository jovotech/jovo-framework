import { JovoUser } from '@jovotech/core';
import { AlexaResponse } from '@jovotech/output-alexa';
import { AlexaRequest } from './AlexaRequest';
import { AlexaSkill } from './AlexaSkill';

export class AlexaUser extends JovoUser<AlexaRequest, AlexaResponse> {
  constructor(jovo: AlexaSkill) {
    super(jovo);
  }
}
