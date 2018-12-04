# Routing

In this section, you will learn more about how to use intents and states to route your users through your voice app.

* [Introduction to Routing](#introduction-to-routing)
   * [Intents](#intents)
   * [States](#states)
   * [Input](#input)
* [Handlers](#handlers)
   * [Separate Handlers](#separate-handlers)
   * [Platform Handlers](#platform-handlers) 
* [Intent Redirects](#intent-redirects)
   * [toIntent](#tointent)
   * [toStateIntent](#tostateintent)
   * [toStatelessIntent](#tostatelessintent)
* [Event Listeners](#event-listeners)
* [Session Attributes](#session-attributes)

## Introduction to Routing

### Intents

### States

### Input

## Handlers

The routing is done with `handlers`, which can be added with the `app.setHandler` method in the `app.js`:

```javascript
app.setHandler({
    
    // Add intents and states here

});
```

### Separate Handlers

You can add multiple handlers by passing more than one object to the `setHandler` method:

```javascript
app.setHandler(handler1, handler2, ..);
```

This allows you to have the handlers separated into different files (as modules), which can then be added to `setHandler` by using `require`:

```javascript
app.setHandler(
    require('./handlers/stateless'),

    // Option 1: Require full object
    require('./handlers/firstState'),

    // Option 2: Require inside state object
    {
        'SecondState': require('./handlers/secondState'),
    }
);
```

The `stateless.js` file could look like this:

```javascript
module.exports = {
    LAUNCH() {
        this.followUpState('FirstState')
            .ask('Do you want to get started?');
    },

    Unhandled() {
        this.toIntent('LAUNCH');
    },
};
```
A more general [introduction to states](#states) can be found below.

For a full example of separating handlers into different files, take a look at this GitHub repository: [jankoenig/jovo-separate-handlers](https://github.com/jankoenig/jovo-separate-handlers).

### Platform Handlers

For cases where the experience differs on Alexa and Google Assistant, you can use the methods `setAlexaHandler` and `setGoogleActionHandler` to overwrite the default handlers.

Here is an example that offers different output for the two platforms:

```javascript
const handlers = {
    LAUNCH() {
        this.toIntent('HelloWorldIntent');
    },
};

const alexaHandlers = {
    HelloWorldIntent() {
        this.tell('Hello Alexa User');
    },
};

const googleActionHandlers = {
    HelloWorldIntent() {
        this.tell('Hello Google User');
    },
};

app.setHandler(handlers);
app.setAlexaHandler(alexaHandlers);
app.setGoogleActionHandler(googleActionHandlers);
```


## Intent Redirects

Jovo offers the ability to redirect incoming intents to others. For example, the  sample voice app uses this to go from `'LaunchIntent'` to `'HelloWorldIntent'`:

```javascript
app.setHandler({

    LAUNCH() {
        this.toIntent('HelloWorldIntent');
    },

    HelloWorldIntent() {
        this.ask('Hello World! What\'s your name?', 'Please tell me your name.');
    },
});
```

You can use the following methods to redirect intents:
* [toIntent](#tointent)
* [toStateIntent](#tostateintent)
* [toStatelessIntent](#tostatelessintent)

### toIntent

Use  `toIntent` to jump into a new intent within the same request. 

Sometimes, you may want to pass additional information (like user input) to another intent. You can use the `arg` parameter to do exactly this.

```javascript
this.toIntent(intent[, arg]);

// Go to PizzaIntent
this.toIntent('PizzaIntent');

// Go to PizzaIntent and pass more data
this.toIntent('PizzaIntent', moreData);
```

To make use of the passed data, add a parameter to your intent handler:

```javascript
app.setHandler({

    LAUNCH() {
        let data = 'data';
        this.toIntent('HelloWorldIntent', data);
    },

    HelloWorldIntent(data) {
        this.tell('Hello World' + data + '!');
    }
});
```


### toStateIntent

Similar to [`toIntent`](#tointent), you can use `toStateIntent` to redirect to an intent inside a specific state.

The routing will look for an intent within the given state, and go there if available. If not, it will go to the fallback option outside your defined states.

```javascript
this.toStateIntent(state, intent[, arg]);

// Go to PizzaIntent in state Onboarding
this.toStateIntent('OnboardingState', 'PizzaIntent');

// Go to PizzaIntent in state Onboarding and pass more data
this.toStateIntent('OnboardingState', 'PizzaIntent', moreData);
```


### toStatelessIntent

If you're inside a state and want to go to a global intent, you can use `toStatelessIntent` to do exactly this:

```javascript
this.toStatelessIntent(intent[, arg]);

// Go to global PizzaIntent
this.toStatelessIntent('PizzaIntent');

// Go to global PizzaIntent and pass more data
this.toStatelessIntent('PizzaIntent', moreData);
```

## Event Listeners

Event Listeners offer a way for you to react on certain events like `onRequest` and `onResponse`. Find out more about event listeners here: [App Logic > Routing > Event Listeners](./event-listeners.md './routing/event-listeners').


## Session Attributes

It might be helpful to save certain information across requests during a session (find out more about [session management in the introduction above](#introduction-to-session-management)). This can be done with Session Attributes.

The `setSessionAttribute` and `setSessionAttributes` methods can be used to store certain information that you can use later within the session. It's like a cookie that's alive until the session ends (usually after calling the `tell` function or when the user requests to stop).

```javascript
this.$session.$data.key = value;

// Set the current game score to 130 points
this.$session.$data.score = 130;

// Set the current game score to 130 points and number of games to 2
this.$session.$data = { score: 130, games: 2 };
```

You can either access all session attributes with `getSessionAttributes`, or call for a certain attribute with `getSessionAttribute(key)`.

```javascript
let attributes = this.getSessionAttributes();
let value = this.getSessionAttribute(key);

// Save current session's game score to variable
let score = this.getSessionAttribute('score');
```

Have a look at [App Logic > Data](../02_data './data') to learn more about how to persist data across sessions.


<!--[metadata]: { "description": "Learn how to route through your voice app logic with Jovo.",
		"route": "routing"
                }-->
