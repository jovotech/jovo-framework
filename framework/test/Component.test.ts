import { App, BaseComponent, ComponentDeclaration, PluginConfig } from '../src';
import { Component } from '../src/decorators/Component';
import { MetadataStorage } from '../src/metadata/MetadataStorage';
import { EmptyComponent, ExampleComponent, ExampleComponentPlugin } from './utilities';

// TODO implement more tests
describe('registering components', () => {
  let app: App;
  const metadataStorage = MetadataStorage.getInstance();
  beforeEach(() => {
    app = new App();
    metadataStorage.clearAll();
  });

  test('via BaseComponent-constructor and undecorated component', () => {
    app.useComponents(EmptyComponent);
    expect(app.components).toEqual({
      EmptyComponent: { target: EmptyComponent, options: {} },
    });
  });

  describe('via ComponentPlugin', () => {
    test('no config passed', () => {
      app.use(new ExampleComponentPlugin());
      expect(app.components).toEqual({
        ExampleComponent: { target: ExampleComponent, options: {} },
      });
    });

    test('config passed', () => {
      app.use(new ExampleComponentPlugin({ component: { text: 'edited' } }));
      expect(app.components).toEqual({
        ExampleComponent: { target: ExampleComponent, options: { config: { text: 'edited' } } },
      });
    });
  });

  describe('via ComponentDeclaration-instance', () => {
    test('no options passed', () => {
      app.useComponents(new ComponentDeclaration(ExampleComponent));
      expect(app.components).toEqual({
        ExampleComponent: { target: ExampleComponent, options: {} },
      });
    });

    test('options with config passed', () => {
      app.useComponents(
        new ComponentDeclaration(ExampleComponent, {
          config: {
            text: 'edited',
          },
        }),
      );
      expect(app.components).toEqual({
        ExampleComponent: { target: ExampleComponent, options: { config: { text: 'edited' } } },
      });
    });

    test('options with name passed', () => {
      app.useComponents(
        new ComponentDeclaration(ExampleComponent, {
          name: 'NewComponentName',
        }),
      );
      expect(app.components).toEqual({
        NewComponentName: { target: ExampleComponent, options: { name: 'NewComponentName' } },
      });
    });

    test('options with components passed', () => {
      app.useComponents(
        new ComponentDeclaration(ExampleComponent, { components: [EmptyComponent] }),
      );
      expect(app.components).toEqual({
        ExampleComponent: {
          target: ExampleComponent,
          options: { components: [EmptyComponent] },
          components: {
            EmptyComponent: {
              options: {},
              target: EmptyComponent,
            },
          },
        },
      });
    });
  });

  describe('via ComponentDeclaration-object', () => {
    test('no options passed', () => {
      app.useComponents({ component: ExampleComponent });
      expect(app.components).toEqual({
        ExampleComponent: { target: ExampleComponent, options: {} },
      });
    });

    test('options with config passed', () => {
      app.useComponents(
        new ComponentDeclaration(ExampleComponent, {
          config: {
            text: 'edited',
          },
        }),
      );
      expect(app.components).toEqual({
        ExampleComponent: { target: ExampleComponent, options: { config: { text: 'edited' } } },
      });
    });

    test('options with components passed', () => {
      app.useComponents(
        new ComponentDeclaration(ExampleComponent, { components: [EmptyComponent] }),
      );
      expect(app.components).toEqual({
        ExampleComponent: {
          target: ExampleComponent,
          options: { components: [EmptyComponent] },
          components: {
            EmptyComponent: {
              options: {},
              target: EmptyComponent,
            },
          },
        },
      });
    });
  });

  describe('via @Component-decorator and useComponents', () => {
    test('no config passed', () => {
      @Component()
      class DecoratedComponent extends BaseComponent {
        getDefaultConfig() {
          return {};
        }
      }

      app.useComponents(DecoratedComponent);
      expect(app.components).toEqual({
        DecoratedComponent: { target: DecoratedComponent, options: {} },
      });
    });

    test('config passed in decorator', () => {
      @Component<DecoratedComponent>({
        config: {
          test: true,
        },
      })
      class DecoratedComponent extends BaseComponent<{ test: boolean } & PluginConfig> {
        getDefaultConfig() {
          return { test: false };
        }
      }

      app.useComponents(DecoratedComponent);
      expect(app.components).toEqual({
        DecoratedComponent: {
          target: DecoratedComponent,
          options: {
            config: {
              test: true,
            },
          },
        },
      });
    });

    test('config passed in decorator and declaration', () => {
      @Component<DecoratedComponent>({
        config: {
          test: 'decorator',
        },
      })
      class DecoratedComponent extends BaseComponent<{ test: string } & PluginConfig> {
        getDefaultConfig() {
          return { test: 'default' };
        }
      }

      app.useComponents(
        new ComponentDeclaration(DecoratedComponent, { config: { test: 'declaration' } }),
      );
      expect(app.components).toEqual({
        DecoratedComponent: {
          target: DecoratedComponent,
          options: {
            config: {
              test: 'declaration',
            },
          },
        },
      });
    });
  });
});
