# Routing

In this section, you will learn more about how to use intents and states to route your users through your voice app.

* [Introduction to Routing](#introduction-to-routing)
   * [Intents](#intents)
   * [States](#states)
   * [Input](#input)
* [Intent Redirects](#intent-redirects)
   * [toIntent](#tointent)
   * [toStateIntent](#tostateintent)
   * [toStatelessIntent](#tostatelessintent)
* [Advanced Routing](#advanced-routing)
   * [Separate Handlers](#separate-handlers)
   * [Platform Handlers](#platform-handlers) 
   * [Event Listeners](#event-listeners)

## Introduction to Routing

Typically, routing in a Jovo app is done in the `app.js` file in the `src` folder of your project. By default, routing elements are added by using the `setHandler` method.

This is how a simple handler looks like:

```javascript
app.setHandler({
    LAUNCH() {
        this.toIntent('HelloWorldIntent');
    },

    HelloWorldIntent() {
        this.ask('Hello World! What\'s your name?', 'Please tell me your name.');
    },

    MyNameIsIntent() {
        this.tell('Hey ' + this.$inputs.name.value + ', nice to meet you!');
    },
});
```

Routing in a Jovo project consists of three key concepts:
* [Intents](#intents)
* [States](#states)
* [Input](#input)

### Intents

Each intent from your [Language Model](../model './model') can be added as a function, similarly to `HelloWorldIntent` and `MyNameIsIntent` above.

```javascript
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

> [Learn more about Intents here](./intents.md './routing/intents').

### States

Jovo comes with built-in state handling that allows you to react to intents differently based on the context a user is currently in:

```javascript
app.setHandler({

    LAUNCH() {
        let speech = 'Do you want to order something?';
        let reprompt = 'Please answer with yes or no.';
        this.followUpState('OrderState')
            .ask(speech, reprompt);
    },
    
    // Example: Behave differently for a 'yes' or 'no' answer inside order state
    OrderState: {
        
        YesIntent() {
           // Do something
        },

        NoIntent() {
           // Do something
        },
    },

});
```

> [Learn more about States here](./states.md './routing/states').

### Input

In the `MyNameIsIntent` of the example above, the user's first name is passed as input, which can be accessed with `this.$inputs.name.value`.

```javascript
app.setHandler({

    MyNameIsIntent() {
        this.tell('Hey ' + this.$inputs.name.value + ', nice to meet you!');
    },

});
```

> [Learn more about Input here](./input.md './routing/input').


## Intent Redirects

Jovo offers the ability to redirect incoming intents to others. For example, the  sample voice app uses this to go from `LAUNCH` to `HelloWorldIntent`:

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

> [Learn how to pass data between intents](../data './data').

### toIntent

Use `toIntent` to jump into a new intent within the same request. 

```javascript
this.toIntent(intent);

// Go to PizzaIntent
this.toIntent('PizzaIntent');
```


### toStateIntent

Similar to [`toIntent`](#tointent), you can use `toStateIntent` to redirect to an intent inside a specific state.

The routing will look for an intent within the given state, and go there if available. If not, it will go to the fallback option outside your defined states.

```javascript
this.toStateIntent(state, intent);

// Go to PizzaIntent in state Onboarding
this.toStateIntent('OnboardingState', 'PizzaIntent');
```


### toStatelessIntent

If you're inside a state and want to go to a global intent, you can use `toStatelessIntent` to do exactly this:

```javascript
this.toStatelessIntent(intent);

// Go to global PizzaIntent
this.toStatelessIntent('PizzaIntent');
```

> Note: Calling this method will remove the current state from the response.


## Advanced Routing

As explained in the introduction above, routing is usually done with `handlers`, which can be added with the `app.setHandler` method in the `src/app.js` file:

```javascript
app.setHandler({
    
    // Add intents and states here

});
```

For complex projects that include many intents and states, this can get quite complicated quickly. In this section, additional routing methods are explained:

* [Separate Handlers](#separate-handlers)
* [Platform Handlers](#platform-handlers) 
* [Event Listeners](#event-listeners)

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
        this.tell('Hello Alexa User.');
    },
};

const googleActionHandlers = {
    HelloWorldIntent() {
        this.tell('Hello Google User.');
    },
};

app.setHandler(handlers);
app.setAlexaHandler(alexaHandlers);
app.setGoogleActionHandler(googleActionHandlers);
```


### Event Listeners

Event Listeners offer a way for you to react on certain events like `onRequest` and `onResponse`.

```javascript
app.onRequest(function(jovo) {
    // ...
}
```

> [Find out more about Event Listeners here](./event-listeners.md './routing/event-listeners').



<!--[metadata]: { "description": "Learn how to route through your voice app logic with Jovo.", "route": "routing" }-->
