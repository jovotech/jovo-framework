# Google Assistant Platform Integration

> To view this page on the Jovo website, visit https://v3.jovo.tech/marketplace/jovo-platform-googleassistant

Learn more about Google Assistant specific features that can be used with the Jovo Framework.

* [Introduction](#introduction)
	* [Installation](#installation)
	* [Quickstart](#quickstart)
* [$googleAction Object](#googleaction-object)
* [Jovo Language Model](#jovo-language-model)
* [User Data & Permissions](#user-data--permissions)
* [Google Action Interfaces](#google-action-interfaces)
* [Google Transactions](#google-transactions)
* [Output](#output)
	* [Multiple Reprompts](#multiple-reprompts)
	* [Confirmation](#confirmation)

## Introduction

### Installation

```sh
$ npm install --save jovo-platform-googleassistant
```

Import the installed module, initialize and add it to the `app` object:

```javascript
// @language=javascript

// src/app.js
const { GoogleAssistant } = require('jovo-platform-googleassistant');

app.use(new GoogleAssistant());

// @language=typescript

// src/app.ts
import { GoogleAssistant } from 'jovo-platform-googleassistant';

app.use(new GoogleAssistant());
```

### Quickstart

#### Install the Jovo CLI

We highly recommend using the Jovo CLI if you want to benefit from all the features coming with Jovo. You can learn more and find alternatives on our [installation page](https://v3.jovo.tech/docs/installation).

```sh
$ npm install -g jovo-cli
```


#### Create a new Jovo Project

You can create a Jovo project into a new directory with the following command:

```sh
// @language=javascript

# Create default Jovo project (Alexa and Google Assistant)
$ jovo3 new <directory>

# Create Google Assistant only Jovo project
$ jovo3 new <directory> --template google


// @language=typescript

# Create default Jovo project (Alexa and Google Assistant)
$ jovo3 new <directory> --language typescript

# Create Google Assistant only Jovo project
$ jovo3 new <directory> --template google --language typescript
```

This will create a new folder, download the [Jovo "Hello World" template](https://v3.jovo.tech/templates/helloworld), and install all the necessary dependencies so you can get started right away.

This is how a typical Jovo project looks like:

```javascript
// @language=javascript

models/
  └── en-US.json
src/
  |── app.js
  |── config.js
  └── index.js
project.js

// @language=typescript

models/
  └── en-US.json
src/
  |── app.ts
  |── config.ts
  └── index.ts
project.js
```

> [Find out more about the Jovo project structure here](https://v3.jovo.tech/docs/project-structure).


#### Run and Test the Code

To test the logic of your code, you can use the local development server provided by Jovo, and the [Jovo Debugger](https://v3.jovo.tech/marketplace/jovo-plugin-debugger). 

To get started, use the following command:

```sh
// @language=javascript

# Run local development server
$ jovo3 run

// @language=typescript

# Run compiler
$ npm run tsc

# Run local development server
$ jovo3 run
```

This will start the development server on port `3000` and create a Jovo Webhook URL that can be used for local development. Copy this link and open it in your browser to use the [Jovo Debugger](https://v3.jovo.tech/marketplace/jovo-plugin-debugger).

![Jovo Debugger](https://v3.jovo.tech/img/docs/v3/jovo-debugger-helloworld.gif)

In the Debugger, you can quickly test if the flow of your voice app works. For this example, click on the `LAUNCH` button, and then specify a name on the `MyNameIsIntent` button. The Debugger will create requests and run them against your local webhook.
 
> [Find out more about requests and responses here](https://v3.jovo.tech/docs/requests-responses).

## $googleAction Object

The `$googleAction` object holds references to every Google Action specific feature:

```javascript
// @language=javascript

this.$googleAction

// @language=typescript

this.$googleAction!
```

## Jovo Language Model

> For a general understanding of the Jovo Language Model, check out the [platform-independent docs](https://v3.jovo.tech/docs/model)

You can add a `dialogflow` object at the root of the Jovo Language Model to add Dialogflow specific stuff using their original syntax. While building, it will be merged with the platform-independent stuff:

```js
"dialogflow": {
	"intents": [
		{
			"name": "Default Fallback Intent",
			"auto": true,
			"webhookUsed": true,
			"fallbackIntent": true
		},
		{
			"name": "Default Welcome Intent",
			"auto": true,
			"webhookUsed": true,
			"events": [
				{
					"name": "WELCOME"
				}
			]
		}
	]
},
```

### Session Entities

Session Entities work similar to [Alexa Dynamic Entities](https://v3.jovo.tech/marketplace/jovo-platform-alexa#dynamic-entities) in that you can enhance your existing static entities with dynamic ones to react to changes in user data or context. You can even choose whether to supplement or replace existing entities by providing an optional `EntityOverrideMode`.

Here is the official reference by Google: [Session Entities](https://cloud.google.com/dialogflow/docs/entities-session).

Session Entities are stored for 20 minutes, although we recommend to clear every session entity as soon as the user session ends.

```javascript
// You can use either of these functions, depending on your use case.

// Adds a single session entity.
this.$googleAction.addSessionEntityType({
	name: 'FruitInput',
	entities: [
		{
			value: 'apple',
			synonyms: ['red apple', 'sweet apple']
		},
		{
			value: 'banana',
			synonyms: ['yellow banana']
		}
	],
	entityOverrideMode: 'ENTITY_OVERRIDE_MODE_SUPPLEMENT'
});

// Adds an array of session entities.
this.$googleAction.addSessionEntityTypes([
	{
		name: 'FruitInput',
		entities: [
			{
				value: 'peach',
				synonyms: ['soft peach']
			}
		]
	}
]);

// Add a single session entity by providing the most basic properties as arguments.
this.$googleAction.addSessionEntity(
    'FruitInput', 
    'strawberry', 
    [ 'red strawberry' ]
);
```

## User Data & Permissions

There are a lot of Google Action specific user data and permissions that your voice app can use, such as:

* Contact Information
* Location
* Date and Time
* Account Linking

> [You can find out more about your Google Action user's data here](https://v3.jovo.tech/marketplace/jovo-platform-googleassistant/data-permissions).


## Google Action Interfaces

* [Media Response](https://v3.jovo.tech/marketplace/jovo-platform-googleassistant/interfaces/media-response)
* [Daily Update](https://v3.jovo.tech/marketplace/jovo-platform-googleassistant/interfaces/daily-updates)
* [Notifications](https://v3.jovo.tech/marketplace/jovo-platform-googleassistant/interfaces/notifications)
* [Routine Suggestions](https://v3.jovo.tech/marketplace/jovo-platform-googleassistant/interfaces/routine-suggestions)
* [Visual Output](https://v3.jovo.tech/marketplace/jovo-platform-googleassistant/interfaces/visual-output)

## Google Transactions

The Google Transactions feature allows you to sell digital and physical goods in your Google Actions. You can find the documentation [here](https://v3.jovo.tech/marketplace/jovo-platform-googleassistant/transactions).

## Output

Besides the platform independent [basic output](https://v3.jovo.tech/docs/output) capabilities and the ones specified in the *Interfaces* section of the docs, the Google Action platform supports the following two features:

### Multiple Reprompts

Google Assistant allows to add multiple reprompts that are spoken out in order if there is no response by the user. Here is the official reference by Google: [Static Reprompts](https://developers.google.com/actions/assistant/reprompts#static_reprompts).

The reprompts can be added to the [`ask`](https://v3.jovo.tech/docs/output#ask) method adding more parameters:

```javascript
this.ask(speech, reprompt1, reprompt2, goodbyeMessage);
```

The first two messages are usually reprompt messages, the third one is used to say goodbye to the user.

### Confirmation

You can ask your user to confirm something using the following method:

```javascript
// @language=javascript

this.$googleAction.askForConfirmation(text);

// Example
this.$googleAction.askForConfirmation('Is this correct?');

// @language=typescript

this.$googleAction!.askForConfirmation(text: string);

// Example
this.$googleAction!.askForConfirmation('Is this correct?');
```

The question should be one which can be answered with yes or no.

The user's response will be mapped to the `ON_CONFIRMATION` intent, where you can check wether they confirmed or not using `this.$googleAction.isConfirmed()`:

```javascript
// @language=javascript

ON_CONFIRMATION() {
    if (this.$googleAction.isConfirmed()) {
        this.tell('Confirmed')
    } else {
        this.tell('Not confirmed');
    }
}

// @language=typescript

ON_CONFIRMATION() {
    if (this.$googleAction!.isConfirmed()) {
        this.tell('Confirmed')
    } else {
        this.tell('Not confirmed');
    }
}
```