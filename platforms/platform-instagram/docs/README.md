---
title: 'Instagram Platform Integration'
excerpt: 'The Instagram platform integration allows you to build custom Instagram messaging bots using Jovo.'
url: 'https://www.jovo.tech/marketplace/platform-instagram'
---

# Instagram Platform Integration

The Instagram [platform integration](https://www.jovo.tech/docs/platforms) allows you to build custom Messenger bots using Jovo.

## Introduction

Apps for managing Instagram direct messages (DMs) are called Instagram messaging apps, and also referred to as bots. They work similar to [Facebook Messenger bots](https://www.jovo.tech/marketplace/platform-facebookmessenger). You can find a general introduction into building those apps in the [official Instagram Messaging documentation](https://developers.facebook.com/docs/messenger-platform/instagram).

In the [installation](#installation) section, we're going to set up a Jovo project that works with Instagram.

An Instagram bot usually consists of two parts:

- The Facebook app that is connected to a Facebook page in the Facebook for Developers portal
- The code that handles the logic of your bot

In the Facebook for Developers portal, you need to create an app that gets connected to a Facebook page. This page then gets connected to an Instagram business account. Learn how to set it up in the [deployment](#deployment) section.

If a user sends messages to your Instagram account, the Messenger platform sends API requests to your webhook endpoint. The code is then responsible for returning an appropriate response. We're going to set up the code for this in the [installation](#installation) section, and look into [configuration](#configuration) options afterwards.

Jovo is a framework that allows you to build apps that work across devices and platforms. However, this does not mean that you can't build highly complex Instagram bots with Jovo. Any custom Instagram messaging app that can be built with the official Messenger SDK can also be built with the Jovo Framework. In the [platform-specific features](#platform-specific-features) section, we're going to take a look at Instagram features in Jovo.

## Installation

To create a new Instagram project with Jovo, we recommend installing the Jovo CLI, creating a new Jovo project, and selecting Instagram as platform using the CLI wizard. Learn more in our [getting started guide](https://www.jovo.tech/docs/getting-started).

```sh
# Install Jovo CLI globally
$ npm install -g @jovotech/cli

# Start new project wizard
# In the platform step, use the space key to select Instagram
$ jovo new <directory>
```

If you want to add Instagram to an existing Jovo project, you can install the plugin like this:

```sh
$ npm install @jovotech/platform-instagram
```

Add it as plugin to your [app configuration](https://www.jovo.tech/docs/app-config), e.g. `app.ts`:

```typescript
import { App } from '@jovotech/framework';
import { InstagramPlatform } from '@jovotech/platform-instagram';
// ...

const app = new App({
  plugins: [
    new InstagramPlatform({
      pageAccessToken: '<yourAccessToken>',
      verifyToken: '<yourVerifyToken>',
    }),
    // ...
  ],
});
```

The integration needs at least a `pageAccessToken` and a `verifyToken`. Learn more in the [configuration section](#configuration).

## Configuration

You can configure the Instagram platform in the [app configuration](https://www.jovo.tech/docs/app-config), for example `app.ts`:

```typescript
import { InstagramPlatform } from '@jovotech/platform-instagram';

// ...

const app = new App({
  plugins: [
    new InstagramPlatform({
      pageAccessToken: '<yourAccessToken>',
      verifyToken: '<yourVerifyToken>',
      plugins: [ /* ... */ ],
      session: { /* ... */ },
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

### NLU Integration

Instagram requests mostly consist of raw text that need to be turned into structured data using an [natural language understanding (NLU) integration](https://www.jovo.tech/docs/nlu).

Here is an example how you can add an NLU integration (in this case [NLP.js](https://www.jovo.tech/marketplace/nlu-nlpjs)) to the [app configuration](https://www.jovo.tech/docs/app-config) in `app.ts`:

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

Instagram does not offer session storage, which is needed for features like [session data](https://www.jovo.tech/docs/data#session-data), [component data](https://www.jovo.tech/docs/data#component-data), and the [`$state` stack](https://www.jovo.tech/docs/state-stack).

To make Instagram bots work with these features, Jovo automatically enables the storage of session data to the active [database integration](https://www.jovo.tech/docs/databases). Under the hood, it adds `session` to the [`storedElements` config](https://www.jovo.tech/docs/databases#storedelements).

Since Instagram does not have the concept of sessions, we need to define after which time a request should be seen as the start of the new session. The default is _15 minutes_ and can be modified either in the [`storedElements` config](https://www.jovo.tech/docs/databases#storedelements) (works across platforms) or in the Instagram config:

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

There are various Instagram specific elements that can be added to the [output](https://www.jovo.tech/docs/output).

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

## Deployment

To test your Instagram messaging bot with an Instagram account, you need to create an app in the Facebook for Developers portal. [Learn more in the official Instagram Messaging docs](https://developers.facebook.com/docs/messenger-platform/instagram/get-started).

You need to do two things:

- Connect a page to the app, generate an access token, and add it to the [`accessToken` configuration](#configuration).
- Add your app endpoint (for example your [Jovo Webhook URL](https://www.jovo.tech/docs/webhook) for testing) as callback URL and add a verify token that you also specify in the [`verifyToken` configuration](#configuration). This will be used by Facebook to verify your server.

If your Facebook app is in developer mode, Facebook will only send requests to your webhook for users who have a tester role (or upwards). Make sure that your Instagram account is connected to your Facebook page for the testing to work.