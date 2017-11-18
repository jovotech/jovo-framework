# [App Configuration](../) > Server

In this section, you can learn more about different types of server configurations to run your voice app.

* [Introduction](#introduction)
* [Available Integrations](#available-integrations)
* [Code Examples](#integrations)
  * [Webhook](#webhook)
  * [AWS Lambda](#aws-lambda)


## Introduction

Jovo come with off-the-shelf server integrations that make it easier for you to deploy your voice app to the provider of your choice. Server integrations are added in the [`App Configuration`](https://github.com/jovotech/jovo-framework-nodejs/tree/master/docs/02_app-configuration) part of your app.

Jovo currently supports a [webhook](#webhook) (which we recommend for local prototyping) and [AWS Lambda](#aws-lambda). The sample repository offers examples for both, which you can see in more detail below.

## Available Integrations

Find more information on server integrations here:

Name | Description | Docs
------------ | ------------- | -------------
Webhook | Run an express server as HTTPS endpoint | [📝](https://github.com/jovotech/jovo-framework-nodejs/tree/master/docs/02_app-configuration/server/webhook.md)
AWS Lambda | Run the voice app as AWS Lambda Function | [📝](https://github.com/jovotech/jovo-framework-nodejs/tree/master/docs/02_app-configuration/server/aws-lambda.md)


## Code Examples

### Webhook

Find the complete documentation on webhooks here: [App Configuration > Server > Webhook](https://github.com/jovotech/jovo-framework-nodejs/tree/master/docs/02_app-configuration/server/webhook.md).

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

Find the complete documentation on AWS Lambda here: [App Configuration > Server > Webhook](https://github.com/jovotech/jovo-framework-nodejs/tree/master/docs/02_app-configuration/server/aws-lambda.md).

```javascript
const app = require('jovo-framework').Jovo;

// Other configurations go somewhere here

exports.handler = function(event, context, callback) {
    app.handleRequest(req, res, handlers);
    app.execute();
};

// App Logic below
```