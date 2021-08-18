import {
  Capability,
  EntityMap,
  InputType,
  JovoSession,
  RequestTypeLike,
  UnknownObject,
} from '@jovotech/framework';

export interface Input<TYPE extends RequestTypeLike = RequestTypeLike> {
  type: InputType;
  text?: TYPE extends InputType.Text ? string : never;
  intent?: TYPE extends InputType.Intent ? Intent | string : never;
  entities?: TYPE extends InputType.Intent ? EntityMap : never;

  alternativeIntents?: TYPE extends InputType.Intent ? Array<Intent | string> : never;
  audio?: TYPE extends InputType.Speech ? RequestAudioData : never;
}

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
