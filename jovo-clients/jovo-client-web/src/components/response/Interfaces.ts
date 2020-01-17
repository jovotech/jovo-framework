import { IAdaptiveCard } from 'adaptivecards';

export interface Action {
  key: string;
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

export interface WebAssistantResponse {
  version: string;
  response: Response;
  sessionData?: Record<string, any>;
  userData?: Record<string, any>;
}
