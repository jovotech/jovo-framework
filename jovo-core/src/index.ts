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
  getDefaultConfig(): { test: string } {
    return { test: 'default' };
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
  getDefaultConfig(): { foo: string } {
    return { foo: 'default' };
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

const app = new App();

app.use(Example, { resolve: CorePlatform, config: {}, plugins: [DialogflowNlu] });
// app.use(Example, {
//   plugins: [],
// });
//
// app.use(CorePlatform, {
//   // config
//   plugins: {
//     DialogflowNlu: {
//
//     }
//   }
// }, [DialogflowNlu])

(async () => {
  await app.initialize();
  await app.handle();
})();
