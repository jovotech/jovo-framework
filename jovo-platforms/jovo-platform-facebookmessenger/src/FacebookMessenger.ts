import {
  ActionSet,
  BaseApp,
  ErrorCode,
  Extensible,
  ExtensibleConfig,
  HandleRequest,
  Host,
  Jovo,
  JovoError,
  Platform,
  RequestBuilder,
  ResponseBuilder,
  TestSuite,
} from 'jovo-core';
import _get = require('lodash.get');
import _merge = require('lodash.merge');
import _set = require('lodash.set');
import {
  AirlineTemplate,
  AirlineTemplateOptions,
  AirlineTemplatePayload,
  AttachmentMessage,
  AttachmentMessageOptions,
  BASE_PATH,
  ButtonTemplate,
  ButtonTemplateOptions,
  ButtonTemplatePayload,
  FacebookMessengerCore,
  FacebookMessengerRequestBuilder,
  FacebookMessengerResponseBuilder,
  GenericTemplate,
  GenericTemplateOptions,
  GenericTemplatePayload,
  HOST,
  HTTPS,
  MediaTemplate,
  MediaTemplateOptions,
  MediaTemplatePayload,
  Message,
  MessengerBot,
  MessengerBotEntry,
  ReceiptTemplate,
  ReceiptTemplateOptions,
  ReceiptTemplatePayload,
  SenderAction,
  SenderActionType,
  TemplateType,
  TextMessage,
  TextMessageOptions,
} from '.';

export interface UpdateConfig<T> {
  updateOnSetup?: boolean;
  data?: T;
}

export interface GreetingElement {
  locale: string;
  text: string;
}

export interface Config extends ExtensibleConfig {
  shouldOverrideAppHandle?: boolean;
  greeting?: UpdateConfig<GreetingElement[]>;
  launch?: UpdateConfig<string>;
  pageAccessToken?: string;
  verifyToken?: string;
  locale?: string;
}

export class FacebookMessenger extends Extensible implements Platform {
  requestBuilder: FacebookMessengerRequestBuilder = new FacebookMessengerRequestBuilder();
  responseBuilder: FacebookMessengerResponseBuilder = new FacebookMessengerResponseBuilder();

  config: Config = {
    shouldOverrideAppHandle: true,
    greeting: {
      updateOnSetup: false,
    },
    launch: {
      updateOnSetup: false,
    },
    pageAccessToken: process.env.FB_PAGE_ACCESS_TOKEN || '',
    verifyToken: process.env.FB_VERIFY_TOKEN || '',
    locale: process.env.FB_LOCALE || 'en-US',
  };

  constructor(config?: Config) {
    super(config);

    if (config) {
      this.config = _merge(this.config, config);
    }

    this.actionSet = new ActionSet(
      [
        '$init',
        '$request',
        '$user',
        '$type',
        '$asr',
        '$nlu',
        '$inputs',
        '$session',
        '$tts',
        '$output',
        '$response',
      ],
      this,
    );
  }

  getAppType(): string {
    return 'MessengerBot';
  }

  install(app: BaseApp): void {
    if (!_get(app.config, `user.sessionData`)) {
      _set(app.$plugins.get('JovoUser')!.config!, 'sessionData.enabled', true);
    }

    app.$platform.set(this.constructor.name, this);
    app.middleware('setup')!.use(this.setup.bind(this));
    app.middleware('request')!.use(this.request.bind(this));
    app.middleware('platform.init')!.use(this.initialize.bind(this));
    app.middleware('nlu')!.use(this.nlu.bind(this));
    app.middleware('after.user.load')!.use(this.afterUserLoad.bind(this));
    app.middleware('platform.output')!.use(this.output.bind(this));
    app.middleware('response')!.use(this.response.bind(this));

    this.use(new FacebookMessengerCore());

    this.augmentJovo();

    if (this.config.shouldOverrideAppHandle) {
      this.overrideAppHandle();
    }
  }

  async setup(handleRequest: HandleRequest) {
    const path = `${BASE_PATH}/messenger_profile?access_token=${this.config.pageAccessToken}`;
    const options = {
      hostname: HOST,
      path,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    };
    const data: any = {};

    if (this.config.launch && this.config.launch.updateOnSetup) {
      const launchPayload = this.config.launch.data;
      if (!launchPayload) {
        throw new JovoError(
          `Cannot set launch-payload to 'undefined'!`,
          ErrorCode.ERR_PLUGIN,
          'FacebookMessenger',
        );
      }

      data.get_started = {
        payload: launchPayload,
      };
    }

    if (this.config.greeting && this.config.greeting.updateOnSetup) {
      const greetingElements = this.config.greeting.data;
      if (!greetingElements || greetingElements.length < 1) {
        throw new JovoError(
          `Cannot set greeting-elements to 'undefined' or an empty array.`,
          ErrorCode.ERR_PLUGIN,
          'FacebookMessenger',
        );
      }

      data.greeting = greetingElements;
    }

    const json = JSON.stringify(data);

    try {
      await HTTPS.makeRequest(options, Buffer.from(json));
    } catch (e) {
      throw new JovoError(e, ErrorCode.ERR_PLUGIN, 'FacebookMessenger');
    }
  }

  async request(handleRequest: HandleRequest) {
    const queryParams = handleRequest.host.getQueryParams();

    const mode = queryParams['hub.mode'];
    const token = queryParams['hub.verify_token'];
    const challenge = queryParams['hub.challenge'];

    if (mode && token) {
      if (mode === 'subscribe' && token === this.config.verifyToken) {
        handleRequest.stopMiddlewareExecution();
        await handleRequest.host.setResponse(challenge);
      } else {
        throw new JovoError(
          'The verify token that was set in the config does not match the verify token in the request!',
          ErrorCode.ERR,
          'FacebookMessenger',
          `verify token in the config '${this.config.verifyToken}' does not match the passed verify token '${token}'!`,
          'Check the verify token in the config and in the webhook-verification-form.',
        );
      }
    }
  }

  async initialize(handleRequest: HandleRequest) {
    handleRequest.platformClazz = MessengerBot;
    await this.middleware('$init')!.run(handleRequest);

    if (!handleRequest.jovo || handleRequest.jovo.constructor.name !== this.getAppType()) {
      return Promise.resolve();
    }

    await this.middleware('$request')!.run(handleRequest.jovo);
    await this.middleware('$type')!.run(handleRequest.jovo);
  }

  async nlu(handleRequest: HandleRequest) {
    if (!handleRequest.jovo || handleRequest.jovo.constructor.name !== this.getAppType()) {
      return Promise.resolve();
    }

    await this.middleware('$nlu')!.run(handleRequest.jovo);
    await this.middleware('$inputs')!.run(handleRequest.jovo);
  }

  async afterUserLoad(handleRequest: HandleRequest) {
    if (!handleRequest.jovo || handleRequest.jovo.constructor.name !== this.getAppType()) {
      return Promise.resolve();
    }

    await this.middleware('$session')!.run(handleRequest.jovo);
  }

  async output(handleRequest: HandleRequest) {
    if (!handleRequest.jovo || handleRequest.jovo.constructor.name !== this.getAppType()) {
      return Promise.resolve();
    }

    await this.middleware('$output')!.run(handleRequest.jovo);
  }

  async response(handleRequest: HandleRequest) {
    if (!handleRequest.jovo || handleRequest.jovo.constructor.name !== this.getAppType()) {
      return Promise.resolve();
    }

    const messengerBot = handleRequest.jovo;
    await this.middleware('$response')!.run(messengerBot);

    const messages: Message[] = _get(messengerBot, '$response.messages', []);
    const pageAccessToken = _get(
      handleRequest.jovo.$config,
      'plugin.FacebookMessenger.pageAccessToken',
      '',
    );

    for (const message of messages) {
      message.send(pageAccessToken).catch((e) => {
        throw new JovoError(e, ErrorCode.ERR_PLUGIN, 'FacebookMessenger');
      });
    }
  }

  makeTestSuite(): TestSuite<RequestBuilder, ResponseBuilder> {
    return new TestSuite(
      new FacebookMessengerRequestBuilder(),
      new FacebookMessengerResponseBuilder(),
    );
  }

  private augmentJovo() {
    Jovo.prototype.$messengerBot = undefined;
    Jovo.prototype.messengerBot = function() {
      if (this.constructor.name !== 'MessengerBot') {
        throw Error(`Can't handle request. Please use this.isMessengerBot()`);
      }
      return this as MessengerBot;
    };
    Jovo.prototype.isMessengerBot = function() {
      return this.constructor.name === 'MessengerBot';
    };

    Jovo.prototype.text = function(options: TextMessageOptions) {
      const message = new TextMessage({ id: this.$user.getId()! }, options);
      this.$output.FacebookMessenger.Messages.push(message);
      return this;
    };
    Jovo.prototype.attachment = function(options: AttachmentMessageOptions) {
      const message = new AttachmentMessage({ id: this.$user.getId()! }, options);
      this.$output.FacebookMessenger.Messages.push(message);
      return this;
    };

    Jovo.prototype.overrideText = function(text: string) {
      this.$output.FacebookMessenger.OverrideText = text;
      return this;
    };

    Jovo.prototype.airlineTemplate = function(options: AirlineTemplateOptions) {
      const payload: AirlineTemplatePayload = {
        ...options,
        template_type: TemplateType.Airline,
      };
      const message = new AirlineTemplate({ id: this.$user.getId()! }, payload);
      this.$output.FacebookMessenger.Messages.push(message);
      return this;
    };
    Jovo.prototype.buttonTemplate = function(options: ButtonTemplateOptions) {
      const payload: ButtonTemplatePayload = {
        ...options,
        template_type: TemplateType.Button,
      };
      const message = new ButtonTemplate({ id: this.$user.getId()! }, payload);
      this.$output.FacebookMessenger.Messages.push(message);
      return this;
    };
    Jovo.prototype.genericTemplate = function(options: GenericTemplateOptions) {
      const payload: GenericTemplatePayload = {
        ...options,
        template_type: TemplateType.Generic,
      };
      const message = new GenericTemplate({ id: this.$user.getId()! }, payload);
      this.$output.FacebookMessenger.Messages.push(message);
      return this;
    };
    Jovo.prototype.mediaTemplate = function(options: MediaTemplateOptions) {
      const payload: MediaTemplatePayload = {
        ...options,
        template_type: TemplateType.Media,
      };
      const message = new MediaTemplate({ id: this.$user.getId()! }, payload);
      this.$output.FacebookMessenger.Messages.push(message);
      return this;
    };
    Jovo.prototype.receiptTemplate = function(options: ReceiptTemplateOptions) {
      const payload: ReceiptTemplatePayload = {
        ...options,
        template_type: TemplateType.Receipt,
      };
      const message = new ReceiptTemplate({ id: this.$user.getId()! }, payload);
      this.$output.FacebookMessenger.Messages.push(message);
      return this;
    };

    Jovo.prototype.action = async function(action: SenderActionType) {
      const message = new SenderAction({ id: this.$user.getId()! }, action);

      const pageAccessToken = _get(this.$config, 'plugin.FacebookMessenger.pageAccessToken', '');
      const result = await message.send(pageAccessToken);
      return !!result;
    };
  }

  private overrideAppHandle() {
    const PROTOTYPE_BACKUP = BaseApp.prototype.handle;
    BaseApp.prototype.handle = async function(host: Host) {
      const request = host.getRequestObject();
      const isMessengerRequest: boolean =
        request &&
        request.object === 'page' &&
        request.entry &&
        Array.isArray(request.entry) &&
        request.entry.length > 0;
      if (isMessengerRequest) {
        const promises: Array<Promise<any>> = [];
        request.entry.forEach((entry: MessengerBotEntry) => {
          const hostCopy: Host = Object.create(host.constructor.prototype);
          // tslint:disable-next-line
          hostCopy.setResponse = async function(obj: any) {
            return;
          };
          for (const key in host) {
            if (host.hasOwnProperty(key)) {
              const value = (host as any)[key];
              if (key === '$request') {
                (hostCopy as any)[key] = entry;
              } else {
                (hostCopy as any)[key] =
                  typeof value === 'object' && value.constructor.name === 'Object'
                    ? { ...value }
                    : value;
              }
            }
          }
          promises.push(PROTOTYPE_BACKUP.call(this, hostCopy));
        });

        await Promise.all(promises);
        return host.setResponse({});
      }
      return PROTOTYPE_BACKUP.call(this, host);
    };
  }
}
