import { JovoUser } from '@jovotech/framework';
import { Alexa } from './Alexa';

import { AlexaRequest } from './AlexaRequest';
import { ProfileProperty, sendCustomerProfileApiRequest } from './api';

export class AlexaUser extends JovoUser<Alexa> {
  constructor(jovo: Alexa) {
    super(jovo);
  }

  get id(): string {
    return this.jovo.$request.session?.user?.userId || 'AlexaUser';
  }

  async getEmail(): Promise<string | undefined> {
    const request: AlexaRequest = this.jovo.$request;
    const email: string = await sendCustomerProfileApiRequest(
      ProfileProperty.EMAIL,
      request.getApiEndpoint(),
      request.getApiAccessToken(),
    );
    return email;
  }
}
