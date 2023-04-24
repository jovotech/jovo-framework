import {App, BaseComponent, Component, Global, InputType, Intents, PrioritizedOverUnhandled} from '../src';
import { ExamplePlatform, ExampleServer } from './utilities';

test('test handler decorator inheritance', async () => {
  @Global()
  @Component()
  class MyComponent extends BaseComponent {
    @Intents('IntentA')
    handleIntentA() {
      return this.$send('MyComponent.IntentA');
    }

    @Intents('IntentB')
    handleIntentB() {
      return this.$send('MyComponent.IntentB');
    }

    @Intents('IntentC')
    handleIntentC() {
      return this.$send('MyComponent.IntentC');
    }

    UNHANDLED() {
      return this.$send('MyComponent.UNHANDLED');
    }
  }

  @Global()
  @Component()
  class ComponentA extends MyComponent {
    @Intents('IntentA')
    handleIntentA() {
      return this.$send('ComponentA.IntentA');
    }

    @Intents('IntentD')
    handleIntentC() {
      return super.handleIntentC();
    }
  }

  @Global()
  @Component()
  class ComponentB extends BaseComponent {
    someHandler() {
      return this.$send('test');
    }
  }

  const app = new App({
    plugins: [new ExamplePlatform()],
    components: [ComponentA],
  });
  await app.initialize();

  let server = new ExampleServer({
    input: {
      type: InputType.Intent,
      intent: 'IntentA',
    },
  });
  await app.handle(server);
  expect(server.response.output).toEqual([
    {
      message: 'ComponentA.IntentA',
    },
  ]);

  server = new ExampleServer({
    input: {
      type: InputType.Intent,
      intent: 'IntentB',
    },
  });
  await app.handle(server);
  expect(server.response.output).toEqual([
    {
      message: 'MyComponent.IntentB',
    },
  ]);

  server = new ExampleServer({
    input: {
      type: InputType.Intent,
      intent: 'IntentC',
    },
  });
  await app.handle(server);
  expect(server.response.output).toEqual([
    {
      message: 'MyComponent.UNHANDLED',
    },
  ]);

  server = new ExampleServer({
    input: {
      type: InputType.Intent,
      intent: 'IntentD',
    },
  });
  await app.handle(server);
  expect(server.response.output).toEqual([
    {
      message: 'MyComponent.IntentC',
    },
  ]);
});

test('test prioritized handlers not being skipped', async () => {
  @Component({name: 'BottomComponent'})
  class BottomComponent extends BaseComponent {
    @PrioritizedOverUnhandled()
    @Intents('IntentA')
    handleIntentA() {
      return this.$send('BottomComponent.IntentA');
    }
  }

  @Component({name: 'MiddleComponent'})
  class MiddleComponent extends BaseComponent {
    @PrioritizedOverUnhandled()
    @Intents('IntentA')
    handleIntentA() {
      return this.$send('MiddleComponent.IntentA');
    }

    UNHANDLED() {
      return this.$send('MiddleComponent.UNHANDLED');
    }
  }

  @Component({name: 'TopComponent'})
  class TopComponent extends BaseComponent {
    UNHANDLED() {
      return this.$send('TopComponent.UNHANDLED');
    }
  }

  const app = new App({
    plugins: [new ExamplePlatform()],
    components: [BottomComponent, MiddleComponent, TopComponent],
  });
  await app.initialize();

  const server = new ExampleServer({
    input: {
      type: InputType.Intent,
      intent: 'IntentA',
    },
    session: {
      id: '1234',
      data: {},
      state: [
        {
          component: 'BottomComponent',
        },
        {
          component: 'MiddleComponent',
          resolve: {},
        },
        {
          component: 'TopComponent',
          resolve: {},
        }
      ]
    }
  });
  await app.handle(server);
  expect(server.response.output).toEqual([
    {
      message: 'MiddleComponent.IntentA',
    }
  ]);
});