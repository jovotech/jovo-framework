# [App Logic](../) > Data

In this section, you will learn how to deal with entities and slot values provided by your users, and also store and retrieve user specific data with the User class.

* [Introduction to User Input](#introduction-to-user-input)
* [How to Access Input](#how-to-access-input)
  * [Input as Parameter](#input-as-parameter)
  * [getInput | getInputs](#getinput)
  * [inputMap](#inputmap)
* [User Object](#user-object)
  * [Platform Type](#platform-type)
* [Logging](#logging)
  * [Log Requests](#log-requests)
  * [Log Responses](#log-responses)
* [Persisting Data](#persisting-data)
  * [Session Attributes](#session-attributes)
  * [Database Integrations](#database-integrations)

## Introduction to User Input

> If you're new to voice applications, you can learn more about general principles like slots and entities here: [Getting Started > Voice App Basics](https://github.com/jovotech/jovo-framework-nodejs/tree/master/docs/01_getting-started/voice-app-basics.md).

We call user input any additional information your user provides besides an `intent`. On Amazon Alexa, input is usually called a `slot`, on Google Assistant/Dialogflow an `entity` or `parameter`.


## How to Access Input

There are two ways to get the inputs provided by a user: either by [adding parameters](#input-as-parameter) to  your `handlers` intent functions, or by using the [`getInput`](#getinput) method.

### Input as Parameter
You can access input by adding parameters directly to your intent, like so:
```javascript
const handlers = {

    // Other Intents and States

    'SomeIntent': function(inputNameOne, inputNameTwo) {
        // Do something
    }

    // Other Intents and States
};
```

Two important things to consider when using this option:
* The parameter names need to be the same as the slot/entity names on the respective developer consoles at Amazon and Dialogflow
* The incoming names are matched to `camelCase`, for example `given-name` can be accessed with a `givenName` parameter.


### getInput

You can either access the values of all user inputs with the `getInputs` method, or get specific values directly with `getInput('inputName')`.

```javascript
const handlers = {

    // Other Intents and States

    'SomeIntent': function() {
        // Get all inputs
        let inputs = app.getInputs();

        // Get input for a single slot or entity
        let value = app.getInput('inputName');

        // Do something
    }

    // Other Intents and States
};
```

### inputMap

Similar to [`intentMap`](https://github.com/jovotech/jovo-framework-nodejs/tree/master/docs/03_app-logic/routing/#intentmap), there are cases where it might be valuable (due to naming conventions on different platforms or built-in input types) to map different input entities to one defined Jovo `inputName`. You can add this to the configuration section of your voice app:

```javascript
// Create above webhook.post (webhook) or exports.handler (Lambda)
let myInputMap = { 
    'incomingInputName' : 'mappedInputName',
};

// Use setter
app.setInputMap(myInputMap);

// Use setConfig
app.setConfig({
    inputMap: myInputMap,
    // Other configurations
});
```

Example: You want to ask your users for their name and created a slot called `name` on the Amazon Developer Platform. However, on Dialogflow, you decided to use the pre-defined entity `given-name`. You can now use an inputMap to match incoming inputs from Alexa and Google.

```javascript
// Map Dialogflow standard parameter given-name with name
app.setConfig({
    inputMap: { 'given-name' : 'name', },
    // Other configurations
});
```

With this, you can use `name` as a parameter in your intent function:

```javascript
const handlers = {

    // Other Intents and States

    'MyNameIsIntent': function(name) {
        app.tell('Hello ' + name + '!');
    }

    // Other Intents and States
};
```

## User Object

Besides conversational parameters, there is also additional information that is not explicitly provided by a user, like which device they are using, or their ID. Learn more about different types of implicit user input in this section.

For retrieving and storing this type of information, the Jovo `User Class` can be used to create more contextual and adaptive experiences based on user specific data.

The user object can be accessed like this:

```javascript
let user = app.user();
```

You can find more information here: [App Logic > Data > User](https://github.com/jovotech/jovo-framework-nodejs/tree/master/docs/03_app-logic/02_data/user.md).

### Platform Type

Want to see which platform your user is currently interacting with? With `getType`, you can get exactly this.

```javascript
app.getType();
```

This is going to return a type that looks like this:

```javascript
// For Amazon Alexa
AlexaSkill

// For Google Assistant
GoogleAction
```


## Logging

When you’re using a webhook and ngrok, it’s easy to use logging for debugging, like this:

```javascript
console.log('This is going to appear in the logs');
```

For voice app specific debugging, Jovo offers some handy functions for logging incoming requests and outgoing responses.

You can enable logging by using the following:

```javascript
// Use setter
app.enableLogging();

// Use setConfig
app.setConfig({
  logging: true,
  // Other configurations
});
```

This will enable both [Request Logging](#log-requests) and [Response Logging](#log-responses), which can also be separately enabled. For this, see the sections below.


### Log Requests

You can log the incoming JSON requests by adding the following configuration:

```javascript
// Use setter
app.enableRequestLogging();

// Use setConfig
app.setConfig({
  requestLogging: true,
  // Other configurations
});
```

The result looks like this (data changed):

```json
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

#### Request Logging Objects

As you can see above, the logs of a request are quite long and impractical, if you only need certain information. With `requestLoggingObjects`, you can limit the log output to specific objects.

```javascript
let myRequestLoggingObjects(['request']);

// Use setter
app.setRequestLoggingObjects(myRequestLoggingObjects);

// Use setConfig
app.setConfig({
  requestLoggingObjects: myRequestLoggingObjects,
  // Other configurations
});
```

The example above will reduce the log output to this:

```json
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
// Use setter
app.enableResponseLogging();

// Use setConfig
app.setConfig({
  responseLogging: true,
  // Other configurations
});
```

The result looks like this:

```json
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


#### Response Logging Objects

Similar to [`requestLoggingObjects`](#request-logging-objects), you can limit the response logging output to specific objects, as well.

```javascript
let myResponseLoggingObjects(['response']);

// Use setter
app.setResponseLoggingObjects(myResponseLoggingObjects);

// Use setConfig
app.setConfig({
  responseLoggingObjects: myResponseLoggingObjects,
  // Other configurations
});
```

The example above will reduce the log output to this:

```json
"shouldEndSession": true,
"outputSpeech": {
  "type": "SSML",
  "ssml": "<speak>Hello World!</speak>"
}
```


## Persisting Data

> Learn more about Sessions here: [App Logic > Routing > Introduction to User Sessions](https://github.com/jovotech/jovo-framework-nodejs/tree/master/docs/03_app-logic/01_routing/#introduction-to-user-sessions).

If you want to store user input to use later, there is an important distinction to be made: Should the information only be available during a session, or be persisted for use in later sessions?

### Session Attributes

For information that is only needed across multiple requests during one session, you can attach attributes to your responses. Learn more here: [App Logic > Routing > Session Attributes](https://github.com/jovotech/jovo-framework-nodejs/tree/master/docs/03_app-logic/01_routing/#session-attributes).

### Database Integrations

For information that is needed across sessions, you can use our database integrations. Learn more here: [Integrations > Databases](https://github.com/jovotech/jovo-framework-nodejs/tree/master/docs/06_integrations/databases).

