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

export interface CoreRequestSession {
  id: string;
  new: boolean;
  data?: JovoSession;
  lastUpdatedAt?: string; // ISO 8601 YYYY-MM-DDTHH:mm:ss.sssZ
}

export interface CoreRequestUser {
  id: string;
  data?: UnknownObject;
}

export interface Device {
  capabilities: Array<Capability | string>;
}

export interface CoreRequestContext {
  device: Device;
  session: CoreRequestSession;
  user: CoreRequestUser;
}
