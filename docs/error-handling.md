---
title: 'Error Handling'
excerpt: 'Learn more about different ways of error handling when building Jovo apps and plugins.'
url: 'https://www.jovo.tech/docs/error-handling'
---

# Error Handling

Learn more about different ways of error handling when building Jovo apps and plugins.

## Introduction

Error handling allows you to catch certain errors that happen when the app is initialized or during the handler execution.

You can use the [`onError()` method](#onerror) to react to those events. For example, this can be used for [logging](https://www.jovo.tech/docs/logging) or sending notifications.

Jovo also has an error class called [`JovoError`](#jovoerror) which can be used for structured error output, for example when building Jovo plugins.

## onError

`onError()` allows you to add a callback function with an `error` and `jovo` parameter. It is a method of `app`, so it is recommended to use it somewhere in your [app configuration files](./app-config.md), for example `app.ts`:

```typescript
import { Jovo } from '@jovotech/framework';
// ...

app.onError((error: Error, jovo: Jovo) => {
  // ...
});
```

Currently, `onError()` catches the following events:

- Errors happening during `App.initialize()`
- Errors happening during `App.handle()`
- Errors happening during handler execution (`ComponentTreeNode.executeHandler()`)
- When a platform sends an [`ERROR` request](https://www.jovo.tech/docs/input#error)

The `jovo` parameter is `undefined` if the error is thrown outside a handler (for example during `initialize()`).

The function that is passed to `onError()` can also be asynchronous:

```typescript
app.onError(async (error: Error, jovo: Jovo) => {
  // ...
});
```

You can also use `onError()` multiple times:

```typescript
app.onError((error: Error, jovo: Jovo) => {
  /* ... */
});
app.onError((error: Error, jovo: Jovo) => {
  /* ... */
});
```

## JovoError

When building [Jovo plugins](https://www.jovo.tech/docs/plugins) and other extensions, it's helpful to use the `JovoError` class to provide more structure information when an error occurs.

```typescript
import { JovoError } from '@jovotech/common';
// ...

throw new JovoError({ message: 'This is a sample error.' });
```

`JovoError` has the following properties:

| Property    | Type                                                                                         | Description                                                              |
| ----------- | -------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------ |
| `message`   | `string`                                                                                     | Main error message. Required.                                            |
| `hint`      | `string`                                                                                     | Potential steps to resolve the issue.                                    |
| `learnMore` | `string`                                                                                     | A link where you can find more information. `Learn more: <learnMore>`.   |
| `context`   | [`AnyObject`](https://github.com/jovotech/jovo-framework/blob/v4/latest/common/src/index.ts) | Additional data that might be helpful for debugging. Can be any object.  |
| `package`   | `string`                                                                                     | The package where the error occurred, for example `@jovotech/framework`. |
