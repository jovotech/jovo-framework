import { JovoRequest } from './JovoRequest';
import { JovoResponse } from '@jovotech/output';

import { Jovo } from './Jovo';

export type Capability = 'screen' | 'audio' | 'long-form-audio' | string;

export type JovoDeviceConstructor<
  REQUEST extends JovoRequest,
  RESPONSE extends JovoResponse,
  JOVO extends Jovo<REQUEST, RESPONSE>,
  CAPABILITY extends Capability = Capability,
> = new (jovo: JOVO) => JovoDevice<REQUEST, RESPONSE, JOVO, CAPABILITY>;

export abstract class JovoDevice<
  REQUEST extends JovoRequest,
  RESPONSE extends JovoResponse,
  JOVO extends Jovo<REQUEST, RESPONSE>,
  CAPABILITY extends Capability = Capability,
> {
  capabilities: CAPABILITY[] = [];

  public constructor(readonly jovo: JOVO) {
    this.setCapabilitiesFromRequest();
  }

  protected abstract setCapabilitiesFromRequest(): void;

  // TODO: AND or OR ? currently OR
  supports(capability: CAPABILITY | CAPABILITY[]): boolean {
    if (Array.isArray(capability)) {
      for (let i = 0; i < capability.length; i++) {
        const item = capability[i];
        if (this.capabilities.includes(item)) {
          return true;
        }
      }
      return false;
    } else {
      return this.capabilities.includes(capability);
    }
  }

  addCapability(...capability: CAPABILITY[]): void {
    this.capabilities = this.capabilities.concat(capability);
  }
}
