import { DeepPartial } from '.';
import { Extensible, ExtensibleConfig, ExtensibleInitConfig } from './Extensible';
import { HandleRequest } from './HandleRequest';
import { MiddlewareCollection } from './MiddlewareCollection';
import { Platform } from './Platform';
import { HandlerPlugin } from './plugins/handler/HandlerPlugin';
import { OutputPlugin } from './plugins/output/OutputPlugin';
import { RouterPlugin } from './plugins/router/RouterPlugin';

export interface AppConfig extends ExtensibleConfig {
  test: string;
}

export class App extends Extensible<AppConfig> {
  readonly config: AppConfig = {
    test: '',
  };

  middlewareCollection = new MiddlewareCollection(
    'request',
    'interpretation.asr',
    'interpretation.nlu',
    'dialog.context',
    'dialog.logic',
    'response.output',
    'response.tts',
    'response',
  );

  constructor(config?: DeepPartial<Omit<AppConfig & ExtensibleInitConfig, 'plugin'>>) {
    super(config);
    this.use(new RouterPlugin(), new HandlerPlugin(), new OutputPlugin());
  }

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
  async handle(req: Record<string, any>): Promise<any> {
    const handleRequest = new HandleRequest(this);
    await handleRequest.mount();

    await handleRequest.middlewareCollection.run('request', handleRequest);

    const relatedPlatform = this.platforms.find((platform) => platform.isPlatformRequest(req));
    if (!relatedPlatform) {
      // TODO improve error
      throw new Error('No matching platform');
    }
    const jovo = relatedPlatform.createJovoInstance(this, handleRequest);

    // RIDR-pipeline

    await handleRequest.middlewareCollection.run('interpretation.asr', handleRequest, jovo);
    await handleRequest.middlewareCollection.run('interpretation.nlu', handleRequest, jovo);
    await handleRequest.middlewareCollection.run('dialog.context', handleRequest, jovo);
    await handleRequest.middlewareCollection.run('dialog.logic', handleRequest, jovo);
    await handleRequest.middlewareCollection.run('response.output', handleRequest, jovo);
    await handleRequest.middlewareCollection.run('response.tts', handleRequest, jovo);
    await handleRequest.middlewareCollection.run('response', handleRequest, jovo);

    console.log(JSON.stringify(jovo, undefined, 2));
  }
}
