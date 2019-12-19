import _merge = require('lodash.merge');
import { Extensible, ExtensibleConfig, Plugin, PluginConfig } from '../src';

//
//
interface ConfigBase extends ExtensibleConfig {
  key?: string;
}

class BaseClass extends Extensible {
  config: ConfigBase = {
    key: 'value',
    plugin: {},
  };

  constructor(config?: ConfigBase) {
    super(config);

    if (config) {
      this.config = _merge(this.config, config);
    }
  }

  /**
   * Dummy install implementation
   */
  install() {
    // tslint:disable-line:no-empty
  }
}

interface ConfigPluginA extends PluginConfig {
  pluginA: string;
}

//
class PluginA implements Plugin {
  config: ConfigPluginA = {
    pluginA: 'defaultA',
  };

  constructor(config?: ConfigPluginA) {
    if (config) {
      this.config = _merge(this.config, config);
    }
  }

  /**
   * Dummy install implementation
   */
  install(parent: any) {
    // tslint:disable-line
  }
}

class PluginB implements Plugin {
  /**
   * Dummy install implementation
   */
  install(parent: any) {
    // tslint:disable-line
  }
}

interface ConfigExtensiblePlugin extends ExtensibleConfig {
  key?: string;
  plugins?: any; // tslint:disable-line
}

class ExtensiblePlugin extends Extensible implements Plugin {
  config: ConfigExtensiblePlugin = {
    key: 'ExtensiblePlugin',
    plugins: {},
  };

  constructor(config?: ConfigBase) {
    super(config);
    if (config) {
      this.config = _merge(this.config, config);
    }
  }

  /**
   * Dummy install implementation
   */
  install(parent: any) {
    // tslint:disable-line
  }
}

test('test plugins in base class plugins map', () => {
  const baseClass = new BaseClass();
  baseClass.use(new PluginA());
  baseClass.use(new PluginB());
  expect(baseClass.$plugins.has('PluginA')).toBe(true);
  expect(baseClass.$plugins.has('PluginB')).toBe(true);
});
test('test PluginA default config', () => {
  const baseClass = new BaseClass();
  baseClass.use(new PluginA());

  expect((baseClass.$plugins.get('PluginA') as PluginA).config.pluginA).toBe('defaultA');
});

test('test PluginA constructor config', () => {
  const baseClass = new BaseClass();
  baseClass.use(
    new PluginA({
      pluginA: 'foobar',
    }),
  );
  expect((baseClass.$plugins.get('PluginA') as PluginA).config.pluginA).toBe('foobar');
});

test('test PluginA config from plugins-baseclass config', () => {
  const baseClass = new BaseClass({
    plugin: {
      PluginA: {
        pluginA: 'fromBaseClass',
      },
    },
  });
  baseClass.use(new PluginA());
  expect((baseClass.$plugins.get('PluginA') as PluginA).config.pluginA).toBe('fromBaseClass');
});

test('test PluginA constructor config priority', () => {
  const baseClass = new BaseClass({
    plugin: {
      PluginA: {
        pluginA: 'fromBaseClass',
      },
    },
  });

  baseClass.use(
    new PluginA({
      pluginA: 'fromConstructor',
    }),
  );
  expect((baseClass.$plugins.get('PluginA') as PluginA).config.pluginA).toBe('fromConstructor');
});

test('test ExtensiblePlugin', () => {
  const baseClass = new BaseClass({
    plugin: {
      ExtensiblePlugin: {
        key: 'ExtensiblePlugin from BaseAppConfig',
      },
    },
  });

  const extensiblePlugin = new ExtensiblePlugin();
  extensiblePlugin.use(
    new PluginA({
      pluginA: 'fromConstructor',
    }),
  );

  baseClass.use(extensiblePlugin);
  expect((baseClass.$plugins.get('ExtensiblePlugin') as ExtensiblePlugin).config.key).toBe(
    'ExtensiblePlugin from BaseAppConfig',
  );

  const extensiblePluginFromMap = baseClass.$plugins.get('ExtensiblePlugin') as ExtensiblePlugin;

  expect((extensiblePluginFromMap.$plugins.get('PluginA') as PluginA).config.pluginA).toBe(
    'fromConstructor',
  );
});
