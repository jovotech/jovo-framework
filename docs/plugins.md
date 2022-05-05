---
title: 'Plugins'
excerpt: 'Learn how you can build your own plugins to customize and extend the Jovo Framework.'
---

# Plugins

Learn how you can build your own plugins to customize and extend the Jovo Framework. For lightweight plugins, take a look at [hooks](./hooks.md).

## Introduction

Jovo plugins allow you to hook into the Jovo [middleware architecture](./middlewares.md) to extend or modify the framework without having to change its core code. Usually, this is used to hook into the [RIDR Lifecycle](./ridr-lifecycle.md), but it's also possible to hook into [events](./middlewares.md#event-middlewares).

Here are a few use cases where plugins can be helpful:

- Modify [Jovo properties](./jovo-properties.md): For example, you could hook into `before.platform.output` and make changes to the [output](./output.md) before it gets turned into a native platform response.
- Logging: You could hook into specific middlewares and log things. For example, you could could send requests and responses to a monitoring service.
- Retrieve data: You could call an API, for example a content management system (CMS), and store the data in a property to use in [handlers](./handlers.md) or [output classes](./output-classes.md).
- Our [database](./databases.md), [NLU](./nlu.md), and [platform integrations](./platforms.md) are also plugins.

We recommend first taking a look at the [get started with Jovo plugins](#get-started-with-jovo-plugins) section before diving deeper into [advanced Jovo plugins](#advanced-jovo-plugins).

## Get Started with Jovo Plugins

This section provides a first overview of Jovo plugins. First we're going to take a look at the [basic plugin structure](#basic-plugin-structure), then at potential [plugin configurations](#plugin-configuration). After that, we're going to [add the plugin to our Jovo app](#add-a-plugin-to-the-jovo-app).

### Basic Plugin Structure

Here is an example of a basic plugin called `SomePlugin`:

```typescript
// src/plugins/SomePlugin.ts

import {
  Jovo,
  HandleRequest,
  Plugin,
  PluginConfig,
  Extensible,
  InvalidParentError,
} from '@jovotech/framework';

export class SomePlugin extends Plugin {
  mount(extensible: Extensible) {
    if (!(extensible instanceof HandleRequest)) {
      throw new InvalidParentError(this.constructor.name, HandleRequest);
    }
    extensible.middlewareCollection.use('<middleware>', (jovo) => {
      return this.someMethod(jovo);
    });
  }

  someMethod(jovo: Jovo) {
    // ...
  }

  getDefaultConfig(): PluginConfig {
    return {};
  }
}
```

The plugin above includes the following methods:

- `mount`: Use the `middlewareCollection.use` method to hook into middlewares. You can add `before` and `after`, e.g. `before.platform.output`. Find all middlewares in the [RIDR docs](./ridr-lifecycle.md). Depending on the type of the plugin, it's also possible to use different (or additional) methods like `install`. [Learn more about this and the plugin lifecycle below](#plugin-lifecycle).
- Some method (in this example `someMethod`, but you can choose any name) that gets called when the middleware referenced in `install` gets executed. This is where your plugin gets to work. Through the `jovo` parameter, you have access to all [Jovo properties](./jovo-properties.md), e.g. `jovo.$output`.
- `getDefaultConfig`: If your plugin uses configuration, you can return the default config here. This method has to be implemented by every plugin, even if it just returns an empty object as shown in the example above. Learn more in the [plugin configuration](#plugin-configuration) section below.

We recommend putting each plugin into a separate file in a `plugins` folder. In this case, the `SomePlugin` above would be located at `plugins/SomePlugin.ts`.

### Plugin Configuration

If your plugin needs configuration (for example API keys), you can pass a generic type parameter that extends `PluginConfig` to `Plugin` (see `Plugin<SomePluginConfig>` below).

For `SomePlugin` it could look like this:

```typescript
import { PluginConfig /* ... */ } from '@jovotech/framework';

// ...

export interface SomePluginConfig extends PluginConfig {
  someConfig: string;
  // ...
}

export class SomePlugin extends Plugin<SomePluginConfig> {
  // ...

  someMethod(jovo: Jovo) {
    console.log(this.config.someConfig);

    // ...
  }

  getDefaultConfig(): SomePluginConfig {
    return {
      someConfig: 'someString',
    };
  }
}
```

The following properties and methods are related to the configuration:

- `config`: The actual configuration of the plugin. Can be accessed from plugin methods using `this.config`.
- `initConfig`: The initial configuration that was passed in the constructor if there was any. Can be accessed from plugin methods using `this.initConfig`.
- `getDefaultConfig()`: Returns the default configuration of the plugin. Has to be implemented by every plugin.

Configuration can be passed to the constructor of the plugin (see [add a plugin to the Jovo app](#add-a-plugin-to-the-jovo-app) below), which will be merged with the default configuration from `getDefaultConfig()`. If no configuration is passed, the default configuration will be used.

### Add a Plugin to the Jovo App

Import the plugin and add it to the [app configuration](./app-config.md) like this:

```typescript
import { SomePlugin } from './plugins/SomePlugin';
// ...
const app = new App({
  plugins: [
    new SomePlugin(),
    // ...
  ],
  // ...
});
```

You can also add it by calling `use`:

```typescript
app.use(new SomePlugin());
```

If your plugin uses [configuration](#plugin-configuration), you can add it to the constructor like this:

```typescript
new SomePlugin({
  someConfig: 'someValue',
});
```

## Advanced Jovo Plugins

After getting an initial understanding of how to create and add a plugin from the [getting started section](#get-started-with-jovo-plugins), let's dive a bit deeper and take a look under the hood and at some advanced plugin structures.

First, we're going to take a look at the [plugin lifecycle](#plugin-lifecycle) and how [plugin mounting](#plugin-mounting) works. We'll also learn more about parent and child plugins using the [Extensible structure](#jovo-extensible-structure).

If you want to dive even deeper, take a look at the [`Plugin` class here](https://github.com/jovotech/jovo-framework/blob/v4dev/framework/src/Plugin.ts).

### Plugin Lifecycle

In the [basic plugin structure section](#basic-plugin-structure), we used the `mount` method to define which middlewares should be used for this plugin:

```typescript
import { Jovo, HandleRequest, Plugin, Extensible, InvalidParentError } from '@jovotech/framework';

export class SomePlugin extends Plugin {
  mount(extensible: Extensible) {
    if (!(extensible instanceof HandleRequest)) {
      throw new InvalidParentError(this.constructor.name, HandleRequest);
    }
    extensible.middlewareCollection.use('<middleware>', (jovo) => {
      return this.someMethod(jovo);
    });
  }

  // ...
}
```

It's also possible to use other methods for this, which we call plugin lifecycle hooks. Below is a table of all available methods:

| Name         | Trigger                                                                           | Use Case                                                             | Notes                    |
| ------------ | --------------------------------------------------------------------------------- | -------------------------------------------------------------------- | ------------------------ |
| `install`    | When the plugin is installed via `use` (once)                                     | Installing other plugins as well as modifying `App`                  | Can only be synchronous. |
| `initialize` | When `App.initialize` is called (once)                                            | Time-consuming actions like API-calls that only need to be done once | Can be asynchronous.     |
| `mount`      | When plugins are [mounted](#plugin-mounting) onto `HandleRequest` (every request) | Registering middleware-functions                                     | Can be asynchronous.     |
| `dismount`   | After the [RIDR Lifecycle](./ridr-lifecycle.md) (every request)                   | Cleanup                                                              | Can be asynchronous.     |

It's important to note that the `install` and `initialize` plugin lifecycle hooks don't have access to `HandleRequest`, since they happen when the app gets started, before the request gets handled. Learn more in the [plugin mounting](#plugin-mounting) section below.

Here is how `install` looks like with `App` instead of `HandleRequest`:

```typescript
import { Jovo, App, Plugin, Extensible, InvalidParentError } from '@jovotech/framework';

export class SomePlugin extends Plugin {
  install(extensible: Extensible) {
    if (!(extensible instanceof App)) {
      throw new InvalidParentError(this.constructor.name, App);
    }
    extensible.middlewareCollection.use('<middleware>', (jovo) => {
      return this.someMethod(jovo);
    });
  }

  // ...
}
```

For more details about signatures, take a look at the [`Plugin` class here](https://github.com/jovotech/jovo-framework/blob/v4dev/framework/src/Plugin.ts).

### Plugin Mounting

On every request, the mounting takes place, which consists of the following steps:

1. Every plugin and nested child plugin in `App` is cloned.
2. The cloned plugins get referenced in the `config` and `plugins` of `HandleRequest` under same path as they were for `App`.

The `config` of the plugins is now the request config. Changes to the request config are just applied during this request and do not mutate the original config.

Due to the request config getting set during mounting, the `mount`-[lifecycle-hook](#plugin-lifecycle) should be used for registering middlewares.

### Jovo Properties

You can also add your own [Jovo properties](./jovo-properties.md#custom-properties) using a plugin:

```typescript
// MyPropertyPlugin.ts

import {
  Jovo,
  HandleRequest,
  Plugin,
  PluginConfig,
  Extensible,
  InvalidParentError,
} from '@jovotech/framework';

// Add the $myProperty type to the Jovo class
declare module '@jovotech/framework/dist/types/Jovo' {
  interface Jovo {
    $myProperty: MyPropertyPlugin;
  }
}

export class MyPropertyPlugin extends Plugin {
  mount(extensible: Extensible) {
    if (!(extensible instanceof HandleRequest)) {
      throw new InvalidParentError(this.constructor.name, HandleRequest);
    }

    // Add the $myProperty property to the Jovo object
    extensible.middlewareCollection.use('before.request.start', (jovo) => {
      jovo.$myProperty = new MyPropertyPlugin(this);
    });
  }

  // Sample method that can be called using $myProperty
  myFunction(jovo: Jovo) {
    // ...
  }

  getDefaultConfig(): PluginConfig {
    return {};
  }
}
```

As a result, you can use this in your handler:

```typescript
this.$myProperty.myFunction();
```

### Jovo Extensible Structure

Besides normal plugins, there are also plugins that extend `Extensible` which itself extends `Plugin`.

The main difference to normal plugins is that these plugins have a `MiddlewareCollection` and can have child plugins.

`Extensible` has two optional generic type parameters:

1. The type of the plugin's configuration that has to extend `ExtensibleConfig`
2. The names of the middlewares in case type-hinting for the `MiddlewareCollection` should work

Every class that extends `Platform` as well as `App` extend `Extensible`.

#### Add a Plugin as a Child

Similar to the [add plugin to your Jovo app section](#add-a-plugin-to-the-jovo-app), you can add the child plugin to the extensible plugin either by using the `plugins` array of the constructor or the `use` method.

Here's how you can add it using the constructor:

```typescript
import { SomeExtensiblePlugin } from './plugins/SomeExtensiblePlugin';
import { SomePlugin } from './plugins/SomePlugin';
// ...

const app = new App({
  plugins: [
    new SomeExtensiblePlugin({
      plugins: [new SomePlugin()],
    }),
    // ...
  ],
  // ...
});
```

And here's a version with `use`:

```typescript
const extensiblePlugin = new SomeExtensiblePlugin();
extensiblePlugin.use(new SomePlugin());
```
