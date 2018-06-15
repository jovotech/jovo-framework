# [App Configuration](../) > Server

In this section, you can learn more about different types of server configurations to run your voice app.

* [Introduction](#introduction)
* [Available Integrations](#available-integrations)
* [Code Example](#code-example)


## Introduction

Jovo come with off-the-shelf server integrations that make it easier for you to deploy your voice app to the provider of your choice.

Jovo currently supports a [webhook](./webhook.md './server/webhook') (which we recommend for local prototyping) and [AWS Lambda](./aws-lambda.md './server/aws-lambda'). 

## Available Integrations

Find more information on server integrations here:

Name | Description
------------ | -------------
[Webhook](./webhook.md './server/webhook') | Run an express server as HTTPS endpoint
[AWS Lambda](./aws-lambda.md './server/aws-lambda') | Run the voice app as AWS Lambda Function


## Code Example

```javascript
'use strict';

const {Webhook} = require('jovo-framework');
const {app} = require('./app/app.js');

// =================================================================================
// Server Configuration
// =================================================================================

// Used if you run the application on a webhook
if (app.isWebhook()) {
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

<!--[metadata]: {"title": "Server Configuration", 
                "description": "Host your Alexa Skill and Google Action on AWS Lambda or a Webserver with Jovo.",
                "activeSections": ["configuration", "server", "server_index"],
                "expandedSections": "configuration",
                "inSections": "configuration",
                "breadCrumbs": {"Docs": "docs/",
				"App Configuration": "docs/configuration",
                                "Server": ""
                                },
		"commentsID": "framework/docs/server",
		"route": "docs/server"
                }-->
