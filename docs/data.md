---
title: 'Data'
excerpt: 'Learn more about different types of data that can be used in a Jovo app. For example, some data might be only relevant for a specific interaction, a component, or session.'
---

# Data

There are different types of data that can be used in a Jovo app. For example, some data might be only relevant for a specific interaction, a component, or session. Other data might be needed across sessions and should be persisted using the [Jovo database integrations](./databases.md).

## Introduction

These are the types of data that are usually only stored for a short amount of time ([short-term data storage](#short-term-data-storage)):

- [Request data](#request-data): Only used for this specific interaction, stored in `this.$data`.
- [Component data](#component-data): Only used for this specific component, stored in `this.$component.data`.
- [Session data](#session-data): Only used for this specific session, stored in `this.$session.data`.
- [App data](#app-data): This is a special data type that keeps the data stored as long as the server is running, which can be usually for caching. Stored in `this.$app.data`.

And here are some types of data that are typically persisted across user sessions ([long-term data storage](#long-term-data-storage)):

- [User data](#user-data): User specific data stored in `this.$user.data`.
- [History](#history): Data from previous interactions, accessible via `this.$history`.

## Short-term Data Storage

### Request Data

Request data is written into the Jovo object (`this`) and only stored for a specific request. This can be helpful if data is needed across different methods.

We recommend the following practice to store data in the Jovo object:

```typescript
this.$data.someKey = 'someValue';
```

### Component Data

Sometimes, a [component](./components.md) might need to gather information that becomes irrelevant as soon as the component resolves.

You can store data only for a specific component like this:

```typescript
this.$component.data.someKey = 'someValue';
```

This data is stored in the `$state` stack:

```typescript
$state = [
  {
    componentPath: 'SomeComponent',
    data: {
      someKey: 'someValue',
    },
  },
];
```

The `$state` is stored as [session data](#session-data). Once the component is removed from it, the data is removed as well.

### Session Data

Session data (sometimes also called session attributes) stores data that is only needed for the specific session.

You can store elements into the session data like this:

```typescript
this.$session.data.someKey = 'someValue';
```

Most platforms offer some kind of local storage that allows you to store session dta in the JSON response back to the platform, which can then be accessed in the next request (as long as the session stays active).

Other platforms (like Facebook Messenger) don't support this. For them, you need to enable `session` as `storedElement` in your [database integration](./databases.md)

### App Data

> This feature is currently in implementation

App data is a special data type that stores data into the app object, which exists as long as the server is running:

```typescript
this.$app.data.someKey = 'someValue';
```

For example, this can be used for non-user-specific information that needs an API call that is not necessary to be executed at every request. By storing data in the app object, the API call only needs to be done once while the server is running (or the serverless function like AWS Lambda is warm).

## Long-term Data Storage

### User Data

The Jovo `$user` object uses [database integrations](./databases.md) to persist user specific data across sessions.

The data can be stored like this:

```typescript
this.$user.data.someKey = 'someValue';
```

### History

The `$history` makes it possible to store data of each interaction into a persisted history. This enables your app to remember what was previously said, repeat things like previous output, or just track usage over time.

The history object contains an `items` array that is sorted by time (DESC). The most recent history item can be accessed like this:

```typescript
// Get the history element for the most recent interaction
this.$history.prev;

// Alternatively access it using the items array
this.$history.items[0];

/* Sample result if output and input are enabled
{
  output: {
    message: 'Hello World!',
  },
  input: {
    intent: 'HelloWorldIntent',
  },
}
*/
```

For each [database integration](./databases.md), you can add the `history` configuration to the `storedElements` property.

```typescript
new FileDb({
  // ...
  storedElements: {
    // ...
    history: {
      enabled: true,
      size: 3, // Size of the this.$history array

      // Example: Store this.$output into the history
      output: true, // this.$output, optional
    },
  },
}),
```

You can add the following [Jovo properties](./jovo-properties.md) to the history:

- `request`: Stores `this.$request`
- `input`: Stores `this.$input`
- `output`: Stores `this.$output`
- `response`: Stores `this.$response`
- `state`: Stores `this.$state`
- `entities`: Stores `this.$entities`

You can even add your own custom data to the history. Add any property with a function that returns the data to be stored. Here is an example for a `someCustomData` property:

```typescript
new FileDb({
  // ...
  storedElements: {
    // ...
    history: {
      // ...
      someCustomData: (jovo: Jovo) => {
          return `Some custom data for user ${jovo.$user.id}`
      },
    },
  },
}),
```

Here is an example how the history is then stored in a database:

```js
[
  {
    // ...
    history: {
      items: [
        {
          output: {
            message: 'Yes! I love pizza, too.',
          },
          input: {
            type: 'INTENT',
            intent: 'AMAZON.YesIntent',
          },
          state: [
            {
              componentPath: 'LoveHatePizzaComponent',
            },
          ],
          someCustomData: 'Some custom data for user amzn1.account.AM3B00000000000000000000000',
        },
        {
          output: {
            message: 'Hello World! Do you like pizza?',
            listen: true,
          },
          input: {
            TYPE: 'LAUNCH',
          },
          state: [
            {
              componentPath: 'LoveHatePizzaComponent',
            },
          ],
          someCustomData: 'Some custom data for user amzn1.account.AM3B00000000000000000000000',
        },
      ],
    },
    createdAt: '2021-06-30T06:45:40.444Z',
    updatedAt: '2021-06-30T06:47:44.253Z',
  },
];
```

#### Example: Repeat

For voice interfaces, it is recommended to add a functionality that lets users ask to repeat the previous message. For example, [Alexa](https://www.jovo.tech/marketplace/platform-alexa) has a built-in `AMAZON.RepeatIntent` for use cases like this.

You can repeat the previous message by storing the [`$output` array](./output.md) in the [`$history`](#history). Here is an example for [FileDb](https://www.jovo.tech/marketplace/db-filedb):

```typescript
new FileDb({
  // ...
  storedElements: {
    // ...
    history: {
      enabled: true,
      size: 1, // Size of the this.$history array
      output: true, // Store this.$output in history
    },
  },
}),
```

In your [handler](./handlers.md), you can then access the previous output using `this.$history.prev.output`. The below example has a handler for this as part of the `GlobalComponent`:

```typescript
// src/components/GlobalComponent.ts

import { Component, BaseComponent, Global, Intents } from '@jovotech/framework';
// ...

@Global()
@Component()
export class GlobalComponent extends BaseComponent {
  // ...

  @Intents(['RepeatIntent'])
  repeatPreviousMessage() {
    return this.$send(this.$history.prev.output);
  }
}
```

Since in this example, the repeat handler is part of a [global component](./components.md#global-components), this comes with the following benefits:

- The handler can be reached from anywhere, even if the flow is currently deep down inside subcomponents.
- Global components don't get added to the [`$state` stack](./state-stack.md). This way, the interaction stays in the previous component and the user can proceed with the flow after hearing the repeated message.

If you are using [`UNHANDLED`](./handlers.md#unhandled) as part of a component, it is possible that the global component handlers don't get reached because the `UNHANDLED` handler of the current component gets prioritized by default. Learn more about this in the [routing documentation](./routing.md#unhandled-prioritization). 

To have the repeat handler always be executed instead of `UNHANDLED`, you can use the [`prioritizedOverUnhandled`](./handlers.md#prioritizedOverUnhandled) property:

```typescript
// src/components/GlobalComponent.ts

import { Component, BaseComponent, Global, Handle } from '@jovotech/framework';
// ...

@Global()
@Component()
export class GlobalComponent extends BaseComponent {
  // ...

  @Handle({ intents: ['RepeatIntent'], prioritizedOverUnhandled: true })
  repeatPreviousMessage() {
    return this.$send(this.$history.prev.output);
  }
}
```