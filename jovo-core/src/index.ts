import { App } from './App';
import { Extensible, ExtensibleConfig } from './Extensible';

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

class Example extends Extensible<ExampleConfig> {
  getDefaultConfig() {
    return { test: 'default' };
  }

  test() {}

  mounted(parent: App): Promise<void> | void {
    return;
  }
}

interface Example2Config extends ExtensibleConfig {
  help: string;
}

declare module './Extensible' {
  interface ExtensiblePluginConfig {
    Example2?: Example2Config;
  }
}

class Example2 extends Extensible<Example2Config> {
  getDefaultConfig() {
    return { help: 'default' };
  }

  mounted(parent: App): Promise<void> | void {
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

class CorePlatform extends Extensible<CorePlatformConfig> {
  getDefaultConfig() {
    return { foo: 'default' };
  }

  mounted(parent: App): Promise<void> | void {
    return;
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

class FacebookMessenger extends Extensible<FacebookMessengerConfig> {
  getDefaultConfig() {
    return { pageAccessToken: 'default' };
  }

  mounted(parent: App): Promise<void> | void {
    return;
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

  mounted(parent: Extensible): Promise<void> | void {
    return;
  }
}

interface GoogleBusinessConfig extends ExtensibleConfig {
  customAgentId: string;
}

declare module './Extensible' {
  interface ExtensiblePluginConfig {
    GoogleBusiness?: GoogleBusinessConfig;
  }
}

class GoogleBusiness extends Extensible<GoogleBusinessConfig> {
  getDefaultConfig() {
    return { customAgentId: 'default' };
  }

  mounted(parent: App): Promise<void> | void {
    return;
  }
}

class Root extends Extensible<{ root: string } & ExtensibleConfig> {
  getDefaultConfig() {
    return { root: 'default' };
  }

  mounted(parent: Extensible): Promise<void> | void {
    return undefined;
  }
}

class Nested extends Extensible<{ nested: string } & ExtensibleConfig> {
  getDefaultConfig() {
    return {
      nested: 'default',
    };
  }

  mounted(parent: Extensible): Promise<void> | void {
    return undefined;
  }
}

class DeepNested extends Extensible<{ deepNested: string } & ExtensibleConfig> {
  getDefaultConfig() {
    return {
      deepNested: 'default',
    };
  }

  mounted(parent: Extensible): Promise<void> | void {
    return undefined;
  }
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
  await app.handle();
})();
