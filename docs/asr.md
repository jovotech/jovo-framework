---
title: 'ASR Integrations'
excerpt: 'Learn more about automatic speech recognition (ASR) services that can be integrated with Jovo.'
---

# ASR Integrations

Learn more about automatic speech recognition (ASR) services that can be integrated with Jovo.

## Introduction

Automatic speech recognition (in short, ASR) is the process of turning raw speech input (recorded audio) into transcribed text. It is part of the `interpretation` step of the [RIDR lifecycle](./ridr-lifecycle.md).

Jovo offers integrations with a variety of ASR services. [You can find all the current integrations here](#integrations).

ASR integrations are helpful for platforms that deal with raw speech input. The integration then writes the results into an `asr` object that is part of the [`$input` property](./input.md):

```typescript
// Before ASR step
{
  type: 'SPEECH',
  audio: { /* ... */ }, // recorded speech
}

// After ASR step
{
  type: 'SPEECH',
  audio: { /* ... */ },
  asr: {
    text: 'the transcribed text',
  },
}
```

The `text` then needs to be turned into structured meaning by using an [NLU integration](./nlu.md). Some services like [Amazon Lex](https://www.jovo.tech/marketplace/slu-lex) are also called spoken language understanding (SLU) services because they take care of both the ASR and NLU steps.

Learn more about Jovo ASR integrations in the following sections:

- [Integrations](#integrations)
- [Configuration](#configuration)

## Integrations

Currently, the following integrations are available with Jovo `v4`:

- [Lex SLU](https://www.jovo.tech/marketplace/slu-lex)

## Configuration

An ASR integration needs to be added as a [platform](./platforms.md) plugin in the [app configuration](./app-config.md). Here is an example how it could look like in the `app.ts` file, using [Core Platform](https://www.jovo.tech/marketplace/platform-core) with [Lex SLU](https://www.jovo.tech/marketplace/slu-lex):

```typescript
import { CorePlatform } from '@jovotech/platform-core';
import { LexSlu } from '@jovotech/slu-lex';
// ...

const app = new App({
  plugins: [
    new CorePlatform({
      plugins: [new LexSlu(
        // ASR Plugin Configuration
      )],
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
    supportedTypes: ['SPEECH'], // Use ASR for 'SPEECH' input types
  }
}),
```

The `input` config property refers to the Jovo [`$input` property](./input.md). The `supportedTypes` array includes all [input types](./input.md#input-types) for which the ASR integration should run, the default being `['SPEECH']`.
