# Entities

Learn more about how to access entities using Jovo.
- [Introduction](#introduction)
- [Access Entities](#access-entities)
- [Dynamic Entities](#dynamic-entities)

## Introduction

Entities are variable elements of an intent that can be defined in a [model](./models.md) and retrieved by a [platform](./platforms.md) or [NLU](./nlu.md) integration.

For example, a user saying "*my name is max*" could result in a `MyNameIsIntent` with the entity `name` being filled with `max`. Here is what the corresponding [`$input` object](./input.md) could look like:

```typescript
{
  type: 'INTENT',
  intent: 'MyNameIsIntent',
  entities: {
    name: {
      value: 'Max',
    },
  },
}
```

Depending on if the information is coming from a [platform](./platforms.md) directly, or from an [NLU](./nlu.md) integration, the `entities` can either be found in the root of the [`$input` object](./input.md) or inside an `nlu` property. Jovo offers a convenience property `this.$entities` to [access entities](#access-entities).

Usually, entities and their entity types are defined in the [Jovo Model](./models.md). The downside of this is that the trained models are static and can't be dynamically updated, e.g. by using data from an API call. Jovo offers a concept called [dynamic entities](#dynamic-entities) to update entity values during runtime.


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
  id: 'entityValueId',
  key: 'mappedEntityValue',
}
```
* `value`: The value retrieved from the user input.
* `key`: If the entity value was a synonym, the "main" value of the language model will be provided here.
* `id`: Some platforms and NLUs provide the possibility to add IDs to their entity values. If there is no ID available, the `id` will be the same as the `value`.


## Dynamic Entities

Dynamic entities offer the ability to dynamically add values (e.g. from an API call) to entity types during runtime. Currently, this feature is supported by the Alexa and Google Assistant platforms.

You can add dynamic entities to the `listen` property:

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
            value: 'peperoni'
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

* `REPLACE`: Only uses the new entities
* `MERGE`: Supplements the new entities with existing ones
* `CLEAR`: Deletes the dynamic entities
