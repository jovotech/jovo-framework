import {
  AxiosError,
  AxiosRequestConfig,
  AxiosResponse,
  BaseApp,
  ErrorCode,
  ExtensibleConfig,
  HandleRequest,
  Host,
  HttpService,
  Jovo,
  JovoError,
  Log,
  Platform,
  TestSuite,
} from 'jovo-core';
import _get = require('lodash.get');
import _merge = require('lodash.merge');
import _set = require('lodash.set');
import {
  ApiVersion,
  BASE_URL,
  DEFAULT_VERSION,
  FacebookMessengerCore,
  FacebookMessengerRequestBuilder,
  FacebookMessengerResponseBuilder,
  Message,
  MessengerBot,
  MessengerBotEntry,
  MessengerBotRequest,
  MessengerBotResponse,
  MessengerBotUser,
  PersistentMenuItemType,
  WebViewHeightRatio,
  WebViewShareButton,
  DisabledSurfaces,
} from '.';

export interface UpdateConfig<T> {
  updateOnSetup?: boolean;
  data?: T;
}

export interface GreetingElement {
  locale: string;
  text: string;
}

export interface PersistentMenuItem {
  type: PersistentMenuItemType;
  title: string;
  url?: string;
  payload: string;
  webview_height_ratio?: WebViewHeightRatio;
  messenger_extensions?: Boolean;
  fallback_url?: string;
  webview_share_button?: WebViewShareButton;
}

export interface PersistentMenuElement {
  locale: string;
  composer_input_disabled?: boolean;
  disabled_surfaces: Array<DisabledSurfaces>;
  call_to_actions: Array<PersistentMenuItem>;
}

export interface Config extends ExtensibleConfig {
  shouldOverrideAppHandle?: boolean;
  shouldIgnoreSynchronousResponse?: boolean;
  greeting?: UpdateConfig<GreetingElement[]>;
  launch?: UpdateConfig<string>;
  persistentMenu?: UpdateConfig<PersistentMenuElement[]>;
  pageAccessToken?: string;
  verifyToken?: string;
  locale?: string;
  version?: ApiVersion;
  userProfileFields?: string;
  fetchUserProfile?: boolean;
}

export class FacebookMessenger extends Platform<MessengerBotRequest, MessengerBotResponse> {
  requestBuilder: FacebookMessengerRequestBuilder = new FacebookMessengerRequestBuilder();
  responseBuilder: FacebookMessengerResponseBuilder = new FacebookMessengerResponseBuilder();

  config: Config = {
    shouldOverrideAppHandle: true,
    shouldIgnoreSynchronousResponse: false,
    greeting: {
      updateOnSetup: false,
    },
    launch: {
      updateOnSetup: false,
    },
    persistentMenu: {
      updateOnSetup: false,
    },
    pageAccessToken: process.env.FB_PAGE_ACCESS_TOKEN || '',
    verifyToken: process.env.FB_VERIFY_TOKEN || '',
    locale: process.env.FB_LOCALE || 'en-US',
    version: DEFAULT_VERSION,
    userProfileFields:
      process.env.FB_USER_PROFILE_FIELDS || 'first_name,last_name,profile_pic,locale',
    fetchUserProfile: true,
  };

  constructor(config?: Config) {
    super(config);

    if (config) {
      this.config = _merge(this.config, config);
    }
  }

  getAppType(): string {
    return 'MessengerBot';
  }

  install(app: BaseApp): void {
    if (!_get(app.config, `user.sessionData`)) {
      _set(app.$plugins.get('JovoUser')!.config!, 'sessionData.enabled', true);
      _set(app.$plugins.get('JovoUser')!.config!, 'sessionData.data', true);
    }

    app.$platform.set(this.constructor.name, this);
    app.middleware('setup')!.use(this.setup.bind(this));
    app.middleware('request')!.use(this.request.bind(this));
    app.middleware('platform.init')!.use(this.initialize.bind(this));
    app.middleware('nlu')!.use(this.nlu.bind(this));
    app.middleware('after.user.load')!.use(this.afterUserLoad.bind(this));
    app.middleware('before.handler')!.use(this.beforeHandler.bind(this));

    app.middleware('platform.output')!.use(this.output.bind(this));
    app.middleware('response')!.use(this.response.bind(this));
    app.middleware('after.response')!.use(this.afterResponse.bind(this));

    this.use(new FacebookMessengerCore());

    Jovo.prototype.$messengerBot = undefined;
    Jovo.prototype.messengerBot = function () {
      if (this.constructor.name !== 'MessengerBot') {
        throw Error(`Can't handle request. Please use this.isMessengerBot()`);
      }
      return this as MessengerBot;
    };
    Jovo.prototype.isMessengerBot = function () {
      return this.constructor.name === 'MessengerBot';
    };

    if (this.config.shouldOverrideAppHandle) {
      this.overrideAppHandle();
    }
  }

  async setup(handleRequest: HandleRequest) {
    await this.middleware('setup')!.run(handleRequest);
    if (this.isVerifyRequest(handleRequest.host)) {
      return;
    }

    const path = `/${this.config.version}/me/messenger_profile?access_token=${this.config.pageAccessToken}`;
    const url = BASE_URL + path;
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

    if (this.config.persistentMenu && this.config.persistentMenu.updateOnSetup) {
      const persistentMenuElements = this.config.persistentMenu.data;
      if (!persistentMenuElements || persistentMenuElements.length < 1) {
        throw new JovoError(
          `Cannot set persistent menu elements to 'undefined' or an empty array.`,
          ErrorCode.ERR_PLUGIN,
          'FacebookMessenger',
        );
      }

      data.persistent_menu = persistentMenuElements;
    }

    if (Object.keys(data).length === 0) {
      return;
    }

    const config: AxiosRequestConfig = {
      url,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      data,
    };

    try {
      await HttpService.request(config);
    } catch (e) {
      const errorMessage = e.response.data.error.message;

      throw new JovoError(
        `${e.message}: ${errorMessage}`,
        ErrorCode.ERR_PLUGIN,
        'FacebookMessenger',
        errorMessage,
        `The reason for that might be a missing 'pageAccessToken' or an invalid value for 'greeting' or 'launch'`,
      );
    }
  }

  async request(handleRequest: HandleRequest) {
    if (!this.isVerifyRequest(handleRequest.host)) {
      return;
    }
    const queryParams = handleRequest.host.getQueryParams();

    const token = queryParams['hub.verify_token'];
    const challenge = queryParams['hub.challenge'];

    if (token === this.config.verifyToken) {
      handleRequest.stopMiddlewareExecution();
      await handleRequest.host.setResponse(+challenge);
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
  async beforeHandler(handleRequest: HandleRequest) {
    if (!handleRequest.jovo || handleRequest.jovo.constructor.name !== this.getAppType()) {
      return Promise.resolve();
    }
    const user = handleRequest.jovo.$user as MessengerBotUser;

    if (handleRequest.jovo.$session.$data.userProfile) {
      user.profile = handleRequest.jovo.$session.$data.userProfile;
    } else if (this.config.fetchUserProfile && handleRequest.jovo.isNewSession()) {
      await user.fetchAndSetProfile(this.config.userProfileFields);
      handleRequest.jovo.$session.$data.userProfile = user.profile;
    }

    if (user.profile && user.profile.locale) {
      const locale = user.profile.locale.replace('_', '-');
      handleRequest.jovo.$request!.setLocale(locale);
    }
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

    const message: Message | undefined = _get(messengerBot, '$response.message', undefined);
    if (message && this.config.shouldIgnoreSynchronousResponse !== true) {
      const pageAccessToken = _get(
        handleRequest.jovo.$config,
        'plugin.FacebookMessenger.pageAccessToken',
        '',
      );
      try {
        await message.send(pageAccessToken, this.config.version || DEFAULT_VERSION);
      } catch (e) {
        Log.error(e.response?.data);
      }
    }
  }

  async afterResponse(handleRequest: HandleRequest) {
    if (!handleRequest.jovo || handleRequest.jovo.constructor.name !== this.getAppType()) {
      return Promise.resolve();
    }
    await handleRequest.host.setResponse(handleRequest.jovo.$response);
  }

  makeTestSuite(): TestSuite<FacebookMessengerRequestBuilder, FacebookMessengerResponseBuilder> {
    return new TestSuite(
      new FacebookMessengerRequestBuilder(),
      new FacebookMessengerResponseBuilder(),
    );
  }

  private isVerifyRequest(host: Host): boolean {
    const queryParams = host.getQueryParams();

    const mode = queryParams['hub.mode'];
    const token = queryParams['hub.verify_token'];
    const challenge = queryParams['hub.challenge'];

    return mode === 'subscribe' && !!token && !!challenge;
  }

  private overrideAppHandle() {
    const PROTOTYPE_BACKUP = BaseApp.prototype.handle;
    BaseApp.prototype.handle = async function (host: Host) {
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
          hostCopy.setResponse = async function (obj: any) {
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
