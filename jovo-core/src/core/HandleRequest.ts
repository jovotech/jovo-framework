import { BaseApp, Host, Jovo } from '..';

export class HandleRequest {
  app: BaseApp;
  host: Host;
  jovo?: Jovo;
  error?: Error;
  // tslint:disable-next-line:no-any
  $data?: any;
  // tslint:disable-next-line:no-any
  platformClazz?: any;
  excludedMiddlewareNames?: string[];

  constructor(app: BaseApp, host: Host, jovo?: Jovo) {
    this.app = app;
    this.host = host;
    this.jovo = jovo;
  }

  stopMiddlewareExecution() {
    this.excludedMiddlewareNames = [
      'setup',
      'request',
      'platform.init',
      'asr',
      'platform.nlu',
      'nlu',
      'user.load',
      'router',
      'handler',
      'user.save',
      'tts',
      'platform.output',
      'response',
      'fail',
    ];
  }
}
