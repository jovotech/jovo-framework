---
title: 'Instagram Platform Integration'
excerpt: 'The Instagram platform integration allows you to build custom Messenger Bots using Jovo.'
---

# Instagram Platform Integration

The Instagram [platform integration](https://v4.jovo.tech/docs/platforms) allows you to build custom Messenger bots using Jovo.

## Getting Started

You can install the plugin like this:

```sh
$ npm install @jovotech/platform-instagram
```

Add it as plugin to your [app configuration](https://v4.jovo.tech/docs/app-config), e.g. `app.ts`:

```typescript
import { App } from '@jovotech/framework';
import { InstagramPlatform } from '@jovotech/platform-instagram';
// ...

const app = new App({
  plugins: [
    new InstagramPlatform(),
    // ...
  ],
});
```

## Configuration

You can configure the Instagram platform in the [app configuration](https://v4.jovo.tech/docs/app-config), for example `app.ts`:

```typescript
import { InstagramPlatform } from '@jovotech/platform-instagram';

// ...

const app = new App({
  plugins: [
    new InstagramPlatform({
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

- `plugins`: For example, you need to ddd an [NLU integration](#nlu-integration) here.
- `session`: Session specific config. Take a look at [session data](#session-data) for more information.

### NLU Integration

Instagram requests mostly consist of raw text that need to be turned into structured data using an [natural language understanding (NLU) integration](https://v4.jovo.tech/docs/nlu).

Here is an example how you can add an NLU integration (in this case [NLP.js](https://v4.jovo.tech/marketplace/nlu-nlpjs)) to the [app configuration](https://v4.jovo.tech/docs/app-config) in `app.ts`:

```typescript
import { InstagramPlatform } from '@jovotech/platform-instagram';
import { NlpjsNlu } from '@jovotech/nlu-nlpjs';

// ...

const app = new App({
  plugins: [
    new InstagramPlatform({
      plugins: [new NlpjsNlu()],
    }),
    // ...
  ],
});
```

### Session Data

Instagram does not offer session storage, which is needed for features like [session data](https://v4.jovo.tech/docs/data#session-data), [component data](https://v4.jovo.tech/docs/data#component-data), and the [`$state` stack](https://v4.jovo.tech/docs/state-stack).

To make Instagram bots work with these features, Jovo automatically enables the storage of session data to the active [database integration](https://v4.jovo.tech/docs/databases). Under the hood, it adds `session` to the [`storedElements` config](https://v4.jovo.tech/docs/databases#storedelements).

Since Instagram does not have the concept of sessions, we need to define after which time a request should be seen as the start of the new session. The default is _15 minutes_ and can be modified either in the [`storedElements` config](https://v4.jovo.tech/docs/databases#storedelements) (works across platforms) or in the Instagram config:

```typescript
new Instagram({
  session: {
    expiresAfterSeconds: 900,
  },
});
```

## Platform-Specific Features

You can access the Instagram specific object like this:

```typescript
this.$instagram;
```

You can also use this object to see if the request is coming from Instagram (or a different platform):

```typescript
if (this.$instagram) {
  // ...
}
```

### Output

There are various Instagram specific elements that can be added to the [output](https://v4.jovo.tech/docs/output).

For output that is only used for Instagram, you can add the following to the output object:

```typescript
{
  // ...
  platforms: {
    instagram: {
      // ...
    }
  }
}
```

You can add response objects that should show up exactly like this in the Instagram response object using the `nativeResponse` object:

```typescript
{
  // ...
  platforms: {
    instagram: {
      nativeResponse: {
        // ...
      }
      // ...
    }
  }
}
```
