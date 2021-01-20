import { App, BaseComponent, ComponentDeclaration } from '../src';
import { Component } from '../src/plugins/handler/decorators/Component';
import { EmptyComponent, ExampleComponent, ExampleComponentPlugin } from './utilities';

// TODO implement tests
describe('registering components', () => {
  let app: App;
  beforeEach(() => {
    app = new App();
  });

  test('BaseComponent-constructor', () => {
    app.useComponents(EmptyComponent);
  });

  test('ComponentPlugin', () => {
    app.use(new ExampleComponentPlugin());
  });

  test('ComponentDeclaration', () => {
    app.useComponents(new ComponentDeclaration(ExampleComponent));
  });

  test('@Component-decorator', () => {
    @Component()
    class DecoratedComponent extends BaseComponent {
      getDefaultConfig() {
        return {};
      }
    }
  });
});
