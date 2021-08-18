# State Stack

The Jovo `$state` stack remembers components that are relevant for the current user session.

- [Introduction](#introduction)
- [Stacking Components](#stacking-components)
- [State Properties](#state-properties)

## Introduction

The `$state` stack is a key element of [routing](./routing.md) and dialogue management as part of the *dialogue and logic* step of the [RIDR Lifecycle](./ridr-lifecycle.md).

`$state` is stored in [session data](./data.md#session-data) with the following characteristics:

* It is an array of [components](./components.md) that the user was interacting with in this session
* It also stores information about component delegation, for example [which handlers to resolve to](./handlers.md#resolve-a-component)
* Additionally, it can hold [component data](./data.md#component-data) which gets cleared once the component resolves

This information is important for the [router](./routing.md) to understand where in the conversation the user currently is. For example, if the user says "*yes*", the Jovo app needs to know which question they are referring to. If you want to dive deeper, take a look at this [comprehensive introduction to dialogue management](https://www.context-first.com/dialogue-management-introduction/).

If you're used to building state machines (for example Jovo `v3`), you can see a Jovo component as a state. The main difference is that the state is now a stack, making it easier to keep track of previous interactions.

Once a component is entered, it is added to the Jovo `$state` stack:

```typescript
$state = [
  {
    component: 'SomeComponent'
  }
]
```

The component is removed from the stack once it resolves or the session closes.

## Stacking Components

The Jovo `$state` stack is an array, its last index (`state.length - 1`) referencing the most recently active component.

This is helpful to remember previous steps, for example after [a component delegated to a different one](./handlers.md#delegate-to-components) to complete a task.

As an example, let's start with a component called `TableReservationComponent` that gets invoked by a user request and is thus added to the `$state`:

```typescript
$state = [
  {
    component: 'TableReservationComponent'
  }
]
```

The `TableReservationComponent` then needs to collect some information and delegates to a `CollectNumberOfPeopleComponent`. That component can either [resolve](./handlers.md#resolve-a-component) with a `success` or an `exit` event. The delegating component references handlers to be called for each of these events to the `$delegate` call:

```typescript
return this.$delegate(
  CollectNumberOfPeopleComponent,
  { resolve: {
      success: confirmTableAvailability,
      exit: offerHelp
    }
  }
);
```

The delegate call then enters the `START` handler inside `CollectNumberOfPeopleComponent` and adds the relevant information for the next request to the `$state`:

```typescript
$state = [
  {
    component: 'TableReservationComponent'
  },
  {
    component: 'CollectNumberOfPeopleComponent',
    resolve: {
      success: 'confirmTableAvailability',
      exit: 'offerHelp'
    }
  }
]
```

There are now several things that could happen in `CollectNumberOfPeopleComponent`:

* It delegates to another component, adding that one to the `$state` as well
* It collects the information and then resolves, which results in its removal from the `$state`

If the `CollectNumberOfPeopleComponent` gets removed, the router looks if there are any components left. In this case it's `TableReservationComponent`. Here, the router invokes the right handler based on the event coming from the `$resolve`.


## State Properties

Each object in the `$state` array contains at least a `component` string which references the path to a component. Subcomponents are nested using `.`, e.g. `ParentComponent.SubComponent`.

The object may also include:

* A `resolve` object that references handlers that should be called for specific events. This data is added using the [`$delegate` method](./handlers.md#delegate-to-components).
* A `data` object with [component data](./data.md#component-data).
* A [`subState`](./handlers.md#substate)
* A `config` object with additional elements passed with [`$delegate`](./handlers.md#delegate-to-components).
