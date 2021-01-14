import { AlexaOutputConverterStrategy, AlexaResponse } from 'jovo-output-alexa';
import { Component } from './Component';
import { ComponentPlugin } from './ComponentPlugin';
import {
  App,
  Extensible,
  ExtensibleConfig,
  HandleRequest,
  Jovo,
  JovoRequest,
  MiddlewareCollection,
  Platform,
  Plugin,
} from './index';
import { Handle } from './plugins/handler/decorators/Handle';

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

interface AlexaConfig extends ExtensibleConfig {
  foo: string;
}

declare module './Extensible' {
  interface ExtensiblePluginConfig {
    Alexa?: AlexaConfig;
  }
}

class Alexa extends Platform<JovoRequest, AlexaResponse, AlexaConfig> {
  outputConverterStrategy = new AlexaOutputConverterStrategy();

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

  createJovoInstance(app: App, handleRequest: HandleRequest): AlexaSkill {
    return new AlexaSkill(this);
  }
}

class AlexaSkill extends Jovo<JovoRequest, AlexaResponse> {}

interface DialogflowNluConfig extends ExtensibleConfig {
  bar: string;
}

declare module './Extensible' {
  interface ExtensiblePluginConfig {
    DialogflowNlu?: DialogflowNluConfig;
  }
}

class DialogflowNlu extends Extensible<DialogflowNluConfig> {
  middlewareCollection = new MiddlewareCollection();

  getDefaultConfig(): { bar: string } {
    return { bar: 'default' };
  }

  mount(parent: Extensible): Promise<void> | void {
    return;
  }
}

const app = new App();

class RootComponent extends Component {
  @Handle({ intents: ['StartIntent', 'LaunchIntent'] })
  LAUNCH() {
    this.$output = {
      message: `Hello world! What's your name?`,
      reprompt: `Please tell me your name.`,
      listen: true,
      quickReplies: ['Max', 'John', 'Sarah'],
    };
  }
}

class RootComponentPlugin extends ComponentPlugin {
  readonly component = RootComponent;

  getDefaultConfig() {
    return {};
  }
}

app.use(
  new Example({
    test: 'overwritten',
  }),
  new Alexa({
    foo: 'overwritten',
    plugins: [new DialogflowNlu()],
  }),
  new RootComponentPlugin(),
);

app.setHandlers({
  LAUNCH() {
    this.$output = {
      message: `Hello world! What's your name?`,
      reprompt: `Please tell me your name.`,
      listen: true,
      quickReplies: ['Max', 'John', 'Sarah'],
    };
  },
});

(async () => {
  await app.initialize();

  console.log(app.handler);

  await app.handle({
    version: '1.0.0',
    request: {
      type: 'abc',
    },
    type: 'jovo-platform-core',
  });
})();
