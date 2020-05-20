import {
  ActionSet,
  BaseApp,
  EnumRequestType,
  ErrorCode,
  ExtensibleConfig,
  HandleRequest,
  HttpService,
  Jovo,
  JovoError,
  Platform,
  TestSuite,
} from 'jovo-core';
import _merge = require('lodash.merge');

import { LindenbaumTestSuite } from './index';
import { LindenbaumBot } from './core/LindenbaumBot';
import { LindenbaumRequest } from './core/LindenbaumRequest';
import { LindenbaumResponse } from './core/LindenbaumResponse';
import { LindenbaumRequestBuilder } from './core/LindenbaumRequestBuilder';
import { LindenbaumResponseBuilder } from './core/LindenbaumResponseBuilder';
import { LindenbaumCore } from './modules/LindenbaumCore';

export class Lindenbaum extends Platform<LindenbaumRequest, LindenbaumResponse> {
  static type = 'Lindenbaum';
  static appType = 'LindenbaumBot';

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
    return Lindenbaum.appType;
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

    this.use(new LindenbaumCore());

    Jovo.prototype.$lindenbaumBot = undefined;
    Jovo.prototype.lindenbaumBot = function () {
      if (this.constructor.name !== Lindenbaum.appType) {
        throw new JovoError(
          `Can't handle request. Please use this.isLindenbaumBot()`,
          ErrorCode.ERR_PLUGIN,
          'jovo-platform-lindenbaum',
        );
      }
      return this as LindenbaumBot;
    };
  }

  async initialize(handleRequest: HandleRequest) {
    handleRequest.platformClazz = Lindenbaum;
    await this.middleware('$init')!.run(handleRequest);

    if (handleRequest.jovo?.constructor.name !== Lindenbaum.appType) {
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
    if (handleRequest.jovo?.constructor.name !== Lindenbaum.appType) {
      return Promise.resolve();
    }

    if (handleRequest.jovo.$type.type === EnumRequestType.INTENT) {
      await this.middleware('$nlu')!.run(handleRequest.jovo);
      await this.middleware('$inputs')!.run(handleRequest.jovo);
    }
  }

  async session(handleRequest: HandleRequest) {
    if (!handleRequest.jovo!.$session) {
      handleRequest.jovo!.$session = { $data: {} };
    }
    // @ts-ignore for some reason $session doesn't exist on $user. Works on all the other packages.
    handleRequest.jovo!.$session.$data = { ...handleRequest.jovo!.$user.$session.$data };
  }

  async tts(handleRequest: HandleRequest) {
    if (handleRequest.jovo?.constructor.name !== Lindenbaum.appType) {
      return Promise.resolve();
    }
    await this.middleware('$tts')!.run(handleRequest.jovo);
  }

  async output(handleRequest: HandleRequest) {
    if (handleRequest.jovo?.constructor.name !== Lindenbaum.appType) {
      return Promise.resolve();
    }
    await this.middleware('$output')!.run(handleRequest.jovo);
  }

  async response(handleRequest: HandleRequest) {
    if (handleRequest.jovo?.constructor.name !== Lindenbaum.appType) {
      return Promise.resolve();
    }

    const lindenbaumBot = handleRequest.jovo as LindenbaumBot;
    await this.middleware('$response')!.run(lindenbaumBot);

    const baseUrl = (lindenbaumBot.$request as LindenbaumRequest).getCallbackUrl();
    const $response = lindenbaumBot.$response as LindenbaumResponse;
    if (baseUrl) {
      $response.responses.forEach(async (res) => {
        const endpoint: string = Object.keys(res)[0]; // object only has one key

        await HttpService.post(baseUrl + endpoint, res[endpoint]);
      });
    }
    await handleRequest.host.setResponse(handleRequest.jovo.$response);
  }

  makeTestSuite(): LindenbaumTestSuite {
    return new TestSuite(new LindenbaumRequestBuilder(), new LindenbaumResponseBuilder());
  }
}
