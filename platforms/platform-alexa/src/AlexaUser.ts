import { JovoUser } from '@jovotech/framework';
import { AlexaResponse } from '@jovotech/output-alexa';

import { AlexaRequest } from './AlexaRequest';
import { AlexaSkill } from './AlexaSkill';
import { ProfileProperty, requestContactApi } from './utilities';

export class AlexaUser extends JovoUser<AlexaRequest, AlexaResponse, AlexaSkill> {
  constructor(jovo: AlexaSkill) {
    super(jovo);
  }

  get id(): string {
    return this.jovo.$request.session?.user?.userId || 'AlexaUser';
  }

  async getEmail(): Promise<string> {
    const request: AlexaRequest = this.jovo.$request;
    return await requestContactApi(
      ProfileProperty.EMAIL,
      request.getApiEndpoint(),
      request.getApiAccessToken(),
    );
  }
}
