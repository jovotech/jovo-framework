import { Capability, JovoSession, UnknownObject } from '@jovotech/framework';

export interface Intent {
  name: string;
  confidence?: number;
}

export interface RequestAudioData {
  sampleRate: number;
  b64string: string;
  /** Required by all plugins that do ASR. */
  data?: Float32Array;
}

export interface Session
  extends Pick<JovoSession, 'id' | 'data' | 'state' | 'isNew' | 'updatedAt'>,
    UnknownObject {}

export interface User {
  id: string;
  data?: UnknownObject;
}

export interface Device {
  id: string;
  capabilities: Array<Capability | string>;
}

export interface Context {
  device: Device;
  session: Session;
  user: User;
}
