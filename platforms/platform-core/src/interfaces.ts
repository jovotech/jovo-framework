import { Entity, JovoSession, RequestTypeLike, UnknownObject } from '@jovotech/framework';

export enum RequestType {
  Launch = 'LAUNCH',
  Intent = 'INTENT',
  TranscribedText = 'TRANSCRIBED_TEXT',
  Text = 'TEXT',
  Event = 'EVENT',
  Audio = 'AUDIO',
  End = 'END',
  Error = 'ERROR',
}

export enum DeviceType {
  Unspecified = 'UNSPECIFIED',
  Audio = 'AUDIO',
  Browser = 'BROWSER',
}

export enum Capability {
  Audio = 'AUDIO',
  Html = 'HTML',
  Text = 'TEXT',
}

export interface Request {
  id: string;
  timestamp: string;
  type: RequestTypeLike;
  body: RequestBody;
  locale?: string;
  nlu?: Nlu;
  data?: UnknownObject;
}

export interface Nlu {
  intent?: string;
  inputs?: Record<string, Entity>;
  confidence?: number;
}

export interface RequestAudioData {
  sampleRate: number;
  b64string: string;
  /** Required by all plugins that do ASR. */
  data?: Float32Array;
}

export interface RequestBodyAudio {
  audio?: RequestAudioData;
}

export interface RequestBodyText {
  text?: string;
}

export type RequestBody = RequestBodyAudio | RequestBodyText;

export interface Session {
  id: string;
  new: boolean;
  data?: JovoSession;
}

export interface User {
  id: string;
  accessToken?: string;
  data?: UnknownObject;
}

export interface Device {
  id?: string;
  type: DeviceType;
  capabilities: Record<Capability, string | boolean>;
}

export interface Context {
  appId?: string;
  platform?: string;
  device: Device;
  session: Session;
  user: User;
}
