---
title: 'Slack Plugin'
excerpt: 'Send error messages and other notifications from your Jovo app to Slack.'
url: 'https://www.jovo.tech/marketplace/plugin-slack'
---

# Slack Plugin

Send error messages and other notifications from your Jovo app to Slack.

## Introduction

This plugin allows you to automatically log errors and other notifications to a Slack channel. This way, you can make sure that you know when something breaks in your Jovo app.

Learn more how to set it up in the [installation](#installation) and [configuration](#configuration) sections.

## Installation

You can install the plugin like this:

```sh
$ npm install @jovotech/plugin-slack
```

Add it as plugin to any [app configuration](https://www.jovo.tech/docs/app-config) stage you like, e.g. `app.prod.ts`:

```typescript
import { SlackPlugin } from '@jovotech/plugin-slack';
// ...

app.configure({
  plugins: [
    new SlackPlugin({
      webhookUrl: '<your-webhook-url>',
      channel: '<your-channel>',
    }),
    // ...
  ],
});
```

The two configurations in the snippet above need to be added for the plugin to work. Learn more in the [configuration section](#configuration).

## Configuration

The following configurations can be added:

```typescript
new SlackPlugin({
  webhookUrl: '',
  channel: '',
  logErrors: true,
  fields: {
    locale: false,
    platform: true,
    state: false,
    userId: false,
  },
  customBlocks: /* ... */;
  transformError: /* ... */;
}),
```

- `webhookUrl`: Your Slack webhook URL.
- `channel`: The Slack channel that should be used for the logging.
- `logErrors`: Determines whether errors should be logged automatically. If not, you can use [manual messages](#send-messages-manually).
- `fields`: Shows all fields that should be logged along the error messages.
- [`customBlocks`](#customblocks): This offers the ability to add custom blocks (fields) to your error messages.
- [`transformError`](#transformerror): Completely customize the error messages.

### customBlocks

The `customBlocks` property allows you to add additional blocks to the output of your error logs. Learn more about [blocks in the official Slack docs](https://api.slack.com/block-kit).

Here is an example which will display the request object:

```typescript
new SlackPlugin({
  customBlocks: (jovo) => [
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: `*Request*:\n\`\`\`${JSON.stringify(jovo.$request, undefined, 2)}\`\`\``,
      },
    },
  ],
  // ...
});
```


### transformError

It is possible to completely customize the message that is created on error by passing `transformError` in the config.

Here's an example that will only display a header and the error message:

```typescript
new SlackPlugin({
  transformError: (error: Error, jovo?: Jovo) => {
    return {
      blocks: [
        {
          type: 'header',
          text: {
            type: 'plain_text',
            text: 'An error occurred!',
          },
        },
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `*Error message*\n${error.message}`,
          },
        },
      ],
    };
  },
  // ...
});
```


## Send Messages Manually

In addition to the automatic error notifications, you can also send messages manually using these methods in your [handlers](https://www.jovo.tech/docs/handlers):

```typescript
this.$slack.sendError(error: Error, jovo?: Jovo)

this.$slack.sendMessage(message: string | IncomingWebhookSendArguments)
```

The `IncomingWebhookSendArguments` are from the [official Slack SDK](https://slack.dev/node-slack-sdk/reference/webhook).