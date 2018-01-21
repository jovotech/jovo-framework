# App Configuration

In this section, you will learn more about the essential configurations of a Jovo Voice App.

* [Jovo App Structure](#jovo-app-structure)
* [Server Configuration](#server-configuration)
  * [Webhook](#webhook)
  * [AWS Lambda](#aws-lambda)
* [How to Add Configurations](#how-to-add-configurations)
  * [setConfig](#setconfig)
  * [Available Configurations](#available-configurations)


## Jovo App Structure
A Jovo voice app ([`index.js`](https://github.com/jovotech/jovo-sample-voice-app-nodejs/blob/master/index.js)) is divided into two main building blocks: `Configuration` and `Logic`:

![Jovo App Structure](https://www.jovo.tech/img/docs/jovo-architecture.jpg)

In the sample voice app above, the upper part is used for [server configuration](#server-configuration), adding [integrations](ttps://github.com/jovotech/jovo-framework-nodejs/tree/master/docs/06_integrations) like analytics or databases, or global variables that are used throughout your app.

The below part (the `handlers` variable) is where you're routing through your app and managing how to respond to your users. You can find out more about this part here: [App Logic](ttps://github.com/jovotech/jovo-framework-nodejs/tree/master/docs/03_app-logic).


## Server Configuration

This building block changes depending on where you want to host your voice app. Jovo currently supports a [webhook](#webhook) (which we recommend for local prototyping) and [AWS Lambda](#aws-lambda). The [sample repository](https://github.com/jovotech/jovo-sample-voice-app-nodejs) offers examples for both, which you can see in more detail below.

There are just a few simple building blocks that make the difference between two types, as you can see in the image below. This makes it easy to switch from local development mode to publishing your voice app, if you prefer AWS Lambda for that.

![Jovo Server Configuration](https://www.jovo.tech/img/docs/building-a-voice-app/webhook-lambda-differences.jpg)

You can find all the information for server configuration in this section: [App Configuration > Server](https://github.com/jovotech/jovo-framework-nodejs/tree/master/docs/02_app-configuration/server).


### Webhook

Find out more about using a webhook here: [App Configuration > Server > Webhook](https://github.com/jovotech/jovo-framework-nodejs/tree/master/docs/02_app-configuration/server/webhook.md).

Here is a code example:

```javascript
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


### AWS Lambda

Find out more about deploying your voice app to AWS Lambda here: [App Configuration > Server > AWS Lambda](https://github.com/jovotech/jovo-framework-nodejs/tree/master/docs/02_app-configuration/server/aws-lambda.md).

Here is a code example:

```javascript
const app = require('jovo-framework').Jovo;

// Other configurations go somewhere here

exports.handler = function(event, context, callback) {
    app.handleRequest(req, res, handlers);
    app.execute();
};

// App Logic below
```



## How to Add Configurations

To add configurations, you have two options: You can either add them to the main file (outside any function), or to the `webhook.post`/`exports.handler` so that they are loaded with any new request. This depends on the type of configuration.

You can find a list of all [available configurations below](#available-configurations).

Each configuration has its own setter function, but can also be added to a `setConfig` method call.


### setConfig

You can use `setConfig` to have all configurations in one place.

Here is an example of the difference:

```javascript
// Enable logging with setters
app.enableRequestLogging();
app.enableResponseLogging();

// Enable request logging with setConfig
app.setConfig({
    requestLogging: true,
    responseLogging: true,
    // other configurations
});
```

This is the default configuration:

```javascript
app.setConfig({
    logging: false,
    requestLogging: false,
    responseLogging: false,
    requestLoggingObjects: [],
    responseLoggingObjects: [],
    saveUserOnResponseEnabled: true,
    userDataCol: 'userData',
    inputMap: {},
    intentMap: {},
    intentsToSkipUnhandled: [],
    saveBeforeResponseEnabled: false,
    allowedApplicationIds: [],
    db: {
        type: 'file',
        localDbFilename: 'db',
    },
    userMetaData: {
        lastUsedAt: true,
        sessionsCount: true,
        createdAt: true,
        requestHistorySize: 0,
        devices: false,
    },
    i18n: {
        overloadTranslationOptionHandler: sprintf.overloadTranslationOptionHandler,
        load: 'all',
    },
    analytics: {
        intentsToSkip: [],
        usersToSkip: [],
        services: {},
    },
});

```


### Available Configurations

Below is a list of all configurations:

Category | Name | Description | Docs
:--- | :--- | :--- | :---
Routing | intentMap | Maps incoming intents to specified intent names | [📝](https://github.com/jovotech/jovo-framework-nodejs/tree/master/docs/01_routing#intentmap)
 | | intentsToSkipUnhandled | Intents which should not be mapped to 'Unhandled' when not found in a certain state | [📝](https://github.com/jovotech/jovo-framework-nodejs/tree/master/docs/01_routing#intentstoskipunhandled)
Data | inputMap | Maps incoming input (slots and parameters) to specified input names | [📝](https://github.com/jovotech/jovo-framework-nodejs/tree/master/docs/02_data#inputmap)
 | | logging | Logs both requests and responses | [📝](https://github.com/jovotech/jovo-framework-nodejs/tree/master/docs/02_data#logging)
 | | requestLogging | Logs incoming requests | [📝](https://github.com/jovotech/jovo-framework-nodejs/tree/master/docs/02_data#log-requests)
 | | responseLogging | Logs outgoing responses | [📝](https://github.com/jovotech/jovo-framework-nodejs/tree/master/docs/02_data#log-responses)
 | | requestLoggingObjects | Limits request logs to the provided objects | [📝](https://github.com/jovotech/jovo-framework-nodejs/tree/master/docs/02_data#request-logging-objects)
 | | responseLoggingObjects | Limits response logs to the provided objects | [📝](https://github.com/jovotech/jovo-framework-nodejs/tree/master/docs/02_data#response-logging-objects)
User | userDataCol | Changes the name of the user data column in the database | [📝](https://github.com/jovotech/jovo-framework-nodejs/tree/master/docs/02_data/user.md#user-data)
 | | userMetaData | Change the default configurations for storing user meta data | [📝](https://github.com/jovotech/jovo-framework-nodejs/tree/master/docs/02_data/user.md#user-meta-data)
Output | i18n | Enable multilingual output for your voice app | [📝](https://github.com/jovotech/jovo-framework-nodejs/blob/master/docs/03_app-logic/i18n.md#configuration)
Integrations | Databases | Switch between supported database integrations | [📝](https://github.com/jovotech/jovo-framework-nodejs/tree/master/docs/06_integrations/databases)
 | | Analytics | Enable analytics integrations | [📝](https://github.com/jovotech/jovo-framework-nodejs/tree/master/docs/06_integrations/analytics)
