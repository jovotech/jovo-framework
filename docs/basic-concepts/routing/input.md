# Input

> To view this page on the Jovo website, visit https://v3.jovo.tech/docs/routing/input

In this section, you will learn how to deal with entities and slot values provided by your users.

- [Introduction to User Input](#introduction-to-user-input)
- [How to Access Input](#how-to-access-input)
- [inputMap](#inputmap)
- [Validation](#validation)

## Introduction to User Input

> [Learn how to add inputs to the Jovo Language Model here](../model '../model').

We call user input any additional information your user provides besides an `intent`. For example, on Amazon Alexa, input is usually called a `slot`, on Google Assistant/Dialogflow an `entity` or `parameter`.

## How to Access Input

You can access the complete object of inputs with `this.$inputs`, and a specific input by its name: `this.$inputs.name`.

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

## inputMap

Similar to [`intentMap`](./intents.md#intentmap './intents#intentmap'), there are cases where it might be valuable (due to naming conventions on different platforms or built-in input types) to map different input entities to one defined Jovo `inputName`. You can add this to the configuration section of your voice app:

```javascript
// @language=javascript

// src/config.js

module.exports = {
	inputMap: {
		incomingInputName: 'mappedInputName',
	},

	// ...
};

// @language=typescript

// src/config.ts

const config = {
	inputMap: {
		incomingInputName: 'mappedInputName',
	},

	// ...
};
```

Example: You want to ask your users for their name and created a slot called `name` on the Amazon Developer Platform. However, on Dialogflow, you decided to use the pre-defined entity `given-name`. You can now use an inputMap to match incoming inputs from Alexa and Google.

```javascript
// @language=javascript

// src/config.js

module.exports = {
	inputMap: {
		'given-name': 'name',
	},

	// ...
};

// @language=typescript

// src/config.ts

const config = {
	inputMap: {
		'given-name': 'name',
	},

	// ...
};
```

With this, you can use `name` to get the input with both Alexa and Google requests:

```javascript
// @language=javascript

// src/app.js

app.setHandler({
	MyNameIsIntent() {
		this.tell('Hello ' + this.$inputs.name.value + '!');
	},

	// ...
});

// @language=typescript

// src/app.ts

app.setHandler({
	MyNameIsIntent() {
		this.tell('Hello ' + this.$inputs.name.value + '!');
	},

	// ...
});
```

## Validation

Jovo input validation allows you to register multiple validators per input in your handlers.

```javascript
// @language=javascript

// app.js

MyNameIsIntent() {
    const schema = {
        name: new IsRequiredValidator()
    };

    const validation = this.validate(schema);

    if(validation.failed('name')) {
        return this.ask('Please tell me your name again.');
    }

    this.tell(`Hey ${this.$inputs.name.value}!`);
}

// @language=typescript

// app.ts

MyNameIsIntent() {
    const schema = {
        name: new IsRequiredValidator()
    };

    const validation = this.validate(schema);

    if(validation.failed('name')) {
        return this.ask('Please tell me your name again.');
    }

    this.tell(`Hey ${this.$inputs.name.value}!`);
}
```

After defining your schema, where you define how you want to validate your inputs for the current intent, the core function of input validation `this.validate()` will be called. This will return an object containing a function `failed()`. You can use it to check, if the validation failed for a specific case.

```javascript
// @language=javascript

if (validation.failed()) {
} // Input validation failed in general
if (validation.failed('name')) {
} // Input validation failed for input field 'name'
if (validation.failed('IsRequiredValidator')) {
} // Input validation failed for a specific validator
if (validation.failed('name', 'IsRequiredValidator')) {
} // Input validation failed for input field 'name' and a specific validator

// @language=typescript

if (validation.failed()) {
} // Input validation failed in general
if (validation.failed('name')) {
} // Input validation failed for input field 'name'
if (validation.failed('IsRequiredValidator')) {
} // Input validation failed for a specific validator
if (validation.failed('name', 'IsRequiredValidator')) {
} // Input validation failed for input field 'name' and a specific validator
```

You can validate your input in multiple ways, either as a specific Validator, your own function or a mixture from both in an array.
The Validation Plugin already offers you multiple built-in Validators to choose from, each with its own functionality and set of parameter attributes.

```javascript
// @language=javascript

// MyNameIsIntent

const schema = {
	name: [
		new IsRequiredValidator(), // check if current input is required and present
		new ValidValuesValidator([
			// fails if current input value does not match one of the registered values
			'James',
			'John',
		]),
		new InvalidValuesValidator([
			// fails if current input value matches one of the registered values
			'Mercedes',
			'Toyota',
		]),
		function () {
			if (this.$inputs.name.value === 'someValue') {
				throw new ValidationError(
					'OwnFunctionValidator',
					'My own validator function failed.'
				);
			}
		},
	],
};

// @language=typescript

// MyNameIsIntent

const schema = {
	name: [
		new IsRequiredValidator(), // check if current input is required and present
		new ValidValuesValidator([
			// fails if current input value does not match one of the registered values, accepts string and regex values
			'James',
			'John',
			/S.*n/g,
		]),
		new InvalidValuesValidator([
			// fails if current input value matches one of the registered values, accepts string and regex values
			'Mercedes',
			'Toyota',
			/S.*n/g,
		]),
		function (this: Jovo) {
			if (this.$inputs.name.value === 'someValue') {
				throw new ValidationError(
					'OwnFunctionValidator',
					'My own validator function failed.'
				);
			}
		},
	],
};
```

Each Validator derives from a base abstract class `Validator`, which contains an abstract function `validate()` that gets overwritten by each deriving Validator. This means that besides using a function, you can easily write your own Validators and use them with the built-in Validators.

```javascript
// @language=javascript

// OwnValidator.js

const { Validator, Jovo, ValidationError } = require('jovo-core');

class OwnValidator extends Validator {
	validate(jovo) {
		if (['invalidName1', 'invalidName2'].includes(jovo.$inputs.name.value)) {
			throw new ValidationError(
				this.constructor.name,
				`My own validator failed for ${jovo.$inputs.name.value}.`
			);
		}
	}
}

module.exports = { OwnValidator };

// MyNameIsIntent

const schema = {
	name: [new IsRequiredValidator(), new OwnValidator()],
};

// @language=typescript

// OwnValidator.ts

import { Validator, Jovo, ValidationError } from 'jovo-core';

export class OwnValidator extends Validator {
	validate(jovo: Jovo) {
		if (['invalidName1', 'invalidName2'].includes(jovo.$inputs.name.value)) {
			throw new ValidationError(
				this.constructor.name,
				`My own validator failed for ${jovo.$inputs.name.value}.`
			);
		}
	}
}

// MyNameIsIntent

const schema = {
	name: [new IsRequiredValidator(), new OwnValidator()],
};
```

Regardless of whether you're using your own function or Validator, whenever you want to mark a path as failed you need to throw a ValidationError. This class expects at least a Validator identifier and an optional error message. Both of these can be used as a filter in the returned `failed()` function. This can be useful if you want to throw multiple ValidationErrors per function.

```javascript
// @language=javascript

// MyNameIsIntent

const schema = {
	name: function () {
		if (this.$inputs.name.value === 'someValue') {
			throw new ValidationError(
				'OwnFunctionValidator',
				'My own validator function failed.'
			);
		}
	},
};

const validation = this.validate(schema);

if (
	validation.failed(
		'name',
		'OwnFunctionValidator',
		'My own validator function failed.'
	)
) {
	// ...
}

// @language=typescript

// MyNameIsIntent

const schema = {
	name: function (this: Jovo) {
		if (this.$inputs.name.value === 'someValue') {
			throw new ValidationError(
				'OwnFunctionValidator',
				'My own validator function failed.'
			);
		}
	},
};

const validation = this.validate(schema);

if (
	validation.failed(
		'name',
		'OwnFunctionValidator',
		'My own validator function failed.'
	)
) {
	// ...
}
```

You can even use async/await in your own function/Validator for asynchronous calls. For this, simply use `await this.validateAsync()` instead of `this.validate()`.

<!--[metadata]: {"description": "Learn how to deal with entities and slot values provided by your users.", "route": "routing/input"}-->
