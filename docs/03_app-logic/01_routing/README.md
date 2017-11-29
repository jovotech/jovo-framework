# [App Logic](../) > Routing

In this section, you will learn more about how to use intents and states to route your users through your voice app.

* [Introduction to User Sessions](#introduction-to-user-sessions)
* [Intents](#intents)
  * [Standard Intents](#standard-intents)
  * [intentMap](#intentmap)
* [States](#states)
  * [followUpState](#followupstate)
* [Intent Redirects](#intent-redirects)
  * [toIntent](#tointent)
  * [toStateIntent](#tostateintent)
  * [toStatelessIntent](#tostatelessintent)
* [Session Attributes](#session-attributes)

## Introduction to User Sessions

To build engaging voice apps, it's important to understand the concept of user sessions on voice platforms.

A `session` is an uninterrupted interaction between a user and your application. It consists of at least one `request`, but can consist of multiple sequential inputs and outputs. The length of a session is dependent of the following factors:

* The response includes `shouldEndSession`, which is true for `tell` and `endSession` method calls
* A user doesn't respond to an ask prompt and the session times out
* The user asks to end the session by saying "quit" or "exit"

Sessions that contain only a single request with a `tell` response could look like this:

![One Session](https://www.jovo.tech/img/docs/session-tell.jpg)


For more conversational experiences that require back and forth between your app and user, you need to use the `ask` method. Here is what a session with two requests could look like:

![Two Sessions](https://www.jovo.tech/img/docs/session-ask.jpg)

To save user data in form of attributes across requests during a session, take a look at the [Session Attributes](#session-attributes) section below. The platforms don't offer the ability to store user data across sessions. For this, Jovo offers a [Persistence Layer](https://github.com/jovotech/jovo-framework-nodejs/tree/master/docs/06_integrations/databases).


## Intents

If you're new to voice applications, you can learn more general info about principles like intents here: [Getting Started > Voice App Basics](https://github.com/jovotech/jovo-framework-nodejs/tree/master/docs/01_getting-started/voice-app-basics.md).

Intents are defined and handled in the `handlers` variable. Besides at least one of the the required [`'LAUNCH'`](#launch-intent) or [`'NEW_SESSION'`](#new-session-intent) intents, you can add more intents that you defined at the respective developer platforms (see how to create an intent for [Amazon Alexa](https://www.jovo.tech/blog/alexa-skill-tutorial-nodejs/#helloworldintent) and [Google Assistant](https://www.jovo.tech/blog/google-action-tutorial-nodejs/#helloworldintent) in our beginner tutorials) like this:

```javascript
const handlers = {
    'LAUNCH': function () {
        // Triggered when people open the voice app without a specific query
        app.tell('Hello World!');
    },

    'YourFirstIntent': function () {
      // Do something here

    },

};
```

Whenever your application gets a request from one of the voice platforms, this will either be accompanied with an intent (which you need to add), or the signal to start or end the session.

For this, Jovo offers standard, built-in intents, `'LAUNCH'` and `'END'`, to make cross-platform intent handling easier:

```javascript
const handlers = {

    'LAUNCH': function() {
        // Triggered when people open the voice app without a specific query
        // Groups LaunchRequest (Alexa) and Default Welcome Intent (Dialogflow)
    },

    // Add more intents here

    'END': function() {
        // Triggered when the session ends
        // Currently supporting AMAZON.StopIntent and reprompt timeouts
    }
};
```


### Standard Intents

You can learn more about Jovo standard intents in the following sections:

* ['LAUNCH' Intent](#launch-intent)
* ['END' Intent](#end-intent)
* ['NEW_SESSION' Intent](#new_session-intent)
* ['NEW_USER' Intent](#new_user-intent)
* ['Unhandled' Intent](#unhandled-intent)

#### 'LAUNCH' Intent

The `'LAUNCH'` intent is the first one your users will be directed to when they open your voice app without a specific question (no deep invocations, just “open skill” or “talk to app” on the respective platforms). If you don't have `'NEW_SESSION'` defined, this intent is necessary to run your voice app.

```javascript
'LAUNCH': function() {
    // Triggered when a user opens your app without a specific query
 },
```

Usually, you would need to map the requests from Alexa and Google (as they have different names) to handle both in one intent block, but Jovo helps you there with a standard intent.

#### 'NEW_SESSION' Intent

You can use the `'NEW_SESSION'` intent instead of the `'LAUNCH'` intent if you want to always map new session requests to one intent. This means that any request, even deep invocations, will be mapped to the `'NEW_SESSION'` intent. Either `'LAUNCH'` or `'NEW_SESSION'`are required.

```javascript
'NEW_SESSION': function() {
    // Always triggered when a user opens your app, no matter the query (new session)
 },
```
This is helpful if you have some work to do, like collect data (timestamps), before you route the users to the intent they wanted with the `toIntent` method.

This could look like this:

```javascript
'NEW_SESSION': function() {
    // Do some work here

    app.toIntent(app.getIntentName());
},
```


#### 'NEW_USER' Intent

Additionally to the other intents above, you can use the `'NEW_USER'` to direct a new user to this intent and do some initial work before proceeding to the interaction:

```javascript
'NEW_USER': function() {
    // Triggered when a user opens your app for the first time
 },
```
For example, this saves you some time calling `if (app.user().isNewUser()) { }` in every intent where you require the access to user data.


#### 'END' Intent

A session could end due to various reasons. For example, a user could call “stop,” there could be an error, or a timeout could occur after you asked a question and the user didn’t respond. Jovo uses the standard intent `'END'` to match those reasons for you to “clean up” (for example, to get the reason why the session ended, or save something to the database).

```javascript
'END': function() {
    // Triggered when a session ends abrupty or with AMAZON.StopIntent
 },
```

If you want to end the session without saying anything, use the following:

```javascript
app.endSession();
```


##### getEndReason

It is helpful to find out why a session ended. Use getEndReason inside the `'END'` intent to receive more information. This currently only works for Amazon Alexa.

```javascript
'END': function() {
    let reason = app.getEndReason();

    // For example, log
    console.log(reason);

    app.tell('Goodbye!');
 },
```



#### 'Unhandled' Intent

Sometimes, an incoming intent might not be found either inside a state or among the global intents in the `handlers` variable. For this, `'Unhandled'` intents can be used to match those calls:

```javascript
'Unhandled': function() {
    // Triggered when the requested intent could not be found in the handlers variable
 },
```

##### Global 'Unhandled' Intent

One `'Unhandled'` intent may be used outside a state to match all incoming requests that can't be found globally.

In the below example all intents that aren't found, are automatically calling the `'Unhandled'` intent, which redirects to `'LAUNCH'`:

```javascript
const handlers = {

    'LAUNCH': function() {
        app.tell('Hello World!');
    },

    // Add more intents here

    'Unhandled': function() {
        app.toIntent('LAUNCH');
    }
};
```

##### State 'Unhandled' Intents

Usually, when an intent is not found inside a state, the routing jumps outside the state and looks for the intent globally.

Sometimes though, you may want to stay inside that state, and try to capture only a few intents (for example, a yes-no-answer). For this, `'Unhandled'` intents can also be added to states.

See this example:

```javascript
const handlers = {

    'LAUNCH': function() {
        let speech = 'Do you want to play a game?';
        let reprompt = 'Please answer with yes or no.';
        app.followUpState('PlayGameState')
            .ask(speech, reprompt);
    },

    'PlayGameState': {
        'YesIntent': function() {
            // Do something
        },

        'NoIntent': function() {
            // Do something
        },

        'Unhandled': function() {
            let speech = 'You need to answer with yes, to play a game.';
            let reprompt = 'Please answer with yes or no.';
            app.ask(speech, reprompt);
        },
    },

    // Add more intents here

};
```

This helps you to make sure that certain steps are really taken in the user flow.

However, for some intents (for example, a `'CancelIntent'`), it might make sense to always route to a global intent instead of `'Unhandled'`. This can be done with [intentsToSkipUnhandled](#intentsToSkipUnhandled).


##### intentsToSkipUnhandled

With `intentsToSkipUnhandled`, you can define intents that aren't matched to an `'Unhandled'` intent, if not found in a state. This way, you can make sure that they are always captured globally.

```javascript
let myIntentsToSkipUnhandled = [
    'CancelIntent',
    'HelpIntent',
];

// Use the setter
app.setIntentsToSkipUnhandled(myIntentsToSkipUnhandled);

// Use setConfig
app.setConfig({
    intentsToSkipUnhandled: myIntentsToSkipUnhandled,
    // Other configurations
});
```

In the below example, if a person answers to the first question with "Help," it is not going to `'Unhandled'`, but to the global `'HelpIntent'`:

```javascript
const handlers = {

    'LAUNCH': function() {
        let speech = 'Do you want to play a game?';
        let reprompt = 'Please answer with yes or no.';
        app.followUpState('PlayGameState')
            .ask(speech, reprompt);
    },

    'PlayGameState': {
        'YesIntent': function() {
            // Do something
        },

        'NoIntent': function() {
            // Do something
        },

        'Unhandled': function() {
            let speech = 'You need to answer with yes, to play a game.';
            let reprompt = 'Please answer with yes or no.';
            app.ask(speech, reprompt);
        },
    },

    'HelpIntent': function() {
        // Do something
    },

    // Add more intents here

};
```

### intentMap

In cases where the names of certain intents differ across platforms, Jovo offers a simple mapping function for intents. You can add this to the configuration section of your voice app:

```javascript
let myIntentMap = {
    'incomingIntentName' : 'mappedIntentName'
};

// Use setter
app.setIntentMap(myIntentMap);

// Use setConfig
app.setConfig({
    intentMap: myIntentMap,
    // Other configurations
});
```

This is useful especially for platform-specific, built-in intents. One example could be Amazon’s standard intent when users ask for help: `AMAZON.HelpIntent`. You could create a similar intent on Dialogflow called `HelpIntent` and then do the matching with the Jovo `intentMap`.

```javascript
let intentMap = {
    'AMAZON.HelpIntent' : 'HelpIntent'
};
```

This can also be used if you have different naming conventions on both platforms and want to match both intents to a new name. In the below example, the `AMAZON.HelpIntent` and an intent called `help-intent` on Dialogflow are matched to a Jovo intent called `HelpIntent`.

```javascript
let intentMap = {
    'AMAZON.HelpIntent' : 'HelpIntent',
    'help-intent' : 'HelpIntent'
};
```

#### Platform built-in intents

As mentioned above, the platforms offer different types of built-in intents.

* Amazon Alexa: [Standard built-in intents](https://developer.amazon.com/public/solutions/alexa/alexa-skills-kit/docs/built-in-intent-ref/standard-intents)
* Google Assistant: Currently no documentation of built-in intents on Dialogflow



## States

For simple voice apps, the structure to handle the logic is quite simple:

```javascript
const handlers = {

    'LAUNCH' : function() {
        // Do something
    },

    'YesIntent' : function() {
        // Do something
    },

    'NoIntent' : function() {
        // Do something
    },

    'END' : function() {
        // Do something
    }
};
```

This means, no matter how deep into the conversation with your voice app the user is, they will always end up at a specific `'YesIntent'` or `'NoIntent'`. As a developer need to figure out yourself which question they just answered with "Yes."

This is where `states` can be helpful. For more complex voice apps that include multiple user flows, it is necessary to remember and route through some user states to understand at which position the conversation currently is. For example, especially “Yes” and “No” as answers might show up across your voice app for a various number of questions. For each question, a state would be very helpful to distinct between different Yes’s and No’s.

With Jovo, you can include states like this:

```javascript
const handlers = {

    'LAUNCH' : function() {
        let speech = 'Do you want to order something?';
        let reprompt = 'Please answer with yes or no.';
        app.followUpState('OrderState')
            .ask(speech, reprompt);
    },
    
    // Example: Behave differently for a 'yes' or 'no' answer inside order state
    'OrderState' : {
        
        'YesIntent' : function() {
           // Do something
        },

        'NoIntent' : function() {
           // Do something
        },
    },
};
```

By routing a user to a state (by using [`followUpState`](#followupstate)), this means you can react specifically to this certain situation in the process.

When a user is in a certain state and calls an intent, Jovo will first look if that intent is available in the given state. If not, a fallback option needs to be provided outside any state:

```javascript
const handlers = {

    'LAUNCH' : function() {
        // do something
    },
    
    // Example: behave differently for a 'yes' or 'no' answer inside order state
    'OrderState' : {
        
        'YesIntent' : function() {
           // do something
        },

        'NoIntent' : function() {
           // do something
        },

    },

    'YesIntent' : function() {
        // do something
    },

    'NoIntent' : function() {
        // do something
    },

    'END' : function() {
        // do something
    }

};
```

Alternatively, you can also use an [`Unhandled`](#unhandled-intent) intent as described in the section above:

```javascript
const handlers = {

    'LAUNCH' : function() {
        // do something
    },
    
    // Example: behave differently for a 'yes' or 'no' answer inside order state
    'OrderState' : {
        
        'YesIntent' : function() {
           // do something
        },

        'NoIntent' : function() {
           // Do something
        },

    },

    'Unhandled' : function() {
        // Do something
    },

    'END' : function() {
        // Do something
    }

};
```

### followUpState

If you want to route a user to a state after you asked a specific question, you can add a `followUpState`. It is important that you do this before your `ask` call. For example, you can prepend it like this:

```javascript
app.followUpState(stateName)
    .ask(speech, reprompt);
```

This way, the voice app will first look if the response-intent is available in the given state. If not, it will go to the default called intent if it’s available outside a state.

```javascript

const handlers = {

    'LAUNCH' : function() {
        // Ask for a yes-no-question and route to order state
        let speech = 'Do you want to order something?';
        let reprompt = 'Please answer with yes or no.';
        app.followUpState('OrderState').ask(speech, reprompt);
    },
    
    // Example: behave differently for a 'yes' or 'no' answer inside order state
    'OrderState' : {
        
        'YesIntent' : function() {
           // do something
        },

        'NoIntent' : function() {
           // do something
        },

    },

    // Default intents without states below

    'Unhandled' : function() {
        // Do something
    },

    'END' : function() {
        // do something
    }

};
```

## Intent Redirects

Jovo offers the ability to redirect incoming intents to others. For example, the  sample voice app uses this to go from `'LaunchIntent'` to `'HelloWorldIntent'`:

```javascript
const handlers = {

    'LAUNCH': function() {
        app.toIntent('HelloWorldIntent');
    },

    'HelloWorldIntent': function() {
        app.tell('Hello World!');
    }
};
```

You can use the following methods to redirect intents:
* [toIntent](#tointent)
* [toStateIntent](#tostateintent)
* [toStatelessIntent](#tostatelessintent)

### toIntent

Use  `toIntent` to jump into a new intent within the same request. 

Sometimes, you may want to pass additional information (like user input) to another intent. You can use the `arg` parameter to do exactly this.

```javascript
app.toIntent(intent[, arg]);

// Go to PizzaIntent
app.toIntent('PizzaIntent');

// Go to PizzaIntent and pass more data
app.toIntent('PizzaIntent', moreData);
```

To make use of the passed data, add a parameter to your intent handler:

```javascript
const handlers = {

    'LAUNCH': function() {
        let data = 'data';
        app.toIntent('HelloWorldIntent', data);
    },

    'HelloWorldIntent': function(data) {
        app.tell('Hello World' + data + '!');
    }
};
```


### toStateIntent

Similar to [`toIntent`](#tointent), you can use `toStateIntent` to redirect to an intent inside a specific state.

The routing will look for an intent within the given state, and go there if available. If not, it will go to the fallback option outside your defined states.

```javascript
app.toStateIntent(state, intent[, arg]);

// Go to PizzaIntent in state Onboarding
app.toStateIntent('OnboardingState', 'PizzaIntent');

// Go to PizzaIntent in state Onboarding and pass more data
app.toStateIntent('OnboardingState', 'PizzaIntent', moreData);
```


### toStatelessIntent

If you're inside a state and want to go to a global intent, you can use `toStatelessIntent` to do exactly this:

```javascript
app.toStatelessIntent(intent[, arg]);

// Go to global PizzaIntent
app.toStatelessIntent('PizzaIntent');

// Go to global PizzaIntent and pass more data
app.toStatelessIntent('PizzaIntent', moreData);
```



## Session Attributes

It might be helpful to save certain information across requests during a session (find out more about [session management in the introduction above](#introduction-to-session-management)). This can be done with Session Attributes.

The `setSessionAttribute` and `setSessionAttributes` methods can be used to store certain information that you can use later within the session. It’s like a cookie that’s alive until the session ends (usually after calling the `tell` function or when the user requests to stop).

```javascript
app.setSessionAttribute(key, value);
app.setSessionAttributes(attributes);

// Set the current game score to 130 points
app.setSessionAttribute('score', 130);

// Set the current game score to 130 points and number of games to 2
app.setSessionAttributes({ score: 130, games: 2 });
```

You can either access all session attributes with `getSessionAttributes`, or call for a certain attribute with `getSessionAttribute(key)`.

```javascript
let attributes = app.getSessionAttributes();
let value = app.getSessionAttribute(key);

// Save current session's game score to variable
let score = app.getSessionAttribute('score');
```

Have a look at [App Logic > Data](https://github.com/jovotech/jovo-framework-nodejs/tree/master/docs/03_app-logic/data) to learn more about how to persist data across sessions.
