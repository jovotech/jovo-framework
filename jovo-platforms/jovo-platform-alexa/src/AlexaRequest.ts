import { JovoRequest, JovoRequestType, RequestType } from 'jovo-core';
import { Context, Request, Session } from './interfaces';

export interface AlexaRequestJSON {
  version?: string;
  context?: Context;
  session?: Session;
  request?: Request;
}

export class AlexaRequest extends JovoRequest implements AlexaRequestJSON {
  version?: string;
  context?: Context;
  session?: Session;
  request?: Request;

  getRequestType(): JovoRequestType | undefined {
    switch (this.request?.type) {
      case 'LaunchRequest': {
        return { type: RequestType.Launch };
      }
      case 'IntentRequest': {
        return { type: RequestType.Intent };
      }
      case 'SessionEndedRequest': {
        return { type: RequestType.End, subType: this.request?.reason };
      }
      case 'System.ExceptionEncountered': {
        return { type: RequestType.OnError };
      }
      default: {
        return;
      }
    }
  }
}
