---
title: 'Google Business Messages Platform Integration'
excerpt: 'The Google Business Messages platform integration allows you to build custom Google Business Bots using Jovo.'
---

# Google Business Messages Platform Integration

The Google Business Messages [platform integration](https://v4.jovo.tech/docs/platforms) allows you to build custom Google Business bots using Jovo.


## Getting Started

You can install the plugin like this:

```sh
$ npm install @jovotech/platform-googlebusiness
```

Add it as a plugin to your [app configuration](https://v4.jovo.tech/docs/app-config), e.g. `app.ts`:

```typescript
import { App } from '@jovotech/framework';
import { GoogleBusinessPlatform } from '@jovotech/platform-googlebusiness';
// ...

const app = new App({
  plugins: [
    new GoogleBusinessPlatform(),
    // ...
  ],
});
```

## Configuration

You can configure the Google Business platform in the [app configuration](https://v4.jovo.tech/docs/app-config), for example `app.ts`:

```typescript
import { GoogleBusinessPlatform } from '@jovotech/platform-googlebusiness';

// ...

const app = new App({
  plugins: [
    new GoogleBusinessPlatform({
      plugins: [ /* ... */ ],
      session: { /* ... */ },
    }),
    // ...
  ],
});
```

Options include:

- `plugins`: For example, you need to ddd an [NLU integration](#nlu-integration) here.
- `session`: Session specific config. Take a look at [session data](#session-data) for more information.


### NLU Integration

Google Business requests mostly consist of raw text that need to be turned into structured data using an [natural language understanding (NLU) integration](https://v4.jovo.tech/docs/nlu).

Here is an example how you can add an NLU integration (in this case [NLP.js](https://v4.jovo.tech/marketplace/nlu-nlpjs)) to the [app configuration](https://v4.jovo.tech/docs/app-config) in `app.ts`:

```typescript
import { GoogleBusinessPlatform } from '@jovotech/platform-googlebusiness';
import { NlpjsNlu } from '@jovotech/nlu-nlpjs';

// ...

const app = new App({
  plugins: [
    new GoogleBusinessPlatform({
      plugins: [new NlpjsNlu()],
    }),
    // ...
  ],
});
```

### Session Data

Google Business does not offer session storage, which is needed for features like [session data](https://v4.jovo.tech/docs/data#session-data), [component data](https://v4.jovo.tech/docs/data#component-data), and the [`$state` stack](https://v4.jovo.tech/docs/state-stack).

To make Google Business bots work with these features, Jovo automatically enables the storage of session data to the active [database integration](https://v4.jovo.tech/docs/databases). Under the hood, it adds `session` to the [`storedElements` config](https://v4.jovo.tech/docs/databases#storedelements).

Since Google Business does not have the concept of sessions, we need to define after which time a request should be seen as the start of the new session. The default is *15 minutes* and can be modified either in the [`storedElements` config](https://v4.jovo.tech/docs/databases#storedelements) (works across platforms) or in the Google Business config:

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
this.$googleBusiness
```

You can also use this object to see if the request is coming from Google Business (or a different platform):

```typescript
if(this.$googleBusiness) {
  // ...
}
```


### Output

There are various Google Business specific elements that can be added to the [output](https://v4.jovo.tech/docs/output).

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

