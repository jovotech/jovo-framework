import { App, BaseComponent, BuiltInHandler, Component, InputType, MetadataStorage } from '../src';
import { ExamplePlatform, ExamplePlatformResponse } from './utilities';
import { ExampleServer } from './utilities/server';

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
    expect(server.response.session.state).toEqual([
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
    expect(server.response.session.state).toEqual([
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
    expect(server.response.session.state).toEqual([]);
  });
});
