import { DefaultInputMode, JovoWebClient } from '../JovoWebClient';
import { DeepPartial } from '../types';
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
  client: 'jovo-platform-core' | 'jovo-platform-web' | string;
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

export type InitConfig = DeepPartial<Config> & { defaultInputType?: DefaultInputMode };
