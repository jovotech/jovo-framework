# Jovo Plugins

Learn how you can build your own plugins to customize and extend the Jovo Framework.

- [Introduction](#introduction)
- [Jovo Plugin Structure](#jovo-plugin-structure)
  - [Plugin Lifecycle](#plugin-lifecycle)
  - [Plugin Configuration](#plugin-configuration)
  - [Plugin Mounting](#plugin-mounting)
- [Jovo Extensible Structure](#jovo-extensible-structure)
  - [Add a Plugin as a child](#add-a-plugin-as-a-child)
- [Add a Plugin to the Jovo App](#add-a-plugin-to-the-jovo-app)

## Introduction

Jovo Plugins allow you to hook into the Jovo middleware architecture to extend or modify the framework without having to change its core code. Learn more about all middlewares in the [RIDR Lifecycle documentation](./ridr-lifecycle.md).

Here are a few use cases where plugins can be helpful:

- Modify [Jovo properties](./jovo-properties.md): For example, you could hook into `before.platform.output` and make changes to the [output](./output.md) before it gets turned into a native platform response.
- Logging: You could hook into specific middlewares and log things. For example, you could could send requests and responses to a monitoring service.
- Retrieve data: You could call an API, for example a content management system (CMS), and store the data in a property to use in [handlers](./handlers.md) or [output classes](./output-classes.md).
- Our [database](./databases.md), [NLU](./nlu.md), and [platform integrations](./platforms.md) are also plugins.

Learn more about the [structure of a Jovo plugin](#jovo-plugin-structure) below and how you can [add it to a Jovo app](#add-a-plugin-to-the-jovo-app).

## Jovo Plugin Structure

As a bare minimum, a plugin is a class that correctly extends [`Plugin`](../framework/src/Plugin.ts).

Here is an example of a plugin `SomePlugin`:

```typescript
import { Jovo, App, Plugin, Extensible, InvalidParentError } from '@jovotech/framework';

export class SomePlugin extends Plugin {
  install(app: Extensible) {
    if (!(app instanceof App)) {
      throw new InvalidParentError(this.constructor.name, App);
    }
    app.middlewareCollection.use('<middleware>', (jovo) => {
      return this.someMethod(jovo);
    });
  }

  someMethod(jovo: Jovo) {
    // ...
  }

  getDefaultConfig() {
    return {};
  }
}
```

We recommend putting each plugin into a separate file in a `plugins` folder. In this case, the `SomePlugin` above would be located at `plugins/SomePlugin`.

### Plugin Lifecycle

Every plugin can have the following lifecycle-hooks by implementing the respective method:

| name       | trigger                                                                      | use-case                                                             | notes                    |
| ---------- | ---------------------------------------------------------------------------- | -------------------------------------------------------------------- | ------------------------ |
| install    | plugin is installed via `use` (once)                                         | installing other plugins as well as modifying `App`                  | Can only be synchronous. |
| initialize | `App`.`initialize` is called (once)                                          | time-consuming actions like API-calls that only need to be done once | Can be asynchronous.     |
| mount      | plugins are [mounted](#plugin-mounting) onto `HandleRequest` (every request) | registering middleware-functions                                     | Can be asynchronous.     |
| dismount   | after the RIDR-lifecycle (every request)                                     | cleanup                                                              | Can be asynchronous.     |

For more details about signatures, take a look at the [here](../framework/src/Plugin.ts).

### Plugin Configuration

Every plugin can have a configuration (for example API keys) by passing a generic type parameter that extends `PluginConfig` to `Plugin`.

For `SomePlugin` it could look like this:

```typescript
import { PluginConfig } from '@jovotech/framework';

// ...

export interface SomePluginConfig extends PluginConfig {
  someConfig: string;
  // ...
}

export class SomePlugin extends Plugin<SomePluginConfig> {
  // ...

  getDefaultConfig(): SomePluginConfig {
    return {
      someConfig: 'someString',
    };
  }
}
```

The following properties and methods are related to the configuration:

- `config`: The actual configuration of the plugin
- `initConfig`: The initial configuration that was passed in the constructor if there was any
- `getDefaultConfig()`: Returns the default configuration of the plugin. Has to be implemented by every plugin.

For more details about signatures and types, take a look at the [here](../framework/src/Plugin.ts).

Configuration can be passed to the constructor of the plugin which will be merged with the default configuration resulting from `getDefaultConfig()`, otherwise the default configuration will be used.

### Plugin Mounting 

On every request, the mounting takes place, which consists of the following steps:

1. Every plugin and nested child-plugin in `App` is cloned
2. The cloned plugins get referenced in the `config` and `plugins` of `HandleRequest` under same path as they were for `App`

The `config` of the plugins is now the request-config. Changes to the request-config are just applied during this request and do not mutate the original config.

Due to the request-config getting set during mounting, the `mount`-[lifecycle-hook](#plugin-lifecycle) should be used for registering middlewares.

## Jovo Extensible Structure

Besides normal plugins, there are also plugins that extend `Extensible` which itself extends `Plugin`.

The main difference to normal plugins is, that these plugins have a `MiddlewareCollection` and can have child-plugins.

`Extensible` has two optional generic type parameters:

1. The type of the plugin's configuration that has to extend `ExtensibleConfig`
2. The names of the middlewares in case type-hinting for the `MiddlewareCollection` should work

Every class that extends `Platform`, as well as `App` extend `Extensible`.

### Add a Plugin as a child

Plugins can be added to the extensible on the following ways:

- `plugins` in constructor-configuration

```typescript
import { SomeExtensible } from './plugins/SomeExtensible';
import { SomePlugin } from './plugins/SomePlugin';

const extensible = new SomeExtensible({
  plugins: [new SomePlugin()],
});
```

- calling `use` of the extensible

```typescript
import { SomeExtensible } from './plugins/SomeExtensible';
import { SomePlugin } from './plugins/SomePlugin';

const extensible = new SomeExtensible();
extensible.use(new SomePlugin());
```

## Add a Plugin to the Jovo App

Because `App` extends `Extensible` [adding plugins](#add-a-plugin-as-a-child) is the same procedure and can be done the following ways:

- [app configuration](./app-config.md)

```typescript
import { SomePlugin } from './plugins/SomePlugin';

const app = new App({
  plugins: [new SomePlugin()],
});
```

- calling `use` of the app

```typescript
import { SomePlugin } from './plugins/SomePlugin';

const app = new App();
app.use(new SomePlugin());
```
