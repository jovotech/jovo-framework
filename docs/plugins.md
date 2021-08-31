# Jovo Plugins

Learn how you can build your own plugins to customize and extend the Jovo Framework.

- [Introduction](#introduction)
- [Jovo Plugin Structure](#jovo-plugin-structure)
  - [Plugin Configuration](#plugin-configuration)
- [Add a Plugin to the Jovo App](#add-a-plugin-to-the-jovo-app)


## Introduction

Jovo Plugins allow you to hook into the Jovo middleware architecture to extend or modify the framework without having to change its core code. Learn more about all middlewares in the [RIDR Lifecycle documentation](./ridr-lifecycle.md).

Here are a few use cases where plugins can be helpful:

* Modify [Jovo properties](./jovo-properties.md): For example, you could hook into `before.platform.output` and make changes to the [output](./output.md) before it gets turned into a native platform response.
* Logging: You could hook into specific middlewares and log things. For example, you could could send requests and responses to a monitoring service.
* Retrieve data: You could call an API, for example a content management system (CMS), and store the data in a property to use in [handlers](./handlers.md) or [output classes](./output-classes.md).
* Our [database](./databases.md), [NLU](./nlu.md), and [platform integrations](./platforms.md) are also plugins.


Learn more about the [structure of a Jovo plugin](#jovo-plugin-structure) below and how you can [add it to a Jovo app](#add-a-plugin-to-the-jovo-app).


## Jovo Plugin Structure

We recommend putting each plugin into a separate file in a `plugins` folder. For example, this is how a file `plugins/SomePlugin.ts` could look like:

```typescript
import { Jovo, App, Plugin, Extensible, InvalidParentError } from '@jovotech/framework';

export class SomePlugin extends Plugin {

    install(app: Extensible) {
        if (!(app instanceof App)) {
            throw new InvalidParentError(this.constructor.name, App);
        }
        app.middlewareCollection.use('<middleware>', this.someMethod);
    }

    someMethod(jovo: Jovo) {
      // ...
    }

    getDefaultConfig() {
        return {};
    }
}
```

It includes the following methods:

* `install`: Use the `middlewareCollection.use` method to hook into middlewares. You can add `before` and `after`, e.g. `before.platform.output`. Find all middlewares in the [RIDR Lifecycle docs](./ridr-lifecycle.md).
* Some method (in this example `someMethod`) that gets called when the middleware referenced in `install` gets executed. This is where your plugin gets to work. Through the `jovo` parameter, you have access to all [Jovo properties](./jovo-properties.md), e.g. `jovo.$output`.
* `getDefaultConfig`: If your plugin uses configuration, you can return the default config here. Learn more in the [plugin configuration](#plugin-configuration) section below.


### Plugin Configuration

If your plugin needs configuration (for example API keys), you can extend `PluginConfig` and pass your plugin config interface to your plugin (see `Plugin<SomePluginConfig>` below).

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

You can access the config with `jovo.$config.plugin!.SomePlugin`.


## Add a Plugin to the Jovo App

Import the plugin and add it to the [app configuration](./app-config.md) like this.

```typescript
import { SomePlugin } from './plugins/SomePlugin';

// ...

const app = new App({

  plugins: [
    new SomePlugin(),
    // ...
  ]

  // ...

});
```

If your plugin uses [configuration](#plugin-configuration), you can add it like this:

```typescript
new SomePlugin({
  someConfig: 'someValue',
})
```