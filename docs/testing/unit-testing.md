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

#### Request Setters

After creating a request with the request builder, you can modify with several helper methods:

```javascript
// Create an intent request
const request = await testSuite.requestBuilder.intent();

// Example: Update the user ID (default: each conversation gets a random user ID)
request.setUserId('<some-user-id>');

// Example: Set "new session" to true (default: false)
request.setNewSession(true);
```

Here is a list of all available helper methods:

| Method        | Description        | 
| ------------- |-------------| 
| `setIntentName(intentName: string)` | Set the intent name for intent requests. | 
| `setInputs(inputs: Inputs)` | Set input objects of `name`, `key`, `value`, and `id`. [Learn more about input here](../basic-concepts/routing/input.md './routing/input'). |
| `setUserId(userId: string)` | Specifies the User ID of the request. Default is a random string. | 
| `setTimestamp(timestamp: string)` | Set the timestamp of the request. Example: `2015-05-13T12:34:56Z`. | 
| `setLocale(locale: string)` | Set the locale (language) of the request. Default: `en-US`. | 
| `setAccessToken(accessToken: string)` | Add an access token to the request.  | 
| `setNewSession(isNew: boolean)` | Makes this request the first interaction of a session. Default for launch requests. This option turns intent requests into a "deep invocation" (e.g. "Alexa, ask X to do Y") | 
| `setAudioInterface()` | Add audio as supported interface. | 
| `setScreenInterface()` | Add screen as supported interface. | 
| `setVideoInterface()` | Add video as supported interface. | 
| `setSessionData(sessionData: SessionData)` | Adds session data (also known as session attributes), replaces previous data. [Learn more about session data here](../basic-concepts/data#session-data './data#session-data'). | 
| `addSessionData(key: string, value: any)` | Adds additional element to the session data (also known as session attributes). | 
| `setState(state: string)` | Set the state (which is the same as session data `_JOVO_STATE_`). [Learn more about states here](../basic-concepts/routing/states.md './routing/states').  | 

Note: "New Session" requests can't have any Session Data or States.

You can also modify the request objects by directly writing into them. This, however, would require to make different adjustments for each platforms, as paths and namings differ.

#### Request Getters

Here is a list of all available helper methods to get data from a request:

| Method        | Description        | 
| ------------- |-------------| 
| `getIntentName(): string | undefined` | Get the intent name for intent requests. `undefined` for launch requests. | 
| `getInputs(): Inputs` | Get inputs (slots, parameter) of the request. [Learn more about input here](../basic-concepts/routing/input.md './routing/input'). | 
| `getUserId(): string` | Get the User ID of the request. | 
| `getTimestamp(): string` | Get the timestamp of the request. Example: `2015-05-13T12:34:56Z`. | 
| `getLocale(): string` | Get the locale (language) of the request. Example: `en-US`. | 
| `getAccessToken(): string | undefined` | Get an access token to the request. | 
| `isNewSession(): boolean` | Returns true for new sessions (launch requests or deep invocations). | 
| `hasAudioInterface(): boolean` | Returns true if the device supports audio. | 
| `hasScreenInterface(): boolean` | Returns true if the device has a screen. | 
| `hasVideoInterface(): boolean` | Returns true if the device supports video. | 
| `getSessionData(): SessionData` | Get session data (also known as session attributes), replaces previous data. [Learn more about session data here](../basic-concepts/data#session-data './data#session-data'). | 
| `getState(): string` | Get the state (which is the same as session data `_JOVO_STATE_`). [Learn more about states here](../basic-concepts/routing/states.md './routing/states'). | 


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

You can use these cross-platform helper methods:

| Method        | Description        | 
| ------------- |-------------| 
| `getSpeech(): string` | Returns speech text without "speak" and tags. | 
| `getReprompt(): string` | Returns reprompt text without "speak" tags. | 
| `hasSessionData(name: string, value?: any): boolean` | Checks if response has a specific session attribute in it.
| `getSessionData(): SessionData | undefined` | Returns session data. [Learn more about session data here](../basic-concepts/data#session-data './data#session-data'). | 
| `isTell(speech?: string): boolean` | Checks if response has tell in it. | 
| `isAsk(speech?: string, reprompt?: string): boolean` | Checks if response has ask in it. | 
| `hasState(state: string): boolean | undefined` | Checks if response has a state in it. | 
| `hasSessionEnded(): boolean` | Checks if session ended. |



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
