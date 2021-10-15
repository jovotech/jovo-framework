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
- Select a platform of your choice. See [configuration](#configuration) for a list of our supported platforms. If you can't find your platform in the list, select *Universal*.
- Copy the provided *API Key*.
- [Install the Dashbot plugin](#installation) for Jovo.
- Add the API key to the [plugin configuration](#configuration).

## Installation

You can install the plugin like this:

```sh
$ npm install @jovotech/analytics-dashbot
```

Add it as plugin to any stage you like, e.g. `app.prod.ts` ([learn more about staging here](https://v4.jovo.tech/docs/staging)):

```typescript
import { DashbotAnalytics } from '@jovotech/analytics-dashbot';

// ...

app.configure({
  plugins: [
    new DashbotAnalytics({
      // Configuration
    }),
    // ...
  ],
});
```

The [configuration section](#configuration) provides a detailed overview of all configuration options.

## Configuration

The following configurations can be added:

```typescript
new DashbotAnalytics({
  platforms: {
    alexa: { apiKey: '', enabled: true },
    google: { apiKey: '', enabled: true },
    facebook: { apiKey: '', enabled: true },
    universal: { apiKey: '', enabled: true },
  },
}),
```

The `platforms` option includes all Dashbot platforms (note that the name can be different to how the [platform integrations](https://v4.jovo.tech/docs/platforms) are called in Jovo):

- `alexa`: Use this for [Amazon Alexa](https://v4.jovo.tech/marketplace/platform-alexa). [Learn more in the official Dashbot docs](https://docs.dashbot.io/platforms/alexa)
- `google`: Use this for [Google Assistant](https://v4.jovo.tech/marketplace/platform-googleassistant). [Learn more in the official Dashbot docs](https://docs.dashbot.io/platforms/google)
- `facebook`: Use this for [Facebook Messenger](https://v4.jovo.tech/marketplace/platform-facebookmessenger). [Learn more in the official Dashbot docs](https://docs.dashbot.io/platforms/facebook)
- `universal`: Use this for any other platform. [Learn more in the official Dashbot docs](https://docs.dashbot.io/platforms/universal).

