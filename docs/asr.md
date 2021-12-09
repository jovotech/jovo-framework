---
title: 'ASR Integrations'
excerpt: 'Learn more about automatic speech recognition (ASR) services that can be integrated with Jovo.'
---

# ASR Integrations

Learn more about automatic speech recognition (ASR) services that can be integrated with Jovo.

## Introduction

Automatic speech recognition (in short, ASR) is the process of turning raw speech input into transcribed text. It is part of the `interpretation` step of the [RIDR lifecycle](./ridr-lifecycle.md).

Jovo offers integrations with a variety of ASR services. [You can find all the current integrations here](#integrations).

ASR integrations are helpful for platforms that deal with raw speech input. The integration then writes the results into an `asr` object that is part of the [`$input` property](./input.md):

```typescript
{
  type: 'SPEECH',
  audio: { /* ... */ },
  asr: {
    text: 'the transcribed text',
  },
}
```

The `text` then needs to be turned into structured meaning by using an [NLU integration](./nlu.md). Some services like [Amazon Lex](https://www.jovo.tech/marketplace/slu-lex) are also called spoken language understanding (SLU) services because they do both the ASR and NLU parts.

## Integrations

Currently, the following integrations are available with Jovo `v4`:

- [Lex SLU](https://www.jovo.tech/marketplace/slu-lex)

## Configuration

An ASR integration needs to be added as a [platform](./platforms.md) plugin in the [app configuration](./app-config.md). Here is an example how it could look like in the `app.ts` file:

```typescript
import { CorePlatform } from '@jovotech/platform-core';
import { LexSlu } from '@jovotech/slu-lex';
// ...

const app = new App({
  plugins: [
    new CorePlatform({
      plugins: [new LexSlu()],
    }),
    // ...
  ],
});
```

Along with integration specific options (which can be found in each integration's documentation), there are also features that are configured the same way across all ASR integrations.

The default configuration for each ASR integration is:

```typescript
new LexSlu({
  // ...
  input: {
    supportedTypes: ['SPEECH'],
  }
}),
```

The `input` config property determines how the ASR integration should react to certain properties. `supportedTypes` include all [input types](./input.md#input-types) for which the ASR integration should run.
