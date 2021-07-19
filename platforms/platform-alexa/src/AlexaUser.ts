import { JovoUser } from '@jovotech/framework';
import { AlexaResponse } from '@jovotech/output-alexa';

import { AlexaRequest } from './AlexaRequest';
import { Alexa } from './Alexa';

export class AlexaUser extends JovoUser<AlexaRequest, AlexaResponse, Alexa> {
  constructor(jovo: Alexa) {
    super(jovo);
  }

  get id(): string {
    return this.jovo.$request.session?.user?.userId || 'AlexaUser';
  }
}
