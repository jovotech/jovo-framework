# Azure Functions

> To view this page on the Jovo website, visit https://v3.jovo.tech/docs/hosting/azure-functions

[Azure Functions](https://azure.microsoft.com/en-us/services/functions/) is a serverless compute service by Microsoft. Find the [official documentation here](https://docs.microsoft.com/en-us/azure/azure-functions/).

- [Function Configuration](#function-configuration)
- [Running the Function Locally](#running-the-function-locally)
- [Deploying to Azure](#deploying-to-azure)
- [Data Persistence](#data-persistence)

> Tutorial: [Deploy to Azure](https://v3.jovo.tech/tutorials/deploy-to-azure)

## Function Configuration

First, add the following export to your root `index.js`. If there's an existing export there, typically for AWS Lambda, remove it. This function is what gets called by the Azure Functions language worker process when an HTTP request comes in.

```javascript
// @language=javascript

// src/index.js

'use strict';

const { AzureFunction } = require('jovo-framework');
const { app } = require('./app/app.js');

module.exports = async (context, req) => {
	await app.handle(new AzureFunction(context, req));
};

// @language=typescript

// src/index.ts

import { AzureFunction } from 'jovo-framework';
import { app } from './app';

const azure = async (context: any, req: any) => {
	await app.handle(new AzureFunction(context, req));
};

export { azure };
```

Second, create a new file called `host.json` in the same directory as your `index.js` (probably `src`), with the following contents. This indicates to Azure Functions that this is a valid function app and that the [much better v2 runtime](https://azure.microsoft.com/en-us/blog/introducing-azure-functions-2-0/) should be used.

```json
{
	"version": "2.0"
}
```

Finally, create a new file called `function.json` in a subdirectory named `webhook` with the following contents. You can name the directory anything you want, it's just the endpoint name for your function.

```json
{
	"scriptFile": "../index.js",
	"disabled": false,
	"bindings": [
		{
			"type": "httpTrigger",
			"webHookType": "genericJson",
			"direction": "in",
			"name": "req"
		},
		{
			"type": "http",
			"direction": "out",
			"name": "res"
		}
	]
}
```

## Running the Function Locally

Typically you should never need to run the function locally, using instead the `run` command of the Jovo CLI to launch the Jovo Webhook. If you do wish to run it locally inside the Azure Functions runtime, here's how to do that.

First, install the Azure Functions Core Tools:

```sh
$ npm i -g azure-functions-core-tools
```

Then run the following command from the root of your project (where `host.json` resides):

```sh
$ func start
```

You should see the runtime initialize and highlight the URL of your webhook.

## Deploying to Azure

[Zip deployment](https://docs.microsoft.com/en-us/azure/azure-functions/deployment-zip-push) (combined with [Run from Package](https://docs.microsoft.com/en-us/azure/azure-functions/run-functions-from-deployment-package)) is the recommended method for deploying to Azure. It's a two step process that's easy to automate on your build server:

1. Run `npm run bundle` or `jovo deploy --target zip` to create a production ready `bundle.zip` file.
2. Deploy the zip file using one of the methods described on their Zip deployment document. Easiest method for a build server is cURL.

That's it! When initially setting up your function app in the Azure Portal before the first deployment, make sure to set the `WEBSITE_RUN_FROM_PACKAGE` app setting to `1` to enable Run from Package. You'll also want to set the `WEBSITE_NODE_DEFAULT_VERSION` app setting to indicate which version of Node.js should be used to run your code. More information about that can be found on the [JavaScript Developer Reference](https://docs.microsoft.com/en-us/azure/azure-functions/functions-reference-node#node-version).

## Data Persistence

The [FileDB](../../integrations/databases/file-db.md '../databases/file-db') database integration is strongly discouraged on Azure Functions. It also doesn't work at all when you use [Run From Package](https://docs.microsoft.com/en-us/azure/azure-functions/run-functions-from-deployment-package), which makes the file system read-only (and greatly speeds up the deployment and cold start of your function).

It is encouraged to switch to [Azure CosmosDB](../../integrations/databases/cosmosdb.md '../databases/cosmosdb') or to simply not use any database integration at all. You can do the latter by setting `user: { implicitSave: false }` on your Jovo config object.

<!--[metadata]: {"description": "Deploy your Alexa Skills and Google Actions on Azure Functions with the Jovo Framework", "route": "hosting/azure-functions"}-->
