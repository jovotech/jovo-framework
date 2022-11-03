---
title: 'Rasa NLU Integration'
excerpt: 'Turn raw text into structured meaning with the Jovo Framework integration for the open source natural language understanding service Rasa NLU.'
url: 'https://www.jovo.tech/marketplace/nlu-rasa'
---

# Rasa NLU Integration

Turn raw text into structured meaning with the Jovo Framework integration for the open source natural language understanding service Rasa NLU.

## Introduction

[Rasa NLU](https://github.com/RasaHQ/rasa) is an open source [natural language understanding (NLU)](https://www.jovo.tech/docs/nlu) service with its own pipeline of processing components.

Since it is an open source service, you can host Rasa NLU on your own servers without any external API calls. [Learn more in the official Rasa docs](https://rasa.com/docs/rasa/nlu-only).

You can use the Jovo Rasa NLU integration for projects where you receive raw text input that needs to be translated into structured meaning to work with the Jovo intent structure. Platforms like the [Jovo Core Platform](https://www.jovo.tech/marketplace/platform-core) (e.g. in conjunction with the [Jovo Web Client](https://www.jovo.tech/marketplace/client-web)), [Facebook Messenger](https://www.jovo.tech/marketplace/platform-facebookmessenger), and [Google Business Messages](https://www.jovo.tech/marketplace/platform-googlebusiness) are some examples where this would work.

Learn more about setting everything up in the [installation](#installation) and [configuration](#configuration) sections.

The [entities](#entities) section provides an overview how Rasa entities are mapped to [Jovo `$entities`](https://www.jovo.tech/docs/entities).

## Installation

You can install the plugin like this:

```sh
$ npm install @jovotech/nlu-rasa
```

NLU plugins can be added to Jovo platform integrations. Here is an example how it can be added to the Jovo Core Platform in `app.ts`:

```typescript
import { CorePlatform } from '@jovotech/platform-core';
import { RasaNlu } from '@jovotech/nlu-rasa';
// ...

const app = new App({
  plugins: [
    new CorePlatform({
      plugins: [new RasaNlu()],
    }),
    // ...
  ],
});
```

## Configuration

The following configurations can be added:

```typescript
new RasaNlu({
  serverUrl: 'http://localhost:5005',
  serverPath: '/model/parse',
  alternativeIntents: {
    maxAlternatives: 15,
    confidenceCutoff: 0.0,
  };
}),
```

- `serverUrl`: Where your Rasa NLU server can be reached. Default: `http://localhost:5005`.
- `serverPath`: The endpoint that gets called by the integration. Default: `/model/parse`.
- `alternativeIntents`: [Learn more below](#alternative-intents).

### Alternative Intents

For each request, Rasa NLU provides a list of intents that potentially match the input, ranked by a confidence score. By default, the Jovo Rasa NLU integration uses the highest ranked intent for routing.

You can, however, access the other ranked intents as an array called `alternativeIntents` by configuring the following:

```typescript
new RasaNlu({
  // ...
  alternativeIntents: {
    maxAlternatives: 15,
    confidenceCutoff: 0.0,
  };
}),
```

`alternativeIntents` includes these properties:

- `maxAlternatives`: The amount of alternative intents that should be added to the array.
- `confidenceCutoff`: Only add intents that are above this confidence level.

You can access the `alternativeIntents` array like this:

```typescript
this.$input.nlu.alternativeIntents;
```

Since the `alternativeIntents` is specific to the `RasaNluData` type, you can do type casting like this:

```typescript
const alternativeIntents = (this.$input.nlu as RasaNluData | undefined)?.alternativeIntents;
```

## Entities

You can access Rasa entities by using the `$entities` property. You can learn more in the [Jovo Model](https://www.jovo.tech/docs/models) and the [`$entities` documentation](https://www.jovo.tech/docs/entities).

The Rasa entity values are translated into the following Jovo entity properties:

```typescript
{
  value: response.text.substring(entity.start, entity.end), // what the user said
  resolved: entity.value, // the resolved value
  id: entity.value, // same as resolved, since Rasa doesn't support IDs
  native: { /* raw API response for this entity */ }
}
```

If you are using [entity roles](https://rasa.com/docs/rasa/nlu-training-data/#entities-roles-and-groups), the name of the role will be used to access the entity. For example, if a phrase contains two entities `city` with the roles `departure` and `destination`, the entities can be accessed using `this.$entities.departure` and  `this.$entities.destination`.

Learn more about Rasa entities in the [official Rasa docs](https://rasa.com/docs/rasa/training-data-format#entities).

## Jovo Model

You can use the [Jovo Model](https://www.jovo.tech/docs/models) to turn the language model files in your `models` folder into Rasa NLU training data. [Learn more about the Rasa Jovo Model integration here](https://www.jovo.tech/marketplace/nlu-rasa/model).
