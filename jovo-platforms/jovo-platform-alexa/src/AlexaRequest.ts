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
    const requestTypeMap: Record<string, JovoRequestType> = {
      'LaunchRequest': { type: RequestType.Launch },
      'IntentRequest': { type: RequestType.Intent },
      'SessionEndedRequest': { type: RequestType.End, subType: this.request?.reason },
      'System.ExceptionEncountered': { type: RequestType.OnError },
    };
    return this.request?.type ? requestTypeMap[this.request?.type] : undefined;
  }
}
