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
import {
  GoogleBusinessTestSuite,
  GoogleServiceAccount,
  BaseResponse,
  TextResponse,
  StandaloneCardResponse,
  CarouselCardResponse,
} from './index';
import { Cards } from './modules/Cards';
import { GoogleBusinessCore } from './modules/GoogleBusinessCore';
import { GoogleBusinessAPI, SendResponseOptions } from './services/GoogleBusinessAPI';

export interface Config extends ExtensibleConfig {
  locale?: string;
  serviceAccount?: GoogleServiceAccount;
}

export class GoogleBusiness extends Platform<GoogleBusinessRequest, GoogleBusinessResponse> {
  static type = 'GoogleBusiness';
  static appType = 'GoogleBusinessBot';

  config: Config = {
    locale: 'en',
    serviceAccount: undefined,
  };

  constructor(config?: Config) {
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
    app.middleware('after.response')!.use(this.afterResponse.bind(this));

    this.use(new GoogleBusinessCore(), new Cards());

    Jovo.prototype.$googleBusinessBot = undefined;
    Jovo.prototype.googleBusinessBot = function () {
      if (this.constructor.name !== GoogleBusiness.appType) {
        throw new JovoError(
          `Can't handle request. Please use this.isGoogleBusinessBot()`,
          ErrorCode.ERR_PLUGIN,
          'jovo-platform-googlebusiness',
        );
      }
      return this as GoogleBusinessBot;
    };

    Jovo.prototype.isGoogleBusinessBot = function () {
      return this.constructor.name === GoogleBusiness.appType;
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
    if (handleRequest.jovo?.constructor.name !== GoogleBusiness.appType) {
      return Promise.resolve();
    }

    // check for duplicated messages and ignore the request if a message with the id was handled already
    const request = handleRequest.jovo.$request as GoogleBusinessRequest;
    const messageId =
      request.message?.messageId ||
      request.suggestionResponse?.message?.match(/messages[/](.*)/)?.[1] ||
      undefined;

    if (messageId) {
      const processedMessages: string[] = handleRequest.jovo.$session.$data.processedMessages || [];
      if (processedMessages.includes(messageId)) {
        handleRequest.stopMiddlewareExecution();
        return handleRequest.host.setResponse({});
      } else {
        processedMessages.push(messageId);
      }
      handleRequest.jovo.$session.$data.processedMessages = processedMessages;
      await handleRequest.jovo.$user.saveData();
    }
    await this.middleware('$session')!.run(handleRequest.jovo);
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

    const options: SendResponseOptions<BaseResponse> = {
      data: (handleRequest.jovo.$response as GoogleBusinessResponse).response!,
      serviceAccount: this.config.serviceAccount!,
      sessionId: handleRequest.jovo.$request?.getSessionId() || '',
    };

    if (
      (options.data as TextResponse).text ||
      (options.data as StandaloneCardResponse | CarouselCardResponse).richCard
    ) {
      await GoogleBusinessAPI.sendResponse(options);
    }
  }

  async afterResponse(handleRequest: HandleRequest) {
    if (handleRequest.jovo?.constructor.name !== GoogleBusiness.appType) {
      return Promise.resolve();
    }
    await handleRequest.host.setResponse(handleRequest.jovo.$response);
  }

  makeTestSuite(): GoogleBusinessTestSuite {
    return new TestSuite(new GoogleBusinessRequestBuilder(), new GoogleBusinessResponseBuilder());
  }
}
