---
title: 'Dashbot Analytics Integration'
excerpt: 'The Dashbot Jovo integration allows you to monitor and analyze conversations between your Jovo app and its users.'
---

# Dashbot Analytics Integration

Learn how to use Dashbot Analytics with your Jovo app.

## Introduction

[Dashbot](https://www.dashbot.io/) is an analytics tool for both text-based bots (Facebook Messenger, Slack, Kik, Twitter) and voice apps (Amazon Alexa, Google Assistant).

To get started, take the following steps:

- Go to the [Dashbot app](https://reports.dashbot.io/) and sign up or in.
- Create a new chatbot project.
- Select a platform of your choice. See [platforms](#platforms) for a list of our supported platforms. If you can't find your platform in the list, select _Universal_.
- Copy the provided _API Key_.
- [Install the Dashbot plugin](#installation) for Jovo and add the API key to the configuration.

## Installation

You can install the plugin like this:

```sh
$ npm install @jovotech/analytics-dashbot
```

Dashbot is a plugin that gets added to a [platform](https://v4.jovo.tech/docs/platforms) integration, probably only for production environments, for example in an `app.prod.ts` file. [Learn more about staging here](https://v4.jovo.tech/docs/staging).

Since platforms are usually initialized in `app.ts`, we recommend using this syntax in `app.prod.ts`:

```typescript
import { app } from './app';
import { DashbotAnalytics } from '@jovotech/analytics-dashbot';
// ...

app.plugins.AlexaPlatform.use(new DashbotAnalytics({ apiKey: '<yourApiKey>' }));
```

Which is a shortcut for the following:

```typescript
import { AlexaPlatform } from '@jovotech/platform-alexa';
import { DashbotAnalytics } from '@jovotech/analytics-dashbot';
// ...

app.configure({
  plugins: [
    new AlexaPlatform({
      plugins: [
        new DashbotAnalytics({ apiKey: '<yourApiKey>' }),
        // ...
      ],
    }),
  ],
});
```

## Platforms

The Jovo Dashbot integration automatically maps the following Jovo [platforms](https://v4.jovo.tech/docs/platforms) to Dashbot platforms:

- [Amazon Alexa](https://v4.jovo.tech/marketplace/platform-alexa) gets mapped to Dashbot's [`alexa`](https://docs.dashbot.io/platforms/alexa) integration.
- [Google Assistant](https://v4.jovo.tech/marketplace/platform-googleassistant) gets mapped to Dashbot's [`google`](https://docs.dashbot.io/platforms/google) integration.
- [Facebook Messenger](https://v4.jovo.tech/marketplace/platform-facebookmessenger) and [Instagram](https://v4.jovo.tech/marketplace/platform-instagram) get mapped to Dashbot's [`facebook`](https://docs.dashbot.io/platforms/facebook) integration.
- All other platforms get mapped to Dashbot's [`universal`](https://docs.dashbot.io/platforms/universal) platform.
