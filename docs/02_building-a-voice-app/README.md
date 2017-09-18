# Building a Voice App

> Other pages in this category: [Handling Intents and States](intents-stated.md), [User Input and Data](input.md), [Creating Output](output.md).

In this section, you will learn more about the essentials of building an app with the Jovo Framework. For more basic information, see [Getting Started](../01_getting-started) and [Voice App Basics](../01_getting-started/voice-app-basics.md).

* [Jovo App Structure](#jovo-app-structure)
* [App Configuration](#app-configuration)
  * [Server Configuration](#server-configuration)
  * [Webhook](#webhook)
  * [AWS Lambda](#aws-lambda)
  * [How to Add Configurations](#how-to-add-configurations)
* [App Logic](#app-logic)
  * [Intents and States](#intents-and-states)
  * [User Input](#user-input)
  * [Output](#output)
* [Command Line Tools](#command-line-tools)
  * [Create a New Project](#create-a-new-project)


## Jovo App Structure
A Jovo voice app ([`index.js`](https://github.com/jovotech/jovo-sample-voice-app-nodejs/blob/master/index.js)) is divided into two main building blocks: [Configuration](#app-configuration) and [Logic](#app-logic):

![Jovo App Structure](https://www.jovo.tech/img/docs/jovo-architecture.jpg)

The upper part is used for [server configuration](#server-configuration), adding [integrations](../04_integrations) like analytics or databases, or global variables that are used throughout your app.

The below part (the `handlers` variable) is where you're routing through your app and managing how you're responding to your users.


## App Configuration

This building block changes depending on where you want to host your voice app. Jovo currently supports a [webhook](#webhook) (which we recommend for local prototyping) and [AWS Lambda](#aws-lambda). The [sample repository](https://github.com/jovotech/jovo-sample-voice-app-nodejs) offers examples for both, which you can see in more detail below.

To add configurations, you have two options: You can either add them to the main file (outside any function), or to the `webhook.post`/`exports.handler` so that they are loaded with any new request. This depends on the type of configuration.

### Server Configuration

Jovo comes with off-the-shelf [webhook](#webhook) and [AWS Lambda](#aws-lambda) support. There are just a few simple building blocks that make the difference between two types, as you can see in the image below. This makes it easy to switch from local development mode to publishing your voice app, if you prefer AWS Lambda for that.

![Jovo Server Configuration](https://www.jovo.tech/img/docs/building-a-voice-app/webhook-lambda-differences.jpg)


### Webhook

For voice apps in prototype stage, we recommend using a webhook and a tunnel service like [ngrok](#developing-locally-with-ngrok). This way, you can easily update your app without having to upload it to a server or AWS Lambda each time.

Jovo uses the [`express`](https://expressjs.com/) framework for running a server. Here is what the beginning of a Jovo project with a webhook looks like ([see the sample repository index.js](https://github.com/jovotech/jovo-sample-voice-app-nodejs/blob/master/index.js)):

```
const app = require('jovo-framework').Jovo;
const webhook = require('jovo-framework').Webhook;

// Other configurations go somewhere here

// Listen for post requests
webhook.listen(3000, function() {
    console.log('Local development server listening on port 3000.');
});

webhook.post('/webhook', function(req, res) {
    app.handleRequest(req, res, handlers);
    app.execute();
});

// App Logic below
```

You can either run your server locally, or deploy to a webhosting service.


#### Developing locally with ngrok

Do the following steps when you’re ready to test your prototype. To run the server, use the node command in your command line. Make sure that, with every file update, you terminate it with `ctrl+c` and run it again:

```
$ node index.js

# It should return this:
Local development server listening on port 3000.
```

[Ngrok](https://ngrok.com/) is a tunneling service that makes your localhost accessible to outside APIs. This way, you can prototype locally without having to deal with servers or Lambda uploads all the time. You can download ngrok like so:

```
# Open a new tab in your command line tool, then:
$ npm install ngrok -g

# Point ngrok to your localhost:3000
$ ngrok http 3000
```

It should display something similar to this:

![ngrok window](https://www.jovo.tech/img/docs/building-a-voice-app/webhook-url.jpg)

Now use the `https://xyz.ngrok.io` address provided by ngrok, add `/webhook` and paste it as webhook link to the respective developer platform consoles.

Find the following sections in our beginner tutorials to learn how to do so:

* [Amazon Alexa: Add Webhook as HTTPS Endpoint](https://www.jovo.tech/blog/alexa-skill-tutorial-nodejs/#app-configuration)
* [Google Assistant: Add Webhook as API.AI Fulfillment](https://www.jovo.tech/blog/google-action-tutorial-nodejs/#endpoint)

#### Using the Alexa Verifier Middleware

When you finally want to upload your code and host it somewhere else than on AWS Lambda, you need to make sure to switch one line of the configuration:

```
// Use this
const webhook = require('../index').WebhookVerified;

// Instead of this
const webhook = require('../index').Webhook;
```


### AWS Lambda

Here is what the beginning of a Jovo project for Lambda looks like ([see the sample repository index_lambda.js](https://github.com/jovotech/jovo-sample-voice-app-nodejs/blob/master/index_lambda.js)):

```
const app = require('jovo-framework').Jovo;

// Other configurations go somewhere here

exports.handler = function(event, context, callback) {
    app.handleRequest(req, res, handlers);
    app.execute();
};

// App Logic below
```

While for Alexa, the process of hosting a Skill on Lambda is straightforward, for a Google Action there are additional steps that need to be taken to create an API Gateway. To learn more about how to run your voice app on Lambda, please take a look at our step-by-step tutorials:

* [Run your Alexa Skill on Lambda](https://www.jovo.tech/blog/alexa-skill-tutorial-nodejs/#aws-lambda)
* [Run your Google Action on Lambda with an API Gateway](https://www.jovo.tech/blog/google-action-tutorial-nodejs/#aws-lambda)


### How to Add Configurations

As described above, configurations will mostly be added outside the `webhook.post`/`exports.handler` functions (will be loaded when the server/function is started). Sometimes, they can also be added between the `handleRequest` and `execute` method calls (will be loaded every new request).

* Mapping
  * [intentMap](intents-states.md#intentmap)
  * [inputMap](input.md#inputmap)
* Logging
  * [Log Requests](input.md#log-requests)
  * [Log Responses](input.md#log-responses)
* Database Integrations
  * [Database Configurations](../04_integrations#databases)
  * [FilePersistence](../04_integrations#filepersistence)
  * [DynamoDB](../04_integrations#dynamodb)
* Analytics Integrations
  * [Analytics Configurations](../04_integrations#analytics)
  * [Add VoiceLabs Analytics](../04_integrations#voicelabs)
  * [Add Dashbot Analytics](../04_integrations#dashbot)

## App Logic

The `handlers` variable is the main building block of your voice app. This is where the logic happens.

```
let handlers = {
    'LAUNCH' : function () {
        // This intent is required
        // Opened when people open the voice app without a specific query
        app.tell('Hello World!');
    },

    'YourFirstIntent' : function () {
        // do something here

    },

};
```

### Intents & States

You can learn more about how to route through intents and states in the section [Handling Intents and States](/intents-states.md).


### User Input

You can learn more about how to deal with user input and data in the section [Handling User Input](/input.md).


### Output

You can learn more about how to craft speech, audio, and visual responses in the section [Creating Output](/output.md).



## Command Line Tools

You can use the Jovo Command Line Tools ([see GitHub repository](https://github.com/jovotech/jovo-cli)) to create new Jovo projects. See [Installation](../getting-started#installation) for getting started.

### Create a New Project

You can create a Jovo project into a new directory with the following command:

```
$ jovo new <directory>
```