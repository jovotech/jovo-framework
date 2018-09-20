# [App Logic](../) > Data

In this section, you will learn how to deal with entities and slot values provided by your users, and also store and retrieve user specific data with the User class.

* [Introduction to User Input](#introduction-to-user-input)
* [How to Access Input](#how-to-access-input)
  * [Input as Parameter](#input-as-parameter)
  * [getInput | getInputs](#getinput)
  * [inputMap](#inputmap)
* [User Object](#user-object)
* [Logging](#logging)
  * [Log Requests](#log-requests)
  * [Log Responses](#log-responses)
* [Persisting Data](#persisting-data)
  * [Session Attributes](#session-attributes)
  * [Database Integrations](#database-integrations)
* [Account Linking](#account-linking)

## Introduction to User Input

> If you're new to voice applications, you can learn more about general principles like slots and entities here: [Getting Started > Voice App Basics](../../01_getting-started/voice-app-basics.md './voice-app-basics').

We call user input any additional information your user provides besides an `intent`. On Amazon Alexa, input is usually called a `slot`, on Google Assistant/Dialogflow an `entity` or `parameter`.


## How to Access Input

 > With the update to Jovo v1.0, we changed the way you can access input values. Please read more below, or take a look at our [migration document](https://www.jovo.tech/blog/v1-migration-guide/).

There are two ways to get the inputs provided by a user: either by [adding parameters](#input-as-parameter) to  your `handlers` intent functions, or by using the [`getInput`](#getinput) method.

Each input is an object which looks like this:

```javascript
{
  name: 'inputName',
  value: 'inputValue',
  key: 'mappedInputValue', // may differ from value if synonyms are used in language model
}
```
For example, if we want to access the value of an input `name` provided by the user, we can do so by using `name.value`.

Other parameters (like `id` or platform specific elements) can be found in the object as well.


### Input as Parameter
You can access input by adding parameters directly to your intent.

For example, the sample voice app does it like this: 

```javascript
app.setHandler({

    // Other Intents and States

     'MyNameIsIntent': function(name) {
        this.tell('Hey ' + name.value + ', nice to meet you!');
    },
});
```

Two important things to consider when using this option:
* The parameter names need to be the same as the slot/entity names on the respective developer consoles at Amazon and Dialogflow
* The incoming names are matched to `camelCase`, for example `given-name` can be accessed with a `givenName` parameter.


### getInput

You can either access the values of all user inputs with the `getInputs` method, or get specific values directly with `getInput('inputName')`.

```javascript
app.setHandler({

    // Other Intents and States

    'SomeIntent': function() {
        // Get all inputs
        let inputs = this.getInputs();

        // Get input for a single slot or entity
        let value = this.getInput('inputName').value;

        // Do something
    }

    // Other Intents and States
});
```

### inputMap

Similar to [`intentMap`](../01_routing/#intentmap './routing#intentmap'), there are cases where it might be valuable (due to naming conventions on different platforms or built-in input types) to map different input entities to one defined Jovo `inputName`. You can add this to the configuration section of your voice app:

```javascript
let myInputMap = { 
    'incomingInputName' : 'mappedInputName',
};

// Using the constructor
const config = {
    inputMap: myInputMap,
    // Other configurations
};

// Using the setter
app.setInputMap(myInputMap);
```

Example: You want to ask your users for their name and created a slot called `name` on the Amazon Developer Platform. However, on Dialogflow, you decided to use the pre-defined entity `given-name`. You can now use an inputMap to match incoming inputs from Alexa and Google.

```javascript
// Map Dialogflow standard parameter given-name with name
const config = {
    inputMap: { 'given-name' : 'name', },
    // Other configurations
};
```

With this, you can use `name` as a parameter in your intent function:

```javascript
app.setHandler({

    // Other Intents and States

    'MyNameIsIntent': function(name) {
        this.tell('Hello ' + name.value + '!');
    }

    // Other Intents and States
});
```

## User Object

Besides conversational parameters, there is also additional information that is not explicitly provided by a user, like which device they are using, or their ID. Learn more about different types of implicit user input in this section.

For retrieving and storing this type of information, the Jovo [`User Class`](./user.md './data/user') can be used to create more contextual and adaptive experiences based on user specific data.

The user object can be accessed like this:

```javascript
let user = this.user();
```

You can find more information here: [App Logic > Data > User](./user.md './data/user').

## Logging

When you're using a local webhook (see [`jovo webhook`](../../03_app-configuration/02_server/webhook.md#jovo-webhook './server/webhook#jovo-webhook')), it's easy to use logging for debugging, like this:

```javascript
console.log('This is going to appear in the logs');
```

For voice app specific debugging, Jovo offers some handy functions for logging incoming requests and outgoing responses.

You can enable logging by using the following:

```javascript
// Using the constructor
const config = {
  logging: true,
  // Other configurations
};

// Using the setter
app.enableLogging();

```

This will enable both [Request Logging](#log-requests) and [Response Logging](#log-responses), which can also be  enabled separately. For this, see the sections below.


### Log Requests

You can log the incoming JSON requests by adding the following configuration:

```javascript
// Using the constructor
const config = {
  requestLogging: true,
  // Other configurations
};

// Using the setter
app.enableRequestLogging();
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

#### Request Logging Objects

As you can see above, the logs of a request are quite long and impractical, if you only need certain information. With `requestLoggingObjects`, you can limit the log output to specific objects.

```javascript
let myRequestLoggingObjects(['request']);

// Using the constructor
const config = {
  requestLoggingObjects: myRequestLoggingObjects,
  // Other configurations

// Using the setter
app.setRequestLoggingObjects(myRequestLoggingObjects);
};
```

The example above will reduce the log output to this:

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
// Using the constructor
const config = {
  responseLogging: true,
  // Other configurations
};

// Using the setter
app.enableResponseLogging();
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


#### Response Logging Objects

Similar to [`requestLoggingObjects`](#request-logging-objects), you can limit the response logging output to specific objects, as well.

```javascript
let myResponseLoggingObjects(['response']);

// Using the constructor
const config = {
  responseLoggingObjects: myResponseLoggingObjects,
  // Other configurations
};

// Using the setter
app.setResponseLoggingObjects(myResponseLoggingObjects);
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


## Persisting Data

> Learn more about Sessions here: [App Logic > Routing > Introduction to User Sessions](../01_routing/#introduction-to-user-sessions './routing#introduction-to-user-sessions').

If you want to store user input to use later, there is an important distinction to be made: Should the information only be available during a session, or be persisted for use in later sessions?

### Session Attributes

For information that is only needed across multiple requests during one session, you can attach attributes to your responses. Learn more here: [App Logic > Routing > Session Attributes](../01_routing/#session-attributes './routing#session-attributes').

### Database Integrations

For information that is needed across sessions, you can use our user class together with our database integrations. Learn more here: [App Logic > Data > User](./user.md './data/user'), [Integrations > Databases](../../06_integrations/databases './databases').


## Account Linking

To implement Account Linking in your voice application, you need two core methods.

The first allows you to prompt the user to link their account, by showing a card in the respective companion app:

```javascript
// Alexa Skill: Account Linking Card added to the response, need to add other output
this.alexaSkill().showAccountLinkingCard();
this.tell('Please link your account');

// Google Actions: Standalone! Don't add any other output.
this.googleAction().showAccountLinkingCard();
```

The other method returns you the access token, which will be added to every request your skill gets, after the user linked their account:
```javascript
this.getAccessToken();
```

For more information on Account Linking, check out our blogposts:
* [Alexa Skill Account Linking](https://www.jovo.tech/blog/alexa-account-linking-auth0/)
* [Google Actions Account Linking](https://www.jovo.tech/blog/google-action-account-linking-auth0/)

<!--[metadata]: {"title": "Data: Handling User Input", 
                "description": "Learn how to deal with user input and data when using the Jovo Framework.",
                "activeSections": ["logic", "data", "data_index"],
                "expandedSections": "logic",
                "inSections": "logic",
                "breadCrumbs": {"Docs": "docs/",
				"App Logic": "docs/logic",
                                "Data": ""
                                },
		"commentsID": "framework/docs/data",
		"route": "docs/data"
                }-->
