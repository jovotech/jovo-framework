---
title: 'Properties'
excerpt: 'Learn more about Jovo properties, which are reserved variables that part of the Jovo object.'
---

# Jovo Properties

Jovo properties are reserved variables that part of the Jovo `this` object.

## Introduction

The Jovo context object (also referenced as `this`) includes many properties that are instantiated with each request.

In the `this` context, you can access them like this:

```typescript
this.$propertyName;

// Example: $request
this.$request;
```

The properties can be grouped into [RIDR](#ridr-properties), [input](#input), and [context properties](#context-properties).

## RIDR Properties

Jovo app execution follows the [RIDR lifecycle](./ridr-lifecycle.md) that includes four steps: request, interpretation, dialogue & logic, response.

Each of the steps result in a Jovo property: [`$request`](#request), [`$input`](#input), [`$output`](#output), [`$response`](#response).

### $request

The `$request` property contains all information about a request. It is the result of the first step of the [RIDR lifecycle](./ridr-lifecycle.md).

```typescript
this.$request;
```

### $input

The `$input` property contains structured data that is derived from a request. For example, speech recognition (ASR) and natural language understanding (NLU) data. It is the result of the second step of the [RIDR lifecycle](./ridr-lifecycle.md).

```typescript
this.$input;
```

[Learn more about the `$input` property here](./input.md).

### $output

The `$output` array contains one or more structured output templates that are later turned into one or more native platform responses. It is the result of executing a [handler](./handlers.md) and the third step of the [RIDR lifecycle](./ridr-lifecycle.md).

```typescript
this.$output;
```

[Learn more about the `$output` array here](./output.md).

### $response

The `$response` property contains the native response that gets sent back to the platform. It is the result of the fourth step of the [RIDR lifecycle](./ridr-lifecycle.md).

```typescript
this.$response;
```

## Input Properties

Alongside [`$input`](#input), there are additional properties that contain interpreted information about the user's request.

The properties include [`$entities`](#entities) and [`$route`](#route).

### $entities

The `$entities` property contains entities as part of the [structured input](#input).

```typescript
this.$entities;
```

### $route

The `$route` property is the result of the [routing process](./routing.md).

```typescript
this.$route;
```

[Learn more about routing here](./routing.md).

## Context Properties

Context properties contain information that was not explicitly stated by the user, but rather information accompanying the request.

The properties include [`$data`](#data), [`$session`](#session), [`$user`](#user), [`$device`](#device), and [`$history`](#history).

### $data

The `$data` property allows you to store data for the current request.

```typescript
this.$data;
```

[Learn more about request data here](./data.md#request-data).

### $session

The `$session` property contains data and features about the current session.

```typescript
this.$session;
```

One of the most used features of `$session` is to write and access session data:

```typescript
this.$session.data.key = value;
```

[Learn more about session data here](./data.md#session-data).

### $state

The `$state` property is the state stack that gets built as part of the [routing and state management](./routing.md).

```typescript
this.$state;
```

[Learn more about the `$state` stack here](./state-stack.md).

### $user

The `$user` property contains data and features about the specific user interacting with the app.

```typescript
this.$user;
```

One of the most used features of `$user` is to write and access data that is persisted in a user database:

```typescript
this.$user.data.key = value;
```

[Learn more user data here](./data.md#user-data).

### $device

The `$device` property contains data and features about the specific device the user is interacting with.

```typescript
this.$device;
```

[Learn more about the `$device` property here](./device.md).

### $history

The `$history` property contains data about previous user interactions.

```typescript
this.$history;
```

[Learn more about the `$history` property here](./data.md#history).

### $server

The `$server` property contains data and features about the server requests and responses.

```typescript
this.$server;
```

[Learn more about the `$server` property here](./server.md).

## Custom Properties

You can also add your own properties to the Jovo object, for example:

```typescript
this.$myProperty;
```

Here is an example [Jovo plugin](./plugins.md) implementation that adds `$myProperty` to the Jovo object and also adds type declarations:

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

You can also take a look at the [Slack plugin](https://github.com/jovotech/jovo-framework/blob/v4/latest/integrations/plugin-slack/src/index.ts) for an example.
