import {
  ExtensibleConfig,
  ActionSet,
  Platform,
  BaseApp,
  TestSuite,
  Jovo,
  JovoError,
  ErrorCode,
  HandleRequest,
} from 'jovo-core';
import _merge = require('lodash.merge');

import { AutopilotRequestBuilder } from './core/AutopilotRequestBuilder';
import { AutopilotResponseBuilder } from './core/AutopilotResponseBuilder';
import {} from 'module';
import { AutopilotBot } from './core/AutopilotBot';
import { AutopilotCore } from './modules/AutopilotCore';
import { AutopilotNLU } from './modules/AutopilotNLU';
import { AudioPlayerPlugin } from './modules/AudioPlayer';
import { Cards } from './modules/Cards';
import { AutopilotRequest } from './core/AutopilotRequest';
import { AutopilotResponse } from './core/AutopilotResponse';
import { AutopilotTestSuite } from './index';

export class Autopilot extends Platform<AutopilotRequest, AutopilotResponse> {
  constructor(config?: ExtensibleConfig) {
    super(config);

    if (config) {
      this.config = _merge(this.config, config);
    }

    this.actionSet = new ActionSet(
      [
        'setup',
        '$init',
        '$request',
        '$session',
        '$user',
        '$type',
        '$nlu',
        '$inputs',
        '$tts',
        '$output',
        '$response',
      ],
      this,
    );
  }

  getAppType(): string {
    return 'AutopilotBot';
  }

  install(app: BaseApp) {
    app.$platform.set(this.constructor.name, this);
    app.middleware('platform.init')!.use(this.initialize.bind(this));
    app.middleware('platform.nlu')!.use(this.nlu.bind(this));
    app.middleware('tts')!.use(this.tts.bind(this));
    app.middleware('before.user.save')!.use(this.saveSessionId.bind(this));
    app.middleware('platform.output')!.use(this.output.bind(this));
    app.middleware('response')!.use(this.response.bind(this));

    this.use(new AutopilotCore(), new AutopilotNLU(), new AudioPlayerPlugin(), new Cards());

    Jovo.prototype.$autopilotBot = undefined;
    Jovo.prototype.autopilotBot = function() {
      if (this.constructor.name !== 'AutopilotBot') {
        throw new JovoError(
          `Can't handle request. Please use this.isAutopilotBot()`,
          ErrorCode.ERR_PLUGIN,
          'jovo-platform-autopilot',
        );
      }
      return this as AutopilotBot;
    };
  }

  makeTestSuite(): AutopilotTestSuite {
    return new TestSuite(new AutopilotRequestBuilder(), new AutopilotResponseBuilder());
  }

  async initialize(handleRequest: HandleRequest) {
    handleRequest.platformClazz = Autopilot;
    await this.middleware('$init')!.run(handleRequest);

    if (handleRequest.jovo?.constructor.name !== 'AutopilotBot') {
      return Promise.resolve();
    }

    await this.middleware('$request')!.run(handleRequest.jovo);
    await this.middleware('$type')!.run(handleRequest.jovo);
    await this.middleware('$session')!.run(handleRequest.jovo);

    if (this.config.handlers) {
      handleRequest.app.config.handlers = _merge(
        handleRequest.app.config.handlers,
        this.config.handlers,
      );
    }
  }

  async nlu(handleRequest: HandleRequest) {
    if (handleRequest.jovo?.constructor.name !== 'AutopilotBot') {
      return Promise.resolve();
    }

    await this.middleware('$nlu')!.run(handleRequest.jovo);
    await this.middleware('$inputs')!.run(handleRequest.jovo);
  }

  async tts(handleRequest: HandleRequest) {
    if (handleRequest.jovo?.constructor.name !== 'AutopilotBot') {
      return Promise.resolve();
    }
    await this.middleware('$tts')!.run(handleRequest.jovo);
  }

  async saveSessionId(handleRequest: HandleRequest) {
    if (handleRequest.jovo?.constructor.name !== 'AutopilotBot') {
      return Promise.resolve();
    }

    // is undefined if no active DB
    if (handleRequest.jovo.$user.$session) {
      handleRequest.jovo.$user.$session.id = handleRequest.jovo.$request!.getSessionId();
    }
  }

  async output(handleRequest: HandleRequest) {
    if (handleRequest.jovo?.constructor.name !== 'AutopilotBot') {
      return Promise.resolve();
    }
    await this.middleware('$output')!.run(handleRequest.jovo);
  }

  async response(handleRequest: HandleRequest) {
    if (handleRequest.jovo?.constructor.name !== 'AutopilotBot') {
      return Promise.resolve();
    }
    await this.middleware('$response')!.run(handleRequest.jovo);

    await handleRequest.host.setResponse(handleRequest.jovo.$response);
  }
}
