# [Building a Voice App](./) > Intents & States

> Other pages in this category: [User Input and Data](input.md), [Creating Output](output.md).

In this section, you will learn more about how to use intents and states to route your users through your voice app.

* [Introduction to User Sessions](#introduction-to-user-sessions)
* [Intents](#intents)
  * ['LAUNCH' intent](#launch-intent)
  * ['END' intent](#end-intent)
  * [intentMap](#intentmap)
* [States](#states)
  * [followUpState](#followupstate)
* [toIntent | toStateIntent](#tointent-tostateintent)
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

To save user data in form of attributes across requests during a session, take a look at the [Session Attributes](#session-attributes) section below. The platforms don't offer the ability to store user data across sessions. For this, Jovo offers a Persistence Layer.


## Intents

If you're new to voice applications, you can learn more general info about principles like intents here: [Voice App Basics/Natural Language Lingo](../getting-started/voice-app-basics.md/#natural-language-lingo).

Intents are defined and handled in the `handlers` variable. Besides the required [`'LAUNCH'`](#launch-intent) intent, you can add more intents that you defined at the respective developer platforms (see how to create an intent for [Amazon Alexa](https://www.jovo.tech/blog/alexa-skill-tutorial-nodejs/#helloworldintent) and [Google Assistant](https://www.jovo.tech/blog/google-action-tutorial-nodejs/#helloworldintent) in our beginner tutorial) like this:

```
let handlers = {
    'LAUNCH' : function () {
      // This intent is required
      // Opened when people open the voice app without a specific query
        app.tell('Hello World!');
    },

    'YourFirstIntent' : function () {
      // do something here

    },

};
```
Whenever your application gets a request from one of the voice platforms, this will either be accompanied with an intent (which you need to add), or the signal to start or end the session.

For this, offers two standard, built-in intents, `'LAUNCH'` and `'END'`, to make cross-platform intent handling easier:

```
let handlers = {

    'LAUNCH' : function() {
        // This intent called when a user opens your app without a specific query
        // Groups LaunchRequest (Alexa) and Default Welcome Intent (API.AI)
    },

    // Add more intents here

    'END' : function() {
        // This intent is called when the session ends
        // Currently supporting AMAZON.StopIntent and reprompt timeouts
    }
};
```

You can learn more about the built-in intents in the following sections:


### 'LAUNCH' intent

The `'LAUNCH'` intent is the first one your users will be directed to when they open your voice app without a specific question (no deep invocations, just “open skill” or “talk to app” on the respective platforms). This intent is necessary to run your voice app.

Usually, you would need to map the requests from Alexa and Google (as they have different names) to handle both in one intent block, but Jovo helps you there with a standard intent.

### 'END' intent

A session could end due to various reasons. For example, a user could call “stop,” there could be an error, or a timeout could occur after you asked a question and the user didn’t respond. Jovo uses the standard intent `'END'` to match those reasons for you to “clean up” (for example, to get the reason why the session ended, or save something to the database).

If you want to end the session without saying anything, use the following:

```
app.endSession();
```

### getEndReason

It is helpful to find out why a session ended. Use getEndReason insinde the `'END'` intent to receive more information. This currently only works for Amazon Alexa.

```
let reason = app.getEndReason();

// For example, log
console.log(reason);
```


### intentMap

In cases where the names of certain intents differ across platforms, Jovo offers a simple mapping function for intents. You can add this to the [configuration section](../#app-configuration) of your voice app:

```
// Create above webhook.post (webhook) or exports.handler (Lambda)
let intentMap = {
    'incomingIntentName' : 'mappedIntentName'
};
app.setIntentMap(intentMap);
```

This is useful especially for platform-specific, built-in intents. One example could be Amazon’s standard intent when users ask for help: `AMAZON.HelpIntent`. You could create a similar intent on API.AI called `HelpIntent` and then do the matching with the Jovo `intentMap`.

```
let intentMap = {
    'AMAZON.HelpIntent' : 'HelpIntent'
};
```

This can also be used if you have different naming conventions on both platforms and want to match both intents to a new name. In the below example, the `AMAZON.HelpIntent` and an intent called `help-intent` on API.AI are matched to a Jovo intent called `HelpIntent`.

```
let intentMap = {
    'AMAZON.HelpIntent' : 'HelpIntent',
    'help-intent' : 'HelpIntent'
};
```

#### Platform built-in intents

As mentioned above, the platforms offer different types of built-in intents.

* Amazon Alexa: [Standard built-in intents](https://developer.amazon.com/public/solutions/alexa/alexa-skills-kit/docs/built-in-intent-ref/standard-intents)
* Google Assistant: Currently no documentation of built-in intents on API.AI



## States

For simple voice apps, the structure to handle the logic is quite simple:

```
let handlers = {

    'LAUNCH' : function() {
        // do something
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

This means, no matter how deep into the conversation with your voice app the user is, they will always end up at a specific `'YesIntent'` or `'NoIntent'`. This means that you as a developer need to figure out yourself which question they just answered with "Yes."

This is where `states` can be helpful. For more complex voice apps that include multiple user flows, it is necessary to remember and route through some user states to understand at which position the conversation currently is. For example, especially “Yes” and “No” as answers might show up across your voice app for a various number of questions. For each question, a state would be very helpful to distinct between different Yes’s and No’s.

With Jovo, you can include states like this:

```
let handlers = {

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

    'END' : function() {
        // do something
    }

};
```

By routing a user to a state (by using [`followUpState`](#followupstate)), this means you can react specifically to this certain situation in the process.

When a user is in a certain state and calls an intent, Jovo will first look if that intent is available in the given state. If not, a fallback option needs to be provided outside any state:

```
let handlers = {

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

### followUpState

If you want to route a user to a state after you asked a specific question, prepend a `followUpState` call to an `ask` call.

```
app.ask(speech, reprompt)
    .followUpState(stateName);
```

This way, the voice app will first look if the response-intent is available in the given state. If not, it will go to the default called intent if it’s available outside a state.

```
let handlers = {

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


## toIntent | toStateIntent

Use the `toIntent` or `toStateIntent` methods to jump into a new intent within the same request (similar, but different to the `followUpState` method that awaits the next request within the same session). For example, the  sample voice app uses this to go from `'LaunchIntent'` to `'HelloWorldIntent'`:

```
let handlers = {

    'LAUNCH': function() {
        app.toIntent('HelloWorldIntent');
    },

    'HelloWorldIntent': function() {
        app.tell('Hello World!');
    }
};
```

If `toStateIntent` is used, the framework will look for an intent within the given state, and go there if available. If not, it will go to the fallback option outside your defined states.

Sometimes, you may want to pass additional information (like user input) to another intent. You can use the `arg` parameter to do exactly this. Make sure to add `arg` as a parameter to that intent as well to be able to use it.

```
app.toIntent(intent[, arg]);
app.toStateIntent(state, intent[, arg]);

// Go to PizzaIntent
app.toIntent('PizzaIntent');

// Go to PizzaIntent and pass more info
app.toIntent('PizzaIntent', moreData);

// Go to PizzaIntent in state Onboarding
app.toStateIntent('OnboardingState', 'PizzaIntent');

// Go to PizzaIntent in state Onboarding and pass more info
app.toStateIntent('OnboardingState', 'PizzaIntent', moreData);
```

To make use of the passed data, add a parameter to your intent handler:

```
let handlers = {

    'LAUNCH': function() {
        let data = 'data';
        app.toIntent('HelloWorldIntent', data);
    },

    'HelloWorldIntent': function(data) {
        app.tell('Hello World' + data + '!');
    }
};
```

## Session Attributes

It might be helpful to save certain informations across requests during a session (find out more about [session management in the introduction above](#introduction-to-session-management)). This can be done with Session Attributes.

The `addSessionAttribute` or `setSessionAttribute` methods can be used to store certain information that you can use later. It’s like a cookie that’s alive until the session ends (usually after calling the `tell` function or when the user requests to stop).

```
app.setSessionAttribute(key, value);

// Set the current game score to 130 points
app.setSessionAttribute('score', 130);
```

You can either access all session attributes with `getSessionAttributes`, or call for a certain attribute with `getSessionAttribute(key)`.

```
let attributes = app.getSessionAttributes();
let value = app.getSessionAttribute(key);

// Save current session's game score to variable
let score = app.getSessionAttribute('score');
```

Have a look at our [User Object](./input.md#user-object) to learn more about how to persist data across sessions.