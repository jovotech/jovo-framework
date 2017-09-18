# [Building a Voice App](./) > User Input and Data

> Other pages in this category: [Handling Intents and States](intents-stated.md), [Creating Output](output.md).

In this section, you will learn how to deal with entities and slot values provided by your users, and also store and retrieve user specific data with the User class.

* [Introduction to User Input](#introduction-to-user-input)
* [How to Access Input](#how-to-access-input)
  * [Input as Parameter](#input-as-parameter)
  * [getInput | getInputs](#getinput-getinputs)
  * [inputMap](#inputmap)
* [User Object](#user-object)
  * [User ID](#user-id)
  * [Platform Type](#platform-type)
* [Logging](#logging)
  * [Log Requests](#log-requests)
  * [Log Responses](#log-responses)
* [Persisting Data](#persisting-data)
  * [Session Attributes](#session-attributes)
  * [Database Integrations](#database-integrations)

## Introduction to User Input

> If you're new to voice applications, you can learn more general info about principles like slots and entities here: [Voice App Basics/Natural Language Lingo](../getting-started/voice-app-basics.md).

We call user input any additional information your user provides besides an `intent`. On Amazon Alexa, input is usually called a `slot`, on Google Assistant/API.AI an `entity`.


## How to Access Input

There are two ways to get the inputs provided by a user: either by adding parameters to  your handlers' intent functions, or by using the `getInput` method.

### Input as Parameter
You can add parameters directly to your intent, like so:

```
let handlers = {

    // Other Intents and States

    'SomeIntent': function(inputNameOne, inputNameTwo) {
        // Do something
    }

    // Other Intents and States
};
```

The parameter names need to be the same as the slot/entity names on the respective developer consoles at Amazon and API.AI. For some built-in entities at API.AI that use hyphens, the parameters should be in camelCase (for example, `given-name` can be accessed with a `givenName` parameter).


### getInput | getInputs

You can either access the values of all user inputs with the `getInputs` method, or get specific values directly with `getInput(inputName)`.

```
let handlers = {

    // Other Intents and States

    'SomeIntent': function() {
        // Get all inputs
        let inputs = app.getInputs();

        // Get input for a single slot or entity
        let value = app.getInput(inputName);

        // Do something
    }

    // Other Intents and States
};
```

### inputMap

Similar to [`intentMap`](../intents-states.md/#intentmap), there are cases where it might be valuable (due to naming conventions on different platforms or built-in input types) to map different input entities to one defined Jovo inputName. You can add this to the [configuration section](./#jovo-app-structure) of your voice app:

```
// Create above webhook.post (webhook) or exports.handler (Lambda)
let inputMap = { 
    'incomingInputName' : 'mappedInputName'
};
app.setInputMap(inputMap);
```

Example: You want to ask your users for their name and created a slot called `name` on the Amazon Developer Platform. However, on API.AI, you decided to use the pre-defined entity `given-name`. You can now use an inputMap to match incoming inputs from Alexa and Google.

```
// Map API.AI standard parameter given-name with name
let inputMap = { 
    'given-name' : 'name' 
};
```

## User Object

Besides conversational parameters, there is also additional information that is not explicitly provided by a user, like which device they are using, or their ID. Learn more about different types of implicit user input in this section.

For retrieving and storing this type of information, the Jovo `User Class`can be used to create more contextual and adaptive experiences based on user specific data. You can find the class here: [user.js](https://github.com/jovotech/jovo-framework-nodejs/blob/master/lib/user.js).

The user object can be accessed like this:

```
let user = app.user();
```

### User Data

With our [database integrations](../04_integrations#databases), you can store user specific data easily.

Just specify a key and a value, and you're good to go: 

```
app.user().data.key = value;

// Example
app.user().data.score = 300;
```


### Metadata

The user object metadata is the first step towards building more contextual experiences with the Jovo Framework. Right now, the following data is automatically stored (by default on the FilePersistence db.json, or DynamoDB if you enable it):

* createdAt: When the user first used your app
* lastUsedAt: When was the last time your user interacted with your app
* sessionsCount: How often did your user engage with your app

```
let userCreatedAt = app.user().metaData.createdAt; 
let userlastUsedAt = app.user().metaData.lastUsedAt; 
let userSessionsCount = app.user().metaData.sessionsCount;
```

### User ID

Returns user ID on the particular platform, either Alexa Skill User ID or Google Actions User ID:

```
app.user().getId();

// Alternatively, you can also use this
app.getUserId();
```

This is going to return an ID that looks like this:

```
// For Amazon Alexa
amzn1.ask.account.AGJCMQPNU2XQWLNJXU2K23R3RWVTWCA6OX7YK7W57E7HVZJSLH4F5U2JOLYELR4PSDSFGSDSD32YHMRG36CUUAY3G5QI5QFNDZ44V5RG6SBN3GUCNTRHAVT5DSDSD334e34I37N3MP2GDCHO7LL2JL2LVN6UFJ6Q2GEVVKL5HNHOWBBD7ZQDQYWNHYR2BPPWJPTBPBXPIPBVFXA

// For Google Assistant
ARke43GoJIqbF8g1vfyDdqL_Sffh
```

### Platform Type

Want to see which platform your user is currently interacting with? With getType, you can get exactly this.

```
app.getType();
```

This is going to return a type that looks like this:

```
// For Amazon Alexa
AlexaSkill

// For Google Assistant
GoogleAction
```

## Logging

When you’re using a webhook and ngrok, it’s easy to use logging for debugging, like this:

```
console.log('This is going to appear in the logs');
```

For voice app specific debugging, Jovo offers some handy functions for logging incoming requests and outgoing responses.


### Log Requests

You can log the incoming JSON requests by adding the following configuration:

```
// Place anywhere in your index.js
app.enableRequestLogging();
```

The result looks like this (data changed):

```
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

### Log Responses

You can log the outgoing JSON responses by adding the following configuration:

```
// Place anywhere in your index.js
app.enableResponseLogging();
```

The result looks like this:

```
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

## Persisting Data

> Learn more about Sessions here: [Handling Intents and States/Introduction to User Sessions](./intents-states.md#introduction-to-user-sessions)

If you want to store user input to use later, there is an important distinction to be made: Should the information only be available during a session, or be persisted for use in later sessions?

### Session Attributes

For information that is only needed across multiple requests during one session, you can attach attributes to your responses. Learn more here: [Handling Intents and States/Session Attributes](./intents-states.md#session-attributes).

### Database Integrations

For information that is needed across sessions, you can use our database integrations. Learn more here: [Integrations/Databases](../04_integrations#databases).

