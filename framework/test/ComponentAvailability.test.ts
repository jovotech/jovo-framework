import {
  App,
  BaseComponent,
  Component,
  ComponentNotAvailableError,
  Global,
  InputType,
  Intents,
  MatchingRouteNotFoundError,
} from '../src';
import { ExamplePlatform, ExampleServer } from './utilities';

describe('component availability during routing', () => {
  test('isAvailable declared', async () => {
    @Global()
    @Component({ isAvailable: () => false })
    class UnavailableComponent extends BaseComponent {
      @Global()
      @Intents('UnavailableIntent')
      async testIntent() {
        return this.$send('should not be called');
      }
    }

    @Global()
    @Component({ isAvailable: () => true })
    class AvailableComponent extends BaseComponent {
      @Global()
      @Intents('AvailableIntent')
      async testIntent() {
        return this.$send('test');
      }
    }

    const app = new App({
      plugins: [new ExamplePlatform()],
      components: [AvailableComponent, UnavailableComponent],
    });
    await app.initialize();

    let server = new ExampleServer({
      input: {
        type: InputType.Intent,
        intent: 'UnavailableIntent',
      },
    });
    await app.handle(server);
    expect(server.response.error).toBeInstanceOf(MatchingRouteNotFoundError);

    server = new ExampleServer({
      input: {
        type: InputType.Intent,
        intent: 'AvailableIntent',
      },
    });
    await app.handle(server);
    expect(server.response.output).toEqual([{ message: 'test' }]);
  });

  test('isAvailable not declared', async () => {
    @Global()
    @Component()
    class TestComponent extends BaseComponent {
      @Global()
      @Intents('TestIntent')
      async testIntent() {
        return this.$send('test');
      }
    }

    const app = new App({
      plugins: [new ExamplePlatform()],
      components: [TestComponent],
    });
    await app.initialize();

    const server = new ExampleServer({
      input: {
        type: InputType.Intent,
        intent: 'TestIntent',
      },
    });
    await app.handle(server);
    expect(server.response.output).toEqual([{ message: 'test' }]);
  });
});

describe('component availability during redirect and delegate', () => {
  test('isAvailable declared', async () => {
    @Component({ isAvailable: () => false })
    class UnavailableComponent extends BaseComponent {
      async START() {
        return this.$send('should not be called');
      }
    }

    @Global()
    @Component({ isAvailable: () => true })
    class RootComponent extends BaseComponent {
      @Global()
      @Intents('IntentA')
      async testRedirect() {
        return this.$redirect('UnavailableComponent', 'START');
      }

      @Global()
      @Intents('IntentB')
      async testDelegate() {
        return this.$delegate('UnavailableComponent', { resolve: {} });
      }
    }

    const onError = jest.fn();

    const app = new App({
      plugins: [new ExamplePlatform()],
      components: [RootComponent, UnavailableComponent],
    });
    app.onError(onError);
    await app.initialize();

    let server = new ExampleServer({
      input: {
        type: InputType.Intent,
        intent: 'IntentA',
      },
    });
    await app.handle(server);
    expect(server.response.output).toEqual([]);
    expect(onError).toHaveBeenCalledTimes(1);
    expect(onError.mock.calls[0][0]).toBeInstanceOf(ComponentNotAvailableError);

    onError.mockClear();

    server = new ExampleServer({
      input: {
        type: InputType.Intent,
        intent: 'IntentB',
      },
    });
    await app.handle(server);
    expect(server.response.output).toEqual([]);
    expect(onError).toHaveBeenCalledTimes(1);
    expect(onError.mock.calls[0][0]).toBeInstanceOf(ComponentNotAvailableError);
  });

  test('isAvailable not declared', async () => {
    @Component()
    class UnavailableComponent extends BaseComponent {
      async START() {
        return this.$send('test');
      }
    }

    @Global()
    @Component()
    class RootComponent extends BaseComponent {
      @Global()
      @Intents('IntentA')
      async testRedirect() {
        return this.$redirect('UnavailableComponent', 'START');
      }

      @Global()
      @Intents('IntentB')
      async testDelegate() {
        return this.$delegate('UnavailableComponent', { resolve: {} });
      }
    }

    const app = new App({
      plugins: [new ExamplePlatform()],
      components: [RootComponent, UnavailableComponent],
    });
    await app.initialize();

    let server = new ExampleServer({
      input: {
        type: InputType.Intent,
        intent: 'IntentA',
      },
    });
    await app.handle(server);
    expect(server.response.output).toEqual([{ message: 'test' }]);
    server = new ExampleServer({
      input: {
        type: InputType.Intent,
        intent: 'IntentB',
      },
    });
    await app.handle(server);
    expect(server.response.output).toEqual([{ message: 'test' }]);
  });
});
