# Logging

> To view this page on the Jovo website, visit https://v3.jovo.tech/docs/data/logging

In this section, you will learn how to log certain data in your Jovo app.

- [Introduction](#introduction)
- [Basic Logging](#basic-logging)
  - [Log Requests](#log-requests)
  - [Log Responses](#log-responses)
- [Jovo Logger](#jovo-logger)
  - [Log Levels](#log-levels)
  - [Using the Jovo Logger in your App](#using-the-jovo-logger-in-your-app)
  - [Appenders](#appenders)
- [Logging Helpers](#logging-helpers)

## Introduction to Logging

When you're using a local webhook, it's easy to use logging for debugging, like this:

```javascript
console.log('This is going to appear in the logs');
```

For voice app specific debugging, Jovo offers some handy functions for logging incoming requests and outgoing responses:

- [Basic Logging](#basic-logging)
- [Jovo Logger](#jovo-logger)
- [Logging Helpers](#logging-helpers)

## Basic Logging

You can enable logging by using the following:

```javascript
// @language=javascript

// src/config.js

module.exports = {
	logging: true,

	// ...
};

// @language=typescript

// src/config.ts

const config = {
	logging: true,

	// ...
};
```

This will enable both [Request Logging](#log-requests) and [Response Logging](#log-responses), which can also be enabled separately. For this, see the sections below.

### Log Requests

You can log the incoming JSON requests by adding the following configuration:

```javascript
// @language=javascript

// src/config.js

module.exports = {
	logging: {
		request: true,
	},

	// ...
};

// @language=typescript

// src/config.ts

const config = {
	logging: {
		request: true,
	},

	// ...
};
```

The result looks like this (data changed):

```javascript
// Amazon Alexa Request Example
{
  "version": "1.0",
  "session": {
    "new": true,
    "sessionId": "amzn1.echo-api.session.c4551117-1708-446e-a2b2-bg12d2913e3a",
    "application": {
      "applicationId": "amzn1.ask.skill.f5c2b3f3-35e6-4c69-98e1-11e75ee6745b"
    },
    "user": {
      "userId": "amzn1.ask.account.AGJCMQPNU2XQWLNJXU2KXDSTRSDTRDSDSDW4SDVT5DLTZKUH2J25I37N3MP2GDCHO7LL2JL2LVN6UFJ6Q2GEVVKL5HNHOWBBD7ZQDQYWNHYR2BPPWJPTBPBXPIPBVFXA"
    }
  },
  "context": {
    "AudioPlayer": {
      "playerActivity": "IDLE"
    },
    "System": {
      "application": {
        "applicationId": "amzn1.ask.skill.f5c2b3f3-35e6-4c69-98e1-bg12d2913e3a"
      },
      "user": {
        "userId": "amzn1.ask.account.AGJCMQPNU2XQWXDSTRSDTRDSDSDW4SDVT5DOX7YK7W57E7HVZJSLH4F5U2JOLYELR4PTQQJTRJECVPYHMRG36CUUAY3G5QI5QFNDZ44V5RGUCNTRHAVT5DLTZKUH2J25I37N3MP2GDCHO7LL2JL2LVN6UFJ6Q2GEVVKL5HNHOWBBD7ZQDQYWNHYR2BPPWJPTBPBXPIPBVFXA"
      },
      "device": {
        "deviceId": "amzn1.ask.device.AHFATCOCAYDNSDENR7YISGVX2DGRIR3HJHIR47IMLSKZ4TPDRTKBX6AHD2RAIGRMI3WIBMWSUMM3A7JMI5GABHMABUETZWISVZTDDUK3TMVWTGSWQ2BU5VHOIL7KFYFLC6C3YDEMBMHJQOCXRBA",
        "supportedInterfaces": {
          "AudioPlayer": {}
        }
      },
      "apiEndpoint": "https://api.amazonalexa.com"
    }
  },
  "request": {
    "type": "IntentRequest",
    "requestId": "amzn1.echo-api.request.5c96e32a-d803-4ba0-ba04-4293ce23ggf1",
    "timestamp": "2017-07-03T09:56:44Z",
    "locale": "en-US",
    "intent": {
      "name": "HelloWorldIntent",
      "confirmationStatus": "NONE"
    }
  }
}
```

As you can see above, the logs of a request are quite long and impractical, if you only need certain information. With `requestObjects`, you can limit the log output to specific objects.

```javascript
// @language=javascript

// src/config.js

module.exports = {
	logging: {
		request: true,
		requestObjects: ['request', 'context.System.user'],
	},

	// ...
};

// @language=typescript

// src/config.ts

const config = {
	logging: {
		request: true,
		requestObjects: ['request', 'context.System.user'],
	},

	// ...
};
```

The example for `request` above will reduce the log output to this:

```javascript
// Amazon Alexa Request Example
"type": "IntentRequest",
"requestId": "amzn1.echo-api.request.5c96e32a-d803-4ba0-ba04-4293ce23ggf1",
"timestamp": "2017-07-03T09:56:44Z",
"locale": "en-US",
"intent": {
  "name": "HelloWorldIntent",
  "confirmationStatus": "NONE"
}
```

### Log Responses

You can log the outgoing JSON responses by adding the following configuration:

```javascript
// @language=javascript

// src/config.js

module.exports = {
	logging: {
		response: true,
	},

	// ...
};

// @language=typescript

// src/config.ts

const config = {
	logging: {
		response: true,
	},

	// ...
};
```

The result looks like this:

```js
// Amazon Alexa Response Example
{
  "version": "1.0",
  "response": {
    "shouldEndSession": true,
    "outputSpeech": {
      "type": "SSML",
      "ssml": "<speak>Hello World!</speak>"
    }
  },
  "sessionAttributes": {}
}
```

Similar to `requestLoggingObjects`, you can limit the response logging output to specific objects, as well.

```javascript
// @language=javascript

// src/config.js

module.exports = {
	logging: {
		response: true,
		responseObjects: ['response'],
	},

	// ...
};

// @language=typescript

// src/config.ts

const config = {
	logging: {
		response: true,
		responseObjects: ['response'],
	},

	// ...
};
```

The example above will reduce the log output to this:

```js
// Amazon Alexa Request Example
"shouldEndSession": true,
"outputSpeech": {
  "type": "SSML",
  "ssml": "<speak>Hello World!</speak>"
}
```

## Jovo Logger

> Find the source code of the Jovo Logger here: [jovo-core/Log](https://github.com/jovotech/jovo-framework/blob/master/jovo-core/src/Log.ts).

Jovo has an internal logging class that can be used to display certain levels of logs.

- [Log Levels](#log-levels)
- [Using the Jovo Logger in your App](#using-the-jovo-logger-in-your-app)
- [Appenders](#appenders)

### Log Levels

You can set the log level by adding an environment variable, for example in your `app.js` file:

```js
// @language=javascript

// src/app.js

process.env.JOVO_LOG_LEVEL = 'VERBOSE';

// @language=typescript

// src/app.ts

process.env.JOVO_LOG_LEVEL = 'VERBOSE';
```

The following log levels are supported:

- `ERROR`: Only display errors
- `WARN`: Display warnings and errors
- `INFO`: Display infos, warnings, and errors (`default`)
- `VERBOSE`: Display additional information, e.g. when certain middlewares are executed
- `DEBUG`: Display all information, even configs that might include sensitive data (like API keys). Only recommended to use while debugging

### Using the Jovo Logger in your App

You can use the Jovo `Log` class in your app logic to log certain things for different levels.

First, import the class into your project:

```js
// @language=javascript

// src/app.js

const { Log } = require('jovo-core');

// @language=typescript

// src/app.ts

import { Log } from 'jovo-core';
```

You can then use it in your app logic to log things for different levels:

```js
// @language=javascript

app.setHandler({
	SomeIntent() {
		Log.info('This is an info log');
		Log.verbose('This is a verbose log');
	},

	// ...
});

// @language=typescript

app.setHandler({
	SomeIntent() {
		Log.info('This is an info log');
		Log.verbose('This is a verbose log');
	},

	// ...
});
```

You can use the following [log levels](#log-levels) for this:

- `Log.error`
- `Log.info`
- `Log.warn`
- `Log.verbose`
- `Log.debug`

#### Formatting

You can also use helpers to format the log output, like this:

```js
// @language=javascript

app.setHandler({
	SomeIntent() {
		Log.green().info('This is a green info log');
		Log.red().bold().info('This is a red and bold info log');
	},

	// ...
});

// @language=typescript

app.setHandler({
	SomeIntent() {
		Log.green().info('This is a green info log');
		Log.red().bold().info('This is a red and bold info log');
	},

	// ...
});
```

The following methods are available:

- Font colors
  - `black()`
  - `red()`
  - `green()`
  - `yellow()`
  - `blue()`
  - `magenta()`
  - `cyan()`
  - `white()`
- Background colors
  - `blackBackground()`
  - `redBackground()`
  - `greenBackground()`
  - `yellowBackground()`
  - `magentaBackground()`
  - `cyanBackground()`
  - `whiteBackground()`
- Other formatting
  - `underscore()`
  - `bold()`
  - `dim()`
  - `blink()`
  - `reverse()`

### Appenders

You can also define log appenders. For example, the below code imports the `Log` and `LogLevel` classes and then adds a file appender (save logs to a file with a specified name, in this case `errors.log`) for a certain log level (in this case `ERROR`):

```js
// @language=javascript

// src/app.js

const { Log, LogLevel } = require('jovo-core');

Log.addFileAppender('errors.log', { logLevel: LogLevel.ERROR });

// @language=typescript

// src/app.ts

import { Log, LogLevel } from 'jovo-core';

Log.addFileAppender('errors.log', { logLevel: LogLevel.ERROR });
```

## Logging Helpers

If you find yourself searching for that one log that is buried somewhere in all the request and response logs, you can use the following helper method:

```js
console.dd('Log something');
```

The `dd` is short for "dump and die," which means that the execution ends after this log. This helper is inspired by [Laravel's `dd()`](https://laravel.com/docs/5.7/helpers).

<!--[metadata]: {"description": "Learn how to log certain data in your Jovo app.", "route": "data/logging"}-->
