import { Extensible, ExtensibleConfig } from './Extensible';
import { HandleRequest } from './HandleRequest';
import { MiddlewareCollection } from './MiddlewareCollection';
import { Platform } from './Platform';

export interface AppConfig extends ExtensibleConfig {
  test: string;
}

export class App extends Extensible<AppConfig> {
  readonly config: AppConfig = {
    test: '',
  };

  middlewareCollection = new MiddlewareCollection(
    'request',
    'interpretation',
    'dialog',
    'response',
  );

  get platforms(): ReadonlyArray<Platform> {
    return Object.values(this.plugins).filter((plugin) => plugin instanceof Platform) as Platform[];
  }

  getDefaultConfig(): AppConfig {
    return {
      plugin: {},
      test: '',
    };
  }

  async initialize(): Promise<void> {
    // TODO populate this.config from the loaded global configuration via file or require or similar
    return this.initializePlugins();
  }

  mount(): Promise<void> | void {
    return;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async handle(req: Record<string, any>) {
    const handleRequest = new HandleRequest(this);
    await this.mountPluginsTo(handleRequest);

    const relatedPlatform = this.platforms.find((platform) => {
      return platform.isPlatformRequest(req);
    });

    if (!relatedPlatform) {
      // TODO correct error
      throw new Error('No matching platform');
    }

    console.log({ relatedPlatform });

    // begin of RIDR-pipeline
    await this.middlewareCollection.run('request', handleRequest);
    await this.middlewareCollection.run('interpretation', handleRequest);
    await this.middlewareCollection.run('dialog', handleRequest);
    await this.middlewareCollection.run('response', handleRequest);
  }
}
