---
title: 'Lex SLU Integration'
excerpt: 'Turn speech input into structured meaning with the Jovo Framework integration for Amazon Lex.'
---

# Lex SLU Integration

Turn speech input into structured meaning with the Jovo Framework integration for Amazon Lex.

## Introduction

[Amazon Lex](https://aws.amazon.com/lex/) is a spoken language understanding (SLU) service that can do both [automatic speech recognition (ASR)](https://www.jovo.tech/docs/asr) as well as [natural language understanding (NLU)](https://www.jovo.tech/docs/nlu).

Lex can be used for [platforms](https://www.jovo.tech/docs/platforms) that don't come with their own ASR and NLU capabilities, for example [Jovo for Web](https://www.jovo.tech/marketplace/platform-web).

Learn more how to set everything up in the [installation](#installation) and [configuration](#configuration) sections.

To learn more how the integration maps Lex slots to `$entities`, take a look at the [entities section](#entities).

## Installation

You can install the plugin like this:

```sh
$ npm install @jovotech/slu-lex
```

SLU plugins need to be added to Jovo [platform integrations](https://www.jovo.tech/docs/platforms). Here is an example how it can be added to the Jovo Core Platform in `app.ts`:

```typescript
import { CorePlatform } from '@jovotech/platform-core';
import { LexSlu } from '@jovotech/slu-lex';
// ...

const app = new App({
  plugins: [
    new CorePlatform({
      plugins: [
        new LexSlu({
          bot: {
            id: '<your-bot-id>',
            aliasId: '<your-alias-id>' 
          },
          region: '<your-aws-region>',
          credentials: {
            accessKeyId: '<your-access-key-id>',
            secretAccessKey: '<your-secret-access-key>',
          },
        })
      ],
    }),
    // ...
  ],
});
```

For the integration to work, you need to add all configurations shown in the code snippet above. For more information, take a look at the [configuration section](#configuration).

## Configuration

The following configurations can be added:

```typescript
new LexSlu({
  bot: {
    id: '',
    aliasId: ''
  },
  region: '',
  credentials: {
    accessKeyId: '',
    secretAccessKey: '',
  },
  fallbackLocale: 'en_US',
  localeMap: {
    'en': 'en_US',
    'es': 'es_ES',
  },  
  asr: true,
  nlu: true,
}),
```

- `bot`: Includes information about your created Lex bot.
- `region`: The AWS region of the Lex bot, for example `us-east-1`.
- `credentials`: Your AWS security credentials.
- `fallbackLocale`: Locale that should be used if none could be found in the request. Default: `en_US`.
- `localeMap` (optional): This is used to map a request locale to a Lex localeId.
- `asr`: Determines whether the Lex [ASR](https://www.jovo.tech/docs/asr) capabilities should be used. Default: `true`.
- `nlu`: Determines whether the Lex [NLU](https://www.jovo.tech/docs/nlu) capabilities should be used. Default: `true`.

## Entities

You can access Lex slots by using the `$entities` property. You can learn more in the [Jovo Model](https://www.jovo.tech/docs/models) and the [`$entities` documentation](https://www.jovo.tech/docs/entities).

The Lex slot values are translated into the following Jovo entity properties:

```typescript
{
  value: slot.value.originalValue || slot.value.interpretedValue, // what the user said
  resolved: slot.value.resolvedValues?.[0] || slot.value.interpretedValue, // the resolved value
  id: slot.value.resolvedValues?.[0] || slot.value.interpretedValue, // same as resolved, since Lex doesn't support IDs
  native: { /* raw API response for this slot */ }
}
```

You can learn more about the Lex slot format in the [official Lex documentation](https://docs.aws.amazon.com/lexv2/latest/dg/API_runtime_Slot.html).

