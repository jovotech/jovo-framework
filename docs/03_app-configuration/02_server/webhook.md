# [App Configuration](../) > [Server](README.md) > Webhook

For voice apps in prototyping stage, we recommend using a local webserver and a service like [jovo webhook](#jovo-webhook) or [bst proxy](#bst-proxy). This way, you can easily update your app without having to upload it to a server or [AWS Lambda](./aws-lambda.md './aws-lambda') every time.

* [Webhook Configuration](#webhook-configuration)
* [Run the Webhook Locally](#run-the-webhook-locally)
   * [jovo webhook](#jovo-webhook)
   * [bst proxy](#bst-proxy)
   * [ngrok](#ngrok)
* [Deploy to a Server](#deploy-to-a-server)
   * [Verification](#verification)
   * [Run Server](#run-server)


## Webhook Configuration

Jovo uses the [`express`](https://expressjs.com/) framework for running a server. Here is how the part of `index.js`, which is used to run the app on a webhook, looks like:

```javascript
'use strict';

const {Webhook} = require('jovo-framework');
const {app} = require('./app/app.js');

if (app.isWebhook()) {
    const port = process.env.PORT || 3000;
    Webhook.listen(port, () => {
        console.log(`Example server listening on port ${port}!`);
    });
    Webhook.post('/webhook', (req, res) => {
        app.handleWebhook(req, res);
    });
}
```

You can either run your server locally, or deploy to a webhosting service.


## Run the Webhook Locally

You can use either of the following commands to run the server locally:

```sh
# Using the Jovo CLI
$ jovo run

# Alternative
$ node index.js --webhook
```

Make sure that, with every file update, you terminate the server with `ctrl+c` and run it again. Find more information on the `jovo run` command here: [CLI: jovo run](../../02_cli#jovo-run '../cli#jovo-run').

`$ jovo run` should return this:

```sh
Local development server listening on port 3000.
This is your webhook url: https://webhook.jovo.cloud/[your-id]
```

As you can see, a [`jovo webhook`](#jovo-webhook) URL is automatically created, which serves as a link to your local webhook and can be posted as a HTTPS endpoint to the voice platforms.

Here are all the services that can point to your local development server:
* [jovo webhook](#jovo-webhook) (default)
* [bst proxy](#bst-proxy)
* [ngrok](#ngrok)


### jovo webhook

The `jovo webhook` is a free service  that creates a link to your local webserver. This way, you can prototype locally without having to deal with servers or Lambda uploads all the time.

By using the [`jovo init`](../../02_cli#jovo-init '../cli#jovo-init') command or [`jovo run`](../../02_cli#jovo-run '../cli#jovo-run'), a unique, anonymized link is created that looks like this:

```sh
https://webhook.jovo.cloud/[your-id]
```
This link simply makes it easier for you to prototype locally by being able to see the logs in your command line, and to make fast changes without uploading your code to AWS Lambda.

You can either use this link and paste it into the respective developer platform consoles, or use the [`jovo deploy`](../../02_cli#jovo-deploy '../cli#jovo-deploy') command to upload it from the command line (`jovo webhook` is the default `endpoint` added to `app.json` with the [`jovo init`](../../02_cli#jovo-init '../cli#jovo-init') command).

Find the following sections in our beginner tutorials to learn how to do so:

* [Amazon Alexa: Add Webhook as HTTPS Endpoint](https://www.jovo.tech/blog/alexa-skill-tutorial-nodejs/#app-configuration)
* [Google Assistant: Add Webhook as Dialogflow Fulfillment](https://www.jovo.tech/blog/google-action-tutorial-nodejs/#endpoint)


### bst proxy

With the bst proxy by [Bespoken](https://bespoken.io/), you can create a link similar to the [jovo webhook](#jovo-webhook), but with additional features like logging.

You can run the proxy with the `jovo run` command:

```sh
$ jovo run --bst-proxy
```
This is what the result looks like:

![bst proxy result](https://www.jovo.tech/blog/wp-content/uploads/2017/10/terminal-bst-proxy-1.jpg)

Now, you can not only use the link as an endpoint, but also use it to access [Bespoken Analytics](../../06_integrations/analytics#bespoken '../analytics#bespoken') for powerful logging capabilities:

![bst proxy result](https://www.jovo.tech/blog/wp-content/uploads/2017/10/bespoken-logging.jpg)

### ngrok

[Ngrok](https://ngrok.com/) is a tunneling service that makes your localhost accessible to outside APIs.

You can download ngrok like so:

```sh
# Open a new tab in your command line tool, then:
$ npm install ngrok -g

# Point ngrok to your localhost:3000
$ ngrok http 3000
```

It should display something similar to this:

![ngrok window](https://www.jovo.tech/img/docs/building-a-voice-app/webhook-url.jpg)

## Deploy to a Server

> The `jovo webhook` URL is only meant for prototyping purposes and can't be used in production. Follow the steps here to find out how to deploy your voice app to a production server.

### Verification

When you want to deploy your code to a webserver other than AWS Lambda, you need to verify that Alexa Skill requests are actually coming from Amazon.

For this, Jovo uses a package called [alexa-verifier-middleware](https://github.com/alexa-js/alexa-verifier-middleware), which can be accessed by switching one line of the configuration in `index.js`:

```javascript
// Use this
const Webhook = require('jovo-framework').WebhookVerified;

// Instead of this
const {Webhook} = require('jovo-framework');
```

To make use of it, please install it like so:

```sh
$ npm install alexa-verifier-middleware
```

### Run Server

To run the server, use the following command:

```sh
$ node index.js --webhook
```


<!--[metadata]: {"title": "Webhook Configuration", 
                "description": "Find out how to create a webhook for Alexa Skills and Google Actions with the Jovo Framework",
                "activeSections": ["configuration", "server", "webhook"],
                "expandedSections": "configuration",
                "inSections": "configuration",
                "breadCrumbs": {"Docs": "docs/",
				"App Configuration": "docs/configuration",
				"Server": "docs/server",
                                "Webhook": ""
                                },
		"commentsID": "framework/docs/server/webhook",
		"route": "docs/server/webhook"
                }-->
