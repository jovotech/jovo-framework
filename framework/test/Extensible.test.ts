import { Extensible } from '../src';
import { AppLikeExtensible, EmptyPlugin, ExampleExtensible, ExamplePlugin } from './utilities';

describe('constructor', () => {
  test('config with plugins passed: use plugins', () => {
    const instance = new EmptyPlugin();
    const example = new ExampleExtensible({
      plugins: [instance],
    });
    expect(example.plugins.EmptyPlugin).toBe(instance);
  });
});

describe('use', () => {
  test('adds plugin to plugins-object', () => {
    const instance = new EmptyPlugin();
    const example = new ExampleExtensible({
      plugins: [],
    });
    example.use(instance);
    expect(example.plugins.EmptyPlugin).toBe(instance);
  });
});

describe('initializePlugins', () => {
  let extensible;

  test('child: no additional config provided', async () => {
    const plugin = new ExamplePlugin();
    extensible = new AppLikeExtensible({
      plugins: [plugin],
    });

    await extensible.initialize();

    expect(extensible.plugins.ExamplePlugin).toBe(plugin);
    expect(extensible.config.plugin?.ExamplePlugin).toBe(extensible.plugins.ExamplePlugin?.config);
    expect(extensible.plugins.ExamplePlugin?.config).toEqual(plugin.getDefaultConfig());
  });

  test('child: parent-config provided', async () => {
    const plugin = new ExamplePlugin();
    extensible = new AppLikeExtensible({
      plugins: [plugin],
    });
    if (!extensible.config.plugin) {
      extensible.config.plugin = {};
    }
    if (!extensible.config.plugin.ExamplePlugin) {
      extensible.config.plugin.ExamplePlugin = plugin.getDefaultConfig();
    }
    extensible.config.plugin.ExamplePlugin.text = 'parent';
    await extensible.initialize();

    expect(extensible.plugins.ExamplePlugin).toBe(plugin);
    expect(extensible.config.plugin?.ExamplePlugin).toBe(extensible.plugins.ExamplePlugin?.config);
    expect(extensible.plugins.ExamplePlugin?.config).toEqual({
      text: 'parent',
    });
  });

  test('child: constructor config provided', async () => {
    const plugin = new ExamplePlugin({ text: 'constructor' });
    extensible = new AppLikeExtensible({
      plugins: [plugin],
    });
    if (extensible.config.plugin?.ExamplePlugin) {
      extensible.config.plugin.ExamplePlugin.text = 'parent';
    }
    await extensible.initialize();

    expect(extensible.plugins.ExamplePlugin).toBe(plugin);
    expect(extensible.config.plugin?.ExamplePlugin).toBe(extensible.plugins.ExamplePlugin?.config);
    expect(extensible.plugins.ExamplePlugin?.config).toEqual({
      text: 'constructor',
    });
  });

  test('config of children are reference to related config-object in root', async () => {
    const plugin = new ExamplePlugin();
    extensible = new AppLikeExtensible({
      plugins: [plugin],
    });
    await extensible.initialize();
    if (extensible.config.plugin?.ExamplePlugin) {
      extensible.config.plugin.ExamplePlugin.text = 'edited';
    }
    expect(extensible.plugins.ExamplePlugin?.config.text).toEqual('edited');
  });

  test('initialize of children are called if the child has a hook', async () => {
    const plugin = new EmptyPlugin();
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    plugin.initialize = jest.fn(async () => {});
    extensible = new AppLikeExtensible({
      plugins: [plugin],
    });
    await extensible.initialize();
    expect(plugin.initialize).toHaveBeenCalledTimes(1);
  });

  test('nested children are initialized', async () => {
    const plugin = new EmptyPlugin();
    const nested = new ExampleExtensible({
      plugins: [plugin],
    });
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    plugin.initialize = jest.fn(async () => {});
    extensible = new AppLikeExtensible({
      plugins: [nested],
    });
    await extensible.initialize();
    expect(plugin.initialize).toHaveBeenCalledTimes(1);
    expect((extensible.plugins.ExampleExtensible as Extensible).plugins.EmptyPlugin).toBe(plugin);
  });
});

describe('mountPlugins', () => {
  let extensible;

  test('mount of children are called', async () => {
    const plugin = new EmptyPlugin();
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    plugin.mount = jest.fn(async () => {});
    extensible = new AppLikeExtensible({
      plugins: [plugin],
    });
    await extensible.initialize();
    await extensible.mount();
    expect(plugin.mount).toHaveBeenCalledTimes(1);
  });

  test('mount adds plugin to config if none exists', async () => {
    const plugin = new ExamplePlugin();
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    plugin.mount = jest.fn(async () => {});
    extensible = new AppLikeExtensible({
      plugins: [plugin],
    });
    await extensible.initialize();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    delete (extensible as any).config.plugin;
    await extensible.mount();
    expect(plugin.mount).toHaveBeenCalledTimes(1);
  });

  test('config of children are reference to related config-object in root', async () => {
    const plugin = new ExamplePlugin();
    extensible = new AppLikeExtensible({
      plugins: [plugin],
    });
    await extensible.initialize();
    await extensible.mount();
    if (extensible.config.plugin?.ExamplePlugin) {
      extensible.config.plugin.ExamplePlugin.text = 'edited';
    }
    expect(extensible.plugins.ExamplePlugin?.config.text).toEqual('edited');
  });

  test('nested children are mounted', async () => {
    const plugin = new EmptyPlugin();
    const nested = new ExampleExtensible({
      plugins: [plugin],
    });
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    plugin.mount = jest.fn(async () => {});
    extensible = new AppLikeExtensible({
      plugins: [nested],
    });
    await extensible.initialize();
    await extensible.mount();
    expect(plugin.mount).toHaveBeenCalledTimes(1);
  });
});
