# Jovo Webhook

> To view this page on the Jovo website, visit https://v3.jovo.tech/docs/webhook

Learn more about the Jovo Webhook for local development of Alexa Skills and Google Actions

- [Introduction](#introduction)
- [Getting Started](#getting-started)
- [Jovo Debugger](#jovo-debugger)

## Introduction

The Jovo Webhook is a free service that creates a link to your local webserver. This way, you can prototype locally without having to deal with servers or Lambda uploads all the time.

By using the [`jovo run`](./cli/run './cli/run'), a unique, anonymized link is created that looks like this:

```sh
https://webhookv3.jovo.cloud/[your-id]
```

You can either use this link and paste it into the respective developer platform consoles, or use the [`jovo deploy`](https://v3.jovo.tech/marketplace/jovo-cli/deploy) command to upload it from the command line. Your Jovo Webhook URL is the default `endpoint` in your [`project.js`](../configuration/project-js.md './project-js') file.

## Getting Started

To develop your Alexa Skills and Google Actions locally, use the following command:

```sh
# Using the Jovo CLI and Jovo Webhook
$ jovo3 run

# Should return something like this
Local development server listening on port 3000.
This is your webhook url: https://webhookv3.jovo.cloud/[your-id]
```

As you can see, a [Jovo Webhook](#jovo-webhook) URL is automatically created, which serves as a link to your local webhook and can be added as a HTTPS endpoint to the voice platforms.

Make sure that, with every file update, you terminate the server with `ctrl+c` and run it again. You can also use the `nodemon` Jovo CLI integration.

> [Find more information on the `jovo run` command here](./cli/run.md './cli/run').

## Jovo Debugger

By copying the link of your webhook and opening it in your browser, you can access the Jovo Debugger, which makes it even easier to test and debug locally:

[![Jovo Debugger](../img/jovo-debugger-basic-interaction.gif)](./debugger.md './debugger')

> [Learn more about the Jovo Debugger here](./debugger.md './debugger').

<!--[metadata]: {"description": "Learn more about local development of Alexa Skills and Google Actions with the Jovo Webhook.", "route": "webhook"}-->
