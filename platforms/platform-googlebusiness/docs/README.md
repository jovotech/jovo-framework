---
title: 'Google Business Messages Platform Integration'
excerpt: 'The Google Business Messages platform integration allows you to build custom Google Business Bots using Jovo.'
url: 'https://www.jovo.tech/marketplace/platform-googlebusiness'
---

# Google Business Messages Platform Integration

The Google Business Messages [platform integration](https://www.jovo.tech/docs/platforms) allows you to build custom Google Business bots using Jovo.

## Introduction

[Google Business Messages](https://developers.google.com/business-communications/business-messages) allows you to build conversational experiences that can be connected to many Google channels, including Maps and Search. You can [find the official documentation here](https://developers.google.com/business-communications/business-messages/guides).

Learn more about getting started in the [installation](#installation) and [configuration](#configuration) sections. You can also [find a sample app here](https://github.com/jovotech/jovo-framework/tree/v4/latest/examples/typescript/googlebusiness/basic).

## Installation

If you want to create a new Google Business messages project with Jovo, we recommend installing the Jovo CLI, creating a new Jovo project, and selecting Google Business Messages as platform using the CLI wizard. Learn more in our [getting started guide](https://www.jovo.tech/docs/getting-started).

```sh
# Install Jovo CLI globally
$ npm install -g @jovotech/cli

# Start new project wizard
# In the platform step, use the space key to select Google Business Messages
$ jovo new <directory>
```

If you want to add Google Business Messages to an existing Jovo project, you can install the plugin like this:

```sh
$ npm install @jovotech/platform-googlebusiness
```

Add it as plugin to your [app configuration](https://www.jovo.tech/docs/app-config). Google Business Messages requires at least a `serviceAccount` (learn more in the [configuration section](#configuration) below) and we also recommend adding an [NLU integration](https://www.jovo.tech/docs/nlu) like [NLP.js](https://www.jovo.tech/marketplace/nlu-nlpjs):

```typescript
import { App } from '@jovotech/framework';
import { GoogleBusinessPlatform } from '@jovotech/platform-googlebusiness';
import { NlpjsNlu } from '@jovotech/nlu-nlpjs';
import { LangEn } from '@nlpjs/lang-en';
import serviceAccount from './service-account.json';
// ...

const app = new App({
  plugins: [
    new GoogleBusinessPlatform({
      serviceAccount, // Used to authenticate with the GBM platform
      plugins: [
        new NlpjsNlu({
          languageMap: {
            en: LangEn,
          },
        }),
      ],
    }),
    // ...
  ],
});
```

## Configuration

You can configure the Google Business platform in the [app configuration](https://www.jovo.tech/docs/app-config), for example `app.ts`:

```typescript
import { GoogleBusinessPlatform } from '@jovotech/platform-googlebusiness';
import serviceAccount from './service-account.json';
// ...

const app = new App({
  plugins: [
    new GoogleBusinessPlatform({
      serviceAccount,
      plugins: [
        /* ... */
      ],
      session: {
        /* ... */
      },
    }),
    // ...
  ],
});
```

Options include:

- `serviceAccount`: Your service account file required for authentication. Learn more in the [official Google Business Messages docs](https://developers.google.com/business-communications/business-messages/guides/how-to/register?hl=en#enable-api).
- `plugins`: For example, you need to add an [NLU integration](#nlu-integration) here.
- `session`: Session specific config. Take a look at [session data](#session-data) for more information.

### NLU Integration

Google Business requests mostly consist of raw text that need to be turned into structured data using an [natural language understanding (NLU) integration](https://www.jovo.tech/docs/nlu).

Here is an example how you can add an NLU integration (in this case [NLP.js](https://www.jovo.tech/marketplace/nlu-nlpjs)) to the [app configuration](https://www.jovo.tech/docs/app-config) in `app.ts`:

```typescript
import { GoogleBusinessPlatform } from '@jovotech/platform-googlebusiness';
import { NlpjsNlu } from '@jovotech/nlu-nlpjs';
import { LangEn } from '@nlpjs/lang-en';
// ...

const app = new App({
  plugins: [
    new GoogleBusinessPlatform({
      plugins: [
        new NlpjsNlu({
          languageMap: {
            en: LangEn,
          },
        }),
      ],
    }),
    // ...
  ],
});
```

### Session Data

Google Business does not offer session storage, which is needed for features like [session data](https://www.jovo.tech/docs/data#session-data), [component data](https://www.jovo.tech/docs/data#component-data), and the [`$state` stack](https://www.jovo.tech/docs/state-stack).

To make Google Business bots work with these features, Jovo automatically enables the storage of session data to the active [database integration](https://www.jovo.tech/docs/databases). Under the hood, it adds `session` to the [`storedElements` config](https://www.jovo.tech/docs/databases#storedelements).

Since Google Business does not have the concept of sessions, we need to define after which time a request should be seen as the start of the new session. The default is _15 minutes_ and can be modified either in the [`storedElements` config](https://www.jovo.tech/docs/databases#storedelements) (works across platforms) or in the Google Business config:

```typescript
new GoogleBusinessPlatform({
  // ...
  session: {
    expiresAfterSeconds: 900,
  },
});
```

## Platform-Specific Features

You can access the Google Business specific object like this:

```typescript
this.$googleBusiness;
```

You can also use this object to see if the request is coming from Google Business (or a different platform):

```typescript
if (this.$googleBusiness) {
  // ...
}
```

### Output

There are various Google Business specific elements that can be added to the [output](https://www.jovo.tech/docs/output).

For output that is only used for Google Business, you can add the following to the output object:

```typescript
{
  // ...
  platforms: {
    googleBusiness: {
      // ...
    }
  }
}
```

You can add response objects that should show up exactly like this in the Google Business response object using the `nativeResponse` object:

```typescript
{
  // ...
  platforms: {
    googleBusiness: {
      nativeResponse: {
        // ...
      }
      // ...
    }
  }
}
```
