---
title: 'App Configuration'
excerpt: 'Learn how to configure a Jovo app and how to add plugins, components, and staging.'
url: 'https://www.jovo.tech/docs/app-config'
---

# App Configuration

The app configuration in `app.ts` is the place where you can add plugins, components, and other configurations to your Jovo app. [For project (CLI) related configuration, take a look here](./project-config.md).

## Introduction

```
📦src
 ┣ 📜app.dev.ts
 ┣ 📜app.ts
 ┗ ...
```

The app configuration files in the `src` folder are the main entry point of your Jovo apps. They usually include the following elements:
- [Components](./components.md) can be registered
- [Plugins](./plugins.md) and [Hooks](./hooks.md) can be added to extend the framework functionality
- [Service providers](./service-providers-dependency-injection.md) can be added for dependency injection
- Framework configurations, like logging behavior, can be modified

Here is an example [`app.ts` file](https://github.com/jovotech/jovo-v4-template/blob/master/src/app.ts):

```typescript
import { App } from '@jovotech/framework';
import { AlexaPlatform } from '@jovotech/platform-alexa';
import { GlobalComponent } from './components/GlobalComponent';
import { LoveHatePizzaComponent } from './components/LoveHatePizzaComponent';
// ...

const app = new App({
  /*
  |--------------------------------------------------------------------------
  | Components
  |--------------------------------------------------------------------------
  |
  | Components contain the Jovo app logic
  | Learn more here: www.jovo.tech/docs/components
  |
  */
  components: [GlobalComponent, LoveHatePizzaComponent],

  /*
  |--------------------------------------------------------------------------
  | Plugins
  |--------------------------------------------------------------------------
  |
  | Includes platforms, database integrations, third-party plugins, and more
  | Learn more here: www.jovo.tech/marketplace
  |
  */
  plugins: [new AlexaPlatform()],

  /*
  |--------------------------------------------------------------------------
  | Other options
  |--------------------------------------------------------------------------
  |
  | Includes all other configuration options like logging
  | Learn more here: www.jovo.tech/docs/app-config
  |
  */
  logging: true,
});
```

Jovo also supports [staging](#staging) that makes it possible to have different app versions for different deployment environments. Each Jovo project usually comes with at least two files for this:
- `app.ts` ([example](https://github.com/jovotech/jovo-v4-template/blob/master/src/app.ts)): Default configurations.
- `app.dev.ts` ([example](https://github.com/jovotech/jovo-v4-template/blob/master/src/app.dev.ts)): Configurations for local development (for example [FileDb](https://www.jovo.tech/marketplace/db-filedb), [Express server](https://www.jovo.tech/marketplace/server-express) and the [Jovo Debugger](https://www.jovo.tech/docs/debugger)) that get merged into `app.ts`.

Learn more about Jovo app configuration in the following sections:
- [Ways to add configurations](#ways-to-add-configurations): Multiple methods are supported, depending on the use case
- [Configuration elements](#configuration-elements): All elements like components, plugins, and logging
- [Staging](#staging): Run your Jovo app in different environments


## Ways to Add Configurations

There are three ways how app configurations can be done:

- Using the `new App()` constructor in `app.ts` for default configurations.
- Using `app.configure()` for stage-specific configurations.
- Using `app.use()` to add specific plugins and components anywhere in the app.

In the `app.ts` ([example](https://github.com/jovotech/jovo-v4-template/blob/master/src/app.ts)), the configuration is added like this:

```typescript
import { App } from '@jovotech/framework';
// ...

const app = new App({
  // Configuration
});
```

On top of the default configuration, you can add [stages](#staging) with specific options that can be added like this, for example in an `app.dev.ts` ([example](https://github.com/jovotech/jovo-v4-template/blob/master/src/app.dev.ts)) file:

```typescript
import { app } from './app';
// ...

app.configure({
  // Configuration
});
```

Both the constructor and `configure()` support the full range of [configuration elements](#configuration-elements).

The third option is the `use()` method. It allows you to add plugins and components anywhere in the app:

```typescript
import { app } from './app';
import { SomePlugin } from './plugin';
// ...

app.use(
  new SomePlugin({
    // Plugin Configuration
  }),
);
```

## Configuration Elements

The configuration object that can be passed to both the constructor and the `configure()` method contains [components](#components), [plugins](#plugins), [providers](#providers), [logging](#logging), and [routing](#routing).

```typescript
{
  components: [
    // ...
  ],
  plugins: [
    // ...
  ],
  providers: [
    // ...
  ],
  logging: {
    // ...
  },
  routing: {
    // ...
  }
}
```

### Components

You can [register root components](./components.md#register-root-components) with your app by adding them to the `components` array:

```typescript
import { GlobalComponent } from './components/GlobalComponent';
// ...

{
  components: [
    GlobalComponent
    // ...
  ],
  // ...
}
```

[Learn more about component registration here](./components.md#register-root-components).

### Plugins

You can add plugins to the `plugins` array like this:

```typescript
import { AlexaPlatform } from '@jovotech/platform-alexa';

// ...

{
  plugins: [
    new AlexaPlatform({
      // Plugin Configuration
    })
    // ...
  ],
  // ...
}
```

Each plugin has its own configuration options which you can find in the respective plugin's documentation.

Additionally, each plugin config includes a `skipTests` option that makes sure that [unit tests](https://www.jovo.tech/docs/unit-testing) don't use that plugin:

```typescript
{
  plugins: [
    new SomePlugin({
      // ...
      skipTests: true,
    })
  ],
}
```

You can also access a specific plugin like this:

```typescript
app.plugins.<PluginConstructor>

// Example
app.plugins.SomePlugin
```

This can be helpful if you want to add additional configurations to the default plugin config outside `app.ts`. See [staging](#staging) for more information.

### Providers

You can add service providers for [dependency injection](./services-providers-dependency-injection.md) like this:

```typescript
import { OrderService } from './services/OrderService';
// ...

{
  // ...

  providers: [
    OrderService,
    // ...
  ],
}
```

It's also possible to use the `provide` option to specify a provider class or token. [Learn more about the different provider types here](./service-providers-dependency-injection.md#types-of-providers).

```typescript
{
  providers: [
    {
      provide: OrderService,
      useClass: MockOrderService,
    },
    // ...
  ]
}
```


### Logging

[Logging](./logging.md) is enabled by adding the following to the app config:

```typescript
{
  // ...

  logging: true,
}
```

You can also add granular configurations by turning `logging` into an object, for example:

```typescript
{
  // ...

  logging: {
    request: true,
    response: false,
    // ...
  }
}
```

[Learn more about logging and its configuration options here](./logging.md).

### Routing

[Routing](./routing.md) configurations are added to the `routing` object:

```typescript
{
  routing: {
    intentMap: {},
    intentsToSkipUnhandled: [],
  },
  // ...
}
```

#### intentMap

Especially with apps that work across different platforms, it might happen that different platforms use different intent names.

`intentMap` provides a global way to map incoming intents to a unified intent that can be used in your [handler routing](./handlers.md#handler-routing-and-the-handle-decorator).

```typescript
{
  routing: {
    intentMap: {
      'AMAZON.HelpIntent': 'HelpIntent',
      // ...
    },
    // ...
  },
  // ...
}
```

It's also possible to add an `intentMap` to platforms like [Alexa](https://www.jovo.tech/marketplace/platform-alexa). The platform `intentMap` then gets merged into the global `routing.intentMap`.

```typescript
{
  plugins: [
    new AlexaPlatform({
      intentMap: { // Gets merged into global intentMap below
        'AMAZON.HelpIntent': 'HelpIntent',
        // ...
      },
    }),
    // ...
  ],
  routing: {
    intentMap: {
      'HelloIntent': 'StartIntent',
      // ...
    },
    // ...
  },
}
```

For platforms like Alexa that already come with an intent in their requests, the mapped intent name is added to the root of the [`$input` object](./input.md):

```typescript
{
  type: 'INTENT',
  intent: 'HelpIntent',
}
```

If you're using an [NLU integration](./nlu.md), the original intent stays in the `nlu` property and the mapped intent is added to the root of `$input`:

```typescript
{
  type: 'TEXT',
  text: 'My name is Max',
  nlu: {
    intent: 'MyNameIsIntent',
    entities: {
      name: {
        value: 'Max',
      },
    },
  },
  intent: 'MappedMyNameIsIntent',
}
```

#### intentsToSkipUnhandled

`intentsToSkipUnhandled` includes all intents that shouldn't be fulfilled by an [`UNHANDLED` handler](./handlers.md#unhandled).

```typescript
{
  routing: {
    intentsToSkipUnhandled: [
      'HelpIntent'
    ],
    // ...
  },
  // ...
}
```

[Learn more about `intentsToSkipUnhandled` here](./routing.md#intentstoskipunhadled).

## Staging

Stage-specific configurations from a file called `app.<stage>.ts` get merged into the default configuration from `app.ts`.

For example, most Jovo projects include an `app.dev.ts` [(example)](https://github.com/jovotech/jovo-v4-template/blob/master/src/app.dev.ts) file that comes with specific configuration for local development ([FileDb](https://www.jovo.tech/marketplace/db-filedb), [Express server](https://www.jovo.tech/marketplace/server-express) and the [Jovo Debugger](https://www.jovo.tech/docs/debugger)).

You can create a new stage like this:

```sh
$ jovo new:stage <stage>

# Example that creates a new app.prod.ts file
$ jovo new:stage prod
```

This creates a new file `app.prod.ts`. In the process, you can select plugins and a server integration to work with this stage. You can find an [example `app.prod.ts` file here](https://github.com/jovotech/jovo-sample-alexa-googleassistant-lambda/blob/main/src/app.prod.ts).

Typically, a stage app config uses the `configure()` method to modify the configuration.

```typescript
import { app } from './app';
// ...

app.configure({
  // Configuration
});
```

It is also possible to reference a plugin from the default configuration in `app.ts` and add plugins to it using the `use()` method.

Here is an example for [Dashbot Analytics](https://www.jovo.tech/marketplace/analytics-dashbot) being added to [Alexa](https://www.jovo.tech/marketplace/platform) in `app.prod.ts`:

```typescript
// Example: app.prod.ts

import { app } from './app';
import { DashbotAnalytics } from '@jovotech/analytics-dashbot';
// ...

app.plugins.AlexaPlatform.use(new DashbotAnalytics({ apiKey: '<yourApiKey>' }));
```
