---
title: 'NLU Integrations'
excerpt: 'Learn more about natural language understanding (NLU) services that can be integrated with Jovo.'
url: 'https://www.jovo.tech/docs/nlu'
---

# NLU Integrations

Learn more about natural language understanding (NLU) services that can be integrated with Jovo.

## Introduction

Natural language understanding (in short, NLU) is the process of turning raw text into structured meaning. It is part of the `interpretation` step of the [RIDR lifecycle](./ridr-lifecycle.md).

Jovo offers integrations with a variety of NLU services that can either be self-hosted or accessed via an API. [You can find all the current integrations below](#integrations).

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
    native: {
      // Raw API response from the NLU service
    }
  },
}
```

Learn more about Jovo NLU integrations in the following sections:

- [Integrations](#integrations)
- [Configuration](#configuration)
- [Performance](#performance)

## Integrations

Currently, the following integrations are available with Jovo `v4`:

- [Rasa NLU](https://www.jovo.tech/marketplace/nlu-rasa)
- [Snips NLU](https://www.jovo.tech/marketplace/nlu-snips)
- [NLP.js](https://www.jovo.tech/marketplace/nlu-nlpjs)
- [Lex SLU](https://www.jovo.tech/marketplace/slu-lex)

To enhance performance, you can also add the [Keyword NLU plugin](https://www.jovo.tech/marketplace/plugin-keywordnlu), which maps common keywords to intents before other NLU integrations are called.

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

The default configuration for each NLU integration is:

```typescript
new NlpjsNlu({
  // ...
  input: {
    supportedTypes: ['TEXT', 'TRANSCRIBED_SPEECH', 'SPEECH'],
  }
}),
```

The `input` config property determines how the NLU integration should react to certain properties. `supportedTypes` include all [input types](./input.md#input-types) for which the NLU integration should run.


## Performance

The NLU integration calls the respective NLU service/API for every request that includes a `text` and fulfills the `supportedTypes` [configuration](#configuration). Each request costs time and potentially money, depending on the service.

For keywords that are used often (for example `yes`/`no`, or words that show up in [quick replies](https://www.jovo.tech/docs/output-templates#quickreplies)), it can be costly to call an NLU service each time a request contains straightforward input like this. 

To enhance performance, you can add the [Keyword NLU plugin](https://www.jovo.tech/marketplace/plugin-keywordnlu) in addition to a regular [integration](#integrations). The plugin maps common keywords to intents before other NLU integrations are called.

```typescript
import { App } from '@jovotech/framework';
import { KeywordNluPlugin } from '@jovotech/plugin-keywordnlu';
// ...

const app = new App({
  plugins: [
    // Used for common keywords
    new KeywordNluPlugin({
      keywordMap: {
        yes: 'YesIntent',
        no: 'NoIntent',
        'learn more': 'LearnMoreIntent',
      },
    }),
    // ...
  ],
});
```