# Unit Testing for Voice Apps

> To view this page on the Jovo website, visit https://v3.jovo.tech/docs/unit-testing

To make sure your Alexa Skills and Google Actions are robust, we highly recommend testing. Learn how to implement unit tests for your voice apps built with Jovo.

- [Introduction to Unit Testing](#introduction-to-unit-testing)
- [Getting Started with the Jovo TestSuite](#getting-started-with-the-jovo-testsuite)
  - [Install Jest](#install-jest)
  - [Create Test File](#create-test-file)
  - [Run Test Script](#run-test-script)
- [Basic Concepts](#basic-concepts)
  - [Conversation](#conversation)
  - [Request](#request)
  - [Response](#response)
  - [Check](#response)
- [Advanced Concepts](#advanced-concepts)
  - [i18n Keys](#i18n-keys)
  - [User Data](#user-data)

## Introduction to Unit Testing

Unit Testing is a testing method that allows you to make sure individual units of software work as expected. This way you don't have to manually test every potential interaction of your voice app after any change you do to the code, which not only saves a lot of time, but also gives you some well deserved peace of mind.

The Jovo TestSuite allows you to create unit tests for your Alexa Skills and Google Actions that can either test certain individual features, or even full conversational sequences.

## Getting Started with the Jovo TestSuite

> Use the [Jovo Unit Testing Template](https://v3.jovo.tech/templates/unit-testing) to get started with some first tests.

Here's everything you need to know to get started:

- [Install Jest](#install-jest)
- [Create Test File](#create-test-file)
- [Run Test Script](#run-test-script)

### Install Jest

> Since Jovo v2, every new Jovo project comes with Jest as dev dependency and sample tests.

The Jovo TestSuite builds on top of [Jest](https://jestjs.io/), a popular Javascript testing framework.

You can add Jest as dev dependencies like this:

```shell
$ npm install jest --save-dev
```

### Create Test File

> [You can find an example test project here for Typescript](https://github.com/jovotech/jovo-framework/tree/master/examples/typescript/unit-testing). [Javascript Here](https://github.com/jovotech/jovo-framework/tree/master/examples/javascript/unit-testing).

Unit tests are usually located in a `test` folder of your Jovo project. Naming conventions are `<name>.test.js`.

This is how a sample `sample.test.js` file with a single test for both Amazon Alexa and Google Assistant could look like:

```javascript
// @language=javascript

'use strict';

const { App } = require('jovo-framework');
const { GoogleAssistant } = require('jovo-platform-googleassistant');
const { Alexa } = require('jovo-platform-alexa');

for (const p of [new Alexa(), new GoogleAssistant()]) {
	const testSuite = p.makeTestSuite();

	describe(`PLATFORM: ${p.constructor.name} INTENTS`, () => {
		test('should return a welcome message and ask for the name at "LAUNCH"', async () => {
			const conversation = testSuite.conversation();

			const launchRequest = await testSuite.requestBuilder.launch();
			const responseLaunchRequest = await conversation.send(launchRequest);

			expect(
				responseLaunchRequest.isAsk(
					"Hello World! What's your name?",
					'Please tell me your name.'
				)
			).toBe(true);
		});
	});
}

// @language=typescript

import { App } from 'jovo-framework';
import { GoogleAssistant } from 'jovo-platform-googleassistant';
import { Alexa } from 'jovo-platform-alexa';

for (const p of [new Alexa(), new GoogleAssistant()]) {
	const testSuite = p.makeTestSuite();

	describe(`PLATFORM: ${p.constructor.name} INTENTS`, () => {
		test('should return a welcome message and ask for the name at "LAUNCH"', async () => {
			const conversation = testSuite.conversation();

			const launchRequest = await testSuite.requestBuilder.launch();
			const responseLaunchRequest = await conversation.send(launchRequest);

			expect(
				responseLaunchRequest.isAsk(
					"Hello World! What's your name?",
					'Please tell me your name.'
				)
			).toBe(true);
		});
	});
}
```

### Run Test Script

After you've defined some first tests, add the following script to your `package.json`:

```javascript
"scripts": {
    "test": "jest"
},
```

This way, you can run the tests with `npm test`. Don't forget to first start the Jovo webhook:

```shell
// @language=javascript

# Run the development server
$ jovo3 run

# Open a new tab (e.g. cmd + t), run the script
$ npm test

// @language=typescript

# Run compile
$ npm run tsc

# Run the development server
$ jovo3 run

# Open a new tab (e.g. cmd + t), run the script
$ npm test
```

## Basic Concepts

Tests can be run for each platform:

```javascript
for (const p of [
	new Alexa(),
	new GoogleAssistant(),
	new Bixby(),
	new Autopilot(),
]) {
	// Initialize TestSuite for each platform
	const testSuite = p.makeTestSuite();

	// Add test groups here
}
```

After initializing the TestSuite, you can add test groups like this:

```javascript
describe(`GROUP`, () => {
	test('should...', async () => {
		// Add test content here
	});

	// More tests
});
```

Each test contains the following elements:

- [Conversation](#conversation)
- [Request](#request)
- [Response](#response)
- [Check](#response)

### Conversation

Each test starts with a conversation:

```javascript
// Initialize Conversation
const conversation = testSuite.conversation();
```

#### Conversation Configuration

You can also add certain configurations to the constructor of your `conversation` object.

```javascript
const conversationConfig = {
	// Overwrite default configurations here
};
const conversation = testSuite.conversation(conversationConfig);
```

Here are the configuration options:

| Name                     | Description                                                                                                                                                                                                                                                                                               | Value                    |
| :----------------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :----------------------- |
| `userId`                 | The userId of the requests. Random by default                                                                                                                                                                                                                                                             | string                   |
| `locale`                 | The locale of the requests, e.g. `en-US`                                                                                                                                                                                                                                                                  | string                   |
| `defaultDbDirectory`     | The path to the db directory for the jovo-db-filedb integration                                                                                                                                                                                                                                           | string                   |
| `deleteDbOnSessionEnded` | Determines whether the db folder should be deleted after all the tests are done                                                                                                                                                                                                                           | boolean                  |
| `runtime`                | Either `server` or `app`. If it's set to `server` the requests will be sent to the server (`http://localhost:3000/webhook` by default). With the option set to `app` the requests will be sent to the project's app object directly. That means you don't have to start server before you run your tests. | enum - `server` or `app` |
| `httpOptions`            | The options with which the request will be sent to your server. See [AxionsRequestConfig](https://github.com/axios/axios#request-config) for details.                                                                                                                                                     | object                   |

Here is a list of the default configurations of the `conversation` object:

```javascript
// Default Config

config: ConversationConfig = {
	defaultDbDirectory: './db/tests/',
	deleteDbOnSessionEnded: false,
	httpOptions: {
		headers: {
			accept: 'application/json',
			'content-type': 'application/json',
			'jovo-test': 'true',
		},
		method: 'POST',
		url: `http://localhost:${process.env.JOVO_PORT || 3000}/webhook`,
	},
	locale: 'en-US',
	runtime: 'server',
	userId: randomUserId(),
};
```

### Request

#### Request Builder

You can use the request builder of the `testSuite` to build a request. The following request types are supported:

- `launch`
- `intent`

```javascript
// Example: Create a launch request
const launchRequest = await testSuite.requestBuilder.launch();

// Example: Create an HelloWorldIntent request
const helloWorldIntentRequest = await testSuite.requestBuilder.intent(
	'HelloWorldIntent'
);

// Example Create a MyNameIsIntent request with an input
const myNameIsIntentRequest = await testSuite.requestBuilder.intent(
	'MyNameIsIntent',
	{ name: 'Joe' }
);
```

After creating a request with the request builder, you can modify with several helper methods:

```javascript
// Create an intent request
const request = await testSuite.requestBuilder.intent();

// Example: Update the user ID (default: each conversation gets a random user ID)
request.setUserId('<some-user-id>');

// Example: Set "new session" to true (default: false)
request.setNewSession(true);
```

> [Find out more about the helper methods for the Jovo `$request` object here](../basic-concepts/requests-responses/request.md './requests-responses/request').

### Response

The previously created [requests](#request) can be sent to the [conversation](#conversation). This will then return a `response`:

```javascript
const response = await conversation.send(request);

// Example: Send previously created launchRequest to conversation
const responseToLaunchRequest = await conversation.send(launchRequest);

// Example: Send previously created helloWorldIntentRequest to conversation
const responseToHelloWorldIntentRequest = await conversation.send(
	helloWorldIntentRequest
);
```

You can then used these responses to compare them to expected results (see section [Check](#check) below):

```javascript
// Example: Returns true if the response matches this.tell('Hello World!')
response.isTell('Hello World');
```

> [Find out more about the helper methods for the Jovo `$response` object here](../basic-concepts/requests-responses/response.md './requests-responses/response').

### Check

> [Learn more about Jest Expect here](https://jestjs.io/docs/en/expect).

```javascript
expect(value).toBe(value);

// Example: Launch Request should return ask
expect(
	responseToLaunchRequest.isAsk(
		"Hello World! What's your name?",
		'Please tell me your name.'
	)
).toBe(true);

// Example: Launch Request should return right speech
expect(
	responseToLaunchRequest.getSpeech("Hello World! What's your name?")
).toBe(true);
```

## Advanced Concepts

For more thorough testing, you can use the following advanced concepts:

- [i18n Keys](#i18n-keys)
- [User Data](#user-data)

### i18n Keys

When you're using the Jovo [i18n](../basic-concepts/output/i18n.md './output/i18n') or [CMS integrations](../integrations/cms './cms'), you might not want to make checks with strings like `'Hello World! What\'s your name?'` as in the examples above, as the i18n content could change, use different variations, and languages (locales).

The solution for this is to configure the conversation in a way that the CMS only returns the i18n `keys` instead of strings (`values`), which can later be checked against expected keys.

You can do this by setting the `locale` of the conversation to a random string, for example `keys-only`, in the [conversation configuration](#conversation-configuration):

```js
const conversation = testSuite.conversation({ locale: 'keys-only' });
```

For example, if you used `this.t('key')` in your app logic and now set the conversation locale to `keys-only`, the `getSpeech()` method of the unit test would (if correct) return only `key` instead of the string (`value`) stored in the CMS.

You can then use the Jest [`toMatch`](https://jestjs.io/docs/en/expect#tomatchregexporstring) method to match it to an expected key:

```js
expect(launchResponse.getSpeech()).toMatch('key');
```

If your output uses several chained keys (for example by using the [SpeechBuild `addT` method](../basic-concepts/output/speechbuilder.md#features './output/speechbuilder#features')), you can add them together like this:

```js
expect(launchResponse.getSpeech()).toMatch('keyOne ' + 'keyTwo');
```

### User Data

You can use the [conversation](#conversation) to store and retrieve user specific data as well as you would using the [Jovo User object](../basic-concepts/data/user.md#store-data './data/user#store-data'):

```js
// Store user data
conversation.$user.$data.key = value;

// Retrieve user data
let value = conversation.$user.$data.key;
```

As unit tests are run locally, this will save the data into the default [FileDB](../integrations/databases/file-db.md './databases/file-db') database.

This also allows you to access [User Meta Data](../basic-concepts/data/user.md#meta-data './data/user#meta-data'):

```js
// Get the full Meta Data object
conversation.$user.$metaData;
```

You can also delete the database for this user with the following method:

```javascript
await conversation.clearDb();
```

<!--[metadata]: { "description": "Learn how to write unit tests for Alexa Skills and Google Actions with the Jovo Framework.", "route": "unit-testing" }-->
