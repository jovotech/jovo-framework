# Project Structure

> To view this page on the Jovo website, visit https://v3.jovo.tech/docs/project-structure

In this section, you will learn more about the project structure of a Jovo Voice App.

- [Overview](#overview)
- [Project Files](#project-files)
  - [project.js - Project Configuration](#projectjs---project-configuration)
  - [models - Language Model](#models---language-model)
  - [platforms - Platform Files](#platforms---platform-files)
- [Source Files](#source-files)
  - [app.js - App Logic](#appjs---app-logic)
  - [config.js - App Config](#configjs---app-config)
  - [index.js - Host Configuration](#indexjs---host-configuration)

## Overview

A Jovo project is divided into two main building blocks:

- [Project Files](#project-files): Overall project related files, e.g. language models and platform project information
- [Source Files](#source-files): The actual code of your app. Can be found in the `src` folder

## Project Files

These files are in the root folder and include anything that is needed to publish a project to voice platforms like Amazon Alexa and Google Assistant.

Project files include:

- [project.js - Project Configuration](#projectjs---project-configuration)
- [models - Language Model](#models---language-model)
- [platforms - Platform Files](#platforms---platform-files)

### project.js - Project Configuration

The `project.js` file stores all the necessary information for your Jovo project, for example which voice platforms are built for.

Here is the `project.js` file of the [Jovo Sample App](https://github.com/jovotech/jovo-sample-voice-app-nodejs):

```javascript
// ------------------------------------------------------------------
// JOVO PROJECT CONFIGURATION
// ------------------------------------------------------------------

module.exports = {
	alexaSkill: {
		nlu: 'alexa',
	},
	googleAction: {
		nlu: 'dialogflow',
	},
	endpoint: '${JOVO_WEBHOOK_URL}',
};
```

> [Learn more about the `project.js` file here](./project-js.md './project-js').

### models - Language Model

The models folder contains the [Jovo Language Model](../basic-concepts/model './model'), which can be used to create and update platform specific language models using the [Jovo CLI](../basic-concepts/cli './cli').

The idea is to maintain a single language model locally instead of having to go to the platform developer consoles independently.

In the `models` folder, every language gets a file. For example, here's how a file `en-US.json` could look like:

```javascript
{
    "invocation": "my test app",
    "intents":[
        {
            "name":"HelloWorldIntent",
            "phrases":[
                "hello",
                "say hello",
                "say hello world"
            ]
        },
        {
            "name":"MyNameIsIntent",
            "phrases":[
                "{name}",
                "my name is {name}",
                "i am {name}",
                "you can call me {name}"
            ],
            "inputs":[
                {
                    "name":"name",
                    "type":{
                        "alexa":"AMAZON.US_FIRST_NAME",
                        "dialogflow":"@sys.given-name"
                    }
                }
            ]
        }
    ]
}
```

> [Learn more about the Jovo Language Model here](../basic-concepts/model './model').

### platforms - Platform Files

The `platforms` folder is created by the [Jovo CLI](../basic-concepts/cli './cli'). Each platform (like Amazon Alexa and Google Assistant) gets its own folder with project files and language models. These files are then used to [deploy](../basic-concepts/cli/deploy.md './cli/deploy') the projects to the voice platforms.

> [Learn more about the Platforms folder here](../basic-concepts/model/platforms.md './model/platforms').

## Source Files

In the `src` folder, you can find the actual code of your Jovo app. This part is later deployed to [hosting](./hosting './hosting') providers like AWS Lambda.

- [app.js - App Logic](#appjs---app-logic)
- [config.js - App Config](#configjs---app-config)
- [index.js - Host Configuration](#indexjs---host-configuration)

### app.js - App Logic

The `app.js` file is used for the logic of your voice application, which contains handlers, intents, and the configuration of your voice app:

```javascript
// @language=javascript

// src/app.js

'use strict';

// ------------------------------------------------------------------
// APP INITIALIZATION
// ------------------------------------------------------------------

const { App } = require('jovo-framework');
const { Alexa } = require('jovo-platform-alexa');
const { GoogleAssistant } = require('jovo-platform-googleassistant');
const { JovoDebugger } = require('jovo-plugin-debugger');
const { FileDb } = require('jovo-db-filedb');

const app = new App();

app.use(
    new Alexa(),
    new GoogleAssistant(),
    new JovoDebugger(),
    new FileDb()
);


// ------------------------------------------------------------------
// APP LOGIC
// ------------------------------------------------------------------

app.setHandler({
    LAUNCH() {
        return this.toIntent('HelloWorldIntent');
    },

    HelloWorldIntent() {
        this.ask('Hello World! What\'s your name?', 'Please tell me your name.');
    },

    MyNameIsIntent() {
        this.tell('Hey ' + this.$inputs.name.value + ', nice to meet you!');
    },
});

module.exports.app = app;


// @language=typescript

// src/app.ts

// ------------------------------------------------------------------
// APP INITIALIZATION
// ------------------------------------------------------------------

import { App } from 'jovo-framework';
import { Alexa } from 'jovo-platform-alexa';
import { GoogleAssistant } from 'jovo-platform-googleassistant';
import { JovoDebugger } from 'jovo-plugin-debugger';
import { FileDb } = from 'jovo-db-filedb';

const app = new App();

app.use(
    new Alexa(),
    new GoogleAssistant(),
    new JovoDebugger(),
    new FileDb()
);


// ------------------------------------------------------------------
// APP LOGIC
// ------------------------------------------------------------------

app.setHandler({
    LAUNCH() {
        return this.toIntent('HelloWorldIntent');
    },

    HelloWorldIntent() {
        this.ask('Hello World! What\'s your name?', 'Please tell me your name.');
    },

    MyNameIsIntent() {
        this.tell('Hey ' + this.$inputs.name.value + ', nice to meet you!');
    },
});

export { app };
```

> [You can find everything related to the `app.js` here](./app-js.md './app-js').

### config.js - App Config

The `config.js` file stores all the logic-related configuration:

```javascript
// @language=javascript

// src/config.js

// ------------------------------------------------------------------
// APP CONFIGURATION
// ------------------------------------------------------------------

module.exports = {
	logging: true,

	intentMap: {
		'AMAZON.StopIntent': 'END',
	},

	db: {
		FileDb: {
			pathToFile: '../db/db.json',
		},
	},
};

// @language=typescript

// src/config.ts

// ------------------------------------------------------------------
// APP CONFIGURATION
// ------------------------------------------------------------------

const config = {
	logging: true,

	intentMap: {
		'AMAZON.StopIntent': 'END',
	},

	db: {
		FileDb: {
			pathToFile: '../db/db.json',
		},
	},
};

export { config };
```

> [You can find everything related to the `config.js` here](./config-js.md './config-js').

### index.js - Host Configuration

Everything related to running and hosting your voice application, either in Lambda or using a webhook (recommended for local prototyping), is dealt with in `index.js` file:

```javascript
// @language=javascript

// src/index.js

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

// @language=typescript

// src/index.ts

import { Webhook, ExpressJS, Lambda } from 'jovo-framework';
import { app } = from './app';

// ------------------------------------------------------------------
// HOST CONFIGURATION
// ------------------------------------------------------------------

// ExpressJS (Jovo Webhook)
if (process.argv.indexOf('--webhook') > -1) {
    const port = process.env.JOVO_PORT || 3000;
    Webhook.jovoApp = app;

    Webhook.listen(port, () => {
        console.info(`Local server listening on port ${port}.`);
    });

    Webhook.post('/webhook', async (req: Express.Request, res: Express.Response) => {
        await app.handle(new ExpressJS(req, res));
    });
}

// AWS Lambda
exports.handler = async (event: any, context: any, callback: Function) => {
    await app.handle(new Lambda(event, context, callback));
};
```

> [Learn everything related to host configuration and the `index.js` file here](./hosting './hosting').

<!--[metadata]: {"description": "Learn more about the project structure of a Jovo Voice App for Amazon Alexa and Google Assistant",
		        "route": "project-structure"}-->
