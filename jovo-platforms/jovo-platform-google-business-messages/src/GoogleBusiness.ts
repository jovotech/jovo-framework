import {
  ActionSet,
  BaseApp,
  ErrorCode,
  ExtensibleConfig,
  HandleRequest,
  Jovo,
  JovoError,
  Platform,
  TestSuite,
} from 'jovo-core';
import _merge = require('lodash.merge');

import { GoogleBusinessBot } from './core/GoogleBusinessBot';
import { GoogleBusinessRequest } from './core/GoogleBusinessRequest';
import { GoogleBusinessRequestBuilder } from './core/GoogleBusinessRequestBuilder';
import { GoogleBusinessResponse } from './core/GoogleBusinessResponse';
import { GoogleBusinessResponseBuilder } from './core/GoogleBusinessResponseBuilder';
import { GoogleBusinessTestSuite } from './index';
import { GoogleBusinessCore } from './modules/GoogleBusinessCore';
import { Cards } from './modules/Cards';
import { ApiCallOptions, GoogleBusinessAPI } from './services/GoogleBusinessAPI';

export class GoogleBusiness extends Platform<GoogleBusinessRequest, GoogleBusinessResponse> {
  static type = 'GoogleBusiness';
  static appType = 'GoogleBusinessBot';

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
    return GoogleBusiness.appType;
  }

  install(app: BaseApp) {
    if (!app.config.user?.sessionData) {
      app.$plugins.get('JovoUser')!.config!.sessionData = {
        data: true,
        enabled: true,
      };
    }

    app.$platform.set(this.constructor.name, this);
    app.middleware('setup')!.use(this.setup.bind(this));
    app.middleware('platform.init')!.use(this.initialize.bind(this));
    app.middleware('platform.nlu')!.use(this.nlu.bind(this));
    app.middleware('after.user.load')!.use(this.session.bind(this));
    app.middleware('tts')!.use(this.tts.bind(this));
    app.middleware('platform.output')!.use(this.output.bind(this));
    app.middleware('response')!.use(this.response.bind(this));

    this.use(new GoogleBusinessCore(), new Cards());

    Jovo.prototype.$googleBusinessBot = undefined;
    Jovo.prototype.googleBusinessBot = function () {
      if (this.constructor.name !== GoogleBusiness.appType) {
        throw new JovoError(
          `Can't handle request. Please use this.isLindenbaumBot()`,
          ErrorCode.ERR_PLUGIN,
          'jovo-platform-lindenbaum',
        );
      }
      return this as GoogleBusinessBot;
    };
  }

  async initialize(handleRequest: HandleRequest) {
    handleRequest.platformClazz = GoogleBusiness;
    await this.middleware('$init')!.run(handleRequest);

    if (handleRequest.jovo?.constructor.name !== GoogleBusiness.appType) {
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
    if (handleRequest.jovo?.constructor.name !== GoogleBusiness.appType) {
      return Promise.resolve();
    }

    await this.middleware('$nlu')!.run(handleRequest.jovo);
    await this.middleware('$inputs')!.run(handleRequest.jovo);
  }

  async session(handleRequest: HandleRequest) {
    if (!handleRequest.jovo!.$session) {
      handleRequest.jovo!.$session = { $data: {} };
    }

    handleRequest.jovo!.$session.$data = { ...handleRequest.jovo!.$user.$session.$data };
  }

  async tts(handleRequest: HandleRequest) {
    if (handleRequest.jovo?.constructor.name !== GoogleBusiness.appType) {
      return Promise.resolve();
    }
    await this.middleware('$tts')!.run(handleRequest.jovo);
  }

  async output(handleRequest: HandleRequest) {
    if (handleRequest.jovo?.constructor.name !== GoogleBusiness.appType) {
      return Promise.resolve();
    }
    await this.middleware('$output')!.run(handleRequest.jovo);
  }

  async response(handleRequest: HandleRequest) {
    if (handleRequest.jovo?.constructor.name !== GoogleBusiness.appType) {
      return Promise.resolve();
    }
    await this.middleware('$response')!.run(handleRequest.jovo);

    const options: ApiCallOptions = {
      data: (handleRequest.jovo.$response as GoogleBusinessResponse).response,
      endpoint: 'https://businessmessages.googleapis.com/v1',
      path: `/conversations/${handleRequest.jovo.$request?.getSessionId()}/messages`,
      serviceAccount: this.config.serviceAccount,
    };

    try {
      await GoogleBusinessAPI.apiCall(options);
    } catch (e) {
      Promise.reject(
        new JovoError(e.message, ErrorCode.ERR_PLUGIN, 'jovo-platform-google-business-messages'),
      );
    }

    await handleRequest.host.setResponse(handleRequest.jovo.$response);
  }

  makeTestSuite(): GoogleBusinessTestSuite {
    return new TestSuite(
      new GoogleBusinessRequestBuilder(),
      new GoogleBusinessResponseBuilder(),
    );
  }
}
