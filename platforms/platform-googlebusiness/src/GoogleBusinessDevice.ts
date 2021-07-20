import { GoogleBusinessResponse } from '@jovotech/output-googlebusiness';

import { Capability, JovoDevice } from '@jovotech/framework';
import { GoogleBusinessBot } from './GoogleBusinessBot';
import { GoogleBusinessRequest } from './GoogleBusinessRequest';

export type GoogleBusinessCapability = Capability;

export class GoogleBusinessDevice extends JovoDevice<
  GoogleBusinessRequest,
  GoogleBusinessResponse,
  GoogleBusinessBot,
  GoogleBusinessCapability
> {
  constructor(jovo: GoogleBusinessBot) {
    super(jovo);

    this.applyDataFromRequest();
  }

  applyDataFromRequest(): void {
    // needs to be implemented
  }
}
