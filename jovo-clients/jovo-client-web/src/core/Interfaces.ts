import { DefaultInputMode, JovoWebClient } from '../JovoWebClient';
import { Component } from './Component';

// tslint:disable-next-line:no-any
export type Data = Record<string, any>;

export interface UserData {
  id: string;
  accessToken?: string;
  data: Data;
}

export interface SessionData {
  id: string;
  data: Data;
  new: boolean;
}

export interface AudioPlayback {
  audio: HTMLAudioElement;
  stopped?: boolean;
  id: number;
}

export interface ComponentConfig {}

export type ComponentConstructor = new (
  $client: JovoWebClient,
  $initConfig?: ComponentConfig,
) => Component;

export interface Config {
  debugMode: boolean;
  locale: string;
  launchFirst: boolean;
  audioPlayer: {
    enabled: boolean;
  };
  speechSynthesis: {
    enabled: boolean;
    automaticallySetLanguage: boolean;
  };
  initBaseComponents: boolean;
  [key: string]: any;
}

export type DeepPartial<T> = T extends object ? { [K in keyof T]?: DeepPartial<T[K]> } : T;
export type InitConfig = DeepPartial<Config> & { defaultInputType?: DefaultInputMode };
