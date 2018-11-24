# Unit Testing for Voice Apps

To make sure your Alexa Skills and Google Actions are robust, we highly recommend testing. Learn how to implement unit tests with Jovo. 

* [Introduction to Unit Testing](#introduction-to-unit-testing)
* [Getting Started with the Jovo TestSuite](#getting-started-with-the-jovo-testsuite)
   * [Dependencies](#dependencies)
   * [TestSuite Modules](#testsuite-modules)
   * [A First Test](#a-first-test)
   * [Run Test Script](#run-test-script)
* [TestSuite Features](#testsuite-features)
   * [send](#send)
   * [RequestBuilder](#requestbuilder)
   * [UserData](#userdata)
   * [Response](#response)
   * [Record](#record)


## Introduction to Unit Testing

Unit Testing is a testing method that allows you to make sure individual units of software work as expected. This way you don't have to manually test every potential interaction of your voice app after any change you do to the code, which not only saves a lot of time, but also gives you some well deserved peace of mind.

The Jovo TestSuite allows you to create unit tests for your Alexa Skills and Google Actions that can either test certain individual features, or even full conversational sequences.



## Getting Started with the Jovo TestSuite

> Use the [Jovo Unit Testing Template](https://www.jovo.tech/templates/unit-testing) to get started with some first tests.

Here's everything you need to know to get started:
* [Dependencies](#dependencies)
* [TestSuite Modules](#testsuite-modules)
* [A First Test](#a-first-test)
* [Run Test Script](#run-test-script)

### Dependencies

The Jovo TestSuite builds on top of [Mocha](https://mochajs.org/), a popular Javascript testing framework, and [Chai](http://www.chaijs.com/), a helpful assertion library.

You can add them as dev dependencies like this:

```shell
# Install mocha, learn more:
$ npm install mocha --save-dev

# Install chai, learn more:
$ npm install chai --save-dev
```

Chai offers several methods. In our sample template, we use the following in the [`test/sample-tests.js`](https://github.com/jovotech/jovo-templates/blob/master/03_unit-testing/test/sample-tests.js) file:

```javascript
const expect = require('chai').expect;
```

### TestSuite Modules

There are two features that are important when creating unit tests with Jovo:

* `PlatformRequestBuilder`: Will help you create requests for both Alexa Skills and Google Actions that can be tested agains the app logic. Supported platforms:
   * `AlexaSkill`
   * `GoogleActionDialogFlowV2` (Dialogflow API v2)
   * `GoogleActionDialogFlow` (Dialogflow API v1)
* `send`: TestSuite feature to send the created requests to the Jovo webhook

In the sample template's [`test/sample-tests.js`](https://github.com/jovotech/jovo-templates/blob/master/03_unit-testing/test/sample-tests.js), they are integrated like this:

```javascript
const getPlatformRequestBuilder = require('jovo-framework').util.getPlatformRequestBuilder;
const {send} = require('jovo-framework').TestSuite;
```

### A First Test

Use the `getPlatformRequestBuilder` to access the request builders for the platforms that you need:

```javascript
for (let rb of getPlatformRequestBuilder('AlexaSkill', 'GoogleActionDialogFlowV2')) {

    // Add tests here

}
```

Inside this `for` loop, you can add any test or test group like this:

```javascript
describe('GROUP', () => {
    it('should ...', () => {
        return send(rb.intent('SomeIntent'))
            .then((res) => {
                const matchedResponse = res.isTell('Some speech.');
                expect(matchedResponse).to.equal(true);
            })
    })

    // Add more it's for this group here
})
```

For example, a test that simulates a full conversation flow could look like this (from the sample template [`test/sample-tests.js`](https://github.com/jovotech/jovo-templates/blob/master/03_unit-testing/test/sample-tests.js)):

```javascript
for (let rb of getPlatformRequestBuilder('AlexaSkill', 'GoogleActionDialogFlowV2')) {

    describe('CONVERSATIONS', () => {
            // Launch -> MyNameIsIntent
            it('should run the whole conversation flow and greet the user with the correct name', () => {
                return send(rb.launch())
                    .then((res) => {
                        const matchesResponse = res.isAsk('Hello World! What\'s your name?', 'Please tell me your name.');
                        expect(matchesResponse).to.equal(true);
                        return send(rb.intent('MyNameIsIntent', {name: 'Chris'}));
                    })
                    .then((res) => {
                        const matchesResponse = res.isTell('Hey Chris, nice to meet you!');
                        expect(matchesResponse).to.equal(true);
                    });
            });

            // Launch -> HelloWorldIntent
            it('should ask for the name again if user responds with something else', () => {
                return send(rb.launch())
                    .then((res) => {
                        expect(res.isAsk('Hello World! What\'s your name?', 'Please tell me your name.')).to.equal(true);
                        return send(rb.intent('HelloWorldIntent'));
                    })
                    .then((res) => {
                        const matchesResponse = res.isAsk('What\'s your name?');
                         expect(matchesResponse).to.equal(true);
                    });
            });
        });
    });
}
```

### Run Test Script

After you've defined some first tests, add the following script to your `package.json`:

```javascript
"scripts": {
    "test": "mocha test --recursive"
},
```

This way, you can run the tests with `npm test`, but don't forget to first start the Jovo webhook:

```shell
# Run the development server
$ jovo run

# Open a new tab (e.g. cmd + t), run the script
$ npm test
```

## TestSuite Features

Learn more about all the TestSuite features:

* [send](#send)
* [RequestBuilder](#requestbuilder)
* [UserData](#userdata)
* [Response](#response)
* [Record](#record)

### send

The main component of the TestSuite is the function `send()`. With it, the user is able to send specific requests to the running Jovo App.

```javascript
it('should successfully go into LaunchIntent for ' + rb.type(), function (done) {
    send(rb.launch())
        .then((res) => {
            expect(res.isAsk('Hello World! What\'s your name?', 'Please tell me your name.')).to.equal(true);
            done();
        });
});
```

`send()` returns a Promise, which means that you can nest multiple requests for a whole simulated conversation flow according to the Promise concept.

```javascript
send(rb.launch())                                                               // send launch request
    .then((res) => {
        expect(res.isAsk('Hello World! What\'s your name?', 'Please tell me your name.')).to.equal(true);
        return send(rb.intent('MyNameIsIntent', {name: 'John'}))                // send intent request with slot name=John
    })
    .then((res) => {
        expect(res.isTell('Hey John, nice to meet you!')).to.equal(true);
        done();
    });
```

Apart from using the RequestBuilder for defining request intents, you can also build your own JSON request object and pass it to `send()`. Be careful with this though, as an invalid request object will fail. Alternatively, you can pass the object as an argument to `rb.intent(object)` to access the requestbuilder functions on your own object. Keep in mind, that you cannot pass an AlexaRequest into the GoogleActionRequestBuilder and vice versa. Passing your own object as the parameter works for every request option that the RequestBuilder offers.

```javascript
let requestObj = {
    'version': '1.0',
    'session': {
        ...
    },
    ...
};

send(rb.intent(requestObj));
```

### RequestBuilder
The RequestBuilder can be used to build intentRequests easily with respective functions.

#### Launch
This sends a basic LaunchRequest to your voice app, hence simulates the start of your voice application.

```javascript
send(rb.launch());
```

#### Intent

```javascript
send(rb.intent());
```
This sends a default intentRequest with the intentName 'HelpIntent'. You can specify the intentName by passing it into `intent('intentName')` as the first parameter or by calling `intent().setIntentName('intentName')`. Slots/Parameters can be added as well by passing them as an object as the second parameter in `intent('intentName', {key: 'value'})` or by using the method `intent().addInput('key', 'value')`.

### Access Token

```javascript
send(rb.intent().setAccessToken(YourTestTokenValue));
```
If you have account linking set up and need to pass in an access token to interact with your intents, you can use this method to attach the `accessToken` property with the value you pass in to `setAccessToken(Value)` to the `user` property in the request.

#### Session Attributes
Although session attributes are applied automatically, you may want to go straight to a specific intent without calling the whole conversation flow before. For this situation, you can call `rb.intent().setSessionAttribute('key', 'value')` to specify session attributes. As a shortcut for only setting a specific state, you have the option to use `setState('stateName')`. If you want to add multiple session attributes at once, you can pass them as an object:

```javascript
let sessionAttributes = {
    'STATE': 'TestState',
    'key': 'value',
};

send(rb.intent().setSessionAttributes(sessionAttributes)
    .then((res) => {
        ...
    });
```

#### setSessionNew
To simulate a new session, you can call `rb.intent().setSessionNew(true)`. Per default, `rb.intent()` won't represent a new session.

#### setType
To alter the type of a request, use `rb.intent().setType('type')`. This only works for Alexa.

#### Alexa Specifics
##### AudioPlayer Directives
To send AudioPlayer Directives to your voice app, you can build the request object with `rb.audio()`. You can specify the directive by passing it as the parameter `rb.audio('PlaybackStopped')` or by calling `setType('AudioPlayer.PlaybackStopped')`.

##### Error
To simulate an error sent to your application, you can call `rb.error()`.

##### Skill Event
If your skill is for instance disabled, a SkillEventRequest is sent to let your app know about it. To simulate that, use `rb.skillEvent()`. To alter the type of the skillEvent, pass it as a parameter or call `setType('AlexaSKillEvent.SkillDisabled')` like shown above for AudioPlayer Directives.

##### DisplayRequest
To simulate a display event, that occurres when for example a user touches the display of an Echo Show. Simply call `rb.touch()`. To alter the type of the skillEvent, pass it as a parameter or call `setType('Display.ElementSelected)` like shown above for AudioPlayer Directives.


### UserData
Per default, user data is stored in a file `./db/db.json`. All methods available from our TestSuite to add/update/read/delete user data access this file through the configuration set in `./app/app.js`. If you want to test your application with a different file, you can specify this in `./app/app.js`:

```javascript
const config = {
    db: {
        type: 'file',
        localDbFilename: 'test_db'
    }
};
```

For accessing data across sessions, you can add user data to your user.

```javascript
addUserData(rb.intent().getUserId(), 'key', 'value');
```

This method expects a userId as the first parameter, to identify the user. For the default id, that comes with the default intent ```rb.intent()```, you can simply call `rb.intent().getUserId()` or pass it as a string. If you built your own intent request, you can pass it to `rb.intent()` like shown above and call `getUserId()`:

```javascript
let requestObj = {
    'version': '1.0',
    'session': {
        ...
    },
    ...
}

let intentRequest = rb.intent(requestObj);
addUserData(intentRequest.getUserId(), 'key', 'value');
send(intentRequest)
    .then((res) => {
        ...
    });
``` 

To set the userId, call `rb.intent().setUserId('userId');`.

If you want to add user data between two requests, you can nest `addUserData()` with `send()`.

```javascript
 send(rb.launch())
    .then(() => {
        addUserData(rb.intent().getUserId(), 'key', 'value');              // get the default user id
        return send(rb.intent('CheckForUserDataIntent'));                  // return the send promise
    })
    .then((res) => {
        expect(res.isTell('value')).to.equal(true);
        done();
    })
```

You can also add a new user by passing a user object to `addUser(userObject)`.

If you want to check if some data is stored for a specific user, use `getUserData('userId', 'key')` to receive the value or `getUserData('userId')` to get all data for the specified user.

It is recommended to delete the user or remove specific user data after your test. This way you can assure, that the next test runs independently.

If you want to remove specific user data, call `removeUserData('userId', 'key')` or just `removeUserData('userId')` to remove all data for the specified user. If you want to remove a whole user, you can use `removeUser('userId')`, or `removeUser()` to delete all users.

### Response
If you want to access the final response object from your workflow, `send()` returns a variable `res`, presenting a ResponseObject with respective functions. You can call these and expect a certain value from them, using expect from the Chai Assertion Library per default. Of course, you are free to use any other assertion methods.

```javascript
send(req.launch())
    .then((res) => {
        expect(res.isTell('value')).to.equal(true);
        done();
    });
```

#### isTell
This method checks, if the response is a tell and compares the given parameter with the actual value, returning true if this is the case.

```javascript
expect(res.isTell('Hello World')).to.equal(true);
```  

If you have dynamic values in your code (e.g. `this.tell(['Hello World', 'Hey World']);`), you can check for these values by passing the same array in `isTell()`.

```javascript
expect(res.isTell(['Hello World', 'Hey World'])).to.equal(true);
```

#### isAsk

`isAsk()` works the same way as `isTell()`, except with 2 parameters instead of just one (for reprompts).

```javascript
expect(res.isAsk('Hello World! What\'s your name?', 'Please tell me your name.')).to.equal(true);
```

This works with dynamic values as well.

#### hasSessionAttribute
Check if a specific session attribute has been delivered with the response.

```javascript
expect(res.hasSessionAttribute('key', 'value')).to.equal(true);
```

Alternatively, if you just want to check if the response includes any session attributes, use `res.hasSessionAttributes()`.

Again, a shortcut to check if your response contains a specific state would be `res.hasState('state')`.

#### getShouldEndSession
Checks if the session should end.

```javascript
expect(res.getShouldEndSession()).to.equal(true);
```

### Record
We offer you the possibility to record your requests and responses while testing your app in the console or per voice. For that, add the following parameter to your cli command:

```shell
$ jovo run --record <name>

## Short version
$ jovo run -r <name>
```

These will be stored in `./test/recordings/{name}/{platform}/`. To access these files, you can use the `require()` function:

```javascript
send(require('./recordings/HelloWorld/AlexaSkill/01_req_LAUNCH'))
	.then((res) => {
    	...
    });
```
You also have the possibility to pass them as a parameter to the respective RequestBuilder funciton to access specific methods, to alter your object:

```javascript
send(rb.intent(require('./recordings/HelloWorld/GoogleAction/03_req_HelpIntent')).setSessionAttribute('key', 'value'))
    .then((res) => {
        ...
    });
```



<!--[metadata]: {"title": "Unit Testing for Voice Apps", 
                "description": "Learn how to write unit tests for Alexa Skills and Google Actions with the Jovo Framework.",
                "activeSections": ["advanced", "advanced_testing"],
                "expandedSections": "advanced",
                "inSections": "advanced",
                "breadCrumbs": {"Docs": "docs/",
				"Advanced Features": "docs/advanced",
                "Unit Testing": ""
                                },
		"commentsID": "framework/docs/unit-testing",
		"route": "docs/unit-testing"
                }-->
