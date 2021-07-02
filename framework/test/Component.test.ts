import {
  App,
  BaseComponent,
  Component,
  ComponentDeclaration,
  ComponentMetadata,
  MetadataStorage,
  PluginConfig,
} from '../src';

import { EmptyComponent, ExampleComponent, ExampleComponentPlugin } from './utilities';

describe('registering components', () => {
  let app: App;

  function expectNodeMetadataAtToEqual(path: string[], equals: ComponentMetadata) {
    const node = app.componentTree.getNodeAt(path);
    expect(node?.metadata).toEqual(equals);
  }

  const metadataStorage = MetadataStorage.getInstance();
  beforeEach(() => {
    app = new App();
    metadataStorage.clearAll();
  });

  test('via BaseComponent-constructor and undecorated component', () => {
    app.use(EmptyComponent);
    expectNodeMetadataAtToEqual(['EmptyComponent'], new ComponentMetadata(EmptyComponent, {}));
  });

  describe('via ComponentPlugin', () => {
    test('no config passed', () => {
      app.use(new ExampleComponentPlugin());
      expectNodeMetadataAtToEqual(
        ['ExampleComponent'],
        new ComponentMetadata(ExampleComponent, {}),
      );
    });

    test('config passed', () => {
      app.use(new ExampleComponentPlugin({ component: { text: 'edited' } }));
      expectNodeMetadataAtToEqual(
        ['ExampleComponent'],
        new ComponentMetadata(ExampleComponent, {
          config: {
            text: 'edited',
          },
        }),
      );
    });
  });

  describe('via ComponentDeclaration-instance', () => {
    test('no options passed', () => {
      app.use(new ComponentDeclaration(ExampleComponent));
      expectNodeMetadataAtToEqual(
        ['ExampleComponent'],
        new ComponentMetadata(ExampleComponent, {}),
      );
    });

    test('options with config passed', () => {
      app.use(
        new ComponentDeclaration(ExampleComponent, {
          config: {
            text: 'edited',
          },
        }),
      );
      expectNodeMetadataAtToEqual(
        ['ExampleComponent'],
        new ComponentMetadata(ExampleComponent, {
          config: {
            text: 'edited',
          },
        }),
      );
    });

    test('options with name passed', () => {
      app.use(
        new ComponentDeclaration(ExampleComponent, {
          name: 'NewComponentName',
        }),
      );
      expectNodeMetadataAtToEqual(
        ['NewComponentName'],
        new ComponentMetadata(ExampleComponent, { name: 'NewComponentName' }),
      );
    });

    test('options with components passed', () => {
      app.use(new ComponentDeclaration(ExampleComponent, { components: [EmptyComponent] }));
      expectNodeMetadataAtToEqual(
        ['ExampleComponent'],
        new ComponentMetadata(ExampleComponent, { components: [EmptyComponent] }),
      );
    });
  });

  describe('via ComponentDeclaration-object', () => {
    test('no options passed', () => {
      app.use({ component: ExampleComponent });
      expectNodeMetadataAtToEqual(
        ['ExampleComponent'],
        new ComponentMetadata(ExampleComponent, {}),
      );
    });

    test('options with config passed', () => {
      app.use(
        new ComponentDeclaration(ExampleComponent, {
          config: {
            text: 'edited',
          },
        }),
      );
      expectNodeMetadataAtToEqual(
        ['ExampleComponent'],
        new ComponentMetadata(ExampleComponent, {
          config: {
            text: 'edited',
          },
        }),
      );
    });

    test('options with components passed', () => {
      app.use(new ComponentDeclaration(ExampleComponent, { components: [EmptyComponent] }));
      expectNodeMetadataAtToEqual(
        ['ExampleComponent'],
        new ComponentMetadata(ExampleComponent, {
          components: [EmptyComponent],
        }),
      );
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
      expectNodeMetadataAtToEqual(
        ['DecoratedComponent'],
        new ComponentMetadata(DecoratedComponent, {}),
      );
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
      expectNodeMetadataAtToEqual(
        ['DecoratedComponent'],
        new ComponentMetadata(DecoratedComponent, {
          config: {
            test: true,
          },
        }),
      );
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
      expectNodeMetadataAtToEqual(
        ['DecoratedComponent'],
        new ComponentMetadata(DecoratedComponent, {
          config: {
            test: 'declaration',
          },
        }),
      );
    });
  });
});
