# Unit Testing for Voice Apps

To make sure your Alexa Skills and Google Actions are robust, we highly recommend testing. Learn how to implement unit tests for your voice apps built with Jovo. 

* [Introduction to Unit Testing](#introduction-to-unit-testing)
* [Getting Started with the Jovo TestSuite](#getting-started-with-the-jovo-testsuite)
    * [Install Jest](#install-jest)
    * [Create Test File](#create-test-file)
    * [Run Test Script](#run-test-script)
* [Basic Concepts](#basic-concepts)
    * [Conversation](#conversation)
    * [Request](#request)
    * [Response](#response)
    * [Check](#response)
    * [Data](#data)


## Introduction to Unit Testing

Unit Testing is a testing method that allows you to make sure individual units of software work as expected. This way you don't have to manually test every potential interaction of your voice app after any change you do to the code, which not only saves a lot of time, but also gives you some well deserved peace of mind.

The Jovo TestSuite allows you to create unit tests for your Alexa Skills and Google Actions that can either test certain individual features, or even full conversational sequences.



## Getting Started with the Jovo TestSuite

> Use the [Jovo Unit Testing Template](https://www.jovo.tech/templates/unit-testing) to get started with some first tests.

Here's everything you need to know to get started:
* [Install Jest](#install-jest)
* [Create Test File](#create-test-file)
* [Run Test Script](#run-test-script)

### Install Jest

> Since Jovo v2, every new Jovo project comes with Jest as dev dependency and sample tests. 

The Jovo TestSuite builds on top of [Jest](https://jestjs.io/), a popular Javascript testing framework.

You can add Jest as dev dependencies like this:

```shell
$ npm install jest --save-dev
```

### Create Test File

> [You can find an example test project here](https://github.com/jovotech/jovo-framework-nodejs/tree/master/examples/unit-testing).

Unit tests are usually located in a `test` folder of your Jovo project. Naming conventions are `<name>.test.js`.

This is how a sample `sample.test.js` file with a single test for both Amazon Alexa and Google Assistant could look like:

```javascript
'use strict';

const { App } = require('jovo-framework');
const { GoogleAssistant } = require('jovo-platform-googleassistant');
const { Alexa } = require('jovo-platform-alexa');

for (const p of [new Alexa(), new GoogleAssistant()]) {
    const testSuite = p.makeTestSuite();

    describe(`PLATFORM: ${p.constructor.name} INTENTS` , () => {
        test('should return a welcome message and ask for the name at "LAUNCH"', async () => {
            const conversation = testSuite.conversation();

            const launchRequest = await testSuite.requestBuilder.launch();
            const responseLaunchRequest = await conversation.send(launchRequest);

            expect(
                responseLaunchRequest.isAsk('Hello World! What\'s your name?', 'Please tell me your name.')
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
# Run the development server
$ jovo run

# Open a new tab (e.g. cmd + t), run the script
$ npm test
```

## Basic Concepts

Tests can be run for each platform:

```javascript
for (const p of [new Alexa(), new GoogleAssistant()]) {
    // Initialize TestSuite for each platform
    const testSuite = p.makeTestSuite();

    // Add test groups here
}
```

After initializing the TestSuite, you can add test groups like this:

```javascript
describe(`GROUP` , () => {
    test('should...', async () => {
        // Add test content here
    });

    // More tests
});
```

### Conversation

Each test starts with a conversation:

```javascript
// Initialize Conversation
const conversation = testSuite.conversation();
```

#### Conversation Configuration

You can also add certain configurations to the constructor of your `conversation` object.

```javascript
// Initialize Conversation
const conversationConfig = {
    // Overwrite default configurations here
};
const conversation = testSuite.conversation(conversationConfig);

// Example: Use different PORT for the Jovo Webhook
const conversationConfig = {
    httpOptions: { 
        port: PORT,
    },
};
const conversation = testSuite.conversation(conversationConfig);

// Example in short
const conversation = testSuite.conversation({httpOptions: { port: PORT }});
```
Here is a list of the default configurations of the `conversation` object:

```javascript
// Default Config

config: ConversationConfig = {
    userId: randomUserId(),
    locale: 'en-US',
    defaultDbDirectory: './db/tests/',
    httpOptions: {
        host: 'localhost',
        port: 3000,
        path: '/webhook',
        method: 'POST',
        headers: {
            'accept': 'application/json',
            'content-type': 'application/json',
            'jovo-test': 'true'
        },
    },
};
```

### Request

#### Request Builder

You can use the request builder of the `testSuite` to build a request. The following request types are supported:

* `launch`
* `intent`

```javascript
// Example: Create a launch request
const launchRequest = await testSuite.requestBuilder.launch();

// Example: Create an HelloWorldIntent request
const helloWorldIntentRequest = await testSuite.requestBuilder.intent('HelloWorldIntent');

// Example Create a MyNameIsIntent request with an input
const myNameIsIntentRequest = await testSuite.requestBuilder.intent('MyNameIsIntent', { name: 'Joe' });
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

> [Find out more about the helper methods for the Jovo `$request` object here](../basic-concepts/requests-responses/request.md './requests-responses/request).


### Response

The previously created [requests](#request) can be sent to the [conversation](#conversation). This will then return a `response`:

```javascript
const response = await conversation.send(request);

// Example: Send previously created launchRequest to conversation 
const responseToLaunchRequest = await conversation.send(launchRequest);

// Example: Send previously created helloWorldIntentRequest to conversation
const responseToHelloWorldIntentRequest = await conversation.send(helloWorldIntentRequest);
```

You can then used these responses to compare them to expected results (see section [Check](#check) below):

```javascript
// Example: Returns true if the response matches this.tell('Hello World!')
response.isTell('Hello World')
```

> [Find out more about the helper methods for the Jovo `$response` object here](../basic-concepts/requests-responses/response.md './requests-responses/response).


### Check

> [Learn more about Jest Expect here](https://jestjs.io/docs/en/expect).

```javascript
expect(value).toBe(value);

// Example: Launch Request should return ask
expect(
    responseToLaunchRequest.isAsk('Hello World! What\'s your name?', 'Please tell me your name.')
        ).toBe(true);

// Example: Launch Request should return right speech
expect(
    responseToLaunchRequest.getSpeech('Hello World! What\'s your name?')
        ).toBe(true);
```


### Data

Delete the database for this user with the following method:

```javascript
await conversation.clearDb();
```




<!--[metadata]: { "description": "Learn how to write unit tests for Alexa Skills and Google Actions with the Jovo Framework.", "route": "unit-testing" }-->
