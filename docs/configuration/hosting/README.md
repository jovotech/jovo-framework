# Hosting

In this section, you can learn more about different types of services that can be used for hosting your Alexa Skills and Google Actions.

* [Introduction](#introduction)
* [Available Integrations](#available-integrations)
* [Code Example](#code-example)


## Introduction

Jovo come with off-the-shelf server integrations that make it easier for you to deploy your voice app to the provider of your choice.

Jovo currently supports a [webhook](./webhook.md './server/webhook') (which we recommend for local prototyping), [AWS Lambda](./aws-lambda.md './server/aws-lambda'), and [Azure Functions](./azure-functions.md './server/azure-functions'). 

## Available Integrations

Find more information on server integrations here:

Name | Description
------------ | -------------
[Webhook](./webhook.md './hosting/webhook') | Run an express server as HTTPS endpoint
[AWS Lambda](./aws-lambda.md './hosting/aws-lambda') | Run the voice app as AWS Lambda Function
[Google Cloud Functions](./google-cloud-functions.md './hosting/google-cloud-functions') | Run the voice app on Google Cloud Functions
[Azure Functions](./azure-functions.md './hosting/azure-functions') | Run the voice app on Azure Functions


## Code Example

```javascript
'use strict';

const { Webhook, ExpressJS, Lambda } = require('jovo-framework');
const { app } = require ('./app.js');

// ------------------------------------------------------------------
// HOST CONFIGURATION
// ------------------------------------------------------------------

// ExpressJS (Jovo Webhook)
if (process.argv.indexOf('--webhook') > -1) {
    const port = process.env.PORT || 3000;

    Webhook.listen(port, () => {
        console.info(`Local server listening on port ${port}.`);
    });

    Webhook.post('/webhook', async (req, res) => {
        await app.handle(new ExpressJS(req, res));
    });
}

// AWS Lambda
exports.handler = async (event, context, callback) => {
    await app.handle(new Lambda(event, context, callback));
};
```

<!--[metadata]: {"description": "Host your Alexa Skill and Google Action on AWS Lambda, Azure Functions, or a Webserver with Jovo.",
		        "route": "hosting"}-->
