import { Component, ComponentConfig, JovoWebClient } from '../../src';
import { makeTestClient } from '../util';

interface TestComponentConfig extends ComponentConfig {
  foo: string;
}

class TestComponent extends Component<TestComponentConfig> {
  static DEFAULT_CONFIG: TestComponentConfig = {
    foo: 'bar',
  };

  readonly name = 'TestComponent';

  async onInit(): Promise<void> {
    // tslint:disable-line
  }

  getDefaultConfig(): TestComponentConfig {
    return TestComponent.DEFAULT_CONFIG;
  }
}

describe('test Component', () => {
  const client: JovoWebClient = makeTestClient();
  const component: TestComponent = new TestComponent(client);

  beforeAll(() => {
    client.use(component);
  });

  test('test get name', () => {
    expect(component.name).toBe('TestComponent');
  });

  test('test get $config', () => {
    expect(component.$config.foo).toBe('bar');
  });

  test('test onInit', async () => {
    await expect(component.onInit()).resolves.toBeUndefined();
  });

  test('test onStop', async () => {
    await expect(component.onStop()).resolves.toBeUndefined();
  });
});
