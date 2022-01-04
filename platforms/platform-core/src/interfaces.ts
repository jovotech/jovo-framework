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

export interface CoreRequestSession
  extends Pick<JovoSession, 'id' | 'data' | 'state' | 'isNew' | 'updatedAt'>,
    UnknownObject {}

export interface CoreRequestUser {
  id: string;
  data?: UnknownObject;
}

export interface Device {
  id: string;
  capabilities: Array<Capability | string>;
}

export interface CoreRequestContext {
  device: Device;
  session: CoreRequestSession;
  user: CoreRequestUser;
}
