# Unit Testing for Voice Apps

To make sure your Alexa Skills and Google Actions are robust, we highly recommend testing. Learn how to implement unit tests with Jovo. 

* [Introduction to Unit Testing](#introduction-to-unit-testing)
* [Getting Started with the Jovo TestSuite](#getting-started-with-the-jovo-testsuite)
    * [Install Jest](#install-jest)
    * [Create Test File](#create-test-file)
    * [Run Test Script](#run-test-script)
* [Basic Concepts](#basic-concepts)


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

The Jovo TestSuite builds on top of [Jest](https://jestjs.io/), a popular Javascript testing framework.

You can add them as dev dependencies like this:

```shell
$ npm install jest --save-dev
```

### Create Test File

Unit tests are usually located in a `test` folder of your Jovo project. This is how a sample `test.js` file with a single test for both Amazon Alexa and Google Assistant could look like:

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
});
```


<!--[metadata]: { "description": "Learn how to write unit tests for Alexa Skills and Google Actions with the Jovo Framework.", "route": "unit-testing" }-->
