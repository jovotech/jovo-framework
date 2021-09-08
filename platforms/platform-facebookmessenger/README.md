---
title: 'Facebook Messenger Platform Integration'
excerpt: 'The Facebook Messenger platform integration allows you to build custom Messenger Bots using Jovo.'
---

# Facebook Messenger Platform Integration

The Facebook Messenger [platform integration](https://v4.jovo.tech/docs/platforms) allows you to build custom Messenger bots using Jovo.


## Getting Started

You can install the plugin like this:

```sh
$ npm install @jovotech/platform-facebookmessenger
```

Add it as plugin to your [app configuration](https://v4.jovo.tech/docs/app-config), e.g. `app.ts`:

```typescript
import { App } from '@jovotech/framework';
import { FacebookMessengerPlatform } from '@jovotech/platform-facebookmessenger';
// ...

const app = new App({
  plugins: [
    new FacebookMessengerPlatform(),
    // ...
  ],
});
```

## Configuration

You can configure the Facebook Messenger platform in the [app configuration](https://v4.jovo.tech/docs/app-config), for example `app.ts`:

```typescript
import { FacebookMessengerPlatform } from '@jovotech/platform-facebookmessenger';

// ...

const app = new App({
  plugins: [
    // For example NLU integration
  ],
  sessionExpiresAfterSeconds: 900
});
```

Options include:

- `plugins`: Add an [NLU integration](#nlu-integration) here.
- `sessionExpiresAfterSeconds`: Defines when a request should be treated as a new session. Take a look at [session data](#session-data) for more information.


### NLU Integration

Facebook Messenger requests mostly consist of raw text that need to be turned into structured data using an [natural language understanding (NLU) integration](https://v4.jovo.tech/docs/nlu).

Here is an example how you can add an NLU integration (in this case [NLP.js](https://v4.jovo.tech/marketplace/nlu-nlpjs)) to the [app configuration](https://v4.jovo.tech/docs/app-config) in `app.ts`:

```typescript
import { FacebookMessengerPlatform } from '@jovotech/platform-facebookmessenger';
import { NlpjsNlu } from '@jovotech/nlu-nlpjs';

// ...

const app = new App({
  plugins: [
    new FacebookMessengerPlatform({
      plugins: [new NlpjsNlu()],
    }),
    // ...
  ],
});
```

### Session Data

Facebook Messenger does not offer session storage, which is needed for features like [session data](https://v4.jovo.tech/docs/data#session-data), [component data](https://v4.jovo.tech/docs/data#component-data), and the [`$state` stack](https://v4.jovo.tech/docs/state-stack).

To make Facebook Messenger bots work with these features, Jovo automatically enables the storage of session data to the active [database integration](https://v4.jovo.tech/docs/databases). Under the hood, it adds `session` to the [`storedElements` config](https://v4.jovo.tech/docs/databases#storedelements).

Since Facebook does not have the concept of sessions, we need to define after which time a request should be seen as the start of the new session. The default is *15 minutes* and can be modified with the `sessionExpiresAfterSeconds` option:

```typescript
new FacebookMessengerPlatform({
  sessionExpiresAfterSeconds: 900,
});
```


## Platform-Specific Features

You can access the Facebook Messenger specific object like this:

```typescript
this.$facebookMessenger
```

You can also use this object to see if the request is coming from Facebook Messenger (or a different platform):

```typescript
if(this.$facebookMessenger) {
  // ...
}
```


### Output

There are various Facebook Messenger specific elements that can be added to the [output](https://v4.jovo.tech/docs/output).

For output that is only used for Facebook Messenger, you can add the following to the output object:

```typescript
{
  // ...
  platforms: {
    facebookMessenger: {
      // ...
    }
  }
}
```

You can add response objects that should show up exactly like this in the Facebook Messenger response object using the `nativeResponse` object:

```typescript
{
  // ...
  platforms: {
    facebookMessenger: {
      nativeResponse: {
        // ...
      }
      // ...
    }
  }
}
```

