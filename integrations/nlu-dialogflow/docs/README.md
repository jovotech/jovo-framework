---
title: 'Dialogflow NLU Integration'
excerpt: 'Turn raw text into structured meaning with the Jovo Framework integration for the natural language understanding service Dialogflow.'
url: 'https://www.jovo.tech/marketplace/nlu-dialogflow'
---

# Dialogflow NLU Integration

Turn raw text into structured meaning with the Jovo Framework integration for the natural language understanding service Dialogflow.

## Introduction

[Dialogflow](https://cloud.google.com/dialogflow) is a [natural language understanding (NLU)](https://www.jovo.tech/docs/nlu) service offered by Google Cloud. You can learn more in the [official Dialogflow documentation](https://cloud.google.com/dialogflow/docs/).

You can use the Jovo Dialogflow NLU integration for projects where you receive raw text input that needs to be translated into structured meaning to work with the Jovo intent structure. Learn more in the [NLU integration docs](https://www.jovo.tech/docs/nlu).


## Installation

You can install the plugin like this:

```sh
$ npm install @jovotech/nlu-dialogflow
```

NLU plugins can be added to Jovo platform integrations. Here is an example how it can be added to the Jovo Core Platform in [`app.ts`](https://www.jovo.tech/docs/app-config):

```typescript
import { App } from '@jovotech/framework';
import { CorePlatform } from '@jovotech/platform-core';
import { DialogflowNlu } from '@jovotech/nlu-dialogflow';
import ServiceAccount from './serviceAccount.json'; // Your Dialogflow service account
// ...

const app = new App({
  plugins: [
    new CorePlatform({
      plugins: [
        new DialogflowNlu({
          serviceAccount: ServiceAccount,
        }),
      ],
    }),
    // ...
  ],
});
```

To access the Dialogflow API, you need to at least provide a [service account file](#serviceaccount). Learn more about [all configurations here](#configuration).

## Configuration

The following configurations can be added:

```typescript
new DialogflowNlu({
  serviceAccount: {},
  defaultLocale: 'en-US',
}),
```

- [`serviceAccount`](#serviceaccount): The service account file that allows you to access the Dialogflow CLI.
- `defaultLocale`: The default locale passed to Dialogflow if the request doesn't come with a locale.

### serviceAccount

To access the Dialogflow API, you need to create a service account and create security credentials. You can find a step by step guide in the [official Dialogflow docs](https://cloud.google.com/dialogflow/es/docs/quick/setup#auth).

After successfully creating credentials (as a JSON file), place the file in your project (relative to the `src` folder) and import it in your app configuration.

```typescript
import ServiceAccount from './serviceAccount.json';
// ...

new DialogflowNlu({
  serviceAccount: ServiceAccount,
}),
```


## Entities

You can access Dialogflow entities by using the `$entities` property. You can learn more in the [Jovo Model](https://www.jovo.tech/docs/models) and the [`$entities` documentation](https://www.jovo.tech/docs/entities).

The Dialogflow entity values are translated into the following Jovo entity properties:

```typescript
{
  value: text, // what the user said
  resolved: resolved, // the resolved value
  id: resolved, // same as resolved, since Dialogflow doesn't support IDs
  native: { /* raw API response for this entity */ }
}
```

