import { Component, ComponentOptions, JovoWebClient } from '../../src';
import { makeTestClient } from '../util';

interface TestComponentOptions extends ComponentOptions {
  foo: string;
}

class TestComponent extends Component<TestComponentOptions> {
  static DEFAULT_OPTIONS: TestComponentOptions = {
    foo: 'bar',
  };

  async onInit(): Promise<void> {}

  getDefaultOptions(): TestComponentOptions {
    return TestComponent.DEFAULT_OPTIONS;
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

  test('test get options', () => {
    expect(component.options.foo).toBe('bar');
  });

  test('test onInit', async () => {
    await expect(component.onInit()).resolves.toBeUndefined();
  });

  test('test onStop', async () => {
    await expect(component.onStop()).resolves.toBeUndefined();
  });
});
