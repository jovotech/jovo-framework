---
title: 'Lex SLU Integration'
excerpt: 'Turn speech input into structured meaning with the Jovo Framework integration for Amazon Lex.'
---

# Lex SLU Integration

Turn speech or text input into structured meaning with the Jovo Framework integration for Amazon Lex.

## Introduction

[Amazon Lex](https://aws.amazon.com/lex/) is a spoken language understanding (SLU) service that can do both [automatic speech recognition (ASR)](https://www.jovo.tech/docs/asr) as well as [natural language understanding (NLU)](https://www.jovo.tech/docs/nlu).

Lex can be used for [platforms](https://www.jovo.tech/docs/platforms) that don't come with their own ASR and NLU capabilities, for example [Jovo for Web](https://www.jovo.tech/marketplace/platform-web).

Learn more in the sections below:

- [Installation](#installation): How to add Lex to your Jovo project
- [Configuration](#configuration): All configuration options
- [Entities](#entities): How tu use Lex with `this.$entities`
- [Dialog Management](#dialog-management): How to do slot filling with Lex

If you want to dig deeper, you can find the implementation here: [`LexSlu.ts`](https://github.com/jovotech/jovo-framework/blob/v4/latest/integrations/slu-lex/src/LexSlu.ts).

## Installation

You can install the plugin like this:

```sh
$ npm install @jovotech/slu-lex
```

SLU plugins need to be added to Jovo [platform integrations](https://www.jovo.tech/docs/platforms). Here is an example how it can be added to the [Jovo Core Platform](https://www.jovo.tech/marketplace/platform-core) in `app.ts`:

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
            aliasId: '<your-alias-id>',
          },
          region: '<your-aws-region>',
          credentials: {
            accessKeyId: '<your-access-key-id>',
            secretAccessKey: '<your-secret-access-key>',
          },
        }),
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

## Dialog Management

Lex allows you to [manage sessions](https://docs.aws.amazon.com/lexv2/latest/dg/using-sessions.html) by specifying multiple slots that need to be filled before the intent can complete.

Learn more in the following sections:

- [Dialog Management NLU Data](#dialog-management-nlu-data)
- [Use Lex Dialog Management in a Handler](#use-lex-dialog-management-in-a-handler)

### Dialog Management NLU Data

In addition to the properties that are usually part of `$input.nlu` (written into the [`$input` object](https://www.jovo.tech/docs/input) by [NLU integrations](https://www.jovo.tech/docs/nlu)), Lex can also add additional values for `state`, `confirmationState`, `dialogAction` and `messages`.

Here is an example:

```json
{
  "intent": {
    "name": "BookHotel",
    "confidence": 1,
    "state": "InProgress",
    "confirmationState": "None"
  },
  "messages": [
    {
      "content": "How many nights will you be staying?",
      "contentType": "PlainText"
    }
  ],
  "entities": {
    "CheckInDate": {
      "id": "2022-08-09",
      "resolved": "2022-08-09",
      "value": "August 9th",
      "native": {
        "value": {
          "interpretedValue": "2022-08-09",
          "originalValue": "August 9th",
          "resolvedValues": ["2022-08-09"]
        }
      }
    },
    "Location": {
      "id": "los angeles",
      "resolved": "los angeles",
      "value": "Los Angeles",
      "native": {
        "value": {
          "interpretedValue": "Los Angeles",
          "originalValue": "Los Angeles",
          "resolvedValues": ["los angeles"]
        }
      }
    },
    "sessionState": {
      "dialogAction": {
        "slotToElicit": "Nights",
        "type": "ElicitSlot"
      }
    }
  }
}
```

Additional values are explained below:

- `intent`
  - `state`: Contains fulfillment information for the intent. Values are "InProgress", "ReadyForFulfillment", "Failed" and [others](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-lex-runtime-v2/enums/intentstate.html).
  - `confirmationState`: Contains information about whether fulfillment of the intent has been confirmed. Values are "None", "Confirmed" and "Denied".
- `sessionState`
  - `dialogAction`: The next step that Amazon Lex V2 should take in the conversation with a user. The `slotToElicit` has its prompt in `messages`.
- `messages`: The next prompt to pass on to the user.

### Use Lex Dialog Management in a Handler

Here is an example of how a component handler can manage the dialog state:

```ts
@Intents(['BookHotel'])
bookRoom() {
  const nluData = this.$input.nlu as LexNluData;
  if (nluData.intent.state === 'ReadyForFulfillment') {
    // make api call

    return this.$send('The room has been booked!');
  }

  if (nluData.intent.state === 'Failed') {
    return this.$send('No worries. Maybe next time.');
  }

  const message = nluData.messages?.[0].content as string;
  let quickReplies;

  if (
    nluData.sessionState?.dialogAction?.type === 'ElicitSlot' &&
    nluData.sessionState?.dialogAction?.slotToElicit === 'RoomType'
  ) {
    quickReplies = ['king', 'queen', 'deluxe'];
  }

  return this.$send({ message, quickReplies });
}
```
