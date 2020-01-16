import { JovoResponse, SessionConstants, SessionData } from 'jovo-core';
import _get = require('lodash.get');
import _set = require('lodash.set');

// tslint:disable-next-line:no-any
export type Data = Record<string, any>;

export enum ActionType {
  Speech = 'SPEECH',
  Audio = 'AUDIO',
  Visual = 'VISUAL',
  Processing = 'PROCESSING',
  Custom = 'CUSTOM',
  SequenceContainer = 'SEQ_CONTAINER',
  ParallelContainer = 'PAR_CONTAINER',
  QuickReply = 'QUICK_REPLY',
}

export interface BaseAction {
  name?: string;
  type: ActionType;
  delay?: number;
  payload?: Data;
  [key: string]: any; // tslint:disable-line:no-any
}

export type Action =
  | SequentialAction
  | ParallelAction
  | Reprompt
  | SpeechAction
  | AudioAction
  | VisualAction
  | ProcessingAction
  | QuickReplyAction;

export interface SequentialAction extends BaseAction {
  actions: BaseAction[];
}

export interface ParallelAction extends BaseAction {
  actions: BaseAction[];
}

export interface Reprompt extends SequentialAction {}

export interface SpeechAction extends BaseAction {
  ssml?: string;
  plain?: string;
  displayText?: string;
}

export interface AudioTrack {
  id: string;
  url: string;
  offsetInMs?: number;
  durationInMs?: number;
  metaData?: {
    title?: string;
    description?: string;
    coverImageUrl?: string;
    backgroundImageUrl?: string;
  };
}
export interface AudioAction extends BaseAction {
  tracks: AudioTrack[];
}

export type VisualActionType = 'BASIC_CARD' | 'IMAGE_CARD' | '';

export interface VisualAction extends BaseAction {
  visualType: VisualActionType;
}

export interface VisualActionBasicCard extends VisualAction {
  title: string;
  body: string;
}

export interface VisualActionImageCard extends VisualAction {
  title?: string;
  body?: string;
  imageUrl: string;
}

export type ProcessingActionType = 'HIDDEN' | 'TYPING' | 'SPINNER';
export interface ProcessingAction {
  processingType: ProcessingActionType;
  durationInMs: number;
  text?: string;
}

export interface QuickReply {
  id: string;
  label: string;
  url?: string;
  value: any; // tslint:disable-line:no-any
}
export interface QuickReplyAction extends BaseAction {
  replies: QuickReply[];
}

export interface Response {
  version: string;
  actions: Action[];
  reprompts?: Reprompt[];
  user?: {
    data: Data;
  };
  session?: {
    end: boolean;
    data: Data;
  };
  context?: {};
}

export interface CorePlatformResponseJSON extends Response {}

// TODO fully implement methods.
export class CorePlatformResponse implements JovoResponse {
  // reviver can be passed as the second parameter to JSON.parse
  // to automatically call User.fromJSON on the resulting value.
  // tslint:disable-next-line:no-any
  static reviver(key: string, value: any): any {
    // tslint:disable-line
    return key === '' ? CorePlatformResponse.fromJSON(value) : value;
  }

  // fromJSON is used to convert an serialized version
  // of the User to an instance of the class
  static fromJSON(json: CorePlatformResponseJSON | string): CorePlatformResponse {
    // if it's a string, parse it first
    if (typeof json === 'string') {
      return JSON.parse(json, CorePlatformResponse.reviver);
    } else {
      const response = Object.create(CorePlatformResponse.prototype);
      return Object.assign(response, json);
    }
  }

  version: string;
  actions: Action[];
  reprompts: Reprompt[];
  user: {
    data: Data;
  };
  session: {
    end: boolean;
    data: Data;
  };
  context?: {};

  constructor() {
    this.version = '0.0.1';
    this.actions = [];
    this.reprompts = [];
    this.user = {
      data: {},
    };
    this.session = {
      data: {},
      end: false,
    };
  }

  getReprompt(): string | undefined {
    return JSON.stringify(this.reprompts);
  }

  getRepromptPlain(): string | undefined {
    return this.getReprompt();
  }

  getSessionAttributes(): SessionData | undefined {
    return this.session.data;
  }

  getSessionData(): SessionData | undefined {
    return this.getSessionAttributes();
  }

  getSpeech(): string | undefined {
    return JSON.stringify(this.actions);
  }

  getSpeechPlain(): string | undefined {
    return this.getSpeech();
  }

  // tslint:disable-next-line:no-any
  hasSessionAttribute(name: string, value?: any): boolean {
    return typeof value === 'undefined'
      ? this.getSessionAttribute(name)
      : this.getSessionAttribute(name) === value;
  }

  // tslint:disable-next-line:no-any
  hasSessionData(name: string, value?: any): boolean {
    return this.hasSessionAttribute(name, value);
  }

  hasSessionEnded(): boolean {
    return _get(this, 'session.end', false);
  }

  hasState(state: string): boolean | undefined {
    return this.hasSessionAttribute(SessionConstants.STATE, state);
  }

  isAsk(speechText?: string | string[], repromptText?: string | string[]): boolean {
    return false;
  }

  isTell(speechText?: string | string[]): boolean {
    return false;
  }

  setSessionAttributes(sessionAttributes: SessionData): this {
    _set(this, `session.data`, sessionAttributes);
    return this;
  }

  setSessionData(sessionData: SessionData): this {
    return this.setSessionAttributes(sessionData);
  }

  getSessionAttribute(name: string) {
    return _get(this, `session.data.${name}`);
  }
}
