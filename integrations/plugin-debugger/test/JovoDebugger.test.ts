import {
  App,
  Jovo,
  NluData,
  NluPlugin,
  OmitWhere,
  PlainObjectType,
  Plugin,
  PluginConfig,
  TestServer,
} from '@jovotech/framework';
import { HandleRequest } from '@jovotech/framework/dist/types';
import { CoreRequest } from '@jovotech/platform-core';
import { JovoDebugger } from '../src';

class DebuggerTestServer extends TestServer {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(request: any, public onResponse?: (response?: any) => void | Promise<void>) {
    super(request);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async setResponse(response?: any): Promise<void> {
    return this.onResponse?.(response);
  }
}

class DebuggerTestNluPlugin extends NluPlugin {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async processText(jovo: Jovo, text: string): Promise<NluData | undefined> {
    return;
  }
}

const coreRequest: PlainObjectType<CoreRequest> = {
  version: '4.0',
  platform: 'jovo-debugger',
  id: '7bd31461-0211-4c92-b642-69a978c2f18c',
  timestamp: '2020-11-23T12:35:36.368Z',
  timeZone: 'Europe/Berlin',
  locale: 'en',
  data: {},
  input: {
    type: 'LAUNCH',
  },
  context: {
    device: {
      id: '1e4jk3b8-h99a-4hg5-8z14-2ec3cfs51b7f',
      capabilities: ['AUDIO', 'TEXT'],
    },
    session: {
      id: '1e4076b8-539a-48d5-8b14-1ec3cf651b7b',
      data: {},
      isNew: true,
      updatedAt: new Date('2020-11-23T12:35:21.345Z'),
    },
    user: {
      id: '67fed000-9f11-4acf-bbbc-1e52e5ea22a9',
      data: {},
    },
  },
};

const mockSocket = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any,@typescript-eslint/no-empty-function,@typescript-eslint/no-unused-vars
  emit: () => {},
  // eslint-disable-next-line @typescript-eslint/no-explicit-any,@typescript-eslint/no-empty-function,@typescript-eslint/no-unused-vars
  on: () => {},
};

let jovoDebugger: JovoDebugger, app: App;

beforeEach(() => {
  jovoDebugger = new JovoDebugger({
    skipTests: false,
    nlu: new DebuggerTestNluPlugin(),
    enabled: true,
    modelsPath: '',
    webhookUrl: '',
  });
  jest
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .spyOn(jovoDebugger as any, 'connectToWebhook')
    .mockImplementation(() => Promise.resolve(mockSocket));

  app = new App({
    plugins: [jovoDebugger],
  });
});

test('Applying proxies does not break config and plugin references', async () => {
  interface TestPluginConfig extends PluginConfig {
    foo: string;
  }
  class TestPlugin extends Plugin<TestPluginConfig> {
    getDefaultConfig(): TestPluginConfig {
      return { foo: '' };
    }
    mount(parent: HandleRequest) {
      parent.middlewareCollection.use('before.request.start', (jovo: Jovo) => {
        expect(this).toEqual(jovo.$plugins.TestPlugin);
        expect(this.config).toEqual(jovo.$config.plugin?.TestPlugin);
        this.config.foo = 'bar';
        expect(this.config).toEqual(jovo.$config.plugin?.TestPlugin);
        parent.stopMiddlewareExecution();
      });
    }
  }
  app.use(new TestPlugin());

  await app.initialize();
  await app.handle(new DebuggerTestServer(coreRequest));
});
