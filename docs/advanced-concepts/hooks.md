# Jovo Hooks

> To view this page on the Jovo website, visit https://v3.jovo.tech/docs/hooks

Middleware hooks are the easiest way to extend certain parts of the Jovo Framework. You can see them as a lightweigt version of [Jovo Plugins](./plugins.md './plugins').

- [Introduction](#introduction)
- [Hook Elements](#hook-elements)
  - [error](#error)
  - [host](#host)
  - [jovo](#jovo)
- [Middleware Execution](#middleware-execution)

Watch the video here:

[![Video: Jovo Hooks](../img/video-jovo-hooks.jpg 'youtube-video')](https://www.youtube.com/watch?v=hBrX5srF3yU)

## Introduction

> [Find a full example file here](https://github.com/jovotech/jovo-framework/blob/master/examples/hooks/src/app.js).

Jovo Hooks allow you to "hook" into `middlewares` of the [Jovo Architecture](./architecture.md './architecture').

Here is how a hook could look like:

```js
// @language=javascript
// src/app.js

app.hook('<middleware-name>', (error, host, jovo) => {
	// ...
});

// Example: Wrap Alexa Skill output in a Polly voice SSML tag
// before the response JSON is created in the platform.output middleware
app.hook('before.platform.output', (error, host, jovo) => {
	const pollyName = 'Hans';

	if (jovo.isAlexaSkill()) {
		if (jovo.$output.tell) {
			jovo.$output.tell.speech = `<voice name="${pollyName}">${jovo.$output.tell.speech}</voice>`;
		}

		if (jovo.$output.ask) {
			jovo.$output.ask.speech = `<voice name="${pollyName}">${jovo.$output.ask.speech}</voice>`;
			jovo.$output.ask.reprompt = `<voice name="${pollyName}">${jovo.$output.ask.reprompt}</voice>`;
		}
	}
});

// @language=typescript
// src/app.ts

app.hook('<middleware-name>', (error: Error, host: Host, jovo: Jovo) => {
	// ...
});

// Example: Wrap Alexa Skill output in a Polly voice SSML tag
// before the response JSON is created in the platform.output middleware
app.hook('before.platform.output', (error: Error, host: Host, jovo: Jovo) => {
	const pollyName = 'Hans';

	if (jovo.isAlexaSkill()) {
		if (jovo.$output.tell) {
			jovo.$output.tell.speech = `<voice name="${pollyName}">${jovo.$output.tell.speech}</voice>`;
		}

		if (jovo.$output.ask) {
			jovo.$output.ask.speech = `<voice name="${pollyName}">${jovo.$output.ask.speech}</voice>`;
			jovo.$output.ask.reprompt = `<voice name="${pollyName}">${jovo.$output.ask.reprompt}</voice>`;
		}
	}
});
```

Here is a list of all available middlewares:

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

## Hook Elements

Each middleware hook contains of a specified `middleware` and an anonymous function that is called with the following parameters:

- [error](#error)
- [host](#host)
- [jovo](#jovo)

### error

The `error` is `undefined` unless the `fail` middleware is used.

```javascript
// @language=javascript

app.hook('fail', (error, host, jovo) => {
	console.log(error);
});

// @language=typescript

app.hook('fail', (error: Error, host: Host, jovo: Jovo) => {
	console.log(error);
});
```

The `error` property has the following interface:

```javascript
interface Error {
	stack?: string;
}
```

### host

> [Learn more about Hosting here](../configuration/hosting './hosting').

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

### jovo

The `jovo` object is the third property, which is the same object you reference inside your handler using `this`.

Depending on the middleware you use, the object can be `undefined`, since the initialization happens inside the `platform.init` middleware.

## Middleware Execution

Each middleware can either be accessed by using its name (e.g. `platform.output`), or by prepending `before` (e.g. `before.platform.output`) or `after` (e.g. `after.platform.output`) to specify when in the order the hook should be triggered.

For example, the order of `platform.output` and the following `response` middlewares looks like this:

```text
before.platform.output
platform.output
after.platform.output

before.response
response
after.response
```

The anonymous function that you pass into the hook is then called when it is reached in the stack of middlewares.

If you need to do API calls and await them in your hooks, use `asnyc/await`:

```js
// @language=javascript

app.hook('<middleware-name>', async (error, host, jovo) => {
	let result = await yourApiCall();

	// ...
});

// @language=typescript

app.hook('<middleware-name>', async (error: Error, host: Host, jovo: Jovo) => {
	let result = await yourApiCall();

	// ...
});
```

<!--[metadata]: {
                "description": "Learn how to easily extend the Jovo Framework by using Middleware Hooks.",
		        "route": "hooks"
                }-->
