# States

> To view this page on the Jovo website, visit https://v3.jovo.tech/docs/routing/states

Learn how to use states in your apps built with the Jovo Framework.

- [Introduction](#introduction)
- [followUpState](#followupstate)
- [Nested States](#nested-states)
- [Remove a State](#remove-a-state)

## Introduction

For simple voice apps, the structure to handle the logic is quite simple:

```javascript
app.setHandler({
	LAUNCH() {
		// Do something
	},

	YesIntent() {
		// Do something
	},

	NoIntent() {
		// Do something
	},

	END() {
		// Do something
	},
});
```

This means, no matter how deep into the conversation with your voice app the user is, they will always end up at a specific `YesIntent` or `NoIntent`. As a developer, you need to figure out yourself which question they just answered with "Yes."

This is where `states` can be helpful. For more complex voice apps that include multiple user flows, it is necessary to remember and route through some user states to understand at which position the conversation currently is. For example, especially "Yes" and "No" as answers might show up across your voice app for a various number of questions. For each question, a state would be very helpful to distinct between different Yes's and No's.

With Jovo, you can include states like this:

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

By routing a user to a state (by using [`followUpState`](#followupstate)), this means you can react specifically to this certain situation in the process.

When a user is in a certain state and calls an intent, Jovo will first look if that intent is available in the given state. If not, a fallback option needs to be provided outside any state:

```javascript
app.setHandler({
	LAUNCH() {
		// do something
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

	YesIntent() {
		// Do something
	},

	NoIntent() {
		// Do something
	},

	END() {
		// Do something
	},
});
```

Alternatively, you can also use an [`Unhandled`](./intents.md#unhandled './intents#unhandled') intent:

```javascript
app.setHandler({
	LAUNCH() {
		// do something
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

	Unhandled() {
		// Do something
	},

	END() {
		// Do something
	},
});
```

## followUpState

If you want to route a user to a state after you asked a specific question, you can add a `followUpState`. It is important that you do this before your `ask` call. For example, you can prepend it like this:

```javascript
this.followUpState(stateName).ask(speech, reprompt);
```

This way, the voice app will first look if the response-intent is available in the given state. If not, it will go to the default called intent if it's available outside a state.

```javascript
app.setHandler({
	LAUNCH() {
		// Ask for a yes-no-question and route to order state
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

	// Default intents without states below

	Unhandled() {
		// Do something
	},

	END() {
		// do something
	},
});
```

## Nested States

You can also nest states for more complex multi-turn conversations:

```javascript
app.setHandler({
	// Other intents

	State1: {
		// Other intents

		SomeIntent() {
			this.followUpState('State1.State2').ask('Do you want to proceed?');
		},

		State2: {
			SomeIntent() {
				// Do something
			},
		},
	},
});
```

You can nest as many states as you want. As they are objects, you reach them with the `.` separator. You can also use `this.getState()` to access the current state:

```javascript
this.followUpState(this.getState() + '.State2');
```

## Remove a State

If you are inside a state and want to move outside to a global (stateless) intent in the next request, you have two options:

```javascript
this.removeState();

// Alternative: Use null as followUpState
this.followUpState(null);
```

<!--[metadata]: { "description": "Learn how to use states in your apps with the Jovo Framework.", "route": "routing/states" }-->
