---
title: 'Facebook Messenger'
excerpt: 'The Facebook Messenger platform integration allows you to build custom Messenger Bots using Jovo.'
url: 'https://www.jovo.tech/marketplace/platform-facebookmessenger'
---

# Facebook Messenger

The Facebook Messenger [platform integration](https://www.jovo.tech/docs/platforms) allows you to build custom Messenger bots using Jovo.

## Introduction

Apps for Facebook Messenger are called Messenger bots. You can find a general introduction into building those bots in the [official Messenger documentation](https://developers.facebook.com/docs/messenger-platform/).

In the [installation](#installation) section, we're going to set up a Jovo project that works with Facebook Messenger.

A Messenger bot usually consists of two parts:

- The Facebook app that is connected to a Facebook page in the Facebook for Developers portal
- The code that handles the logic of your bot

In the Facebook for Developers portal, you need to create an app that gets connected to a Facebook page. Learn how to set it up in the [deployment](#deployment) section.

If a user sends messages to your page, the Messenger platform sends API requests to your webhook endpoint. The code is then responsible for returning an appropriate response. We're going to set up the code for this in the [installation](#installation) section, and look into [configuration](#configuration) options afterwards.

Jovo is a framework that allows you to build apps that work across devices and platforms. However, this does not mean that you can't build highly complex Messenger bots with Jovo. Any custom Messenger bot that can be built with the official Messenger SDK can also be built with the Jovo Framework. In the [platform-specific features](#platform-specific-features) section, we're going to take a look at Facebook Messenger features in Jovo.

## Installation

To create a new Facebook Messenger project with Jovo, we recommend installing the Jovo CLI, creating a new Jovo project, and selecting Facebook Messenger as platform using the CLI wizard. Learn more in our [getting started guide](https://www.jovo.tech/docs/getting-started).

```sh
# Install Jovo CLI globally
$ npm install -g @jovotech/cli

# Start new project wizard
# In the platform step, use the space key to select Facebook Messenger
$ jovo new <directory>
```

If you want to add Facebook Messenger to an existing Jovo project, you can install the plugin like this:

```sh
$ npm install @jovotech/platform-facebookmessenger
```

Add it as plugin to your [app configuration](https://www.jovo.tech/docs/app-config), e.g. `app.ts`:

```typescript
import { App } from '@jovotech/framework';
import { FacebookMessengerPlatform } from '@jovotech/platform-facebookmessenger';
// ...

const app = new App({
  plugins: [
    new FacebookMessengerPlatform({
      pageAccessToken: '<yourAccessToken>',
      verifyToken: '<yourVerifyToken>',
    }),
    // ...
  ],
});
```

The integration needs at least a `pageAccessToken` and a `verifyToken`. Learn more in the [configuration section](#configuration).

## Configuration

You can configure the Facebook Messenger platform in the [app configuration](https://www.jovo.tech/docs/app-config), for example `app.ts`:

```typescript
import { FacebookMessengerPlatform } from '@jovotech/platform-facebookmessenger';
// ...

const app = new App({
  plugins: [
    new FacebookMessengerPlatform({
      pageAccessToken: '<yourAccessToken>',
      verifyToken: '<yourVerifyToken>',
      plugins: [
        /* ... */
      ],
      session: {
        /* ... */
      },
      senderActions: {
        /* ... */
      },
    }),
    // ...
  ],
});
```

Options include:

- `pageAccessToken`: The access token to your page generated in the Facebook Developer portal. See [deployment](#deployment) for more information.
- `verifyToken`: A string to add to the Facebook developer portal to verify server requests. See [deployment](#deployment) for more information.
- `plugins`: For example, you need to add an [NLU integration](#nlu-integration) here.
- `session`: Session specific config. Take a look at [session data](#session-data) for more information.
- `senderActions`: Facebook Messenger [sender actions](#sender-actions).


### NLU Integration

Facebook Messenger requests mostly consist of raw text that need to be turned into structured data using a [natural language understanding (NLU) integration](https://www.jovo.tech/docs/nlu).

Here is an example how you can add an NLU integration (in this case [NLP.js](https://www.jovo.tech/marketplace/nlu-nlpjs)) to the [app configuration](https://www.jovo.tech/docs/app-config) in `app.ts`:

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

Facebook Messenger does not offer session storage, which is needed for features like [session data](https://www.jovo.tech/docs/data#session-data), [component data](https://www.jovo.tech/docs/data#component-data), and the [`$state` stack](https://www.jovo.tech/docs/state-stack).

To make Facebook Messenger bots work with these features, Jovo automatically enables the storage of session data to the active [database integration](https://www.jovo.tech/docs/databases). Under the hood, it adds `session` to the [`storedElements` config](https://www.jovo.tech/docs/databases#storedelements).

Since Facebook does not have the concept of sessions, we need to define after which time a request should be seen as the start of the new session. The default is _15 minutes_ and can be modified either in the [`storedElements` config](https://www.jovo.tech/docs/databases#storedelements) (works across platforms) or in the Facebook Messenger config:

```typescript
new FacebookMessengerPlatform({
  session: {
    expiresAfterSeconds: 900,
  },
});
```

### Sender Actions

Facebook Messenger [sender actions](https://developers.facebook.com/docs/messenger-platform/send-messages/sender-actions/) allow you to mark latest user messages as seen and enable typing indicators while your bot is working on sending a response.

By default, both actions are enabled by default:

```typescript
new FacebookMessengerPlatform({
  senderActions: {
    markSeen: true,
    typingIndicator: true,
  },
});
```

- `markSeen`: This adds the `mark_seen` sender action and show latest messages as read.
- `typingIndicator`: This turns typing indicators on when a request was received (in the [`dialogue.start` middleware](https://www.jovo.tech/docs/ridr-lifecycle#middlewares)) and turns them off when the dialogue lifecycle is completed (in the [`dialogue.end` middleware](https://www.jovo.tech/docs/ridr-lifecycle#middlewares)).

Note: Although [Instagram](https://www.jovo.tech/marketplace/platform-instagram) works similar compared to Facebook Messenger, it does not support sender actions at the moment.


## Platform-Specific Features

You can access the Facebook Messenger specific object like this:

```typescript
this.$facebookMessenger;
```

You can also use this object to see if the request is coming from Facebook Messenger (or a different platform):

```typescript
if (this.$facebookMessenger) {
  // ...
}
```

### Output

There are various Facebook Messenger specific elements that can be added to the [output](https://www.jovo.tech/docs/output).

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

## Deployment

To test your Messenger bot with a Facebook page, you need to create an app in the Facebook for Developers portal. [Learn more in the official Messenger docs](https://developers.facebook.com/docs/messenger-platform/getting-started/app-setup).

You need to do two things:

- Connect a page to the app, generate an access token, and add it to the [`accessToken` configuration](#configuration).
- Add your app endpoint (for example your [Jovo Webhook URL](https://www.jovo.tech/docs/webhook) for testing) as callback URL and add a verify token that you also specify in the [`verifyToken` configuration](#configuration). This will be used by Facebook to verify your server.
