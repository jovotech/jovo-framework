# Routing

Learn more about the different elements of routing: How the Jovo app decides which [component](./components.md) and [handler](./handlers.md) should respond to a request.
- [Introduction](#introduction)
- [Request Routing](#request-routing)
  - [Handler Matches](#handler-matches)
  - [Handler and Component Prioritization](#handler-and-component-prioritization)
  - [UNHANDLED Prioritization](#unhandled-prioritization)
- [Handler Routing](#handler-routing)

## Introduction

Routing is a key activity of dialogue management (as part of the [RIDR Lifecycle](./ridr-lifecycle.md)) and is responsible for matching user input with handlers and components that can return a appropriate response. 

There are multiple types of routing:

* [Request routing](#request-routing): This is the initial routing that happens for each request. It results in an initial handler that is being selected by the router and then executed by Jovo.
* [Handler routing](#handler-routing): Often, handlers route to other handlers or components during the same interaction.


## Request Routing

The router goes through all handlers that potentially match the request (e.g. that accept a specific `intent`) and collects them in a `$route` object. It takes into consideration the following handlers:

* Handlers from all components that are part of the `$state` stack
* Global handlers from all root components

The results are added to a `matches` object in the `$route`. In a below section, we go into detail how [handler matches](#handler-matches) work. 

The matches are ranked by priority. The currently active component in the `$state` stack is the most important one, then the next components in the stack follow, until global handlers are reached. Learn more about [handler and component prioritization](#handler-and-component-prioritization) in the section below.

Here's an example how the `matches` look like for a request with a `YesIntent`. This uses the [Jovo v4 sample template](https://github.com/jovotech/jovo-v4-template) as an example.

```js
this.$route = {
  // ...
  matches: [
    {
      component: 'LoveHatePizzaComponent.YesNoComponent',
      handler: 'yes'
    },
    {
      component: 'LoveHatePizzaComponent.YesNoComponent',
      handler: 'UNHANDLED'
    },
    {
      component: 'LoveHatePizzaComponent',
      handler: 'UNHANDLED'
    }
  ]
}
```

In the example above, the the `yes` handler is the best match that ranks above two `UNHANDLED` handlers. The router then selects the highest ranked match and adds it to a `resolved` object:

```js
this.$route = {
  resolved: {
    {
      component: 'LoveHatePizzaComponent.YesNoComponent',
      handler: 'yes'
    },
  }
  matches: [
    // ...
  ]
}
```

After `resolved` is determined, Jovo runs the specified handler.


### Handler Matches

To find handlers that could potentially fulfill a request, the router first goes through the `$state` stack (for local and global handlers) and then through all [root components](./components.md#register-root-components) (for global handlers).

If a handler matches a request is highly dependent on the metadata that is added using the `@Handle` decorator (or convenience decorators like `@Intents`). [Learn more about these decorators here](./handlers.md#handler-routing-and-the-handle-decorator).

A handler counts as match if:

* It matches a specific request type, like `LAUNCH`
* For raw text or intent request types: It accepts the incoming `intent` (and potentially [`subState`](./handlers.md#substate))
* It also matches other `@Handle` conditions like `platforms` and `if`
* It is an `UNHANDLED` handler ([more on that below](#unhandled-prioritization))

Let's take another look at our example from above. If there is a request with a `YesIntent`, the `LoveHatePizzaComponent.YesNoComponent` is in the `$state` stack, and contains a handler like this:

```typescript
@Intents([ 'YesIntent' ])
yes() {
  // ...
}
```

Then this matches and the handler is added to the `$route.matches`:

```js
this.$route = {
  // ...
  matches: [
    {
      component: 'LoveHatePizzaComponent.YesNoComponent',
      handler: 'yes'
    },
    // ...
  ]
}
```

If a handler is `global` and has the `prioritizedOverUnhandled` property, this info is added to the match item as well:

```js
this.$route = {
  // ...
  matches: [
    {
      component: 'SomeComponent',
      handler: 'SomeHandler',
      global: true,
      prioritizedOverUnhandled: true,
    },
    // ...
  ]
}
```


### Handler and Component Prioritization

The ranking is determined between components, handlers of a component, and global handlers.

For each component, the handlers are ranked in the following order:

* Handlers using the `if` property + other conditions (e.g. `platforms`). The more conditions, the higher the ranking.
* Handlers using only the `if` property.
* Handlers using other conditions (e.g. `platforms`). The more conditions, the higher the ranking.
* Handlers using no other conditions.
* `UNHANDLED` handlers.

At the component-level, the ranking is as follows:

* The most active component of the `$state` stack is ranked highest.
* After that, each lower component in the stack is ranked lower as well.
* If there are no more components in the `$state` stack, global handlers are ranked at the lowest level.



### UNHANDLED Prioritization

`UNHANDLED` is a built in handler that can be seen as a wildcard. If the active component doesn't have a handler that matches the request, then `UNHANDLED` can be used as fallback handler. [Learn more about `UNHANDLED` in the handler docs](./handlers.md#unhandled).

`UNHANDLED` is always ranked below all other handlers from the same component:

```js
this.$route = {
  // ...
  matches: [
    {
      component: 'LoveHatePizzaComponent.YesNoComponent',
      handler: 'yes'
    },
    {
      component: 'LoveHatePizzaComponent.YesNoComponent',
      handler: 'UNHANDLED'
    },
    // ...
  ]
}
```

Often, there could be the case that the `UNHANDLED` handler is on top of the `matches`. In the below case, the user might have asked for business hours instead of responding to a yes/no question. If the active component has an `UNHANDLED` handler, this would always be at the top in a case like this:

```js
this.$route = {
  // ...
  matches: [
    {
      component: 'LoveHatePizzaComponent.YesNoComponent',
      handler: 'UNHANDLED'
    },
    {
      component: 'BusinessDataComponent',
      handler: 'businessHours'
    },
    // ...
  ]
}
```

This could mean that the user gets stuck in a loop: No matter what they say, if it's not "yes" or "no", they will always end up in `UNHANDLED`, which can be a frustrating experience.

For this, there are two options that make it possible to skip `UNHANDLED`:

* [`prioritizedOverUnhandled`](#prioritizedOverUnhandled)
* [`intentsToSkipUnhandled`](#intentstoskipunhandled)


#### prioritizedOverUnhandled

There might be some handlers where you decide that they are more important than `UHANDLED`, even if they're ranked below it in the `matches`. You can highlight them as prioritized by adding the `prioritizedOverUnhandled` property. [Learn more about `prioritizedOverUnhandled` in the handler docs](./handlers.md#prioritizedOverUnhandled).

If a handler is prioritized, the property gets added to the `matches` element:

```js
this.$route = {
  // ...
  matches: [
    {
      component: 'SomeComponent',
      handler: 'SomeHandler',
      prioritizedOverUnhandled: true,
    },
    // ...
  ]
}
```

In the process of finding the best ranked handler, the router goes through the `matches` and adjusts the prioritization with the following steps:

* Search for any `UNHANDLED` in `matches`.
* For each `UNHANDLED`, look if there is a handler with `prioritizedOverUnhandled` ranked somewhere below.
* If there is a `prioritizedOverUnhandled` handler below (if multiple, select the highest ranked one), add `skip: true` to the `UNHANDLED` handler.
* Add `skip: true` to any other handlers between `UNHANDLED` and the first `prioritizedOverUnhandled` handler below it.

Here is an example that would result in skipped `UNHANDLED`:

```js
this.$route = {
  // ...
  matches: [
    {
      component: 'LoveHatePizzaComponent.YesNoComponent',
      handler: 'UNHANDLED'
      skip: true,
    },
    {
      component: 'LoveHatePizzaComponent',
      handler: 'help'
      skip: true,
    },
    {
      component: 'BusinessDataComponent',
      handler: 'businessHours',
      prioritizedOverUnhandled: true,
    },
    // ...
  ]
}
```

In this example, the router would resolve to this:

```js
this.$route = {
  resolved: {
    component: 'BusinessDataComponent',
    handler: 'businessHours',
    prioritizedOverUnhandled: true,
  },
  // ...
}
```


#### intentsToSkipUnhandled

As opposed to [`prioritizedOverUnhandled`](#prioritizedOverUnhandled), a property that takes the perspective of a specific handler, the `intentsToSkipUnhandled` configuration is global. It defines all intents that that should completely ignore `UNHANDLED` handlers.

Let's assume we have a `BusinessHoursIntent` that is part of `intentsToSkipUnhandled`. If there is a request with that intent, the router adds `skip: true` to all `UNHANDLED` handlers in `matches`.

```js
this.$route = {
  // ...
  matches: [
    {
      component: 'LoveHatePizzaComponent.YesNoComponent',
      handler: 'UNHANDLED'
      skip: true,
    },
    {
      component: 'LoveHatePizzaComponent',
      handler: 'help'
    },
    {
      component: 'BusinessDataComponent',
      handler: 'businessHours',
      prioritizedOverUnhandled: true,
    },
    // ...
  ]
}
```

Note the difference between this example and the one from [`prioritizedOverUnhandled`](#prioritizedOverUnhandled). Here, `help` (a handler that apparently also accepts `BusinessHoursIntent`) doesn't get skipped. Instead, it gets added to `resolved` and is the handler to be routed to.

```js
this.$route = {
  resolved: {
    component: 'LoveHatePizzaComponent',
    handler: 'help'
  },
  // ...
}
```


## Handler Routing

Handler routing is what happens after the initial request routing. There are three options how a handler could invoke a different one:

* [Redirect to a different component or handler](./handlers.md#redirect-to-components)
* [Delegate to a subcomponent](./handlers.md#delegate-to-components)
* [Resolve a component after delegation](./handlers.md/#resolve-a-component)
