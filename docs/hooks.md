---
title: 'Hooks'
excerpt: 'Learn how to extend Jovo apps using Hooks.'
---

# Jovo Hooks

Middleware hooks are the easiest way to extend certain parts of the Jovo Framework. You can see them as a lightweight version of [Jovo plugins](./plugins.md).


## Introduction

Jovo hooks allow you to *hook* into the Jovo middleware architecture to extend or modify the framework without having to change its core code. Learn more about all middlewares in the [RIDR Lifecycle documentation](./ridr-lifecycle.md#middlewares).

Here is an example of a hook:

```typescript
// src/app.ts

app.hook('<middleware>', (jovo) => {
  
  // ...
  
});
```

If you compare hooks to [plugins](./plugins.md), you can see that hooks come with less boilerplate code but also offer less flexibility than plugins. We recommend using hooks for smaller customizations before diving deeper into the Jovo plugin architecture.


## Hook Structure

The code snippet from above consists of the following elements:

- `app`: Make sure that `app` is set. We recommend adding hooks to your [app configuration files](./app-config.md), for example `app.ts`.
- `<middleware>`: This is the middleware this hook should use, for example `platform.output`. Find all middlewares in the [RIDR docs](./ridr-lifecycle.md#middlewares). You can also add `before` and `after`, e.g. `before.platform.output`. 
- Callback function with `jovo`: This is where you add the code that should get executed when the middleware triggers the hook.

Here is an example that logs the [`$output` array](./output.md) before it is turned into a native platform response:

```typescript
// src/app.ts

app.hook('before.platform.output', (jovo) => {
  console.log(jovo.$output);
});
```
