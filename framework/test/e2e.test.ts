import {
  App,
  BaseComponent,
  BuiltInHandler,
  Component,
  Global,
  If,
  InputType,
  Intents,
  MetadataStorage,
  PrioritizedOverUnhandled,
} from '../src';
import { ExamplePlatform, ExampleServer } from './utilities';

describe('e2e', () => {
  const metadataStorage = MetadataStorage.getInstance();

  beforeEach(() => {
    metadataStorage.clearAll();
  });

  test('Simple', async () => {
    @Component({ global: true })
    class GlobalComponent extends BaseComponent {
      [InputType.Launch]() {
        return this.$send('Hello world');
      }
    }

    const app = new App({
      plugins: [new ExamplePlatform()],
      components: [GlobalComponent],
    });
    await app.initialize();

    const server = new ExampleServer({
      input: {
        type: InputType.Launch,
      },
    });
    await app.handle(server);
    expect(server.response.output).toEqual([
      {
        message: 'Hello world',
      },
    ]);
  });

  test('UNHANDLED', async () => {
    @Component({ global: true })
    class GlobalComponent extends BaseComponent {
      [BuiltInHandler.Unhandled]() {
        return this.$send('Unhandled');
      }
    }

    const app = new App({
      plugins: [new ExamplePlatform()],
      components: [GlobalComponent],
    });
    await app.initialize();

    const server = new ExampleServer({
      input: {
        type: InputType.Intent,
        intent: 'IntentA',
      },
    });
    await app.handle(server);
    expect(server.response.output).toEqual([
      {
        message: 'Unhandled',
      },
    ]);
  });

  test('Global Intent from other Component', async () => {
    @Component({ global: true })
    class GlobalComponent extends BaseComponent {
      [BuiltInHandler.Unhandled]() {
        return this.$send('Unhandled');
      }
    }
    @Component({ global: true })
    class ComponentA extends BaseComponent {
      GlobalIntentA() {
        return this.$send('GlobalIntentA');
      }
    }

    const app = new App({
      plugins: [new ExamplePlatform()],
      components: [GlobalComponent, ComponentA],
    });
    await app.initialize();

    const server = new ExampleServer({
      input: {
        type: InputType.Intent,
        intent: 'GlobalIntentA',
      },
      session: {
        state: [
          {
            component: 'AnyOtherComponent',
          },
        ],
      },
    });
    await app.handle(server);
    expect(server.response.output).toEqual([
      {
        message: 'GlobalIntentA',
      },
    ]);
  });

  test('Handle PrioritizedOverUnhandled', async () => {
    @Component()
    class ComponentA extends BaseComponent {
      async START(): Promise<void> {
        return;
      }

      @Global()
      @Intents('IntentA')
      @PrioritizedOverUnhandled()
      async intentA(): Promise<void> {
        return this.$send('intentA');
      }

      @Intents('IntentB')
      @PrioritizedOverUnhandled()
      async intentB(): Promise<void> {
        return this.$send('intentB');
      }
    }
    @Component()
    class ComponentB extends BaseComponent {
      async START(): Promise<void> {
        return;
      }

      async UNHANDLED(): Promise<void> {
        return this.$send('UNHANDLED');
      }
    }

    const app = new App({
      plugins: [new ExamplePlatform()],
      components: [ComponentA, ComponentB],
    });
    await app.initialize();

    const server = new ExampleServer({
      input: {
        type: InputType.Intent,
        intent: 'IntentB',
      },
      session: {
        data: {
          state: [
            {
              component: 'ComponentA',
            },
            {
              component: 'ComponentB',
            },
          ],
        },
      },
    });
    await app.handle(server);
    expect(server.response.output).toEqual([
      {
        message: 'intentB',
      },
    ]);
  });

  test('Rank global Intent over Unhandled, without specific order of components', async () => {
    @Global()
    @Component()
    class GlobalComponent extends BaseComponent {
      [BuiltInHandler.Unhandled]() {
        return this.$send('Unhandled');
      }
    }
    @Global()
    @Component()
    class ComponentA extends BaseComponent {
      @Intents('IntentA')
      IntentA() {
        return this.$send('IntentA');
      }
    }

    const app = new App({
      plugins: [new ExamplePlatform()],
      components: [GlobalComponent, ComponentA],
    });
    await app.initialize();

    const server = new ExampleServer({
      input: {
        type: InputType.Intent,
        intent: 'IntentA',
      },
    });
    await app.handle(server);
    expect(server.response.output).toEqual([
      {
        message: 'IntentA',
      },
    ]);

    const app2 = new App({
      plugins: [new ExamplePlatform()],
      components: [ComponentA, GlobalComponent],
    });
    await app2.initialize();

    const server2 = new ExampleServer({
      input: {
        type: InputType.Intent,
        intent: 'IntentA',
      },
    });
    await app2.handle(server2);
    expect(server2.response.output).toEqual([
      {
        message: 'IntentA',
      },
    ]);
  });
  test('Rank global intent with @If higher than same global intent in other component ', async () => {
    @Global()
    @Component()
    class ComponentA extends BaseComponent {
      @Intents('IntentA')
      IntentA() {
        return this.$send('ComponentA.IntentA');
      }
    }

    @Global()
    @Component()
    class ComponentB extends BaseComponent {
      @Intents('IntentA')
      @If(() => true)
      IntentA() {
        return this.$send('ComponentB.IntentA');
      }
    }

    const app = new App({
      plugins: [new ExamplePlatform()],
      components: [ComponentA, ComponentB],
    });
    await app.initialize();

    const server = new ExampleServer({
      input: {
        type: InputType.Intent,
        intent: 'IntentA',
      },
    });
    await app.handle(server);
    expect(server.response.output).toEqual([
      {
        message: 'ComponentB.IntentA',
      },
    ]);
  });

  test('$redirect', async () => {
    @Component({ global: true })
    class GlobalComponent extends BaseComponent {
      [BuiltInHandler.Launch]() {
        return this.$redirect(RedirectTargetComponent);
      }
    }

    @Component()
    class RedirectTargetComponent extends BaseComponent {
      [BuiltInHandler.Start]() {
        return this.$send('Hello world');
      }
    }

    const app = new App({
      plugins: [new ExamplePlatform()],
      components: [GlobalComponent, RedirectTargetComponent],
    });
    await app.initialize();

    const server = new ExampleServer({
      input: {
        type: InputType.Launch,
      },
    });
    await app.handle(server);
    expect(server.response.output).toEqual([
      {
        message: 'Hello world',
      },
    ]);
    expect(server.response.session?.state).toEqual([
      {
        component: RedirectTargetComponent.name,
      },
    ]);
  });

  test('$delegate', async () => {
    // due to limitations of jest this class can not be defined in a describe block, that's why these components
    // are defined in both tests
    // A separate file could cause issues due to calling metadataManager.clearAll() before every test
    // which would erase the metadata of imported components
    @Component({ global: true })
    class GlobalComponent extends BaseComponent {
      [BuiltInHandler.Launch]() {
        return this.$delegate(DelegateTargetComponent, {
          resolve: {
            finish: this.onFinishDelegate,
          },
        });
      }

      onFinishDelegate() {
        return this.$send('Finish');
      }
    }

    @Component()
    class DelegateTargetComponent extends BaseComponent {
      [BuiltInHandler.Start]() {
        return this.$send('Hello world');
      }

      async [BuiltInHandler.Unhandled]() {
        return this.$resolve('finish');
      }
    }

    const app = new App({
      plugins: [new ExamplePlatform()],
      components: [GlobalComponent, DelegateTargetComponent],
    });
    await app.initialize();

    const server = new ExampleServer({
      input: {
        type: InputType.Launch,
      },
    });
    await app.handle(server);
    expect(server.response.output).toEqual([
      {
        message: 'Hello world',
      },
    ]);
    expect(server.response.session?.state).toEqual([
      {
        component: GlobalComponent.name,
      },
      {
        component: DelegateTargetComponent.name,
        config: undefined,
        resolve: {
          finish: 'onFinishDelegate',
        },
      },
    ]);
  });

  test('$resolve', async () => {
    @Component({ global: true })
    class GlobalComponent extends BaseComponent {
      [BuiltInHandler.Launch]() {
        return this.$delegate(DelegateTargetComponent, {
          resolve: {
            finish: this.onFinishDelegate,
          },
        });
      }

      onFinishDelegate() {
        return this.$send('Finish');
      }
    }

    @Component()
    class DelegateTargetComponent extends BaseComponent {
      [BuiltInHandler.Start]() {
        return this.$send('Hello world');
      }

      TestIntent() {
        return this.$resolve('finish');
      }

      [BuiltInHandler.Unhandled]() {
        return this.$resolve('finish');
      }
    }

    const app = new App({
      plugins: [new ExamplePlatform()],
      components: [GlobalComponent, DelegateTargetComponent],
    });
    await app.initialize();

    const server = new ExampleServer({
      input: {
        intent: 'TestIntent',
      },
      session: {
        data: {
          state: [
            {
              component: GlobalComponent.name,
            },
            {
              component: DelegateTargetComponent.name,
              resolve: {
                finish: 'onFinishDelegate',
              },
            },
          ],
        },
      },
    });
    await app.handle(server);
    expect(server.response.output).toEqual([{ message: 'Finish' }]);
    expect(server.response.session?.state).toEqual([]);
  });
});
