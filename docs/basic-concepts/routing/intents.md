# Intents

> To view this page on the Jovo website, visit https://www.jovo.tech/docs/routing/intents

In this section, you will learn more about how to use intents to route your users through your voice app.

* [Introduction](#introduction)
* [Standard Intents](#standard-intents)
    * [LAUNCH](#launch)
    * [NEW_SESSION](#new_session)
    * [NEW_USER](#new_user)
    * [ON_REQUEST](#on_request)
    * [END](#end)
    * [Unhandled](#unhandled)
    * [ON_ERROR](#on_error)
* [Intent Hierarchy](#intent-hierarchy)
* [Built-in Intents](#built-in-intents)
* [intentMap](#intentmap)

## Introduction

> [Learn how to add intents to the Jovo Language Model here](../model '../model').

Besides at least one of the the required [`LAUNCH`](#launch) or [`NEW_SESSION`](#new_session) intents, you can add more intents that you defined at the respective developer platforms like this:

```javascript
// @language=javascript

// src/app.js

app.setHandler({
    LAUNCH() {
        // Triggered when people open the voice app without a specific query
        this.tell('Hello World!');
    },

    YourFirstIntent() {

        // Do something here

    },

});

// @language=typescript

// src/app.ts

app.setHandler({
    LAUNCH() {
        // Triggered when people open the voice app without a specific query
        this.tell('Hello World!');
    },

    YourFirstIntent() {

        // Do something here

    },

});
```

Whenever your application gets a request from one of the voice platforms, this will either be accompanied with an intent (which you need to add), or the signal to start or end the session.

For this, Jovo offers standard, built-in intents, `LAUNCH` and `END`, to make cross-platform intent handling easier:

```javascript
app.setHandler({

    LAUNCH() {
        // Triggered when people open the voice app without a specific query
        // e.g. the LaunchRequest (Alexa) and Default Welcome Intent (Dialogflow), etc.
    },

    // Add more intents here

    END() {
        // Triggered when the session ends
        // Currently supporting AMAZON.StopIntent and reprompt timeouts
    }
});
```


## Standard Intents

You can learn more about Jovo standard intents in the following sections:

* [LAUNCH Intent](#launch-intent)
* [NEW_SESSION Intent](#new_session-intent)
* [NEW_USER Intent](#new_user-intent)
* [ON_REQUEST Intent](#on_request-intent)
* [END Intent](#end-intent)
* [Unhandled Intent](#unhandled)

### LAUNCH

The `LAUNCH` intent is the first one your users will be directed to when they open your voice app without a specific question (no deep invocations, just "open skill" or "talk to app" on the respective platforms). If you don't have `NEW_SESSION` defined, this intent is necessary to run your voice app.

```javascript
LAUNCH() {
    // Triggered when a user opens your app without a specific query
 },
```

### NEW_SESSION

You can use the `NEW_SESSION` intent instead of the `LAUNCH` intent if you want to always map new session requests to one intent. This means that any request, even deep invocations, will be mapped to the `NEW_SESSION` intent. Either `LAUNCH` or `NEW_SESSION` are required.

```javascript
NEW_SESSION() {
    // Always triggered when a user opens your app, no matter the query (new session)
 },
```

This is helpful if you have some work to do, like collect data (timestamps). After all data collection is done, Jovo automatically goes to the intent of the request.

If there are asynchronous calls that need to be executed before the original intent is entered, use the following:

```javascript
async NEW_SESSION() {
    this.$session.$data.someData = await collectSomeData();
},
```

There is no need to redirect to the next intent. For example, if you define the following handlers:

```javascript
app.setHandler({
    NEW_SESSION() {
        console.log('NEW_SESSION');
    },

    LAUNCH() {
        console.log('LAUNCH');
    },
);
```

You receive the following log output for new sessions:

```
NEW_SESSION
LAUNCH
```

### NEW_USER

Additionally to the other intents above, you can use the `NEW_USER` to direct a new user to this intent and do some initial work before proceeding to the interaction:

```javascript
NEW_USER() {
    // Triggered when a user opens your app for the first time
 },
```

For example, this saves you some time calling `if (this.$user.isNew()) { }` in every intent where you require the access to user data.

If there are asynchronous calls that need to be executed before the original intent is entered, use the following:

```javascript
async NEW_USER() {
    this.$user.$data.someData = await collectSomeData();
},
```

There is no need to redirect to the next intent. For example, if you define the following handlers:

```javascript
app.setHandler({
    NEW_USER() {
        console.log('NEW_USER');
    },

    LAUNCH() {
        console.log('LAUNCH');
    },
);
```

You receive the following log output for new users:

```
NEW_USER
LAUNCH
```

### ON_REQUEST

The `ON_REQUEST` intent can be used to map every incoming request to a single intent first. This is the first entry point for any request and does not need to redirect to any other intent.

```javascript
ON_REQUEST() {
    // Triggered with every request
},
```

If you make any async calls in the `ON_REQUEST` intent, it is recommended to store data like this:

```javascript
async ON_REQUEST() {
    this.$data.someData = await collectSomeData();
},
```

There is no need to redirect to the next intent. For example, if you define the following handlers:

```javascript
app.setHandler({
    ON_REQUEST() {
        console.log('ON_REQUEST');
    },

    LAUNCH() {
        console.log('LAUNCH');
    },
);
```

You receive the following log output for new sessions:

```
ON_REQUEST
LAUNCH
```


### END

A session could end due to various reasons. For example, a user could call "stop," there could be an error, or a timeout could occur after you asked a question and the user didn't respond. Jovo uses the standard intent `END` to match those reasons for you to "clean up" (for example, to get the reason why the session ended, or save something to the database).

```javascript
END() {
    // Triggered when a session ends abrupty or with AMAZON.StopIntent
 },
```

#### getEndReason

It is helpful to find out why a session ended. Use getEndReason inside the `'END'` intent to receive more information. This currently only works for Amazon Alexa.

```javascript
END() {
    let reason = this.$alexaSkill.getEndReason();

    // For example, log
    console.log(reason);

    this.tell('Goodbye!');
 },
```


### Unhandled

Sometimes, an incoming intent might not be found either inside a state or among the global intents in the `handlers` variable. For this, `Unhandled` intents can be used to match those calls:

```javascript
Unhandled() {
    // Triggered when the requested intent could not be found in the handlers variable
 },
```

> Tutorial: [How the Unhandled Intent works](https://www.jovo.tech/tutorials/unhandled-intent).

#### Global Unhandled Intent

One `Unhandled` intent may be used outside a state to match all incoming requests that can't be found globally.

In the below example all intents that aren't found, are automatically calling the `Unhandled` intent, which redirects to `LAUNCH`:

```javascript
app.setHandler({

    LAUNCH() {
        this.tell('Hello World!');
    },

    // Add more intents here

    Unhandled() {
        return this.toIntent('LAUNCH');
    }
});
```

#### State Unhandled Intents

Usually, when an intent is not found inside a state, the routing jumps outside the state and looks for the intent globally.

Sometimes though, you may want to stay inside that state, and try to capture only a few intents (for example, a yes-no-answer). For this, `Unhandled` intents can also be added to states.

See this example:

```javascript
app.setHandler({

    LAUNCH() {
        this.$speech.addText('Do you want to play a game?');
        this.$reprompt.addText('Please answer with yes or no.');

        this.followUpState('PlayGameState')
            .ask(this.$speech, this.$reprompt);
    },

    'PlayGameState': {
        YesIntent() {
            // Do something
        },

        NoIntent() {
            // Do something
        },

        Unhandled() {
            this.$speech.addText('You need to answer with yes, to play a game.');
            this.$reprompt.addText('Please answer with yes or no.');

            this.ask(this.$speech, this.$reprompt);
        },
    },

    // ...

});
```

This helps you to make sure that certain steps are really taken in the user flow.

However, for some intents (for example, a `CancelIntent`), it might make sense to always route to a global intent instead of `Unhandled`. This can be done with [intentsToSkipUnhandled](#intentsToSkipUnhandled).


#### intentsToSkipUnhandled

With `intentsToSkipUnhandled`, you can define intents that aren't matched to an `Unhandled` intent, if not found in a state. This way, you can make sure that they are always captured globally.

```javascript
// @language=javascript

// src/config.js

module.exports = {
    
    intentsToSkipUnhandled: [
        'END'
    ],

    // ...

};

// @language=typescript

// src/config.ts

const config = {
    
    intentsToSkipUnhandled: [
        'END'
    ],

    // ...

};
```
In the below example, if a person answers the first question with "Stop," it is not going to `Unhandled`, but to the global `END`:

```javascript
app.setHandler({

    LAUNCH() {
        this.$speech.addText('Do you want to play a game?');
        this.$reprompt.addText('Please answer with yes or no.');

        this.followUpState('PlayGameState')
            .ask(this.$speech, this.$reprompt);
    },

    'PlayGameState': {
        YesIntent() {
            // Do something
        },

        NoIntent() {
            // Do something
        },

        Unhandled() {
            this.$speech.addText('You need to answer with yes, to play a game.');
            this.$reprompt.addText('Please answer with yes or no.');

            this.ask(this.$speech, this.$reprompt);
        },
    },

    END() {
        // Do something
    },

    // ...

});
```

### ON_ERROR

Jovo uses the standard intent `ON_ERROR` to catch error requests:

```javascript
ON_ERROR() {
    // Triggered when there is an error
 },
```

With Alexa Skills, you can use the `getError` method:

```js
// @language=javascript

// Example
ON_ERROR() {
    console.log(`Error: ${JSON.stringify(this.$alexaSkill.getError())}`);
    console.log(`Request: ${JSON.stringify(this.$request)}`);

    this.ask('There was an error. Can I help you in any other way?');
},

// @language=typescript

// Example
ON_ERROR() {
    console.log(`Error: ${JSON.stringify(this.$alexaSkill!.getError())}`);
    console.log(`Request: ${JSON.stringify(this.$request)}`);

    this.ask('There was an error. Can I help you in any other way?');
},
```



## Intent Hierarchy

Jovo intent handling works with promises. This means that the response is returned after the promise is resolved, even if no specific `tell` or `ask` is set. For certain Jovo standard intents it can happen that the handling passes through several intents without you having to use a redirect like `toIntent`.

The Jovo standard intents follow this hierarchy:
* `NEW_USER`
* `NEW_SESSION`
* `ON_REQUEST`
* `LAUNCH` (or other intent that is called)

For example, this code:

```javascript
app.setHandler({

    ON_REQUEST() {
        console.log('ON_REQUEST');
    },

    NEW_USER() {
        console.log('NEW_USER');
    },

    NEW_SESSION() {
        console.log('NEW_SESSION');
    },

    LAUNCH() {
        console.log('LAUNCH');
    },

});
```

Would return the following logs for a `LAUNCH` request from a new user:

```
NEW_USER
NEW_SESSION
ON_REQUEST
LAUNCH
{
  "version": "1.0",
  "response": {
    "shouldEndSession": true
  },
  "sessionAttributes": {}
}
```
After the request has passed through all the intents and no output is set, an empty response is returned.

## Built-in Intents

As mentioned above, the platforms offer different types of built-in intents.

* Amazon Alexa: [Standard built-in intents](https://developer.amazon.com/docs/alexa/custom-skills/standard-built-in-intents.html)
* Google Assistant: [Built-in Intents (Developer Preview)](https://developers.google.com/actions/discovery/built-in-intents)


## intentMap

In cases where the names of certain intents differ across platforms, Jovo offers a simple mapping function for intents. You can add this to the configuration section of your voice app:

```javascript
// @language=javascript

// src/config.js

module.exports = {
    
    intentMap: {
		'AMAZON.StopIntent': 'END',
    },

    // ...

};

// @language=typescript

// src/config.ts

const config = {
    
    intentMap: {
		'AMAZON.StopIntent': 'END',
    },

    // ...

};
```

This is useful especially for platform-specific, built-in intents. One example could be Amazon's standard intent when users ask for help: `AMAZON.HelpIntent`. You could create a similar intent on Dialogflow called `HelpIntent` and then do the matching with the Jovo `intentMap`.

```javascript
// @language=javascript

// src/config.js

module.exports = {
    
    intentMap: {
        'AMAZON.HelpIntent' : 'HelpIntent'
    },

    // ...

};

// @language=typescript

// src/config.ts

const config = {
    
    intentMap: {
        'AMAZON.HelpIntent' : 'HelpIntent'
    },

    // ...

};
```

This can also be used if you have different naming conventions on both platforms and want to match both intents to a new name. In the below example, the `AMAZON.HelpIntent` and an intent called `help-intent` on Dialogflow are matched to a Jovo intent called `HelpIntent`.

```javascript
// @language=javascript

// src/config.js

module.exports = {
    
    intentMap: {
        'AMAZON.HelpIntent' : 'HelpIntent',
        'help-intent' : 'HelpIntent'
    },

    // ...

};

// @language=typescript

// src/config.ts

const config = {
    
    intentMap: {
        'AMAZON.HelpIntent' : 'HelpIntent',
        'help-intent' : 'HelpIntent'
    },

    // ...

};
```

<!--[metadata]: { "description": "Learn more about how to use intents with the Jovo Framework.", "route": "routing/intents" }-->
