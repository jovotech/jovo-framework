import {
  App,
  Jovo,
  PlainObjectType,
  TestServer,
} from '@jovotech/framework';
import { CorePlatform, CoreRequest } from '@jovotech/platform-core';

import { ReplaceRule, TextReplaceNluPlugin } from '../src/index'


class PluginTestServer extends TestServer {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(request: any, public onResponse?: (response?: any) => void | Promise<void>) {
    super(request);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async setResponse(response?: any): Promise<void> {
    return this.onResponse?.(response);
  }
}

let app: App, corePlatform: CorePlatform;

const coreRequest: PlainObjectType<CoreRequest> = {
  version: '1.0',
  timestamp: '2022-11-07T22:16:08.197Z',
  platform: 'core',
  input: {
    type: 'TEXT',
    text: ''
  }
}

beforeEach(() => {
  corePlatform = new CorePlatform({});

  app = new App({
    plugins: [corePlatform],
  });
});

test('should match string and replace with string', async () => {
  const plugin = new TextReplaceNluPlugin({
    onGetReplaceRules: (jovo: Jovo) => {
      return [
        {
          searchValue: 'world',
          replaceValue: 'jovo',
          locales: ['en']
        }
      ] as ReplaceRule[]
    }
  });

  coreRequest.input!.text = 'hello world';

  app.use(plugin);
  await app.initialize();

  let input;
  app.hook('interpretation.nlu', (jovo: Jovo): void => {
    input = jovo.$input.text;
    jovo.$handleRequest.stopMiddlewareExecution();
  });

  await app.handle(new PluginTestServer(coreRequest));


  expect(input).toBe('hello jovo');
});

test('should match regex and replace with string', async () => {
  const plugin = new TextReplaceNluPlugin({
    onGetReplaceRules: (jovo: Jovo) => {
      return [
        {
          searchValue: 'WORLD',
          isRegex: true,
          regexFlags: 'gi',
          replaceValue: 'jovo',
          locales: ['en']
        }
      ] as ReplaceRule[]
    }
  });

  coreRequest.input!.text = 'hello world';

  app.use(plugin);
  await app.initialize();

  let input;
  app.hook('interpretation.nlu', (jovo: Jovo): void => {
    input = jovo.$input.text;
    jovo.$handleRequest.stopMiddlewareExecution();
  });

  await app.handle(new PluginTestServer(coreRequest));


  expect(input).toBe('hello jovo');
});

test('should match regex and replace with special string pattern', async () => {
  const plugin = new TextReplaceNluPlugin({
    onGetReplaceRules: (jovo: Jovo) => {
      return [
        {
          searchValue: '(\\d+)(LBS)',
          isRegex: true,
          regexFlags: 'g',
          replaceValue: "$1 pounds",
          locales: ['en']
        }
      ] as ReplaceRule[]
    }
  });

  coreRequest.input!.text = 'It weighs 100LBS.';

  app.use(plugin);
  await app.initialize();

  let input;
  app.hook('interpretation.nlu', (jovo: Jovo): void => {
    input = jovo.$input.text;
    jovo.$handleRequest.stopMiddlewareExecution();
  });

  await app.handle(new PluginTestServer(coreRequest));


  expect(input).toBe('It weighs 100 pounds.');
});
