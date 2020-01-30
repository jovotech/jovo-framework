import { JovoWebClient } from '../JovoWebClient';
import { Component } from './Component';

// tslint:disable-next-line:no-any
export type Data = Record<string, any>;

export interface UserData {
  id: string;
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

export interface JovoWebClientConfig {
  debugMode: boolean;
  locale: string;
  launchFirst: boolean;
  speechSynthesis: {
    automaticallySetLanguage: boolean;
  };
  initBaseComponents: boolean;
}

export type Config = JovoWebClientConfig & Data;
