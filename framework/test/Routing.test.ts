import { App, BaseComponent, Component, Global, InputType, Intents } from '../src';
import { ExamplePlatform, ExampleServer } from './utilities';

test('test handler decorator inheritance', async () => {
  @Global()
  @Component()
  class MyComponent extends BaseComponent {
    @Intents('IntentA')
    handleIntentA() {
      return this.$send('MyComponent.IntentA');
    }
  }

  @Global()
  @Component()
  class ComponentA extends MyComponent {
    handleIntentA() {
      return this.$send('ComponentA.IntentC');
    }
  }

  const app = new App({
    plugins: [new ExamplePlatform()],
    components: [ComponentA],
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
      message: 'ComponentA.IntentC',
    },
  ]);
});
