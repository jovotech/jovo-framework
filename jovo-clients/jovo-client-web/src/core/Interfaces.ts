import { JovoWebClient } from '../JovoWebClient';
import { Component } from './Component';

export interface UserData {
  id: string;
  data: Record<string, any>;
}

export interface SessionData {
  id: string;
  data: Record<string, any>;
  new: boolean;
}

export interface AudioPlayback {
  audio: HTMLAudioElement;
  stopped?: boolean;
  id: number;
}

export interface ComponentOptions {}

export type ComponentConstructor = new ($client: JovoWebClient, $initOptions?: ComponentOptions) => Component;

export interface JovoWebClientOptions {
  debugMode: boolean;
  locale: string;
  launchFirst: boolean;
  speechSynthesis: {
    automaticallySetLanguage: boolean;
  };
  initBaseComponents: boolean;
}

export type Options = JovoWebClientOptions & Record<string, any>;
