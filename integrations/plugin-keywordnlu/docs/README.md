---
title: 'Keyword NLU Plugin'
excerpt: 'Improve NLU perfomance by matching common keywords to intents instead of making lengthy NLU API requests.'
---

# Keyword NLU Plugin

Improve natural language understanding (NLU) perfomance by matching common keywords to intents instead of making lengthy NLU API requests

## Introduction

This plugin is a lightweight [NLU integration](https://www.jovo.tech/docs/nlu) that does three things:

- It replaces words or phrases in the input `text` to adjust for ASR misunderstandings or names of people or locations
- It maps common keywords (for example words that show up in [quick replies](https://www.jovo.tech/docs/output-templates#quickreplies) that don't necessarily need full fledged NLU) to an intent
- It saves performance by skipping NLU service calls for common keywords

The plugin first determines if there are string replacements to do by looking a `onGetReplaceMap` function. This is a function to allow for retrieval of the keywords list at runtime from `$cms`, a local JSON file, or an API call. The replace map can include multiple locales with the key being a word or phrase to search for in text and the value being a word or phrase to replace it:

```typescript
onGetReplaceMap: (jovo: Jovo) => {
  return {
    en: {
      'know way': 'no',
    }
  }
},
```

The replace map can also act as a pre-process to reduce the number of keys needed in the `keywordMap`.


The plugin then uses a `keywordMap` that may look like this for the locales `en` (English) and `de` (German):

```typescript
{
  en: {
    yes: 'YesIntent',
    no: 'NoIntent',
    'learn more': 'LearnMoreIntent',
  },
  de: {
    ja: 'YesIntent',
    nein: 'NoIntent',
    mehr: 'LearnMoreIntent',
  },
}
```

If the input contains `text` that is part of the `keywordMap`, the Keyword NLU adds the resulting `intent` to the [`$input` object](https://www.jovo.tech/docs/input), which is then used for the routing. Here's example:

```typescript
// Before Keyword NLU
{
  type: 'TEXT',
  text: 'yes',
}

// After Keyword NLU
{
  type: 'TEXT',
  text: 'yes',
  intent: 'YesIntent',
}
```

The Keyword NLU plugin hooks into the `before.interpretation.nlu` [RIDR middleware](https://www.jovo.tech/docs/middlewares#ridr-middlewares), which means it happens one step before other [NLU integrations](https://www.jovo.tech/docs/nlu). If the Keyword NLU is successful, the `interpretation.nlu` step is [skipped](https://www.jovo.tech/docs/middlewares#skip-middlewares), resulting in a faster response, because an external NLU service doesn't need to be called.

You can find the code here: [`KeywordNluPlugin`](https://github.com/jovotech/jovo-framework/blob/v4/latest/integrations/plugin-keywordnlu/src/KeywordNluPlugin.ts).

Learn more in the following sections:
- [Installation](#installation)
- [Configuration](#configuration)

## Installation

You can install the plugin like this:

```sh
$ npm install @jovotech/plugin-keywordnlu
```

Add it as plugin to your [app configuration](https://www.jovo.tech/docs/app-config), e.g. `app.ts`:

```typescript
import { App } from '@jovotech/framework';
import { KeywordNluPlugin } from '@jovotech/plugin-keywordnlu';
// ...

const app = new App({
  plugins: [
    new KeywordNluPlugin({
      keywordMap: {
        en: {
          yes: 'YesIntent',
          no: 'NoIntent',
          'learn more': 'LearnMoreIntent',
        },
        de: {
          ja: 'YesIntent',
          nein: 'NoIntent',
          mehr: 'LearnMoreIntent',
        },
        // ...
      },
    }),
    // ...
  ],
});
```

Learn more about config options in the [configuration](#configuration) section.


## Configuration

The following configuration can be added to the Keyword NLU plugin:

```typescript
new KeywordNluPlugin({
  onGetReplaceMap: (jovo: Jovo) => {
    return {
      en: {
        'know way': 'no',
      }
    }
  },
  onReplace: (jovo: Jovo, locale: string, replaceMap: KeywordMap, text: string) => {
    // ...
    return text;
  },  
  keywordMap: {
    en: {
      yes: 'YesIntent',
      no: 'NoIntent',
      'learn more': 'LearnMoreIntent',
    },
    de: {
      ja: 'YesIntent',
      nein: 'NoIntent',
      mehr: 'LearnMoreIntent',
    },
    // ...
  },
  fallbackLocale: 'en',
}),
```
- `onGetReplaceMap`: Optional. A function that returns a replace map where the key is the search word or phrase and the value is the replacement word or phrase. If no function is defined, string replacement does not occur.
- `onReplace`: Optional. The plugin has it's own implementation for replacing strings. Override this function if you want to implement your own strategy.
- `keywordMap`: Optional. For each locale (e.g. `en`, `de`) it maps a keyword (key) to an intent (value). Text input is transformed to lowercase, so make sure that the keywords are in lowercase as well.
- `fallbackLocale`: The locale to be used if the request does not contain one. Default: `en`.

You can use `onGetReplaceMap` and `keywordMap` independently or in coordination with each other. The call to `onGetReplaceMap` happens first.
