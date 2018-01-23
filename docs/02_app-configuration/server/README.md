# [App Configuration](../) > Server

In this section, you can learn more about different types of server configurations to run your voice app.

* [Introduction](#introduction)
* [Available Integrations](#available-integrations)
* [Code Example](#code-example)


## Introduction

Jovo come with off-the-shelf server integrations that make it easier for you to deploy your voice app to the provider of your choice.

Jovo currently supports a [webhook](#webhook) (which we recommend for local prototyping) and [AWS Lambda](#aws-lambda). 

## Available Integrations

Find more information on server integrations here:

Name | Description | Docs
------------ | ------------- | -------------
Webhook | Run an express server as HTTPS endpoint | [📝](https://github.com/jovotech/jovo-framework-nodejs/tree/master/docs/02_app-configuration/server/webhook.md)
AWS Lambda | Run the voice app as AWS Lambda Function | [📝](https://github.com/jovotech/jovo-framework-nodejs/tree/master/docs/02_app-configuration/server/aws-lambda.md)


## Code Example

```javascript
'use strict';

const {Webhook} = require('jovo-framework');
const {app} = require('./app/app.js');

// =================================================================================
// Server Configuration
// =================================================================================

// Used if you run the application on a webhook
if (isWebhook()) {
    const port = process.env.PORT || 3000;
    Webhook.listen(port, () => {
        console.log(`Example server listening on port ${port}!`);
    });
    Webhook.post('/webhook', (req, res) => {
        app.handleWebhook(req, res);
    });
}

// Used if you run the application on AWS Lambda
exports.handler = (event, context, callback) => {
    app.handleLambda(event, context, callback);
};
```
