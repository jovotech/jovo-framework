# ExpressJS Server

> To view this page on the Jovo website, visit https://v3.jovo.tech/docs/hosting/express-js

Learn how to deploy your Alexa Skills and Google Actions to a server using our ExpressJS webhook. You can also use this webhook for local prototyping. Learn more here: [Project Lifecycle > Local Development](../../workflows/project-lifecycle.md#local-development '../project-lifecycle#local-development').

- [Webhook Configuration](#webhook-configuration)
- [Deploy to a Server](#deploy-to-a-server)
  - [Verification](#verification)
  - [Run Server](#run-server)

## Webhook Configuration

Jovo uses the [`express`](https://expressjs.com/) framework for running a server. Here is how the part of `index.js`, which is used to run the app on a webhook, looks like:

```javascript
// @language=javascript

// src/index.js

'use strict';

const { Webhook, ExpressJS } = require('jovo-framework');
const { app } = require('./app.js');

if (process.argv.indexOf('--webhook') > -1) {
	const port = process.env.JOVO_PORT || 3000;
	Webhook.jovoApp = app;

	Webhook.listen(port, () => {
		console.info(`Local server listening on port ${port}.`);
	});

	Webhook.post('/webhook', async (req, res) => {
		await app.handle(new ExpressJS(req, res));
	});
}

// @language=typescript

// src/index.ts

import { Webhook, ExpressJS } from 'jovo-framework';
import { app } from './app';

if (process.argv.indexOf('--webhook') > -1) {
	const port = process.env.JOVO_PORT || 3000;
	Webhook.jovoApp = app;

	Webhook.listen(port, () => {
		console.info(`Local server listening on port ${port}.`);
	});

	Webhook.post(
		'/webhook',
		async (req: Express.Request, res: Express.Response) => {
			await app.handle(new ExpressJS(req, res));
		}
	);
}
```

You can either run your server locally, or deploy to a webhosting service.

## Deploy to a Server

> The `jovo webhook` URL is only meant for prototyping purposes and can't be used in production. Follow the steps here to find out how to deploy your voice app to a production server.

### Verification

When you want to deploy your code to a webserver other than AWS Lambda, you need to verify that Alexa Skill requests are actually coming from Amazon. Otherwise you will not pass the Alexa Certification for your Skill.

For this, Jovo uses a package called [alexa-verifier-middleware](https://github.com/alexa-js/alexa-verifier-middleware), which can be accessed by changing the configuration in `index.js`:

```javascript
// @language=javascript

// src/index.js

// Use this
const { WebhookVerified: Webhook, ExpressJS } = require('jovo-framework');

// Instead of this
const { Webhook, ExpressJS } = require('jovo-framework');

// @language=typescript

// src/index.ts

// Use this
const { WebhookVerified as Webhook, ExpressJS } = require('jovo-framework');

// Instead of this
const { Webhook, ExpressJS } = require('jovo-framework');
```

Modify your Express Server Setup like this:

```javascript
// @language=javascript

// src/index.js

// Use this
Webhook.post(['/webhook','/webhook_alexa'], async (req, res) => {

// Instead of this
Webhook.post('/webhook', async (req, res) => {

// @language=typescript

// src/index.js

// Use this
Webhook.post(['/webhook','/webhook_alexa'], async (req: Express.Request, res: Express.Response) => {

// Instead of this
Webhook.post('/webhook', async (req: Express.Request, res: Express.Response) => {
```

To make use of it, please install it like so:

```sh
$ npm install alexa-verifier-middleware
```

You can now Access the secured version of your application at /webhook_alexa and the unsecure version at /webhook.

### SSL

```javascript
// @language=javascript

// src/index.js
const fs = require('fs');

// Add this
Webhook.ssl = {
	key: fs.readFileSync('/path/to/cert.key'),
	cert: fs.readFileSync('/path/to/cert.pem'),
};

// @language=typescript

// src/index.ts
import * as fs from 'fs';

// Add this
Webhook.ssl = {
	key: fs.readFileSync('/path/to/cert.key'),
	cert: fs.readFileSync('/path/to/cert.pem'),
};
```

### Run Server

To run the server, use the following command:

```sh
$ node index.js --webhook
```

<!--[metadata]: {"description": "Find out how to host your Alexa Skills and Google Actions on a server with ExpressJS and the Jovo Framework.",
		        "route": "hosting/express-js"}-->
