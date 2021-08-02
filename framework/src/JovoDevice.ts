import { Jovo } from './Jovo';

export type Capability = 'screen' | 'audio' | 'long-form-audio' | string;

export type JovoDeviceConstructor<JOVO extends Jovo> = new (jovo: JOVO) => JOVO['$device'];

export abstract class JovoDevice<
  JOVO extends Jovo = Jovo,
  CAPABILITY extends Capability = Capability,
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

  toJSON(): JovoDevice<JOVO> {
    return { ...this, jovo: undefined };
  }
}
