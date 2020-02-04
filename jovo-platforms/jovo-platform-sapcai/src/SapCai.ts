import _get = require('lodash.get');
import _set = require('lodash.set');
import _merge = require('lodash.merge');
import {
  ActionSet,
  BaseApp,
  EnumRequestType,
  Extensible,
  ExtensibleConfig,
  HandleRequest,
  Jovo,
  Platform,
  TestSuite,
} from 'jovo-core';
import {
  Cards,
  SapCaiCore,
  SapCaiNlu,
  SapCaiRequest,
  SapCaiRequestBuilder,
  SapCaiResponse,
  SapCaiResponseBuilder,
  SapCaiSkill,
} from '.';

export interface Config extends ExtensibleConfig {
  handlers?: any; //tslint:disable-line:no-any
  useLaunch?: boolean;
}

export class SapCai extends Platform<SapCaiRequest, SapCaiResponse> {
  requestBuilder = new SapCaiRequestBuilder();
  responseBuilder = new SapCaiResponseBuilder();

  config: Config = {
    enabled: true,
    plugin: {},
    handlers: undefined,
    useLaunch: true,
  };

  constructor(config?: Config) {
    super(config);

    if (config) {
      this.config = _merge(this.config, config);
    }
  }

  getAppType(): string {
    return 'SapCaiSkill';
  }

  install(app: BaseApp) {
    app.$platform.set(this.constructor.name, this);
    app.middleware('platform.init')!.use(this.initialize.bind(this));
    app.middleware('platform.nlu')!.use(this.nlu.bind(this));
    app.middleware('platform.output')!.use(this.output.bind(this));
    app.middleware('response')!.use(this.response.bind(this));

    app.middleware('fail')!.use((handleRequest: HandleRequest) => {
      if (!handleRequest.jovo) {
        return;
      }

      if (this.config.defaultResponseOnFail) {
        if (!_get(handleRequest.jovo.$handlers, EnumRequestType.ON_ERROR)) {
          app.middleware('response')!.run(handleRequest);
        }
      }
    });

    this.use(new SapCaiCore(), new SapCaiNlu(), new Cards());

    Jovo.prototype.$caiSkill = undefined;
    Jovo.prototype.caiSkill = function() {
      if (this.constructor.name !== 'SapCaiSkill') {
        throw Error(`Can't handle request. Please use this.isCaiSkill()`);
      }
      return this as SapCaiSkill;
    };
    Jovo.prototype.isCaiSkill = function() {
      return this.constructor.name === 'SapCaiSkill';
    };

    //tslint:disable-next-line:no-any
    BaseApp.prototype.setCaiHandler = function(...handlers: any[]) {
      // tslint:disable-line
      for (const obj of handlers) {
        // eslint-disable-line
        if (typeof obj !== 'object') {
          throw new Error('Handler must be of type object.');
        }
        const sourceHandler = _get(this.config, 'plugin.SapCai.handlers');
        _set(this.config, 'plugin.SapCai.handlers', _merge(sourceHandler, obj));
      }
      return this;
    };
  }

  makeTestSuite(): TestSuite<SapCaiRequestBuilder, SapCaiResponseBuilder> {
    return new TestSuite(new SapCaiRequestBuilder(), new SapCaiResponseBuilder());
  }

  async initialize(handleRequest: HandleRequest) {
    handleRequest.platformClazz = SapCaiSkill;
    await this.middleware('$init')!.run(handleRequest);

    if (!handleRequest.jovo || handleRequest.jovo.constructor.name !== 'SapCaiSkill') {
      return Promise.resolve();
    }
    await this.middleware('$request')!.run(handleRequest.jovo);
    await this.middleware('$type')!.run(handleRequest.jovo);
    await this.middleware('$session')!.run(handleRequest.jovo);

    if (this.config.handlers) {
      _set(
        handleRequest.app,
        'config.handlers',
        _merge(_get(handleRequest.app, 'config.handlers'), this.config.handlers),
      );
    }
  }

  async nlu(handleRequest: HandleRequest) {
    if (!handleRequest.jovo || handleRequest.jovo.constructor.name !== 'SapCaiSkill') {
      return Promise.resolve();
    }
    await this.middleware('$nlu')!.run(handleRequest.jovo);
    await this.middleware('$inputs')!.run(handleRequest.jovo);
  }

  async output(handleRequest: HandleRequest) {
    if (!handleRequest.jovo || handleRequest.jovo.constructor.name !== 'SapCaiSkill') {
      return Promise.resolve();
    }
    await this.middleware('$output')!.run(handleRequest.jovo);
  }

  async response(handleRequest: HandleRequest) {
    if (!handleRequest.jovo || handleRequest.jovo.constructor.name !== 'SapCaiSkill') {
      return Promise.resolve();
    }
    await this.middleware('$response')!.run(handleRequest.jovo);

    handleRequest.jovo.$response = handleRequest.jovo.$rawResponseJson
      ? this.responseBuilder.create(handleRequest.jovo.$rawResponseJson)
      : handleRequest.jovo.$response;
    await handleRequest.host.setResponse(handleRequest.jovo.$response);
  }

  uninstall(app: BaseApp) {}
}
