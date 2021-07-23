import { JovoRequest } from './JovoRequest';
import { JovoResponse } from '@jovotech/output';

import { Jovo } from './Jovo';

export type Capability = 'screen' | 'audio' | 'long-form-audio' | string;

export type JovoDeviceConstructor<
  REQUEST extends JovoRequest,
  RESPONSE extends JovoResponse,
  JOVO extends Jovo<REQUEST, RESPONSE>,
  CAPABILITY extends Capability = Capability
> = new (jovo: JOVO) => JovoDevice<REQUEST, RESPONSE, JOVO, CAPABILITY>;

export abstract class JovoDevice<
  REQUEST extends JovoRequest,
  RESPONSE extends JovoResponse,
  JOVO extends Jovo<REQUEST, RESPONSE>,
  CAPABILITY extends Capability = Capability
> {
  capabilities: CAPABILITY[] = [];

  public constructor(readonly jovo: JOVO) {
    this.setCapabilitiesFromRequest();
  }

  protected abstract setCapabilitiesFromRequest(): void;

  supports(capability: CAPABILITY): boolean {
    return this.capabilities.includes(capability);
  }

  addCapability(...capability: CAPABILITY[]): void {
    this.capabilities = this.capabilities.concat(capability);
  }

  toJSON(): JovoDevice<REQUEST, RESPONSE, JOVO> {
    return { ...this, jovo: undefined };
  }
}
