# Rasa NLU Integration

Turn raw text into structured meaning with the Jovo Framework integration for the open source natural language understanding service Rasa NLU.

- [Introduction](#introduction)
- [Installation](#installation)
- [Configuration](#configuration)
  - [Alternative Intents](#alternative-intents)
- [Jovo Model](#jovo-model)


## Introduction

[Rasa NLU](https://github.com/RasaHQ/rasa) is an open source [natural language understanding (NLU)](https://www.jovo.tech/marketplace/tag/nlu) service with its own pipeline of processing components.

Since it is an open source service, you can host Rasa NLU on your own servers without any external API calls. [Learn more in the official Rasa docs](https://rasa.com/docs/rasa/nlu-only).

You can use the Jovo Rasa NLU integration for projects where you receive raw text input that needs to be translated into structured meaning to work with the Jovo intent structure. Platforms like the [Jovo Core Platform](https://www.jovo.tech/marketplace/jovo-platform-core) (e.g. in conjunction with the [Jovo Web Client](https://www.jovo.tech/marketplace/jovo-client-web)), [Facebook Messenger](https://www.jovo.tech/marketplace/jovo-platform-facebookmessenger), and [Google Business Messages](https://www.jovo.tech/marketplace/jovo-platform-googlebusiness) are some examples where this would work.


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

app.configure({
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
this.$nlu.alternativeIntents
```

## Jovo Model

You can use the [Jovo Model](https://www.jovo.tech/marketplace/jovo-model) to turn the language model files in your `models` folder into Rasa NLU training data. [Learn more about the Rasa Jovo Model integration here](https://www.jovo.tech/marketplace/jovo-model/rasa).