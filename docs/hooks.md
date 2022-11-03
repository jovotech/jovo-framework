---
title: 'Hooks'
excerpt: 'Learn how to extend Jovo apps using Hooks.'
url: 'https://www.jovo.tech/docs/hooks'
---

# Jovo Hooks

Middleware hooks are the easiest way to extend certain parts of the Jovo Framework. You can see them as a lightweight version of [Jovo plugins](./plugins.md).

## Introduction

Jovo hooks allow you to _hook_ into the Jovo [middleware architecture](./middlewares.md) to extend or modify the framework without having to change its core code. Usually, this is used to hook into the [RIDR Lifecycle](./ridr-lifecycle.md), but it's also possible to hook into [events](./middlewares.md#event-middlewares).

Here are some examples of a hook:

```typescript
// src/app.ts

import { App, Jovo } from '@jovotech/framework';
// ...

const app = new App({
  /* app config */
});

app.hook('<middleware>', (jovo: Jovo): void => {
  // ...
});

// Same hook without types
app.hook('<middleware>', (jovo) => {
  // ...
});

// Example: Execute code before the dialogue.start middleware
app.hook('before.dialogue.start', (jovo: Jovo): void => {
  // ...
});
```

If you compare hooks to [plugins](./plugins.md), you can see that hooks come with less boilerplate code but also offer less flexibility than plugins. We recommend using hooks for smaller customizations before diving deeper into the Jovo plugin architecture.

## Hook Structure

The code snippet from above consists of the following elements:

- `app`: Make sure that `app` is set. We recommend adding hooks to your [app configuration files](./app-config.md), for example `app.ts`.
- `<middleware>`: This is the middleware this hook should use, for example `response.output`. Find all middlewares in the [RIDR docs](./ridr-lifecycle.md#middlewares). You can also add `before` and `after`, e.g. `before.response.output`.
- Callback function with `jovo`: This is where you add the code that should get executed when the middleware triggers the hook.

Here is an example that logs the [`$output` array](./output.md) before it is turned into a native platform response:

```typescript
// src/app.ts

import { App, Jovo } from '@jovotech/framework';
// ...

const app = new App({
  /* app config */
});

app.hook('before.response.output', (jovo: Jovo): void => {
  console.log(jovo.$output);
});

// Same hook without types
app.hook('before.response.output', (jovo) => {
  console.log(jovo.$output);
});
```

Learn more in the sections below:

- [Hooks that use `async` functions](#async-hooks)
- [Hooks outsourced into separate files](#hook-files)

### Async Hooks

Hooks can also be `async`, which can relevant for operations like API calls.

```typescript
app.hook('<middleware>', async (jovo: Jovo): Promise<void> => {
  const response = await someApiCall();
  // ...
});
```

### Hook Files

You can also store your hook functions in a separate file. Here is an example for [`sessionCount`](#sessioncount):

```typescript
// src/hooks/sessionCountHook.ts

import { Jovo } from '@jovotech/framework';

export const sessionCountHook = (jovo: Jovo): void => {
  if (jovo.$session.isNew) {
    jovo.$user.data.sessionCount = (jovo.$user.data.sessionCount || 0) + 1;
  }
};
```

In your `app.ts` file, you can import and use the hook like this:

```typescript
// src/app.ts

import { App } from '@jovotech/framework';
import { sessionCountHook } from './hooks/sessionCount';
// ...

const app = new App({
  /* app config */
});

app.hook('before.response.output', sessionCountHook);
```

## Example Hooks

- [New Session](#new-session)
- [`sessionCount`](#sessioncount)
- [New User](#new-user)

### New Session

This hook gets executed for every new session before a [handler](https://www.jovo.tech/docs/handlers) gets called. This can be useful for making API calls or cleaning up some data. See [`sessionCount`](#sessioncount) for an additional example.

```typescript
// src/app.ts

import { App, Jovo } from '@jovotech/framework';
// ...

const app = new App({
  /* app config */
});

app.hook('before.dialogue.start', (jovo: Jovo): void => {
  if (jovo.$session.isNew) {
    // ...
  }
});

// Same hook without types
app.hook('before.dialogue.start', (jovo) => {
  if (jovo.$session.isNew) {
    // ...
  }
});
```

This hook can also be [`async`](#async-hooks), which can relevant for operations like API calls.

```typescript
app.hook('before.dialogue.start', async (jovo: Jovo): Promise<void> => {
  if (jovo.$session.isNew) {
    const response = await someApiCall();
    // ...
  }
});
```

If you're used to working with Jovo `v3`: This hook can be used as a replacement of the `NEW_SESSION` handler.

### sessionCount

This hook stores a `sessionCount` variable in the [user database](./data.md#user-data):

```typescript
// src/app.ts

import { App, Jovo } from '@jovotech/framework';
// ...

const app = new App({
  /* app config */
});

app.hook('before.dialogue.start', (jovo: Jovo): void => {
  if (jovo.$session.isNew) {
    jovo.$user.data.sessionCount = (jovo.$user.data.sessionCount || 0) + 1;
  }
});

// Same hook without types
app.hook('before.dialogue.start', (jovo) => {
  if (jovo.$session.isNew) {
    jovo.$user.data.sessionCount = (jovo.$user.data.sessionCount || 0) + 1;
  }
});
```

### New User

This hook gets executed for new users before a [handler](https://www.jovo.tech/docs/handlers) gets called. This can be useful for making API calls or adding some boilerplate data.

```typescript
// src/app.ts

import { App, Jovo } from '@jovotech/framework';
// ...

const app = new App({
  /* app config */
});

app.hook('before.dialogue.start', (jovo: Jovo): void => {
  if (jovo.$user.isNew) {
    // ...
  }
});

// Same hook without types
app.hook('before.dialogue.start', (jovo) => {
  if (jovo.$user.isNew) {
    // ...
  }
});
```

This hook can also be [`async`](#async-hooks), which can relevant for operations like API calls.

```typescript
app.hook('before.dialogue.start', async (jovo: Jovo): Promise<void> => {
  if (jovo.$user.isNew) {
    const response = await someApiCall();
    // ...
  }
});
```

If you're used to working with Jovo `v3`: This hook can be used as a replacement of the `NEW_USER` handler.
