# Google Cloud

> To view this page on the Jovo website, visit https://v3.jovo.tech/docs/hosting/google-cloud-functions

[Google Cloud Functions](https://cloud.google.com/functions/) is a serverless hosting solution by Google Cloud. Find the [official documentation here](https://cloud.google.com/functions/docs/).

- [Google Cloud Functions Configuration](#google-cloud-functions-configuration)
- [Data Persistence](#data-persistence)

> Tutorial: [Deploy to Google Cloud](https://v3.jovo.tech/tutorials/deploy-to-google-cloud)

## Google Cloud Functions Configuration

To make your app work on Google Cloud Functions, open your `index.js` file in the `src` folder, and add the following:

```javascript
// @language=javascript

// src/index.js

const { Webhook, GoogleCloudFunction } = require('jovo-framework');
const { app } = require('./app/app.js');

exports.handler = async (req, res) => {
	await app.handle(new GoogleCloudFunction(req, res));
};

// @language=typescript

// src/index.ts

import { Webhook, GoogleCloudFunction } from 'jovo-framework';
import { app } from './app';

const googleCloudFunction = async (req: any, res: any) => {
	await app.handle(new GoogleCloudFunction(req, res));
};

export { googleCloudFunction };
```

## Data Persistence

It is encouraged to use the Jovo integration for [Google Cloud Firestore](../../integrations/databases/firestore.md '../databases/firestore') if you want to store user specific data.

<!--[metadata]: {"description": "Deploy your Google Actions and Alexa Skills to Google Cloud Functions with the Jovo Framework",
		        "route": "hosting/google-cloud-functions"}-->
