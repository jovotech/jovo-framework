import { Capability, JovoSession } from '@jovotech/framework';
import { UnknownObject } from '@jovotech/common';

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

export interface Session {
  id: string;
  new: boolean;
  data?: JovoSession;
  lastUpdatedAt?: string; // ISO 8601 YYYY-MM-DDTHH:mm:ss.sssZ
}

export interface User {
  id: string;
  data?: UnknownObject;
}

export interface Device {
  capabilities: Array<Capability | string>;
}

export interface Context {
  device: Device;
  session: Session;
  user: User;
}
