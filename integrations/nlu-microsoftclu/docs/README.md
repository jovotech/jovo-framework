---
title: 'Keyword NLU Plugin'
excerpt: 'Improve NLU perfomance by matching common keywords to intents instead of making lengthy NLU API requests.'
url: 'https://www.jovo.tech/marketplace/plugin-keywordnlu'
---

# Keyword NLU Plugin

Improve natural language understanding (NLU) perfomance by matching common keywords to intents instead of making lengthy NLU API requests

## Introduction

This plugin is a lightweight [NLU integration](https://www.jovo.tech/docs/nlu) that does two things:

- It maps common keywords (for example words that show up in [quick replies](https://www.jovo.tech/docs/output-templates#quickreplies) that don't necessarily need full fledged NLU) to an intent
- It saves performance by skipping NLU service calls for common keywords

The plugin uses a `keywordMap` that may look like this for the locales `en` (English) and `de` (German):

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

- `keywordMap`: For each locale (e.g. `en`, `de`) it maps a keyword (key) to an intent (value). Text input is transformed to lowercase, so make sure that the keywords are in lowercase as well.
- `fallbackLocale`: The locale to be used if the request does not contain one. Default: `en`.


