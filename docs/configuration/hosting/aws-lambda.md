# AWS Lambda

[AWS Lambda](https://aws.amazon.com/lambda/) is a serverless hosting solution by Amazon Web Services. Find the [official documentation here](http://docs.aws.amazon.com/lambda/latest/dg/welcome.html).

* [Lambda Configuration](#lambda-configuration)
* [Deployment](#deployment)
   * [Creating a Lambda Function](#creating-a-lambda-function)
   * [Uploading Code](#uploading-code)
* [Additional Services](#additional-services)
* [Troubleshooting](#troubleshooting)

## Lambda Configuration

Here is how the part of `index.js`, which is used to run the app on AWS Lambda, looks like: 

```javascript
// @language=javascript

// src/index.js

'use strict';

const { Lambda } = require('jovo-framework');
const { app } = require('./app/app.js');

exports.handler = async (event, context, callback) => {
    await app.handle(new Lambda(event, context, callback));
};

// @language=typescript

// src/index.ts

import { Lambda } from 'jovo-framework';
import { app } from './app';

exports.handler = async (event: any, context: any, callback: Function) => {
    await app.handle(new Lambda(event, context, callback));
};
```

## Deployment

### Creating a Lambda Function

While for Alexa, the process of hosting a Skill on Lambda is straightforward, for a Google Action there are additional steps that need to be taken to create an API Gateway. To learn more about how to run your voice app on Lambda, please take a look at our step-by-step tutorials:

* [Run your Alexa Skill on Lambda](https://www.jovo.tech/tutorials/alexa-skill-tutorial-nodejs/#aws-lambda)
* [Run your Google Action on Lambda with an API Gateway](https://www.jovo.tech/tutorials/host-google-action-on-lambda)

### Uploading Code

You can create a ready-to-deploy `bundle.zip` file with either of the following commands:

```sh
# Bundle files
$ jovo deploy --target zip

# Alternative
$ npm run bundle
```

This will copy the `src` files into a `bundle` folder, run a production-only npm install, and then zip it. You can then use this file and upload it to your Lambda function.

If you have a Lambda endpoint defined in your `project.js` file, the `jovo deploy` command will not only [deploy platform projects](../../workflows/project-lifecycle.md/#deploy-platform-projects '../project-lifecycle#deploy-platform-projects'), but also bundle and upload your source code to AWS Lambda:

```sh
# Deploy platform projects and source code
$ jovo deploy
```

## Additional Services

> Tutorial: [Add DynamoDB to Store User Data](https://www.jovo.tech/tutorials/add-dynamodb-database)

The [FileDb](../../integrations/databases/file-db.md '../databases/file-db') database integration does not work on AWS Lambda. It is encouraged to switch to [DynamoDB](../../integrations/databases/dynamodb.md '../databases/dynamodb') before uploading to Lambda.



<!--[metadata]: {"description": "Deploy your Alexa Skills and Google Actions on AWS Lambda with the Jovo Framework", "route": "hosting/aws-lambda"}-->
