---
title: 'Entities'
excerpt: 'Learn how to access entities and configure dynamic entities using Jovo.'
url: 'https://www.jovo.tech/docs/entities'
---

# Entities

Learn how to access entities and configure dynamic entities using Jovo.

## Introduction

Entities are variable elements of an intent that can be defined in a [model](./models.md) and retrieved by a [platform](./platforms.md) or [NLU](./nlu.md) integration.

For example, a user saying "_my name is max_" could result in a `MyNameIsIntent` with the entity `name` being filled with `max`. Here is what the corresponding [`$input` object](./input.md) could look like:

```typescript
{
  type: 'INTENT',
  intent: 'MyNameIsIntent',
  entities: {
    name: {
      value: 'max',
    },
  },
}
```

Depending on if the information is coming from a [platform](./platforms.md) directly, or from an [NLU](./nlu.md) integration, the `entities` can either be found in the root of the [`$input` object](./input.md) or inside an `nlu` property. Jovo offers a convenience property `this.$entities` to [access entities](#access-entities):

```typescript
this.$entities.entityName

// Example
someHandler() {
  // ...

  const name = this.$entities.name!.value; // Result: max
}
```

There are also two additional sections with examples for accessing entities:

- [Slot filling](#slot-filling) shows how to collect entity values by delegating to subcomponents
- [Entity validation](#entity-validation) shows how entity values can be checked using the `@Handle` decorator

Usually, entities and their entity types are defined in the [Jovo Model](./models.md). [Learn more about entity types here](https://www.jovo.tech/docs/model-schema#entitytypes).

```json
{
  "entityTypes": {
    "myCityEntityType": {
      "values": ["Berlin", "New York"]
    }
  }
  // ...
}
```

The downside of this is that the trained models are static and can't be dynamically updated, e.g. by using data from an API call. Jovo offers a concept called [dynamic entities](#dynamic-entities) to update entity values during runtime.

## Access Entities

You can access the complete object of entities with `this.$entities`, and a specific entity by its name, `this.$entities.entityName`.

```typescript
this.$entities.entityName

// Example
someHandler() {
  // ...

  const color = this.$entities.color!.value;
}
```

Each entity is an object that contains the following information:

```typescript
{
  value: 'entityValue',
  resolved: 'mappedEntityValue',
  id: 'entityValueId',
  native: { /* ... */ }
}
```

- `value`: The (raw) value retrieved from the user input.
- `resolved`: If the entity value was a synonym, the "main" value of the language model will be provided here. If there is no resolved value, this will default to `value`.
- `id`: Some platforms and NLUs provide the possibility to add IDs to their entity values. If there is no ID available, the `id` will be the same as `resolved`.
- `native`: For platforms that support additional entity features, the raw entity data of the API response will be stored here.

For example, if we have a `city` [entity type](https://www.jovo.tech/docs/model-schema#entitytypes) in our [model](./models.md) that includes the following for `New York`:

```json
"myCityEntityType": {
  "values": [
    {
      "value": "New York",
      "id": "nyc",
      "synonyms": [
        "New York City",
        "NYC",
        "n. y. c."
      ]
    }
  ]
}
```

If a user said something like `I live in new york`, the values would be the following:

```typescript
{
  value: 'new york',
  resolved: 'New York',
  id: 'nyc',
}
```

In general, we recommend using the `resolved` property because the `value` can be ambiguous and might even include typos on text-based platforms.

### Slot Filling

Often, it is necessary to capture multiple entity values for a specific task. For example, a table reservation at a restaurant might need the following:

- `numberOfPeople`: The amount of seats to be reserved
- `time`: For when the reservation should be made

The process of retrieving these values is also called slot filling. Learn more in this [introduction to dialogue management](https://www.context-first.com/dialogue-management-introduction/).

We recommend retrieving and [validating](#entity-validation) entities in designated [components](./components.md). The example below includes the following:

- A `ReservationComponent` that is responsible for handling everything related to reservations.
- It imports a `CollectReservationDataComponent` and adds it as [subcomponent](./components.md#register-subcomponents).
- A [`global`](./handle-decorators.md#global) handler that reacts to a `ReservationIntent` (for example, if a user says "I want to make a reservation").
- This handler then uses [`$delegate`](./handlers.md#delegate-to-components) to let the `CollectReservationDataComponent` handle the slot filling.
- If the `CollectReservationDataComponent` [resolves](./handlers.md#resolve-a-component) with `success`, the `makeReservation` handler will be called.

```typescript
// src/components/ReservationComponent.ts

import { Component, BaseComponent, Handle } from '@jovotech/framework';
import { CollectReservationDataComponent } from './CollectReservationDataComponent';

@Component({
  components: [CollectReservationDataComponent],
})
class ReservationComponent extends BaseComponent {
  @Handle({
    global: true,
    intents: ['ReservationIntent'],
  })
  collectReservationData() {
    return this.$delegate(CollectReservationDataComponent, {
      resolve: {
        success: this.makeReservation,
        // ...
      },
    });
  }

  makeReservation(data) {
    // ...
  }
}
```

The `CollectReservationDataComponent` could include the following:

- It prompts the user for data input in the [`START` handler](https://www.jovo.tech/docs/handlers#start).
- It has handlers for each intent that are used to collect and [validate entities](#entity-validation) for this task.
- It then uses [`$resolve`](./handlers.md#resolve-a-component) to send the data back to the `ReservationComponent`.

A simple example could be just a single entity that needs to be collected. Here, the `$resolve` could be called right in the `collectNumberOfPeople` handler:

```typescript
// src/components/CollectReservationDataComponent.ts

import { Component, BaseComponent, Intents } from '@jovotech/framework';

@Component()
class CollectReservationDataComponent extends BaseComponent {
  START() {
    return this.$send('How many people should we expect?');
  }

  @Intents(['NumberIntent'])
  collectNumberOfPeople() {
    if (this.$entities.$number) {
      return this.$resolve('success', this.$entities.$number.resolved);
    }
    // ...
  }
}
```

If you need to collect more data, it is advisable to store all collected entities in the [component data](./components.md#component-data) and then manually check if all slots are filled. A few more examples for this can be found in the [entity validation](#entity-validation) section.

If all data is collected, you could call a `success` handler. If not, you could prompt for additional entities.

```typescript
// src/components/CollectReservationDataComponent.ts

import { Component, BaseComponent, Intents } from '@jovotech/framework';

@Component()
class CollectReservationDataComponent extends BaseComponent {
  START() {
    return this.$send('How many people should we expect?');
  }

  @Intents(['NumberIntent'])
  collectNumberOfPeople() {
    this.$component.$data.numberOfPeople = this.$entities.$number!.resolved;

    // ...
  }

  success() {
    return this.$resolve('success', this.$component.$data);
  }
}
```

You can access the data in the `makeReservation` handler of the `ReservationComponent`:

```typescript
// src/components/ReservationComponent.ts

import { Component, BaseComponent } from '@jovotech/framework';
import { CollectReservationDataComponent } from './CollectReservationDataComponent';

@Component({
  components: [CollectReservationDataComponent],
})
class ReservationComponent extends BaseComponent {
  // ...

  makeReservation(data) {
    // ...
  }
}
```

### Entity Validation

You can use the [`if` property](./handle-decorators.md#if) of the [`@Handle` decorator](./handle-decorators.md) to check if certain entities are set or have a specific value.

For example, if a `ReservationDataIntent` allows the user to fill multiple slots at once ("for 3 people at 6pm"), you can make sure if the entity values are set like this:

```typescript
// This handler is used if all entities are filled successfully
@Handle({
  intents: ['ReservationDataIntent'],
  if: (jovo) => jovo.$entities.numberOfPeople && jovo.$entities.time
})
confirmReservation() {
  // ...
}

// This handler is used to prompt for a missing entity
@Handle({
  intents: ['ReservationDataIntent'],
  if: (jovo) => jovo.$entities.numberOfPeople === undefined
})
askForNumberOfPeople() {
  return this.$send('For how many people would you like to reserve a table?');
}
```

For readability, you can also take a look at [imported decorators](https://www.jovo.tech/docs/handle-decorators#imported-decorators).

## Dynamic Entities

Dynamic entities offer the ability to dynamically add values (e.g. from an API call) to entity types during runtime. Currently, this feature is supported by the following platforms and NLU services: [Alexa](https://www.jovo.tech/marketplace/platform-alexa), [Google Assistant](https://www.jovo.tech/marketplace/platform-googleassistant), [Snips NLU](https://www.jovo.tech/marketplace/nlu-snips).

You can add dynamic entities to the [`listen` property](./output-templates.md#listen):

```typescript
{
  message: 'Which type of pizza do you like?',
  listen: {
    entities: { /* ... */ }
  }
}
```

This will set `listen` to `true` and add dynamic entities to all platforms/NLUs that support that feature.

```typescript
{
  entities: {
    mode: 'REPLACE', // default
    types: {
      PizzaType: {
        values: [
          {
            value: 'peperoni',
            synonyms: [ 'salami' ], // optional
            id: 'someId', // optional
          },
        ],
      },
    },
  },
}
```

The following modes are supported:

- `REPLACE`: Only uses the new entities
- `MERGE`: Supplements the new entities with existing ones
- `CLEAR`: Deletes the dynamic entities
