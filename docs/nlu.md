---
title: 'Jovo NLU Integrations'
excerpt: 'Learn more about natural language understanding (NLU) services that can be integrated with Jovo.'
---
# NLU Integrations

Learn more about natural language understanding (NLU) services that can be integrated with Jovo.

- [Introduction](#introduction)
- [Integrations](#integrations)
- [Configuration](#configuration)

## Introduction

Natural language understanding (in short, NLU) is the process of turning raw text into structured meaning. It is part of the `interpretation` step of the [RIDR lifecycle](./ridr-lifecycle.md).

Jovo offers integrations with a variety of NLU services that can either be self-hosted or accessed via an API. [You can find all the current integrations here](#integrations).

NLU integrations are helpful for platforms that deal with raw text. The integration then writes the results into an `nlu` object that is part of the [`$input` property](./input.md):

```typescript
{
  type: 'TEXT',
  text: 'My name is Max',
  nlu: {
    intent: 'MyNameIsIntent',
    entities: {
      name: {
        value: 'Max',
      },
    },
  },
}
```


## Integrations

Currently, the following integrations are available with Jovo `v4`:

* [Rasa NLU](https://github.com/jovotech/jovo-framework/tree/v4dev/integrations/nlu-rasa)
* [Dialogflow NLU](https://github.com/jovotech/jovo-framework/tree/v4dev/integrations/nlu-dialogflow)
* [NLP.js](https://github.com/jovotech/jovo-framework/tree/v4dev/integrations/nlu-nlpjs)


## Configuration

An NLU integration needs to be added as a [platform](./platforms.md) plugin in the [app configuration](./app-config.md). Here is an example how it could look like in the `app.ts` file:

```typescript
import { CorePlatform } from '@jovotech/platform-core';
import { NlpjsNlu } from '@jovotech/nlu-nlpjs';

// ...

const app = new App({
  plugins: [
    new CorePlatform({
      plugins: [new NlpjsNlu()],
    }),
    // ...
  ],
});
```

Along with integration specific options (which can be found in each integration's documentation), there are also features that are configured the same way across all NLU integrations.

The default configuration for each database integration is:

```typescript
new NlpjsNlu({
  // ...
  input: {
    supportedTypes: ['TEXT', 'TRANSCRIBED_SPEECH', 'SPEECH'],
  }
}),
```

The `input` config property determines how the NLU integration should react to certain properties. `supportedTypes` include all [input types](./input.md#input-types) for which the NLU integration should run.