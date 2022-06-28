---
title: 'Handle Decorators'
excerpt: 'Learn more about Jovo Handle decorators, which determine which types of user input a handler should respond to.'
---

# Handle Decorators

Learn more about Jovo `@Handle` decorators, which determine which types of user input a [handler](./handlers.md) should respond to.

## Introduction

`@Handle` decorators are [TypeScript method decorators](https://www.typescriptlang.org/docs/handbook/decorators.html#method-decorators) that can be added to a [handler](./handlers.md) function to determine which types of user input the handler should respond to.

For example, the below `showMenu` handler (you can name these methods however you like) is triggered if the user input contains either `ShowMenuIntent` or `YesIntent`:

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

Each of the properties of `@Handle` also includes its own convenience decorator. The above example would also work like this:

```typescript
import { Intents } from '@jovotech/framework';
// ...

@Intents['ShowMenuIntent', 'YesIntent'])
showMenu() {
  // ...
}
```

The `@Handle` decorator includes two types of properties:

- [Routing properties](#routing-properties): The router first looks if the handler matches a specific route:
  - [`intents`](#intents)
  - [`types`](#types)
  - [`global`](#global-handlers)
  - [`subState`](#substate)
  - [`prioritizedOverUnhandled`](#prioritizedOverUnhandled)
- [Condition properties](#condition-properties): After that, it is evaluated if there are additional conditions that have to be fulfilled:
  - [`platforms`](#platforms)
  - [`if`](#if)

The more properties of `@Handle` a handler fulfills, the higher it gets prioritized in the current request. Learn more about handler prioritization in the [routing documentation](./routing.md).

For example, there could be an additional handler just for [Alexa](https://www.jovo.tech/marketplace/platform-alexa) using [`platforms`](#platforms):

```typescript
import { Handle } from '@jovotech/framework';
// ...

@Handle({
  intents: ['ShowMenuIntent', 'YesIntent']
})
showMenu() {
  // ...
}

@Handle({
  intents: ['ShowMenuIntent', 'YesIntent'],
  platforms: ['alexa']
})
showMenuOnAlexa() {
  // ...
}
```

Or you could have different handlers depending on [user data](./data.md#user-data) using [`if`](#if):

```typescript
import { Handle, Jovo } from '@jovotech/framework';
// ...

@Handle({
  intents: ['PlayGameIntent']
})
playGame() {
  // ...
}

@Handle({
  intents: ['PlayGameIntent'],
  if: (jovo: Jovo) => jovo.$user.data.hasAlreadyPlayedToday
})
tellUserToComeBackTomorrow() {
  // ...
}
```


## Routing Properties

Routing properties define the core elements a router is looking for when determining if a handler matches a request. Learn more in the [routing documentation](./routing.md).

The following properties are available:

- [`intents`](#intents)
- [`types`](#types)
- [`global`](#global-handlers)
- [`subState`](#substate)
- [`prioritizedOverUnhandled`](#prioritizedOverUnhandled)

### intents

The `intents` property specifies which incoming intents the handler should be able to fulfill. Learn more about intents in the [models documentation](./models.md).

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

Sometimes, a handler should be [`global`](#global) for only some of the `intents`. For this, you can turn an intent string into an object:

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

### types

The `types` property specifies which [input types](./input.md) the handler should be able to fulfill.

```typescript
@Handle({
  types: ['LAUNCH'],
})
welcomeUser() {
  // ...
}
```

This property is especially helpful for platform specific request types. For example, you can use it to react to any Alexa request type like [`AudioPlayer.PlaybackStopped`](https://www.jovo.tech/marketplace/platform-alexa/audioplayer#audioplayer-handlers) without needing to extend Jovo core functionality in any way:

```typescript
@Handle({
  global: true,
  types: ['AudioPlayer.PlaybackStopped'],
  platforms: ['alexa'],
})
playbackStopped() {
  // ...
}
```

It's also possible to use the `@Types` convenience decorator:

```typescript
import { Types } from '@jovotech/framework';
// ...

@Types(['LAUNCH'])
welcomeUser() {
  // ...
}
```

This decorator supports the same structure as the `types` property in `@Handle`. Additionally, it supports rest parameters, so you don't need to add an array for it to recognize multiple types:

```typescript
@Types('LAUNCH', 'SomeOtherInputType')
welcomeUser() {
  // ...
}
```

### global

By default, handlers are only accessible from their [component](./components.md). By making them global, they can be reached from any part of the Jovo app. This is similar to how "stateless" handlers worked in Jovo `v3`.

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

Sometimes, it might be necessary to split `@Handle` to make sure that not all options are set to `global`. In the below example, the handler is accessible from anywhere for both the `ShowMenuIntent` and `YesIntent` (which is probably not a good idea):

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

### subState

As components have their own [state management system](./state-stack.md), we usually recommend using the [`$delegate()` method](./handlers.md#delegate-to-components) if you have steps that need an additional state. However, sometimes it might be more convenient to have all handlers in one component.

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
  intents: ['YesIntent'],
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

### prioritizedOverUnhandled

Sometimes, it's possible that a conversation gets stuck in an [`UNHANDLED` handler](./handlers.md#unhandled). If you want to prioritize a specific handler over a subcomponent's `UNHANDLED` handler, then you can add the `prioritizedOverUnhandled` property.

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

## Condition Properties

Condition properties are additional elements that need to be fulfilled for a handler to respond to a request. The more conditions are true, [the higher a handler is prioritized](./routing.md#handler-and-component-prioritization).

Currently, they include:

- [`platforms`](#platforms)
- [`if`](#if)

### platforms

You can specify that a handler is only responsible for specific platforms. The `platforms` property is an array of strings with the names of each platform in camelCase:

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

### if

The `if` property can be a function with access to the `jovo` context (the same as `this` inside a handler). The condition is fulfilled if the function returns `true`.

Here is an example of an `if` condition that says a handler should only be triggered if the user has already played today (stored as a `hasAlreadyPlayedToday` boolean as part of [user data](./data.md#user-data)):

```typescript
import { Handle, Jovo } from '@jovotech/framework';
// ...

@Handle({
  // ...
  if: (jovo: Jovo) => jovo.$user.data.hasAlreadyPlayedToday
})
yourHandler() {
  // ...
}
```

It's also possible to use the `@If` convenience decorator:

```typescript
import { If, Jovo } from '@jovotech/framework';
// ...

@If((jovo: Jovo) => jovo.$user.data.hasAlreadyPlayedToday))
yourHandler() {
  // ...
}
```

Here is an additional example that returns a different message if it is a new user:

```typescript
// src/components/GlobalComponent.ts

import { Jovo, Component, BaseComponent, Global, Handle } from '@jovotech/framework';
// ...

@Global()
@Component()
export class GlobalComponent extends BaseComponent {
  LAUNCH() {
    return this.$send('Welcome back!');
  }

  @Handle({ types: ['LAUNCH'], if: (jovo: Jovo) => jovo.$user.isNew })
  welcomeNewUser() {
    return this.$send('Welcome, new user!');
  }
}
```


## Multiple Decorators

Sometimes, it might be necessary to split `@Handle` into multiple decorators. For example, it could be used to make sure that not all options are set to `global`. In the below example, the handler is accessible from anywhere for both the `ShowMenuIntent` and `YesIntent` (which is probably not a good idea):

```typescript
@Global()
@Handle({
  intents: ['ShowMenuIntent', 'YesIntent']
})
showMenu() {
  // ...
}
```

By adding a second `@Handle` decorator, you can make it `global` for only some intents:

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

## Imported Decorators

For a clearer structure and better readability, you can also outsource objects to be used by the `@Handle` decorator in a separate file and then import it in your component file.

The below example exports a class called `Handles` that can include both methods as well as properties:

```typescript
// src/Handles.ts

import { HandleOptions } from '@jovotech/framework';

export class Handles {
  // ...

  static newUserOnLaunch(): HandleOptions {
    return {
      global: true,
      types: ['LAUNCH'],
      if: (jovo: Jovo) => jovo.$user.isNew
    };
  }
}
```

You can then use it with `@Handle` like this:

```typescript
import { Handle } from '@jovotech/framework';
// ...

@Handle(Handles.newUserOnLaunch())
welcomeNewUser() {
  // ...
}
```

Some Jovo platforms also come with convenience decorator methods and objects. For example, the [Alexa platform integration](https://www.jovo.tech/marketplace/platform-alexa) offers a class called [`AlexaHandles`](https://github.com/jovotech/jovo-framework/blob/v4/latest/platforms/platform-alexa/src/AlexaHandles.ts) that exports objects and methods that can be imported in your components.

Here is an example from `AlexaHandles`:

```typescript
import { EnumLike, HandleOptions } from '@jovotech/framework';
// ...

export enum AudioPlayerType {
  PlaybackStarted = 'AudioPlayer.PlaybackStarted',
  PlaybackNearlyFinished = 'AudioPlayer.PlaybackNearlyFinished',
  PlaybackFinished = 'AudioPlayer.PlaybackFinished',
  PlaybackStopped = 'AudioPlayer.PlaybackStopped',
  PlaybackFailed = 'AudioPlayer.PlaybackFailed',
}

export type AudioPlayerTypeLike = EnumLike<AudioPlayerType> | string;

static onAudioPlayer(type: AudioPlayerTypeLike): HandleOptions {
  return {
    global: true,
    types: [type],
    platforms: ['alexa'],
  };
}
```

In your component, it can be used like this (as explained in the [Alexa AudioPlayer docs](https://www.jovo.tech/marketplace/platform-alexa/audioplayer#audioplayer-handlers)):

```typescript
import { Handle } from '@jovotech/framework';
import { AlexaHandles } from '@jovotech/platform-alexa';
// ...

@Handle(AlexaHandles.onAudioPlayer('AudioPlayer.PlaybackStopped'))
playbackStopped() {
  // ...
}
```

The result is the same as using this:

```typescript
import { Handle } from '@jovotech/framework';
// ...

@Handle({
  global: true,
  types: ['AudioPlayer.PlaybackStopped'],
  platforms: ['alexa'],
})
playbackStopped() {
  // ...
}
```
