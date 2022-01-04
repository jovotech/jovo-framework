import { Jovo } from './Jovo';

export enum Capability {
  Screen = 'SCREEN',
  Audio = 'AUDIO',
  LongformAudio = 'LONGFORM_AUDIO',
  Video = 'VIDEO',
}

export type CapabilityType = Capability | `${Capability}` | string;

export type JovoDeviceConstructor<JOVO extends Jovo> = new (jovo: JOVO) => JOVO['$device'];

export abstract class JovoDevice<
  JOVO extends Jovo = Jovo,
  CAPABILITY extends CapabilityType = CapabilityType,
> {
  capabilities: CAPABILITY[];

  public constructor(readonly jovo: JOVO) {
    this.capabilities = (jovo.$request.getDeviceCapabilities() as CAPABILITY[]) || [];
  }

  supports(capability: CAPABILITY): boolean {
    return this.capabilities.includes(capability);
  }

  toJSON(): JovoDevice<JOVO> {
    return { ...this, jovo: undefined };
  }
}
