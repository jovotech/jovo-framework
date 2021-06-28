import {
  App,
  BaseComponent,
  Component,
  ComponentDeclaration,
  MetadataStorage,
  PluginConfig,
} from '../src';
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
    app.use(EmptyComponent);
    expect(app.componentTree.tree).toEqual({
      EmptyComponent: { target: EmptyComponent, options: {} },
    });
  });

  describe('via ComponentPlugin', () => {
    test('no config passed', () => {
      app.use(new ExampleComponentPlugin());
      expect(app.componentTree.tree).toEqual({
        ExampleComponent: { target: ExampleComponent, options: {} },
      });
    });

    test('config passed', () => {
      app.use(new ExampleComponentPlugin({ component: { text: 'edited' } }));
      expect(app.componentTree.tree).toEqual({
        ExampleComponent: { target: ExampleComponent, options: { config: { text: 'edited' } } },
      });
    });
  });

  describe('via ComponentDeclaration-instance', () => {
    test('no options passed', () => {
      app.use(new ComponentDeclaration(ExampleComponent));
      expect(app.componentTree.tree).toEqual({
        ExampleComponent: { target: ExampleComponent, options: {} },
      });
    });

    test('options with config passed', () => {
      app.use(
        new ComponentDeclaration(ExampleComponent, {
          config: {
            text: 'edited',
          },
        }),
      );
      expect(app.componentTree.tree).toEqual({
        ExampleComponent: { target: ExampleComponent, options: { config: { text: 'edited' } } },
      });
    });

    test('options with name passed', () => {
      app.use(
        new ComponentDeclaration(ExampleComponent, {
          name: 'NewComponentName',
        }),
      );
      expect(app.componentTree.tree).toEqual({
        NewComponentName: { target: ExampleComponent, options: { name: 'NewComponentName' } },
      });
    });

    test('options with components passed', () => {
      app.use(new ComponentDeclaration(ExampleComponent, { components: [EmptyComponent] }));
      expect(app.componentTree.tree).toEqual({
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
      app.use({ component: ExampleComponent });
      expect(app.componentTree.tree).toEqual({
        ExampleComponent: { target: ExampleComponent, options: {} },
      });
    });

    test('options with config passed', () => {
      app.use(
        new ComponentDeclaration(ExampleComponent, {
          config: {
            text: 'edited',
          },
        }),
      );
      expect(app.componentTree.tree).toEqual({
        ExampleComponent: { target: ExampleComponent, options: { config: { text: 'edited' } } },
      });
    });

    test('options with components passed', () => {
      app.use(new ComponentDeclaration(ExampleComponent, { components: [EmptyComponent] }));
      expect(app.componentTree.tree).toEqual({
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

      app.use(DecoratedComponent);
      expect(app.componentTree.tree).toEqual({
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

      app.use(DecoratedComponent);
      expect(app.componentTree.tree).toEqual({
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

      app.use(new ComponentDeclaration(DecoratedComponent, { config: { test: 'declaration' } }));
      expect(app.componentTree.tree).toEqual({
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
