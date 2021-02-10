"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _merge = require("lodash.merge");
const src_1 = require("../src");
class BaseClass extends src_1.Extensible {
    constructor(config) {
        super(config);
        this.config = {
            key: 'value',
            plugin: {},
        };
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
//
class PluginA {
    constructor(config) {
        this.config = {
            pluginA: 'defaultA',
        };
        if (config) {
            this.config = _merge(this.config, config);
        }
    }
    /**
     * Dummy install implementation
     */
    install(parent) {
        // tslint:disable-line
    }
}
class PluginB {
    /**
     * Dummy install implementation
     */
    install(parent) {
        // tslint:disable-line
    }
}
class ExtensiblePlugin extends src_1.Extensible {
    constructor(config) {
        super(config);
        this.config = {
            key: 'ExtensiblePlugin',
            plugins: {},
        };
        if (config) {
            this.config = _merge(this.config, config);
        }
    }
    /**
     * Dummy install implementation
     */
    install(parent) {
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
    expect(baseClass.$plugins.get('PluginA').config.pluginA).toBe('defaultA');
});
test('test PluginA constructor config', () => {
    const baseClass = new BaseClass();
    baseClass.use(new PluginA({
        pluginA: 'foobar',
    }));
    expect(baseClass.$plugins.get('PluginA').config.pluginA).toBe('foobar');
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
    expect(baseClass.$plugins.get('PluginA').config.pluginA).toBe('fromBaseClass');
});
test('test PluginA constructor config priority', () => {
    const baseClass = new BaseClass({
        plugin: {
            PluginA: {
                pluginA: 'fromBaseClass',
            },
        },
    });
    baseClass.use(new PluginA({
        pluginA: 'fromConstructor',
    }));
    expect(baseClass.$plugins.get('PluginA').config.pluginA).toBe('fromConstructor');
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
    extensiblePlugin.use(new PluginA({
        pluginA: 'fromConstructor',
    }));
    baseClass.use(extensiblePlugin);
    expect(baseClass.$plugins.get('ExtensiblePlugin').config.key).toBe('ExtensiblePlugin from BaseAppConfig');
    const extensiblePluginFromMap = baseClass.$plugins.get('ExtensiblePlugin');
    expect(extensiblePluginFromMap.$plugins.get('PluginA').config.pluginA).toBe('fromConstructor');
});
//# sourceMappingURL=extensible.test.js.map