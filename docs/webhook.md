---
title: 'Webhook'
excerpt: 'Develop and test your voice apps and chatbots locally using Jovo.'
---

# Jovo Webhook

The Jovo Webhook allows you test your Jovo app without uploading your code to a server.

## Introduction

The Jovo Webhook is a free service that creates a link to your local development server. This way, you can prototype locally without having to deal with servers or cloud deployments to test changes.

This URL only works for local development and can't be used in production. For more information on deployment, take a look at the [staging documentation](./staging.md).

By using the [`run` command](https://www.jovo.tech/docs/run-command), a unique, anonymous link is created that looks like this:

```
https://webhookv4.jovo.cloud/<your-id>
```

This link can be used in a number of use cases:

- Access the [Jovo Debugger](#jovo-debugger) for convenient, browser-based testing
- Connect [platform developer consoles and clients](#developer-consoles-and-clients) to your local code

## Jovo Debugger

By pasting the Webhook URL into your browser's address bar (or by typing `.` after executing the [`run` command](https://www.jovo.tech/docs/run-command)), you can access The Jovo Debugger.

The Jovo Debugger can be used to send requests to your local development server. This makes debugging and testing of your Jovo app more efficient and convenient.

Learn more in the [Jovo Debugger documentation](https://www.jovo.tech/docs/debugger).

## Developer Consoles and Clients

You can also use the Jovo Webhook URL as an endpoint in platform developer consoles, for example the Alexa Developer Console. This way, you can test your platform projects (like Alexa Skills) on a device without having to upload your code.

Tip: If you keep the [Jovo Debugger](#jovo-debugger) open, it will display the incoming requests, even if you're testing on a different device.

If you deploy your projects using the [Jovo CLI](https://www.jovo.tech/docs/cli), you can set the `endpoint` property to your Jovo Webhook URL in the [project configuration](./project-config.md). The `${JOVO_WEBHOOK_URL}` literal gets replaced with the actual URL during the [`build` command](https://www.jovo.tech/docs/build-command):

```js
const { ProjectConfig } = require('@jovotech/cli-core');
// ...

const project = new ProjectConfig({
  endpoint: '${JOVO_WEBHOOK_URL}',
  // ...
});
```

If you have a custom client that sends requests to a Jovo app, you can also use your Jovo Webhook URL to point to your development version.
