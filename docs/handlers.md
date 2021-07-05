# Handlers

Handlers are methods inside a [Jovo component](./components.md) that are responsible for handling a request and returning output.

- [Introduction](#introduction)
- [Handler Routing and State Management](#handler-routing-and-state-management)
  - [Handle Decorator](#handle-decorator)
  - [Handler Prioritization](#handler-prioritization)
- [Handler Logic](#handler-logic)
  - [Return Output](#return-output)
  - [Redirect to Components](#redirect-to-components)
  - [Delegate to Components](#delegate-to-components)
  - [Resolve a Component](#resolve-a-component)
- [Handler Types](#handler-types)
  - [LAUNCH](#launch)
  - [START](#start)
  - [UNHANDLED](#unhandled)

## Introduction

![A handler taking in multiple request types like intent requests, launch requests, or touch requests. The handler then results in some output.](img/handler-requests-output.png)

A handler can fulfil multiple types of requests, like intents and touch selections, and then return output.

A component usually has multiple handlers. The `@Handle` decorator is used to define which handler should be responsible for which type of request. For example, one or multiple intents could be added as intents, and a handler could be even more specialized if you added conditions like platforms. [Learn more about handler routing below](#handler-routing-and-state-management).

```typescript
import { Handle } from '@jovotech/framework';

// ...

@Handle({ /* handler options */ })
yourHandler() {
  // ...
}
```
The inside of a handler defines its logic. In the end, each handler should either return some output using the `$send` method, or redirect/delegate to a different handler or component. [Learn more about handler logic below](#handler-logic).

```typescript
import { SomeOutput } from './output/SomeOutput';

// ...

yourHandler() {
  
  // ...

  return this.$send(SomeOutput, { /* output options */ });
}
```


## Handler Routing and State Management

The routing defines which handler should fulfil the incoming request. For example, each intent in your language model should have at least one handler that responds to it, otherwise the Jovo app might throw an error.

Similar to previous versions of Jovo, it is possible to name a handler exactly like the incoming intent it is supposed to respond to:

```typescript
ShowMenuIntent() {
  // ...
}
```

This does not offer a lot of flexibility, though. For better control, we recommend using the `@Handle` decorator. This way, you can even add multiple of intents and name the handler however you like. [Learn more about the `@Handle` decorator below](#handle-decorator).

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


### Handle Decorator

The `@Handle` decorator contains a set of elements that define when a handler should be triggered.

Here is how you can import and it:

```typescript
import { Handle } from '@jovotech/framework';

// ...

@Handle({ /* handler options */ })
yourHandler() {
  // ...
}
```

Currently, the following elements are supported.

Routing properties:
* [`intents`](#intents)
* [`global`](#global-handlers)
* [`subState`](#substate)
* [`prioritizeOverUnhandled`](#prioritizeOverUnhandled)

Conditional properties:
* [`platforms`](#platforms)
* `if`

#### Intents

The `intents` array specifies which incoming intents the handler should be able to fulfil. For example, This handler responds to only the `ShowMenuIntent`:

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

It's also possible to use the `@Intents` convenience decorator:

```typescript
import { Intents } from '@jovotech/framework';

// ...

@Intents(['ShowMenuIntent', 'YesIntent'])
showMenu() {
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

@Global
@Handle({ /* ... */ })
yourHandler() {
  // ...
}
```

Sometimes, it might be necessary to split `@Handle` to make sure that not all options are set to global. In the below example, the handler is accessible from anywhere for both the `ShowMenuIntent` and `YesIntent` (which is probably not a good idea):

```typescript
@Global
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
  intents: [ { name: 'ShowMenuIntent', global: true }, 'YesIntent']
})
showMenu() {
  // ...
}
```

#### SubState

As components have their own state management system, we usually recommend using the `$delegate` method if you have steps that need an additional state. However, sometimes it might be more convenient to have all handlers in one component.

For this, you can set a `subState` in your handlers

```typescript
this.$subState = 'YourSubState';
```

Jovo then adds it to the component's state in the `$state` stack:

```typescript
$state = [
  {
    component: 'YourComponent',
    subState: 'YourSubState',
  }
]
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
@Intents(['Intents'])
showMenu() {
  // ...
}
```
#### Platforms

You can also specify that a handler is only responsible for specific platforms. Pass the name of each platform (the same as the class name that you're importing in your `app.ts`) as a string:

```typescript
@Handle({
  // ...
  platforms: [ 'Alexa', 'GoogleAssistant' ]
})
yourHandler() {
  // ...
}
```

It's also possible to use the `@Platforms` convenience decorator:

```typescript
import { Platforms } from '@jovotech/framework';

// ...

@Platforms(['Alexa', 'GoogleAssistant'])
yourHandler() {
  // ...
}
```

#### PrioritizeOverUnhandled

Sometimes, it's possible that a conversation gets stuck in an [`UNHANDLED` handler](#unhandled). If you want to prioritize a specific handler over a subcomponent's `UNHANDLED` handler, then you can add the `prioritizeOverUnhandled` property.

```typescript
@Handle({
  // ...
  prioritizeOverUnhandled: true,
})
yourHandler() {
  // ...
}
```

It's also possible to use the `@PrioritizeOverUnhandled` convenience decorator:

```typescript
import { PrioritizeOverUnhandled } from '@jovotech/framework';

// ...

@PrioritizeOverUnhandled()
yourHandler() {
  // ...
}
```

[Learn more about `UNHANDLED` prioritization in the routing docs](./routing.md#unhandled-prioritization).

### Handler Prioritization

It's possible that multiple handlers are able to fulfil a request, for example:

```typescript
@Handle({
  intents: [ 'ShowMenuIntent' ]
})
showMenu() {
  // ...
}

@Handle({
  intents: [ 'ShowMenuIntent' ],
  platforms: [ 'Alexa' ]
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

  this.$user.$data.someKey = 'someValue';

  // ...
}
```

A handler usually concludes with one of these tasks:

* [Return output using `$send`](#return-output)
* [Redirect to a different component using `$redirect`](#redirect-to-components)
* [Delegate to a component using `$delegate`](#delegate-to-components)
* [Report back to a delegating component using `$resolve`](#resolve-a-component)

### Return Output

In most cases, the goal of a handler is to return output to the user. [You can find more information on output here](./output.md).

This can be done in multiple ways using the `$send` method:

* [Send an output object](#send-an-output-object)
* [Send an output class](#send-an-output-class)
* [Send multiple responses](#send-multiple-responses)

#### Send an Output Object

You can directly add an output object to the `$send` method:

```typescript
yourHandler() {
  
  // ...

  return this.$send({ /* output */ });
}
```
This object can contain all output template elements that are described in the [output documentation](./output.md).

Here is an example output that just contains a `message`:

```typescript
yourHandler() {
  
  // ...

  return this.$send({ message: 'Hello World!' });
}
```

#### Send an Output Class

For more complex output, we recommend using [output classes](./output.md).

The below example imports an output class called `SomeOutput` and passes it to `$send` together with potential options:

```typescript
import { SomeOutput } from './output/SomeOutput';

// ...

yourHandler() {
  
  // ...

  return this.$send(SomeOutput, { /* output options */ });
}
```

The options can also override reserved properties from the output class, like the `message`:

```typescript
import { SomeOutput } from './output/SomeOutput';

// ...

yourHandler() {
  
  // ...

  return this.$send(SomeOutput, { message: 'This overrides the message from SomeOutput' });
}
```

#### Send Multiple Responses

It may be necessary to spread output across a handler, or even across components.

This is possible with multiple `$send` calls.

The below example uses two `$send` method calls:

```typescript
import { SomeOutput } from './output/SomeOutput';

// ...

yourHandler() {

  this.$send({ message: 'Alright, one second.' });
  
  // ...

  return this.$send(SomeOutput, { /* output options */ });
}
```

Multiple `$send` calls result in the following behavior, depending on the platform:

* Synchronous platforms like Amazon Alexa only support one response. The output is stored in an array and later merged into a single response. `message` elements are concatenated while for other elements that are only supported once (like `card` or `carousel`), the last one gets used.
* Asynchronous platforms like Facebook Messenger support multiple responses. Each response is sent to the platform asynchronously, which leads to multiple chat bubbles for each `message` element.


### Redirect to Components

If you `$redirect` to a different component, the current one is removed from the `$state` stack. You can see this as a permanent redirect.

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

The following options can be added to `$delegate`:

* `resolve`: Handlers that should be called after the child component resolves with certain data.
    * Can include references to handler functions like `this.onYes` (doesn't work with anonymous functions)
    * Can include a string to the handler key: `'onYes'`
* `config`: The config that is used by the child component. Can be accessed inside the child component with `this.config`

### Resolve a Component

In our previous example, a component delegated to another component (e.g. `YesNoComponent`), expecting it to return a specific result.

After successful handling, the delegated component can use `$resolve` to report back:

```typescript
// YesNoComponent

YesIntent() {
  
  // ...

  return this.$resolve('yes');
}
```

The component is then removed from the `$state` stack and the delegating component is called, looking for a handler that matches the event that is passed with `$resolve` (in the above example `yes`).

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

`UNHANDLED` is called when no other handler in the current component can fulfil the current request. It can be seen as a catch-all of handlers in one specific component.

```typescript
UNHANDLED() {
  // ...
}
```
