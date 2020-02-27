import _get = require('lodash.get');
import _set = require('lodash.set');
import {
  BaseApp,
  ErrorCode,
  Extensible,
  ExtensibleConfig,
  HandleRequest,
  Jovo,
  JovoError,
  TestSuite,
  Platform,
} from 'jovo-core';
import _merge from 'lodash.merge';
import { BixbyRequestBuilder } from './core/BixbyRequestBuilder';
import { BixbyCore } from './core/BixbyCore';
import { BixbyCapsule } from './core/BixbyCapsule';
import { BixbyResponseBuilder } from './core/BixbyResponseBuilder';
import { BixbyNLU } from './modules/BixbyNLU';
import { BixbyAudioPlayerPlugin } from './modules/BixbyAudioPlayer';
import { BixbyRequest } from './core/BixbyRequest';
import { BixbyResponse } from '.';
import { BixbyTestSuite } from './core/Interfaces';

export interface Config extends ExtensibleConfig {}

export class Bixby extends Platform<BixbyRequest, BixbyResponse> {
  requestBuilder = new BixbyRequestBuilder();
  responseBuilder = new BixbyResponseBuilder();

  config: Config = {
    enabled: true,
  };

  constructor(config?: Config) {
    super(config);

    if (config) {
      this.config = _merge(this.config, config);
    }
  }

  getAppType() {
    return 'BixbyCapsule';
  }

  install(app: BaseApp) {
    app.$platform.set(this.constructor.name, this);
    app.middleware('platform.init')!.use(this.initialize.bind(this));
    app.middleware('platform.nlu')!.use(this.nlu.bind(this));
    app.middleware('platform.output')!.use(this.output.bind(this));
    app.middleware('response')!.use(this.response.bind(this));
    app.middleware('fail')!.use(this.fail.bind(this));

    this.use(new BixbyCore(), new BixbyNLU(), new BixbyAudioPlayerPlugin());

    Jovo.prototype.$bixbyCapsule = undefined;
    Jovo.prototype.bixbyCapsule = function() {
      if (this.constructor.name !== 'BixbyCapsule') {
        throw new JovoError(
          "Can't handle request. Please use this.isBixbyCapsule()",
          ErrorCode.ERR,
          'jovo-platform-bixby',
        );
      }

      return this as BixbyCapsule;
    };

    Jovo.prototype.isBixbyCapsule = function() {
      return this.constructor.name === 'BixbyCapsule';
    };

    // tslint:disable-next-line
    BaseApp.prototype.setBixbyHandler = function(...handlers: any[]) {
      for (const obj of handlers) {
        if (typeof obj !== 'object') {
          throw new JovoError('Handler must be of type object');
        }

        const sourceHandler = _get(this.config.plugin, 'Bixby.handlers');
        _set(this.config, 'plugin.Bixby.handlers', _merge(sourceHandler, obj));
      }
      return this;
    };
  }

  makeTestSuite(): BixbyTestSuite {
    return new TestSuite(new BixbyRequestBuilder(), new BixbyResponseBuilder());
  }

  async initialize(handleRequest: HandleRequest) {
    handleRequest.platformClazz = BixbyCapsule;
    await this.middleware('$init')!.run(handleRequest);

    if (!handleRequest.jovo || handleRequest.jovo.constructor.name !== 'BixbyCapsule') {
      return Promise.resolve();
    }

    await this.middleware('$request')!.run(handleRequest.jovo);
    await this.middleware('$type')!.run(handleRequest.jovo);
    await this.middleware('$session')!.run(handleRequest.jovo);
  }

  async nlu(handleRequest: HandleRequest) {
    if (!handleRequest.jovo || handleRequest.jovo.constructor.name !== 'BixbyCapsule') {
      return Promise.resolve();
    }

    await this.middleware('$nlu')!.run(handleRequest.jovo);
    await this.middleware('$inputs')!.run(handleRequest.jovo);
  }

  async output(handleRequest: HandleRequest) {
    if (!handleRequest.jovo || handleRequest.jovo.constructor.name !== 'BixbyCapsule') {
      return Promise.resolve();
    }
    await this.middleware('$output')!.run(handleRequest.jovo);
  }

  async response(handleRequest: HandleRequest) {
    if (!handleRequest.jovo || handleRequest.jovo.constructor.name !== 'BixbyCapsule') {
      return Promise.resolve();
    }

    await this.middleware('$response')!.run(handleRequest.jovo);

    handleRequest.jovo.$response = handleRequest.jovo.$rawResponseJson
      ? this.responseBuilder.create(handleRequest.jovo.$rawResponseJson)
      : handleRequest.jovo.$response;
    await handleRequest.host.setResponse(handleRequest.jovo.$response);
  }

  fail() {
    // TODO implement
  }

  supportsASR(): boolean {
    return false;
  }

  supportsTTS(): boolean {
    return false;
  }
}
