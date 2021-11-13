# Jovo Plugins

> To view this page on the Jovo website, visit https://v3.jovo.tech/docs/plugins

Learn how you can build your own plugins to customize and extend the Jovo Framework.

- [Introduction](#introduction)
- [Using Plugins](#using-plugins)
- [Building Plugins](#building-plugins)
  - [Config](#config)
  - [HandleRequest](#handlerequest)

## Introduction

Plugins allow you to easily extend the Jovo Framework without having to mess with its core code and architecture.

Plugins allow you to "hook" into several parts of the request execution, called `middlewares`. Here is a list of all available middlewares:

| Middleware        | Description                                                                                                                        |
| ----------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| `setup`           | First initialization of `app` object with first incoming request. Is executed once as long as `app` is alive                       |
| `request`         | Raw JSON request from platform gets processed. Can be used for authentication middlewares.                                         |
| `platform.init`   | Determines which platform (e.g. `Alexa`, `GoogleAssistant`) sent the request. Initialization of abstracted `jovo` (`this`) object. |
| `platform.nlu`    | Natural language understanding (NLU) information gets extracted for built-in NLUs (e.g. `Alexa`). Intents and inputs are set.      |
| `nlu`             | Request gets routed through external NLU (e.g. `Dialogflow` standalone). Intents and inputs are set.                               |
| `user.load`       | Initialization of user object. User data is retrieved from database.                                                               |
| `router`          | Request and NLU data (intent, input, state) is passed to router. intentMap and inputMap are executed. Handler path is generated.   |
| `handler`         | Handler logic is executed. Output object is created and finalized.                                                                 |
| `user.save`       | User gets finalized, DB operations.                                                                                                |
| `platform.output` | Platform response JSON gets created from output object.                                                                            |
| `response`        | Response gets sent back to platform.                                                                                               |
| `fail`            | Errors get handled if applicable.                                                                                                  |

> [Learn more about the Jovo architecture here](./architecture.md './architecture').

## Using Plugins

Download the plugin:

```sh
$ npm install --save jovo-plugin-name
```

Enable it in your app:

```javascript
// @language=javascript
// src/app.js

const { PluginName } = require('jovo-plugin-name');

app.use(new PluginName());

// @language=typescript
// src/app.ts

import { PluginName } from 'jovo-plugin-name';

app.use(new PluginName());
```

Add configurations:

```javascript
// @language=javascript
// src/config.js

plugin: {
	PluginName: {
		// Plugin config
	}
}

// @language=typescript
// src/config.ts

plugin: {
	PluginName: {
		// Plugin config
	}
}
```

## Building Plugins

The following code examples will all be in TypeScript , which is the language the whole framework is written in, but it's also possible to create plugins using JavaScript, since, at the end of the day, the TypeScript code is simply transcompiled to JavaScript.

```javascript
// Typescript

import { Plugin, PluginConfig, BaseApp } from 'jovo-core';

interface Config extends PluginConfig {
    //
}

export class PluginName implements Plugin {
    config: Config = {
        // Default config
    };

    constructor() {

    }

    install(app: BaseApp) {
        app.middleware('middleware')!.use(this.pluginFunction.bind(this));
    }

    pluginFunction(handleRequest: HandleRequest) {

    }
}
```

Every plugin has to have an install function, which is used to hook up the plugin to the middlewares. It is also the point at which you can access the plugin's config (more on that later on).

While connecting the plugin to a middleware, you specify a function to be executed as soon as the request execution hits the specified middleware:

```javascript
install(app: BaseApp) {
    app.middleware('middleware')!.use(this.pluginFunction.bind(this));
}

pluginFunction(handleRequest: HandleRequest) {
    // do stuff
}
```

### Config

You can specify the configuration options of your plugin inside the `Config` interface.

```javascript
// Example

export interface Config extends PluginConfig {
	apiKey: string;
	baseId: string;
	options: {
		color: string,
	};
}
```

The default configuration is set inside the `config` object of the plugin class:

```javascript
// Example

export class PluginName implements Plugin {
	// default config
	config: Config = {
		apiKey: '',
		baseId: '',
		options: {
			color: '#FF0000',
		},
	};

	// Rest of the plugin
}
```

Your user can change the configuration using the `config.js` file inside their project using the following syntax:

```javascript
// @language=javascript

// src/config.js

module.exports = {
	// ...

	plugin: {
		PluginName: {
			apiKey: '<value>',
			options: {
				color: '#000000',
			},
		},

		// ...
	},
};

// @language=typescript

// src/config.ts

const config = {
	// ...

	plugin: {
		PluginName: {
			apiKey: '<value>',
			options: {
				color: '#000000',
			},
		},

		// ...
	},
};
```

The user's config will be merged with your default config and will be first accessible inside the `install()` function (not the constructor) of your plugin using `this.config`:

```javascript
install(app: BaseApp) {
    const apiKey = this.config.apiKey;
    const color = this.config.options.color;
}
```

### HandleRequest

Your function will receive the `handleRequest` object as input, which has the following properties:

```javascript
export interface HandleRequest {
	/**
	 * Current app instance
	 */
	app: BaseApp;

	/**
	 * Current host instance
	 */
	host: Host;

	/**
	 * Current jovo instance
	 *
	 * First initialization happens in 'platform.init' middleware
	 */
	jovo?: Jovo;

	/**
	 * Error
	 */
	error?: Error;
}
```

#### app

The first property is a reference to the current `app` object. Here's an example from the `I18Next` plugin, which uses the `app` object to load the language files: [here](https://github.com/jovotech/jovo-framework/blob/b54f6611cb4655ac978f915aaf57f60fe5b43a9c/jovo-integrations/jovo-cms-i18next/src/I18Next.ts#L77)

#### host

The second property is the `host` object (Lambda, Azure, ExpressJS, etc.), which has the following interface:

```javascript
export interface Host {
	/**
	 * Defines file write access
	 *
	 * Eg. Lambda doesn't have file write access, ExpressJS usually does
	 */
	hasWriteFileAccess: boolean;

	/**
	 * Headers of the request
	 */
	headers: { [key: string]: string };

	/**
	 * Full request object
	 */
	$request: any;

	/**
	 * Full request object
	 * @returns {any}
	 */
	getRequestObject(): any;

	/**
	 * Sets response object
	 * @param obj
	 * @returns {Promise<any>}
	 */
	setResponse(obj: any): Promise<any>;
}
```

#### jovo

The `jovo` object is the third property, which is the same object you reference inside your handler using `this`.

Depending on the middleware you use, the object can be `undefined`, since the initialization happens inside the `platform.init` middleware.

#### error

The last one is the `error` property, which wil be `undefined`, unless the plugin is hooked up to the `fail` middleware.

```javascript
interface Error {
	stack?: string;
}
```

<!--[metadata]: {
                "description": "Learn how you can build your own plugins to extend the Jovo Framework.",
		        "route": "plugins"
                }-->
