import { IAdaptiveCard } from 'adaptivecards';

export interface Action {
  key: string;
  // tslint:disable-next-line:no-any
  value: any;
}

export interface Output {
  text: string;
  ssml: string;
}

export interface Card extends IAdaptiveCard {}

interface Response {
  shouldEndSession: boolean;
  output: {
    speech?: Output;
    reprompt?: Output;
    actions?: Action[];
    card?: IAdaptiveCard;
    suggestionChips?: string[];
  };
  inputText?: string;
}

export interface AssistantResponse {
  version: string;
  response: Response;
  // tslint:disable-next-line:no-any
  sessionData?: Record<string, any>;
  // tslint:disable-next-line:no-any
  userData?: Record<string, any>;
}
