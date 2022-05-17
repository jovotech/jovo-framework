---
title: 'Middlewares'
excerpt: 'Learn how you can extend Jovo by hooking into different types of middlewares.'
---

# Middlewares

Learn how you can extend Jovo by hooking into different types of middlewares.

## Introduction

Jovo offers a middleware architecture that lets you hook into certain steps in the lifecycle. This allows Jovo developers to extend the framework without having to make any adjustments to its core code.

Middlewares can be listened to in two different ways:

- [Hooks](./hooks.md): Lightweight extensions for logging and simple data manipulation
- [Plugins](./plugins.md): Powerful extensions that can hook into multiple middlewares

For example, a hook that does an API call for each new session might look like this:

```typescript
app.hook('before.dialogue.start', async (jovo: Jovo): Promise<void> => {
  if (jovo.$session.isNew) {
    const response = await someApiCall();
    // ...
  }
});
```

The most common middlewares to be used are [RIDR middlewares](#ridr-middlewares), but there are also other [types of middlewares](#types-of-middlewares) like [event middlewares](#event-middlewares).

## Types of Middlewares

There are two types of middlewares:

- [RIDR middlewares](#ridr-middlewares): Used to hook into steps across the [RIDR lifecycle](./ridr-lifecycle.md)
- [Event middlewares](#event-middlewares): Used to hook into certain events, for example method calls

### RIDR Middlewares

The [RIDR lifecycle](./ridr-lifecycle.md) (_Request - Interpretation - Dialogue & Logic - Response_) is the main process that determines when each part of the Jovo app is executed.

When extending Jovo, you usually hook into one of the RIDR middlewares that are detailed in the below table:

| Middleware             | Description                                                                              |
| ---------------------- | ---------------------------------------------------------------------------------------- |
| `request.start`        | Enters the `request` middleware group                                                    |
| `request`              | Turns the raw JSON request into a `$request` object                                      |
| `request.end`          | Leaves the `request` middleware group with propagated `$request` object                  |
| `interpretation.start` | Enters the `interpretation` middleware group                                             |
| `interpretation.asr`   | ASR/SLU integrations turn speech audio into raw text                                     |
| `interpretation.nlu`   | NLU integrations turn raw text into structured input                                     |
| `interpretation.end`   | Leaves the `interpretation` middleware group with propagated `$nlu` object               |
| `dialogue.start`       | Enters the `dialogue` middleware group                                                   |
| `dialogue.router`      | Uses information from the `interpretation` steps to find the right component and handler |
| `dialogue.logic`       | Executes the component and handler logic                                                 |
| `dialogue.end`         | Leaves the `dialogue` middleware group with propagated `$output` array                   |
| `response.start`       | Enters the `response` middleware group                                                   |
| `response.output`      | Turns `$output` into a raw JSON response                                                 |
| `response.tts`         | TTS integrations turn text into speech output                                            |
| `response.end`         | Leaves the `response` middleware group with propagated `$response` object                |

### Event Middlewares

Event middlewares don't follow a linear process like the [RIDR middlewares](#ridr-middlewares): They get executed whenever a specific method gets called, so this can happen multiple times during one RIDR lifecycle.

There are two types of event middlewares:

- Public methods like [`$resolve`](./handlers.md#resolve-a-component) can be accessed using `event.$resolve`
- Some "under the hood" methods can be accessed using the class name and the method name, for example `event.ComponentTreeNode.executeHandler`

Find all current event middlewares in the table below:

| Middleware                               | Description                                                                                                                                                                                                                                                                              |
| ---------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `event.$resolve`                         | [`$resolve`](./handlers.md#resolve-a-component) is called in a handler                                                                                                                                                                                                                   |
| `event.$redirect`                        | [`$redirect`](./handlers.md#redirect-to-components) is called in a handler                                                                                                                                                                                                               |
| `event.$delegate`                        | [`$delegate`](./handlers.md#delegate-to-components) is called in a handler                                                                                                                                                                                                               |
| `event.$send`                            | [`$send`](./output.md#send-a-message) is called in a handler                                                                                                                                                                                                                             |
| `event.ComponentTreeNode.executeHandler` | This event is called whenever a new handler gets executed. Part of the [`ComponentTreeNode` class](https://github.com/jovotech/jovo-framework/blob/v4/latest/framework/src/ComponentTreeNode.ts). See the [`ComponentTree` section](./components.md#componenttree) for more information. |

## Middleware Features

### Custom Middlewares

You can also use the `$handleRequest` object to run your own middlewares, for example:

```typescript
await jovo.$handleRequest.middlewareCollection.run('<YOUR_MIDDLEWARE_NAME>', jovo, payload);
```

The `payload` is of the type `AnyObject`, so you can pass any object to the middleware, for example `{ name: 'SomeName' }`.

Using a [hook](./hooks.md) or a [plugin](./plugins.md), you can then hook into this middleware:

```typescript
app.hook('<YOUR_MIDDLEWARE_NAME>', async (jovo: Jovo, payload): Promise<void> => {
  // ...
});
```

### Stop the Middleware Execution

Either a [hook](./hooks.md) or a [plugin](./plugins.md) can use `stopMiddlewareExecution` to remove all middlewares from the middleware collection of `HandleRequest` and its plugins. This way, all following middlewares won't be executed.

Here is an example how this could look like for a plugin method (that was registered with a middleware inside `mount`):

```typescript
someMethod(jovo: Jovo): void {
  // ...
  jovo.$handleRequest.stopMiddlewareExecution();
}
```
