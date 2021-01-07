import { App } from './App';
import { Extensible, ExtensibleConfig } from './Extensible';

export type DeepPartial<T> = { [P in keyof T]?: DeepPartial<T[P]> };

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

  install(parent: App): Promise<void> | void {
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

  install(parent: App): Promise<void> | void {
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

  install(parent: App): Promise<void> | void {
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

  install(parent: App): Promise<void> | void {
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

  install(parent: Extensible): Promise<void> | void {
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

  install(parent: App): Promise<void> | void {
    return;
  }
}

class Root extends Extensible<{ root: string } & ExtensibleConfig> {
  getDefaultConfig() {
    return { root: 'default' };
  }

  install(parent: Extensible): Promise<void> | void {
    return undefined;
  }
}

class Nested extends Extensible<{ nested: string } & ExtensibleConfig> {
  getDefaultConfig() {
    return {
      nested: 'default',
    };
  }

  install(parent: Extensible): Promise<void> | void {
    return undefined;
  }
}

class DeepNested extends Extensible<{ deepNested: string } & ExtensibleConfig> {
  getDefaultConfig() {
    return {
      deepNested: 'default',
    };
  }

  install(parent: Extensible): Promise<void> | void {
    return undefined;
  }
}

const app = new App();

// simple w/o options
app.use(Example);
// simple w/ options
app.use(Example2, {
  help: 'defined',
});

// nested w/o options
app.use(GoogleBusiness, [DialogflowNlu]);

// nested w/o nested options
app.use(FacebookMessenger, { pageAccessToken: '' }, [DialogflowNlu]);

// nested w/ nested options
app.use(CorePlatform, { foo: '', plugin: { DialogflowNlu: { bar: '' } } }, [DialogflowNlu]);

// deep nested w/ nested options
app.use(
  Root,
  {
    root: 'overwritten',
    plugin: {
      Nested: {
        nested: 'overwritten',
        plugin: {
          DeepNested: {
            deepNested: 'overwritten',
          },
        },
      },
    },
  },
  [
    {
      constructor: Nested,
      plugins: [DeepNested],
    },
  ],
);

(async () => {
  await app.initialize();
  await app.handle();
})();
