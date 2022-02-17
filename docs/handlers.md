---
title: 'Handlers'
excerpt: 'Learn more about Jovo Handlers, which are methods inside a Jovo Component that are responsible for handling a request and returning output.'
---

# Handlers

Handlers are methods inside a [Jovo component](./components.md) that are responsible for handling a request and returning output.

## Introduction

![A handler taking in multiple request types like intent requests, launch requests, or touch requests. The handler then results in some output.](img/handler-requests-output.png)

A handler can fulfill multiple types of requests, like intents and touch selections, and then return output.

A component usually has multiple handlers. The `@Handle` decorator is used to define which handler should be responsible for which type of request. For example, one or multiple intents could be added as intents, and a handler could be even more specialized if you added conditions like platforms. [Learn more about handler routing below](#handler-routing-and-the-handle-decorator).

```typescript
import { Handle } from '@jovotech/framework';

// ...

@Handle({ /* handler options */ })
yourHandler() {
  // ...
}
```

The inside of a handler defines its logic. In the end, each handler should either return some output using the `$send()` method, or redirect/delegate to a different handler or component. [Learn more about handler logic below](#handler-logic).

```typescript
import { SomeOutput } from './output/SomeOutput';

// ...

yourHandler() {

  // ...

  return this.$send(SomeOutput, { /* output options */ });
}
```

## Handler Routing and the Handle Decorator

The routing defines which handler should fulfill the incoming request. For example, each intent in your language model should have at least one handler that responds to it, otherwise the Jovo app might throw an error.

Similar to previous versions of Jovo, it is possible to name a handler exactly like the incoming intent it is supposed to respond to:

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

The `@Handle` includes two types of properties:

- [Routing properties](#routing-properties): The router first looks if the handler matches a specific route, e.g. [`intents`](#intents) or [`types`](#types).
- [Condition properties](#condition-properties): After that, it is evaluated if there are additional conditions that have to be fulfilled, e.g. [`platforms`](#platforms).

### Routing Properties

Routing properties define the core elements a router is looking for when determining if a handler matches a request.

They include:

- [`intents`](#intents)
- [`types`](#types)
- [`global`](#global-handlers)
- [`subState`](#substate)
- [`prioritizedOverUnhandled`](#prioritizedOverUnhandled)

#### Intents

The `intents` property specifies which incoming intents the handler should be able to fulfill.

For example, this handler responds to only the `ShowMenuIntent`:

```typescript
@Handle({
  intents: ['ShowMenuIntent']
})
showMenu() {
  // ...
}
```

For some interactions, it might be helpful to add multiple intents as input. The below handler responds to both the `ShowMenuIntent` and `YesIntent`:

```typescript
@Handle({
  intents: ['ShowMenuIntent', 'YesIntent']
})
showMenu() {
  // ...
}
```

Sometimes, a handler should be [`global`](#global-handlers) for only some of the `intents`. For this, you can turn an intent string into an object:

```typescript
@Handle({
  intents: [{ name: 'ShowMenuIntent', global: true }, 'YesIntent']
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

This decorator supports the same structure as the `intents` property in `@Handle`. Additionally, it supports rest parameters, so you don't need to add an array for it to recognize multiple intents:

```typescript
@Intents('ShowMenuIntent', 'YesIntent')
showMenu() {
  // ...
}
```

#### Types

The `types` property specifies which [input types](./input.md) the handler should be able to fulfill.

```typescript
@Handle({
  types: ['LAUNCH'],
})
welcomeNewUser() {
  // ...
}
```

It's also possible to use the `@Types` convenience decorator:

```typescript
import { Types } from '@jovotech/framework';

// ...

@Types(['LAUNCH'])
welcomeNewUser() {
  // ...
}
```

This decorator supports the same structure as the `types` property in `@Handle`. Additionally, it supports rest parameters, so you don't need to add an array for it to recognize multiple types:

```typescript
@Types('LAUNCH', 'SomeOtherInputType')
welcomeNewUser() {
  // ...
}
```

#### Global Handlers

By default, handlers are only accessible from their component. By making them global, they can be reached from any part of the Jovo app. This is similar to how "stateless" handlers worked in Jovo v3.

```typescript
@Handle({
  global: true,
  // ...
})
yourHandler() {
  // ...
}
```

It is also possible to use the `@Global` convenience decorator for this.

```typescript
import { Global, Handle } from '@jovotech/framework';

// ...

@Global()
@Handle({ /* ... */ })
yourHandler() {
  // ...
}
```

Sometimes, it might be necessary to split `@Handle` to make sure that not all options are set to global. In the below example, the handler is accessible from anywhere for both the `ShowMenuIntent` and `YesIntent` (which is probably not a good idea):

```typescript
@Global()
@Handle({
  intents: ['ShowMenuIntent', 'YesIntent']
})
showMenu() {
  // ...
}
```

By adding a second `@Handle` decorator, you can make it global for only some intents:

```typescript
@Handle({
  global: true,
  intents: ['ShowMenuIntent']
})
@Handle({
  intents: ['YesIntent']
})
showMenu() {
  // ...
}
```

Alternatively, you can make an intent an object and add `global` to it:

```typescript
@Handle({
  intents: [{ name: 'ShowMenuIntent', global: true }, 'YesIntent']
})
showMenu() {
  // ...
}
```

#### SubState

As components have their own state management system, we usually recommend using the `$delegate()` method if you have steps that need an additional state. However, sometimes it might be more convenient to have all handlers in one component.

For this, you can set a `$subState` in your handlers

```typescript
this.$subState = 'YourSubState';
```

Jovo then adds it to the component's state in the `$state` stack:

```typescript
$state = [
  {
    component: 'YourComponent',
    subState: 'YourSubState',
  },
];
```

You can then add `subState` to your `@Handle` decorator to make sure that this handler only responds to requests of this specific state.

```typescript
@Handle({
  subState: 'YesOrNoState',
  intents: 'YesIntent',
})
Yes() {
  // ...
}
```

It's also possible to use the `@SubState` convenience decorator:

```typescript
import { SubState, Intents } from '@jovotech/framework';

// ...

@SubState('YesOrNoState')
@Intents(['YesIntent'])
showMenu() {
  // ...
}
```

#### PrioritizedOverUnhandled

Sometimes, it's possible that a conversation gets stuck in an [`UNHANDLED` handler](#unhandled). If you want to prioritize a specific handler over a subcomponent's `UNHANDLED` handler, then you can add the `prioritizedOverUnhandled` property.

```typescript
@Handle({
  // ...
  prioritizedOverUnhandled: true,
})
yourHandler() {
  // ...
}
```

It's also possible to use the `@PrioritizedOverUnhandled` convenience decorator:

```typescript
import { PrioritizedOverUnhandled } from '@jovotech/framework';

// ...

@PrioritizedOverUnhandled()
yourHandler() {
  // ...
}
```

[Learn more about `UNHANDLED` prioritization in the routing docs](./routing.md#unhandled-prioritization).

### Condition Properties

Condition properties are additional elements that need to be fulfilled for a handler to respond to a request. The more conditions are true, [the higher a handler is prioritized](#handler-prioritization).

Currently, they include:

- [`platforms`](#platforms)
- [`if`](#if)

#### Platforms

You can specify that a handler is only responsible for specific platforms. The `platforms` property is an array of strings with the names of each platform in camel case:

```typescript
@Handle({
  // ...
  platforms: ['alexa', 'googleAssistant']
})
yourHandler() {
  // ...
}
```

It's also possible to use the `@Platforms` convenience decorator:

```typescript
import { Platforms } from '@jovotech/framework';

// ...

@Platforms(['alexa'])
yourHandler() {
  // ...
}
```

This decorator supports the same structure as the `platforms` property in `@Handle`. Additionally, it supports rest parameters, so you don't need to add an array for it to recognize multiple platforms:

```typescript
@Platforms('alexa', 'googleAssistant')
yourHandler() {
  // ...
}
```

#### If

The `if` property can be a function with access to the `jovo` context (the same as `this` inside a handler). The condition is fulfilled if the function returns `true`.

Here is an example of an `if` condition that says a handler should only be triggered if the user has already played today (stored as a `hasAlreadyPlayedToday` boolean as part of [user data](./data.md#user-data)):

```typescript
@Handle({
  // ...
  if: (jovo) => jovo.$user.data.hasAlreadyPlayedToday
})
yourHandler() {
  // ...
}
```

It's also possible to use the `@If` convenience decorator:

```typescript
@If((jovo) => jovo.$user.data.hasAlreadyPlayedToday))
yourHandler() {
  // ...
}
```

### Handler Prioritization

It's possible that multiple handlers are able to fulfill a request, for example:

```typescript
@Handle({
  intents: ['ShowMenuIntent']
})
showMenu() {
  // ...
}

@Handle({
  intents: ['ShowMenuIntent'],
  platforms: ['alexa']
})
showMenuOnAlexa() {
  // ...
}
```

If this is the case, the handler with more conditions is the one being prioritized. In the above example for a request coming from Alexa, the `showMenuOnAlexa` handler would be triggered.

[Learn more about handler prioritization in the routing docs](./routing.md#handler-and-component-prioritization).

## Handler Logic

Inside a handler is typically where the conversational logic is happening.

You can access all Jovo-related methods using the `this` context. For example, this is how you can write user data into a database:

```typescript
yourHandler() {

  // ...

  this.$user.data.someKey = 'someValue';

  // ...
}
```

A handler usually concludes with one of these tasks:

- [Return output using `$send()`](#return-output)
- [Redirect to a different component using `$redirect()`](#redirect-to-components)
- [Delegate to a component using `$delegate()`](#delegate-to-components)
- [Report back to a delegating component using `$resolve()`](#resolve-a-component)

### Return Output

In most cases, the goal of a handler is to return output to the user.

```typescript
yourHandler() {

  // ...

  return this.$send(/* output */);
}
```

[You can find more information on output here](./output.md).

### Redirect to Components

If you `$redirect()` to a different component, the current one is removed from the `$state` stack. You can see this as a permanent redirect.

If no handler name is specified, the redirect triggers the other component's `START` handler.

```typescript
import { AnotherComponent } from './AnotherComponent';

// ...

yourHandler() {

  // ...

  return this.$redirect(AnotherComponent);
}
```

You can also specify the name of a handler:

```typescript
import { AnotherComponent } from './AnotherComponent';

// ...

yourHandler() {

  // ...

  return this.$redirect(AnotherComponent, 'someHandler');
}
```

### Delegate to Components

```typescript
import { YesNoComponent } from './YesNoComponent';

// ...

yourHandler() {

  // ...

  return this.$delegate(YesNoComponent, {
    resolve: {
      yes: this.onYes,
      no: this.onNo,
    },
    config: {
      // ...
    }
  });
}

onYes() {
  // ...
}

onNo() {
  // ...
}
```

The following options can be added to `$delegate()`:

- `resolve`: Handlers that should be called after the child component resolves with certain data.
  - Can include references to handler functions like `this.onYes` (doesn't work with anonymous functions)
  - Can include a string to the handler key: `'onYes'`
- `config`: The config that is used by the child component. Can be accessed inside the child component with `this.config`

### Resolve a Component

In our previous example, a component delegated to another component (e.g. `YesNoComponent`), expecting it to return a specific result.

After successful handling, the delegated component can use `$resolve()` to report back:

```typescript
// YesNoComponent

YesIntent() {

  // ...

  return this.$resolve('yes');
}
```

The component is then removed from the `$state` stack and the delegating component is called, looking for a handler that matches the event that is passed with `$resolve()` (in the above example `yes`).

## Handler Types

There are some default handlers that you can use in your components, like `LAUNCH` and `START` that have already been referenced on this page.

### LAUNCH

The `LAUNCH` handler only appears once in every project (typically the `MainComponent`) and is responsible for handling the initial start of the app. On voice assistants like Alexa or Google Assistant, `LAUNCH` is entered when the app is opened using its invocation name.

```typescript
LAUNCH() {
  // ...
}
```

Note: Right now, you need to make this handler `global`, we're going to remove this in the next update.

```typescript
@Handle({ global: true })
LAUNCH() {
  // ...
}
```

### START

`START` is entered when a component is redirected or delegated to without a specified handler name. We recommend using `START` in every component as best practice.

```typescript
START() {
  // ...
}
```

### UNHANDLED

`UNHANDLED` is called when no other handler in the current component can fulfill the current request. It can be seen as a catch-all of handlers in one specific component.

```typescript
UNHANDLED() {
  // ...
}
```

## Middlewares

The `component.handler` middleware gets called every time a handler is executed. For example, you can [hook](./hooks.md) into it like this:

```typescript
app.hook('after.component.handler', (jovo: Jovo): void => {
  // ...
});
```
