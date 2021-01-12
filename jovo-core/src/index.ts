import { MiddlewareCollection } from './MiddlewareCollection';
import { App } from './App';
import { Extensible, ExtensibleConfig } from './Extensible';
import { JovoRequest } from './JovoRequest';
import { JovoResponse } from './JovoResponse';
import { DEFAULT_PLATFORM_MIDDLEWARES, Platform } from './Platform';
import { Plugin } from './Plugin';

export type DeepPartial<T> = { [P in keyof T]?: DeepPartial<T[P]> };

// TODO: Usages of .constructor.name cause errors in webpack, because the name is not the class-name mostly when minimizing.
// It has to be checked whether constructor is valid and can be used to instantiate a new instance for example.

interface ExampleConfig extends ExtensibleConfig {
  test: string;
}

declare module './Extensible' {
  interface ExtensiblePluginConfig {
    Example?: ExampleConfig;
  }
}

class Example extends Plugin<ExampleConfig> {
  getDefaultConfig() {
    return { test: 'default' };
  }

  mount(parent: App): Promise<void> | void {
    return;
  }
}

interface CorePlatformConfig extends ExtensibleConfig {
  foo: string;
}

declare module './Extensible' {
  interface ExtensiblePluginConfig {
    CorePlatform?: CorePlatformConfig;
  }
}

class CorePlatform extends Platform<JovoRequest, JovoResponse, CorePlatformConfig> {
  getDefaultConfig() {
    return { foo: 'default' };
  }

  mount(parent: App): Promise<void> | void {
    return;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  isPlatformRequest(req: Record<string, any>): boolean {
    return req.version && req.request?.type && req.type === 'jovo-platform-core';
  }
}

interface FacebookMessengerConfig extends ExtensibleConfig {
  pageAccessToken: string;
}

declare module './Extensible' {
  interface ExtensiblePluginConfig {
    FacebookMessenger?: FacebookMessengerConfig;
  }
}

class FacebookMessenger extends Platform<JovoRequest, JovoResponse, FacebookMessengerConfig> {
  getDefaultConfig() {
    return { pageAccessToken: 'default' };
  }

  mount(parent: App): Promise<void> | void {
    return;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  isPlatformRequest(req: Record<string, any>): boolean {
    return req.id && req.time && req.messaging && req.messaging[0];
  }
}

interface DialogflowNluConfig extends ExtensibleConfig {
  bar: string;
}

declare module './Extensible' {
  interface ExtensiblePluginConfig {
    DialogflowNlu?: DialogflowNluConfig;
  }
}

class DialogflowNlu extends Extensible<DialogflowNluConfig> {
  getDefaultConfig(): { bar: string } {
    return { bar: 'default' };
  }

  mount(parent: Extensible): Promise<void> | void {
    return;
  }

  middlewareCollection = new MiddlewareCollection();
}

const app = new App();

// always include parent first

app.use(
  new Example({
    test: 'overwritten',
  }),
  new CorePlatform({
    foo: 'overwritten',
    plugins: [new DialogflowNlu()],
  }),
  new FacebookMessenger({
    plugins: [
      new DialogflowNlu({
        bar: 'overwritten',
      }),
    ],
  }),
);

(async () => {
  await app.initialize();

  await app.handle({
    version: '1.0.0',
    request: {
      type: 'abc',
    },
    type: 'jovo-platform-core',
  });
})();
