---
title: 'Migration from v3'
excerpt: 'Learn how to migrate Jovo v3 projects to Jovo v4.'
---

# Migration from Jovo v3

We just released our biggest update so far, Jovo v4! Learn how to migrate your Jovo `v3` projects to `v4`, or check out our [getting started guide](./getting-started.md).

## Introduction

With Jovo `v4`, we've completely redesigned how Jovo apps are built. Over the last year, we translated everything we learned from 4 years Jovo into a completely new framework.

In this migration guide, you will learn how to upgrade your Jovo `v3` apps to `v4`. We recommend creating a fresh Jovo `v4` project (by following our [getting started guide](./getting-started.md)) and then moving over the pieces step by step.

The [TypeScript vs JavaScript](#typescript-vs-javascript) section shows the differences of using Jovo in the two programming languages.

The [new concepts](#new-concepts) section introduces new important elements of building a Jovo app, especially [components](#components-vs-states), [handlers](#handlers-vs-intents), and [output](#output).

The [configuration](#configuration) section highlights changes to how the [app](#app-configuration), [project (CLI)](#project-configuration), [Debugger](#debugger-configuration), and [models](#models) are configured.

The [updated concepts](#updated-concepts) section includes Jovo features that are similar to `v3`, but received an upgrade, for example [naming conventions](#naming-conventions), [unit testing](#unit-testing) and [entities](#entities-vs-inputs).

The [use `v4` and `v3` in parallel](#use-v4-and-v3-in-parallel) section describes how you can build some projects in `v4` (using the latest CLI), while still being able to maintain older projects.

The [integrations and plugins](#integrations-and-plugins) section shows a few more examples of smaller changes to existing Jovo extensions. Take a look at the [Jovo Marketplace](https://www.jovo.tech/marketplace) to find all up to date integrations.

## TypeScript vs JavaScript

Jovo `v4` comes with major improvements to its underlying TypeScript architecture, using modern features that enable us to enhance the development experience with features like decorators and type inference.

Although we recommend using `v4` with TypeScript, you are still able to use it with JavaScript. You can find the difference in the [TS](https://github.com/jovotech/jovo-v4-template) and [JS](https://github.com/jovotech/jovo-v4-template-js) templates.

One of the main improvements in Jovo `v4` is the possibilities to use [decorators as part of handlers](./handlers.md#handler-routing-and-the-handle-decorator). This allows you to have handlers respond to more than just an intent name, making the development more powerful and structured:

```typescript
// v3
ShowMenuIntent() {
  // ...
}

// v4
@Handle({
  intents: ['ShowMenuIntent', 'YesIntent']
  platforms: ['alexa'],
})
showMenu() {
  // ...
}
```

While decorators are a feature that is not supported by JavaScript yet, it is possible using them in Jovo `v4` JS projects. We use [Babel](https://babeljs.io/) to transpile the code into a correct JS format.

## New Concepts

There are quite a few concepts that make Jovo `v4` more powerful, including:

- [Components](#components-vs-states): Reusable elements that are similar to states in Jovo `v3`
- [Handlers](#handlers-vs-intents): Methods of a component, similar to intent handlers in `v3`
- [Output](#output): What you return to the user, similar to `tell`/`ask` in `v3`
- [Input](#input): An object that includes structured meaning derived from the user request

### Components vs States

> [Learn more about components here](./components.md).

A Jovo component is an isolated part of your app that handles a specific task. Here is an example component with a `START` handler (the entry point when another component [redirects](https://www.jovo.tech/docs/handlers#redirect-to-components) or [delegates](https://www.jovo.tech/docs/handlers#delegate-to-components) to it):

```typescript
// src/components/YourComponent.ts

import { Component, BaseComponent } from '@jovotech/framework';

@Component()
class YourComponent extends BaseComponent {
  START() {
    // ...
  }
}
```

Compared to Jovo `v3`, a component can be seen as a state, but instead of using `followUpState` to determine the state of the _next_ request, we use [redirects](https://www.jovo.tech/docs/handlers#redirect-to-components) or [delegates](https://www.jovo.tech/docs/handlers#delegate-to-components) to enter a component in the _current_ request:

```typescript
// v3

{
  LAUNCH() {
    // Ask for a yes/no question and route to order state
    this.$speech.addText('Do you want to order something?');
    this.$reprompt.addText('Please answer with yes or no.');

    this.followUpState('OrderState')
        .ask(this.$speech, this.$reprompt);
  },
  OrderState: {
    YesIntent() {
        // ...
    },
    NoIntent() {
        // ,,,
    },
  },
},


// v4

// GlobalComponent.ts

LAUNCH() {
  return this.$redirect(OrderComponent);
},

// OrderComponent.ts

START() {
  return this.$send({
    message: 'Do you want to order something?',
    reprompt: 'Please answer with yes or no.',
  });
},

YesIntent() {
  // ...
}

NoIntent() {
  // ...
}
```

As long as the component is at the top of the [`$state` stack](./state-stack.md), the [router](./routing.md) will try to match one of the component's handlers to the next request.

These are all the component routing features:

```typescript
// v3

this.toIntent('SomeIntent');
this.toStateIntent('SomeState', 'SomeIntent');
this.toStatelessIntent('SomeIntent');
```

```typescript
// v4

this.someHandler(); // Call a different method inside the same component
this.$redirect(SomeComponent); // Go to START in SomeComponent
this.$redirect(SomeComponent, 'someHandler');
```

Ideally, using the concept of [global handlers](handlers.md#global-handlers), you don't need to rely too much on redirects to handlers in different components.

Instead of nesting all states in the `app.ts` as with Jovo `v3`, you can register all components there, leading to a more clearly structured app:

```typescript
const app = new App({
  components: [
    GlobalComponent,
    OrderComponent,
    // ...
  ],
  // ...
});
```

### Handlers vs Intents

> [Learn more about handlers here](./handlers.md).

As shown in the [components](#components-vs-states) section above, Jovo `v4` still uses the concept of handlers. However, they are way more powerful now and can respond to more than just intents.

In `v3`, all handlers were methods in an object of nested states. In `v4`, they are methods in component classes:

```typescript
// src/components/YourComponent.ts

import { Component, BaseComponent } from '@jovotech/framework';

@Component()
class YourComponent extends BaseComponent {
  handlerA() {
    // ...
  }

  handlerB() {
    // ...
  }

  handlerC() {
    // ...
  }
}
```

Similar to Jovo `v3`, it is possible to name a handler exactly like the incoming intent it is supposed to respond to:

```typescript
ShowMenuIntent() {
  // ...
}
```

This does not offer a lot of flexibility, though. For better control, we recommend using the `@Handle` decorator. The `@Handle` decorator contains a set of elements that define when a handler should be triggered.. This way, you can even add multiple intents and name the handler however you like.

For example, this handler responds the `ShowMenuIntent` and `YesIntent`:

```typescript
import { Handle } from '@jovotech/framework';
// ...

@Handle({
  intents: ['ShowMenuIntent', 'YesIntent']
})
showMenu() {
  // ...
}
```

It's also possible to use the `@Intents` convenience decorator:

```typescript
import { Intents } from '@jovotech/framework';
// ...

@Intents(['ShowMenuIntent', 'YesIntent'])
showMenu() {
  // ...
}
```

### Output

> [Learn more about output here](./output.md).

One of the most important changes in Jovo `v4` is the way output is returned to the user. While `v3` relied on lots of helper methods (like `tell`, `ask`, `showQuickReplies`, ...), `v4` uses [output templates](./output-templates.md) that can be either returned directly using the `$send()` method as well as using [output classes](./output-classes.md):

```typescript
// v3
return this.tell('Hello world!');

// v4
return this.$send('Hello world!'); // Pass a string or an output template
return this.$send(HelloWorldOutput); // Pass an output class
return this.$send(YesNoOutput, { message: 'Do you like pizza?' }); // Pass an output class and override some elements
```

This makes it easier to have a clearer separation of logic and output. And the [output classes](./output-classes.md) come with a few helpful features that make it possible to abstract common responses.

We also removed the Jovo SpeechBuilder. However, it's now possible to send multiple messages by [using `$send()` multiple times](./output.md#send-multiple-responses):

```typescript
// v3

this.$speech.addText('Hello world!');
// ...
this.$speech.addText('Do you like pizza?');
return this.tell(this.$speech);

// v4
this.$send('Hello world!');
// ...
return this.$send('Do you like pizza?');
```

### Input

> [Learn more about Jovo Input here](./input.md).

Jovo uses a new concept of structured input as part of the [RIDR Lifecycle](./ridr-lifecycle.md): The _interpretation_ step turns all request data into structured meaning, which is then used by the [routing](#routing) and other services like the [Jovo Debugger](https://www.jovo.tech/docs/debugger) or [unit testing](#unit-testing).

For platforms like [Alexa](https://www.jovo.tech/marketplace/platform-alexa) (that already send [NLU](./nlu.md) data with the request), the `$input` may look like this:

```typescript
{
  type: 'INTENT',
  intent: 'MyNameIsIntent',
}
```

Some other integrations (like our [Web Client](https://www.jovo.tech/marketplace/client-web)) might only send raw text:

```typescript
{
  type: 'TEXT',
  text: 'My name is Max',
}
```

This text gets turned into structured meaning by using an [NLU integration](./nlu.md).

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
}
```

## Configuration

One of the big improvements of Jovo `v4` is a more consistent configuration across all elements:

- [App configuration](#app-configuration): Add platforms and plugins to your Jovo app
- [Project configuration](#project-configuration): Configure how the Jovo CLI builds and deploys your project
- [Debugger configuration](#debugger-configuration): Customize the Jovo Debugger frontend
- [Models](#models): Define the language model schema

### App Configuration

> [Learn more about app configuration here](./app-config.md).

In `v3`, the app configuration could be found in a `config.js` file. In `v4`, we've moved that over to `app.ts`.

There are specific configuration files for each stage (learn more in the [staging](./staging.md) docs):

- `app.ts`: Default configurations for all stages
- `app.dev.ts`: Configurations for local development, including [Jovo Debugger](https://www.jovo.tech/docs/debugger) and [FileDb](https://www.jovo.tech/marketplace/db-filedb)

This is what it looks like in `app.ts`:

```typescript
import { App } from '@jovotech/framework';
// ...

const app = new App({
  components: [
    // ...
  ],
  plugins: [
    // ...
  ],
  logging: {
    // ...
  },
  routing: {
    // ...
  },
});
```

[Platforms](./platforms.md) and other integrations are now added to the `plugins` array of the config. Each plugin can have its own configuration options, which are added to the constructor:

```typescript
// v3
app.use(new Alexa());

// v4
const app = new App({
  plugins: [
    new AlexaPlatform({
      // Alexa Config
    }),
  ],
});
```

### Project Configuration

> [Learn more about project configuration here](https://www.jovo.tech/docs/project-config).

The project configuration (previously `project.js`) can now be found in a file called `jovo.project.js` in the root of your Jovo project.

Similar to the [app configuration](#app-configuration), the project config now accepts classes in a `plugins` array. Here is an [example for Alexa](https://www.jovo.tech/marketplace/platform-alexa/project-config):

```js
const { ProjectConfig } = require('@jovotech/cli-core');
const { AlexaCli } = require('@jovotech/platform-alexa');
// ...

const project = new ProjectConfig({
  // ...
  plugins: [
    new AlexaCli({
      locales: {
        /* ... */
      },
      skillId: '<yourSkillId>',
      askProfile: 'default',
      files: {
        /* ... */
      },
    }),
    // ...
  ],
});
```

### Debugger Configuration

> [Learn more about Debugger configuration here](https://www.jovo.tech/docs/debugger-config).

The new [Jovo Debugger](https://www.jovo.tech/docs/debugger) comes with lots of new features, including a new configuration file which can be found in `jovo.debugger.js` in the root of your Jovo project.

In this file, you can add buttons that you can use in the Debugger frontend. It's possible to use buttons for both individual requests as well as sequences.

```js
const { DebuggerConfig } = require('@jovotech/plugin-debugger');

// ...

const debugger = new DebuggerConfig({
  locales: [ 'en' ],
  buttons: [
    {
        label: 'LAUNCH',
        input: {
            type: 'LAUNCH'
        }
    },
    {
        label: 'yes',
        input: {
            intent: 'YesIntent'
        }
    },
    // ...
  ]
});
```

### Models

> [Learn more about the Jovo Model here](./models.md).

The Jovo Model schema now comes with an improved structure, including the following changes:

- `inputs` are now called `entities`
- `inputTypes` are now called `entityTypes`
- `intents`, `entities`, and `entityTypes` are now maps instead of arrays

```json
// v3
{
  "invocation": "my test app",
  "intents": [
    {
      "name": "YesIntent",
      "phrases": [
        "yes",
        "yes please",
        "sure"
      ]
    },
    {
      "name": "NoIntent",
      "phrases": [
        "no",
        "no thanks"
      ]
    }
  ]
}

// v4
{
  "invocation": "my test app",
  "intents": {
    "YesIntent": {
      "phrases": [
        "yes",
        "yes please",
        "sure"
      ]
    },
    "NoIntent": {
      "phrases": [
        "no",
        "no thanks"
      ]
    }
  }
}
```

## Updated Concepts

The following features have been getting an upgrade as well:

- [Naming Conventions](#naming-conventions)
- [Unit Testing](#unit-testing)
- [Entities vs Inputs](#entities-vs-inputs)

### Naming Conventions

> [Learn more about Jovo properties here](./jovo-properties.md).

In `v4`, we're using the following naming conventions:

- Every user-facing _first-level_ method or property is prepended by a `$` sign, for example `this.$send()` or `this.$user`
- Properties or methods of a _first-level_ property don't include a `$` anymore, for example `this.$user.data`
- The exception is if a platform extends a Jovo property, then that property uses a `$` as well, for example `this.$alexa.$user`, but `this.$alexa.$user.data`

### Unit Testing

> [Learn more about unit testing here](./unit-testing.md).

The Jovo Test Suite has received a major update and is more consistent with the new concepts of [input](#input) and [output](#output).

```typescript
// v3

const { App } = require('jovo-framework');
const { GoogleAssistant } = require('jovo-platform-googleassistant');
const { Alexa } = require('jovo-platform-alexa');

for (const p of [new Alexa(), new GoogleAssistant()]) {
  const testSuite = p.makeTestSuite();

  test('should ask the user if they like pizza', async () => {
    const conversation = testSuite.conversation();

    const launchRequest = await testSuite.requestBuilder.launch();
    const responseLaunchRequest = await conversation.send(launchRequest);

    expect(responseLaunchRequest.isAsk('Do you like pizza?')).toBe(true);
  });
}

// v4

import { TestSuite, InputType } from '@jovotech/framework';

const testSuite = new TestSuite();

test('should ask the user if they like pizza', async () => {
  const { output } = await testSuite.run({
    type: InputType.Launch, // or 'LAUNCH'
  });

  expect(output).toEqual([
    {
      message: 'Do you like pizza?',
      quickReplies: ['yes', 'no'],
      listen: true,
    },
  ]);
});
```

### Entities vs Inputs

> [Learn more about entities here](./entities.md).

The `$inputs` object was renamed to `$entities` and some properties have changed:

```typescript
// v3
this.$inputs.name.value; // raw value
this.$inputs.name.key; // resolved value for synonyms
this.$inputs.name.id; // ID
this.$inputs.name.alexaSkill; // Alexa specific values

// v4
this.$entities.name.value; // raw value
this.$entities.name.resolved; // previously 'key'
this.$entities.name.id; // ID
this.$alexa.$entities.name.native; // Alexa specific values
```

## Use v4 and v3 in Parallel

Thanks to our new organization-scoped (`@jovotech`) packages, you're able to use `v4` and `v3` in parallel. `v4` is available using `jovo`, `v3` using `jovo3`:

```sh
# First, install the Jovo v4 CLI
$ npm install -g @jovotech/cli
$ jovo

# Then, install the Jovo v3 CLI again
$ npm install -g jovo-cli
$ jovo3
```

We also updated the Debugger webhook URLs:

- `v4`: `webhook.jovo.cloud`
- `v3`: `webhookv3.jovo.cloud`

Make sure to update your Jovo `v3` project to use the latest version that works with the updated Debugger URL:

```sh
$ jovo3 update
```

## Integrations and Plugins

- [Platforms](#platforms)
- [CMS](#cms)
- [Databases](#databases)
- [Analytics](#analytics)
- [Plugins](#plugins)

### Platforms

> [Learn more about platform integrations here](./platforms.md).

As mentioned in the [app configuration](#app-configuration) section, platforms are now added to the `plugins` array of the `app` constructor.

Platform classes are now also appended by `Platform`. Here is an example for [Alexa](https://www.jovo.tech/marketplace/platform-alexa):

```typescript
// v3
import { Alexa } from `jovo-platform-alexa`;

// v4
import { AlexaPlatform } from `@jovotech/platform-alexa`;
```

The platform properties are now accessed using the platform name, instead of platform app type:

```typescript
// v3
this.$alexaSkill;

// v4
this.$alexa;
```

While in the past, most platform integrations had specific methods to add something to the response, almost everything can now be done using existing [output template](./output-templates.md) elements or the [`nativeResponse` property](./output-templates.md#nativeresponse).

Here is an example for quick replies on Facebook Messenger:

```typescript
// v3 handler
await this.$messengerBot.showText({
  text: 'Do you like pizza?',
  quickReplies: ['yes', 'no'],
});

// v4 output template
{
  message: 'Do you like pizza?',
  quickReplies: ['yes', 'no'],
}
```

Here is an [example for Alexa APL](https://www.jovo.tech/marketplace/platform-alexa/output#native-response):

```typescript
// v3 handler
this.$alexaSkill.addDirective({
  type: 'Alexa.Presentation.APL.RenderDocument',
  version: '1.0',
  document: {},
  datasources: {},
});

// v4 output template
{
  // ...
  platforms: {
    alexa: {
      nativeResponse: {
        response: {
          directives: [
            {
              type: 'Alexa.Presentation.APL.RenderDocument',
              document: {},
              datasources: {},
            },
          ];
        }
      }
    }
  }
}
```

### CMS

> [Learn more about CMS integrations here](./cms.md).

- Improved configuration, take a look at [Google Sheets](https://www.jovo.tech/marketplace/cms-googlesheets) and [Airtable](https://www.jovo.tech/marketplace/cms-airtable)
- `responses` are now called `translations`

### Databases

> [Learn more about database integrations here](./databases.md).

- The `lastUsedAt` field was changed to `updatedAt`
- The user context feature is now called [`$history`](./data.md#history)

### Analytics

- [Dashbot analytics](https://www.jovo.tech/marketplace/analytics-dashbot) now has a different configuration: The plugin is added to each platform that it is supposed to track

### Plugins

> [Learn more about building Jovo plugins here](./plugins.md).

- We updated our middlewares, you can find the names in our [RIDR docs](./ridr-lifecycle.md#middlewares)
- The plugin structure is almost the same, we just made some changes to the [plugin lifecycle hooks](./plugins.md#plugin-lifecycle).
