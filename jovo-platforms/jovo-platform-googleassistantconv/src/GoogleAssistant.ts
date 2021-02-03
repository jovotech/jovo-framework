import _get = require('lodash.get');
import _merge = require('lodash.merge');
import _set = require('lodash.set');
import {
  ActionSet,
  BaseApp,
  ExtensibleConfig,
  HandleRequest,
  Jovo,
  Platform,
  TestSuite,
} from 'jovo-core';
import { ConversationalActionRequest } from './core/ConversationalActionRequest';
import { ConversationalActionResponse } from './core/ConversationalActionResponse';
import { GoogleAssistantRequestBuilder } from './core/GoogleAssistantRequestBuilder';
import { GoogleAssistantResponseBuilder } from './core/GoogleAssistantResponseBuilder';
import { ConversationalActionsCore } from './modules/ConversationalActionsCore';
import { GoogleAssistantTestSuite } from './core/Interfaces';
import { GoogleAction } from './core/GoogleAction';
import { MediaResponsePlugin } from './modules/MediaResponse';
import { InteractiveCanvas } from './modules/InteractiveCanvas';
import { TransactionsPlugin } from './modules/Transaction';

export interface Config extends ExtensibleConfig {
  handlers?: any; //tslint:disable-line
}

export class GoogleAssistant extends Platform<
  ConversationalActionRequest,
  ConversationalActionResponse
> {
  config: Config = {
    enabled: true,
    plugin: {},
  };

  requestBuilder = new GoogleAssistantRequestBuilder();
  responseBuilder = new GoogleAssistantResponseBuilder();

  constructor(config?: Config) {
    super(config);

    if (config) {
      this.config = _merge(this.config, config);
    }
  }

  getAppType(): string {
    return 'GoogleAction';
  }

  install(app: BaseApp) {
    app.$platform.set(this.constructor.name, this);
    app.middleware('setup')!.use(this.setup.bind(this));
    app.middleware('platform.init')!.use(this.initialize.bind(this));
    app.middleware('platform.nlu')!.use(this.nlu.bind(this));
    app.middleware('platform.output')!.use(this.output.bind(this));
    app.middleware('response')!.use(this.response.bind(this));

    Jovo.prototype.$googleAction = undefined;

    /**
     * Returns googleAction instance
     * @returns {GoogleAction}
     */
    Jovo.prototype.googleAction = function () {
      if (this.constructor.name !== 'GoogleAction') {
        throw Error(`Can't handle request. Please use this.isGoogleAction()`);
      }
      return this as GoogleAction;
    };

    /**
     * Type of platform is Google Action
     * @public
     * @return {boolean} isGoogleAction
     */
    Jovo.prototype.isGoogleAction = function () {
      return this.constructor.name === 'GoogleAction';
    };

    // tslint:disable-next-line
    BaseApp.prototype.setGoogleAssistantHandler = function (...handlers: any[]) {
      for (const obj of handlers) {
        // eslint-disable-line
        if (typeof obj !== 'object') {
          throw new Error('Handler must be of type object.');
        }
        const sourceHandler = _get(this.config, 'plugin.GoogleAssistant.handlers');
        _set(this.config, 'plugin.GoogleAssistant.handlers', _merge(sourceHandler, obj));
      }
      return this;
    };
    this.use(
      new ConversationalActionsCore(),
      new MediaResponsePlugin(),
      new InteractiveCanvas(),
      new TransactionsPlugin(),
    );
  }

  makeTestSuite(): GoogleAssistantTestSuite {
    return new TestSuite(this.requestBuilder, this.responseBuilder);
  }

  async initialize(handleRequest: HandleRequest) {
    await this.middleware('$init')!.run(handleRequest);

    if (!isValidGoogleAssistantRequest(handleRequest)) {
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
    if (!isValidGoogleAssistantRequest(handleRequest)) {
      return Promise.resolve();
    }

    await this.middleware('$nlu')!.run(handleRequest.jovo);
    await this.middleware('$inputs')!.run(handleRequest.jovo);
  }

  async output(handleRequest: HandleRequest) {
    if (!isValidGoogleAssistantRequest(handleRequest)) {
      return Promise.resolve();
    }
    await this.middleware('$output')!.run(handleRequest.jovo);
  }

  async response(handleRequest: HandleRequest) {
    if (!isValidGoogleAssistantRequest(handleRequest)) {
      return Promise.resolve();
    }
    await this.middleware('$response')!.run(handleRequest.jovo);

    handleRequest.jovo!.$response = handleRequest.jovo!.$rawResponseJson
      ? this.responseBuilder.create(handleRequest.jovo!.$rawResponseJson)
      : handleRequest.jovo!.$response;
    await handleRequest.host.setResponse(handleRequest.jovo!.$response);
  }

  uninstall(app: BaseApp) {}
}

function isValidGoogleAssistantRequest(handleRequest: HandleRequest) {
  return (
    handleRequest.jovo &&
    (handleRequest.jovo.constructor.name === 'GoogleAction' ||
      handleRequest.jovo.constructor.name === 'ConversationalAction')
  );
}
