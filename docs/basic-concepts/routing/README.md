# Routing

> To view this page on the Jovo website, visit https://v3.jovo.tech/docs/routing

In this section, you will learn more about how to use intents and states to route your users through your voice app.

- [Introduction to Routing](#introduction-to-routing)
  - [Intents](#intents)
  - [States](#states)
  - [Input](#input)
- [Intent Redirects](#intent-redirects)
  - [toIntent](#tointent)
  - [toStateIntent](#tostateintent)
  - [toStatelessIntent](#tostatelessintent)
- [Advanced Routing](#advanced-routing)
  - [Separate Handlers](#separate-handlers)
  - [Platform Handlers](#platform-handlers)
  - [Event Listeners](#event-listeners)
- [Routing Helpers](#routing-helpers)
  - [getMappedIntentName](#getmappedintentname)
  - [getRoute](#getroute)

## Introduction to Routing

Typically, routing in a Jovo app is done in the `app.js` file in the `src` folder of your project. By default, routing elements are added by using the `setHandler` method.

This is what a simple handler looks like:

```javascript
// @language=javascript
// src/app.js

app.setHandler({
	LAUNCH() {
		return this.toIntent('HelloWorldIntent');
	},

	HelloWorldIntent() {
		this.ask("Hello World! What's your name?", 'Please tell me your name.');
	},

	MyNameIsIntent() {
		this.tell('Hey ' + this.$inputs.name.value + ', nice to meet you!');
	},
});

// @language=typescript
// src/app.ts

app.setHandler({
	LAUNCH() {
		return this.toIntent('HelloWorldIntent');
	},

	HelloWorldIntent() {
		this.ask("Hello World! What's your name?", 'Please tell me your name.');
	},

	MyNameIsIntent() {
		this.tell('Hey ' + this.$inputs.name.value + ', nice to meet you!');
	},
});
```

The handlers make use of JavaScript Promises and `async/await`. This means the handler routes through all applicable intents and then returns a response when the handling promise gets resolved. This means that, for asynchronous operations (like API calls), you need to add `async` to your handler functions:

```javascript
app.setHandler({
	LAUNCH() {
		return this.toIntent('QuoteIntent');
	},

	async QuoteIntent() {
		const quote = await getRandomQuote();

		this.tell(quote);
	},
});
```

> Tutorial: [Make an API Call with Jovo and async/await](https://v3.jovo.tech/tutorials/api-call)

Routing in a Jovo project consists of three key concepts:

- [Intents](#intents)
- [States](#states)
- [Input](#input)

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
		this.$speech.addText('Do you want to order something?');
		this.$reprompt.addText('Please answer with yes or no.');

		this.followUpState('OrderState').ask(this.$speech, this.$reprompt);
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

Jovo offers the ability to redirect incoming intents to others. For example, the sample voice app uses this to go from `LAUNCH` to `HelloWorldIntent`:

```javascript
app.setHandler({
	LAUNCH() {
		return this.toIntent('HelloWorldIntent');
	},

	HelloWorldIntent() {
		this.ask("Hello World! What's your name?", 'Please tell me your name.');
	},
});
```

You can use the following methods to redirect intents:

- [toIntent](#tointent)
- [toStateIntent](#tostateintent)
- [toStatelessIntent](#tostatelessintent)

> [Learn how to pass data between intents](../data './data').

### toIntent

Use `toIntent` to jump into a new intent within the same request.

```javascript
return this.toIntent(intent);

// Go to PizzaIntent
return this.toIntent('PizzaIntent');
```

### toStateIntent

Similar to [`toIntent`](#tointent), you can use `toStateIntent` to redirect to an intent inside a specific state.

The routing will look for an intent within the given state, and go there if available. If not, it will go to the fallback option outside your defined states.

```javascript
return this.toStateIntent(state, intent);

// Go to PizzaIntent in state Onboarding
return this.toStateIntent('OnboardingState', 'PizzaIntent');
```

### toStatelessIntent

If you're inside a state and want to go to a global intent, you can use `toStatelessIntent` to do exactly this:

```javascript
return this.toStatelessIntent(intent);

// Go to global PizzaIntent
return this.toStatelessIntent('PizzaIntent');
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

- [Separate Handlers](#separate-handlers)
- [Platform Handlers](#platform-handlers)
- [Event Listeners](#event-listeners)

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
		SecondState: require('./handlers/secondState'),
	}
);
```

The `stateless.js` file could look like this:

```javascript
module.exports = {
	LAUNCH() {
		this.followUpState('FirstState').ask('Do you want to get started?');
	},

	Unhandled() {
		this.toIntent('LAUNCH');
	},
};
```

### Platform Handlers

For cases where the experience differs on each platform, you can use the methods `setPlatformHandler` to overwrite the default handlers.

Here is an example that offers different output for the two platforms:

```javascript
const handlers = {
	LAUNCH() {
		return this.toIntent('HelloWorldIntent');
	},
};

const alexaHandlers = {
	HelloWorldIntent() {
		this.tell('Hello Alexa User.');
	},
};

const googleAssistantHandlers = {
	HelloWorldIntent() {
		this.tell('Hello Google User.');
	},
};

app.setHandler(handlers);
app.setPlatformHandler('Alexa', alexaHandlers);
app.setPlatformHandler('GoogleAssistant', googleAssistantHandlers);
```

It is important to note that the first parameter of `setPlatformHandler` has to be the name of an installed platform, otherwise an error will be thrown.

### Event Listeners

Event Listeners offer a way for you to react on certain events like `onRequest` and `onResponse`.

```javascript
app.onRequest(function(jovo) {
    // ...
}
```

> [Find out more about Event Listeners here](./event-listeners.md './routing/event-listeners').

## Routing Helpers

Most information that is necessary for routing can be accessed through the [Jovo `$request` object](../requests-responses/request.md './requests-responses/request'). The Jovo context object (`this`) offers some additional helpful methods.

### getMappedIntentName

While `this.$request.getIntentName()` only makes it possible to access the intent name as it can be found in the request, this method allows you to access the intent _after_ the mapping (see: [intentMap](./intents.md#intentMap './routing/intents#intentMap')) is done:

```javascript
this.getMappedIntentName();
```

### getRoute

This method allows you to access additional information about the whole routing:

```javascript
this.getRoute();
```

<!--[metadata]: { "description": "Learn how to route through your voice app logic with Jovo.", "route": "routing" }-->
