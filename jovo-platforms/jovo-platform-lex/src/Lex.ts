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

import { LexRequestBuilder } from './core/LexRequestBuilder';
import { LexResponseBuilder } from './core/LexResponseBuilder';
import { LexBot } from './core/LexBot';
import { Cards } from './modules/Cards';
import { LexCore } from './modules/LexCore';
import { LexNLU } from './modules/LexNLU';
import { LexRequest } from './core/LexRequest';
import { LexResponse } from './core/LexResponse';
import { LexTestSuite } from './index';

export class Lex extends Platform<LexRequest, LexResponse> {
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
    return 'LexBot';
  }

  install(app: BaseApp) {
    app.$platform.set(this.constructor.name, this);
    app.middleware('setup')!.use(this.setup.bind(this));
    app.middleware('platform.init')!.use(this.initialize.bind(this));
    app.middleware('platform.nlu')!.use(this.nlu.bind(this));
    app.middleware('tts')!.use(this.tts.bind(this));
    app.middleware('platform.output')!.use(this.output.bind(this));
    app.middleware('response')!.use(this.response.bind(this));
    app.middleware('after.response')!.use(this.afterResponse.bind(this));

    this.use(new LexCore(), new LexNLU(), new Cards());

    Jovo.prototype.$lexBot = undefined;
    Jovo.prototype.lexBot = function () {
      if (this.constructor.name !== 'LexBot') {
        throw new JovoError(
          `Can't handle request. Please use this.isLexBot()`,
          ErrorCode.ERR_PLUGIN,
          'jovo-platform-lex',
        );
      }
      return this as LexBot;
    };

    Jovo.prototype.isLexBot = function () {
      return this.constructor.name === 'LexBot';
    };
  }

  makeTestSuite(): LexTestSuite {
    return new TestSuite(new LexRequestBuilder(), new LexResponseBuilder());
  }

  async initialize(handleRequest: HandleRequest) {
    handleRequest.platformClazz = Lex;
    await this.middleware('$init')!.run(handleRequest);

    if (handleRequest.jovo?.constructor.name !== 'LexBot') {
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
    if (handleRequest.jovo?.constructor.name !== 'LexBot') {
      return Promise.resolve();
    }
    await this.middleware('$nlu')!.run(handleRequest.jovo);
    await this.middleware('$inputs')!.run(handleRequest.jovo);
  }

  async tts(handleRequest: HandleRequest) {
    if (handleRequest.jovo?.constructor.name !== 'LexBot') {
      return Promise.resolve();
    }
    await this.middleware('$tts')!.run(handleRequest.jovo);
  }

  async output(handleRequest: HandleRequest) {
    if (handleRequest.jovo?.constructor.name !== 'LexBot') {
      return Promise.resolve();
    }
    await this.middleware('$output')!.run(handleRequest.jovo);
  }

  async response(handleRequest: HandleRequest) {
    if (handleRequest.jovo?.constructor.name !== 'LexBot') {
      return Promise.resolve();
    }
    await this.middleware('$response')!.run(handleRequest.jovo);
  }

  async afterResponse(handleRequest: HandleRequest) {
    if (handleRequest.jovo?.constructor.name !== 'LexBot') {
      return Promise.resolve();
    }

    await handleRequest.host.setResponse(handleRequest.jovo.$response);
  }
}
