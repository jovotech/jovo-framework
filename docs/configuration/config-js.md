# config.js - App Configuration

> To view this page on the Jovo website, visit https://v3.jovo.tech/docs/config-js

In this section, you will learn more about the essential configurations of a Jovo Voice App.

- [Overview](#overview)
- [Adding Configurations](#adding-configurations)
  - [General Configurations](#general-configurations)
  - [Integrations](#integrations)
  - [Plugins](#plugins)
- [Accessing Configurations](#accessing-configurations)
- [Staging](#staging)

## Overview

The `config.js` file in the `src` folder of a Jovo project is the place where all configuration of your voice app can be stored.

For example, the `config.js` for the "Hello World" Jovo project looks like this:

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

The above example shows three different elements:

- [`logging`](../basic-concepts/data/logging.md './data/logging'): Every request and response will be logged if this is `true`. [Learn more here](../basic-concepts/data/logging.md './data/logging').
- `intentMap`: Maps `AMAZON.StopIntent` to the `END` handler. [Learn more here](../basic-concepts/routing/intents.md#intentmap './routing/intents#intentmap').
- `db`: Enables `FileDb` as database integration. [Learn more here](../integrations/databases './databases').

## Adding Configurations

There are several types of integrations that can be added to the `config.js` file:

- [General Configurations](#general-configurations)
- [Integrations](#integrations)
- [Plugins](#plugins)

### General Configurations

Below are references to all the general configurations that can be added to the `config.js` file. The general configurations are added to the root element of the config object.

| Category | Name                                                                                                                             | Description                                                                        |
| :------- | :------------------------------------------------------------------------------------------------------------------------------- | :--------------------------------------------------------------------------------- |
| Routing  | [intentMap](../basic-concepts/routing/intents.md#intentmap './routing/intents#intentmap')                                        | Maps incoming intents to specified intent names                                    |
|          | [intentsToSkipUnhandled](../basic-concepts/routing/intents.md#intentstoskipunhandled './routing/intents#intentstoskipunhandled') | Intents that should not be mapped to 'Unhandled' when not found in a certain state |
|          | [inputMap](../basic-concepts/routing/input.md#inputmap './routing/input#inputmap')                                               | Maps incoming input (slots and parameters) to specified input names                |
| Data     | [logging](../basic-concepts/data/logging.md './data/logging')                                                                    | Logs both requests and responses                                                   |
|          | [user](../basic-concepts/data/user.md './data/user')                                                                             | Configure the Jovo User object                                                     |
| Output   | [i18n](../basic-concepts/output/i18n.md './output/i18n')                                                                         | Enable multilingual output for your voice app                                      |

### Integrations

Jovo integrations are deeply integrated plugins that ususally implement an interface. Examples are:

- `db`: [Database integrations](../integrations/databases './databases')
- `analytics`: [Analytics integrations](../integrations/analytics './analytics')
- `cms`: [CMS integrations](../integrations/cms './cms')

Integration configurations are usually structured like this:

```javascript
// @language=javascript

// src/config.js

module.exports = {
	// Integration type
	db: {
		// Name of integration class
		FileDb: {
			pathToFile: '../db/db.json',
		},
	},

	// ...
};

// @language=typescript

// src/config.ts

const config = {
	// Integration type
	db: {
		// Name of integration class
		FileDb: {
			pathToFile: '../db/db.json',
		},
	},

	// ...
};
```

> [Learn more about Jovo integrations here](../integrations './integrations').

### Plugins

Plugin configurations can be added like this:

```javascript
// @language=javascript

// src/config.js

module.exports = {
	// General plugin wrapper
	plugin: {
		PluginName: {
			// Plugin config
		},
	},

	// ...
};

// @language=typescript

// src/config.ts

const config = {
	// General plugin wrapper
	plugin: {
		PluginName: {
			// Plugin config
		},
	},

	// ...
};
```

## Accessing Configurations

If you want to access elements from your app config, you can do so by using the following object:

```javascript
this.$app.$config;
```

You can also define your own keys and values in the configuration file. For them to not interfere with Jovo config keys, we recommend using a wrapping element like `custom`:

```javascript
// @language=javascript

// src/config.js

module.exports = {
	custom: {
		// Defining values in the config file
		keyOne: 'valueOne',

		// Referencing environment variables
		keyTwo: process.env.KEY_TWO,
	},

	// ...
};

// @language=typescript

// src/config.ts

const config = {
	custom: {
		// Defining values in the config file
		keyOne: 'valueOne',

		// Referencing environment variables
		keyTwo: process.env.KEY_TWO,
	},

	// ...
};
```

You can then access them in your app logic with:

```javascript
const keyOne = this.$app.$config.custom.keyOne;
const keyTwo = this.$app.$config.custom.keyTwo;
```

## Staging

Jovo uses a structure similar to [`node-config`](https://www.npmjs.com/package/config) to allow you to add config overrides for different stages.

For example, you could have several config files for different stages:

- `config.js`: Default config of the project
- `config.qa.js`: Config overrides for the QA environment (e.g. DynamoDB)
- `config.prod.js`: Config overrides for the production environment (e.g. DynamoDB + Analytics)

For the app to discover what environment it is currently in, use `NODE_ENV` or `STAGE` as environment variables.

Here is how the `db` parts could differ for different environments:

```javascript
// @language=javascript

// src/config.js, default config

module.exports = {
	db: {
		FileDb: {
			pathToFile: '../db/db.json',
		},
	},

	// ...
};

// config.prod.js, config overrides for NODE_ENV=prod

module.exports = {
	db: {
		DynamoDb: {
			tableName: 'yourTableName',
		},
	},

	// ...
};

// @language=typescript

// src/config.ts, default config

const config = {
	db: {
		FileDb: {
			pathToFile: '../db/db.json',
		},
	},

	// ...
};

// config.prod.ts, config overrides for NODE_ENV=prod

const config = {
	db: {
		DynamoDb: {
			tableName: 'yourTableName',
		},
	},

	// ...
};
```

When using expressJS for deploying your project, you should install the `dotenv` library to use staged config files:

```
npm install dotenv
```

and configure it inside your launch Intent:

```
LAUNCH() {

  // ...

  require('dotenv').config();

  // ...

},
```

> For project-related staging environments, take a look at [project.js](./project-js.md './project-js').

<!--[metadata]: {"description": "Learn how to configure your Jovo Voice App for Amazon Alexa and Google Assistant", "route": "config-js"}-->
