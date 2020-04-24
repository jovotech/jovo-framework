import { ExpressJS, JovoRequest } from 'jovo-framework';

export class LindenbaumExpressJS extends ExpressJS {
  static dummyLaunchRequest(request: JovoRequest): ExpressJS {
    const express = super.dummyRequest(request);
    express.headers['webhook_path'] = '/session';
    return express;
  }

  static dummyIntentRequest(request: JovoRequest): ExpressJS {
    const express = super.dummyRequest(request);
    express.headers['webhook_path'] = '/message';
    return express;
  }

  static dummyEndRequest(request: JovoRequest): ExpressJS {
    const express = super.dummyRequest(request);
    express.headers['webhook_path'] = '/terminated';
    return express;
  }
}
