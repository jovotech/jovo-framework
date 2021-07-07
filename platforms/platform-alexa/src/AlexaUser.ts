import { JovoUser } from '@jovotech/framework';
import { AlexaResponse } from '@jovotech/output-alexa';

import { AlexaRequest } from './AlexaRequest';
import { AlexaSkill } from './AlexaSkill';

export class AlexaUser extends JovoUser<AlexaRequest, AlexaResponse, AlexaSkill> {
  constructor(jovo: AlexaSkill) {
    super(jovo);
  }

  get id(): string {
    return this.jovo?.$request?.session?.user?.userId || 'AlexaUser';
  }
}
