# Amazon Alexa Platform Integration

> To view this page on the Jovo website, visit https://v3.jovo.tech/marketplace/jovo-platform-alexa

Learn more about Alexa specific features that can be used with the Jovo Framework.

* [Introduction](#introduction)
	* [Installation](#installation)
	* [Quickstart](#quickstart)
* [Configuration](#configuration)
* [$alexaSkill Object](#alexaskill-object)
* [Jovo Language Model](#jovo-language-model)
	* [Dynamic Entities](#dynamic-entities)
* [Permissions and Data](#permissions-and-data)
* [Alexa Skill Interfaces](#alexa-skill-interfaces)
* [Monetization](#monetization)
* [Progressive Responses](#progressive-responses)

## Introduction

### Installation

```sh
$ npm install --save jovo-platform-alexa
```

Import the installed module, initialize and add it to the `app` object:

```javascript
// @language=javascript

// src/app.js
const { Alexa } = require('jovo-platform-alexa');

app.use(new Alexa());

// @language=typescript

// src/app.ts
import { Alexa } from 'jovo-platform-alexa';

app.use(new Alexa());
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

# Create Alexa-only Jovo project
$ jovo3 new <directory> --template alexa


// @language=typescript

# Create default Jovo project (Alexa and Google Assistant)
$ jovo3 new <directory> --language typescript

# Create Alexa-only Jovo project
$ jovo3 new <directory> --template alexa --language typescript
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

## Configuration

Using the `project.js` in your project directory, you can configure your skill specifically for your needs. Using [stages](https://v3.jovo.tech/docs/project-js#stages), you can also utilize different configurations for different environments.

The following elements can be added to the `alexaSkill` object:

```js
{
  alexaSkill: {
    skillId: '<your-skill-id>',
    askProfile: '<your-ask-cli-profile>'
  },
}
```

In the deployment process with the Jovo CLI ([`jovo deploy`](../basic-concepts/cli/deploy './cli/deploy')), `skillId` and `askProfile` are by default taken from the existing `config` in the `/platforms/alexaSkill/.ask` folder. Specifying those in the `project.js` to override the existing platform files is especially useful if you have different versions of the Alexa Skill in separate developer accounts (see [Stages](#stages)).

### skill.json Overrides

You can also add information to go into the `skill.json`. You can basically add or override any element that you can find in the skill manifest:

```js
{
  alexaSkill: {
    manifest: {
      // Add elements to override here.
    }
  },
}
```

To add an object, make sure to add the same path it has in the `skill.json`. The below example (from our [Alexa Audioplayer Template](https://github.com/jovotech/jovo-templates/tree/master/alexa/audioplayer)) adds the Audioplayer Directive to the Alexa Skill:

```js
{
  alexaSkill: {
    manifest: {
      apis: {
        custom: {
          interfaces: [
            {
              type: 'AUDIO_PLAYER',
            }
          ]
        }
      }
    }
  }
}
```

## $alexaSkill Object

The `$alexaSkill` object holds references to every Alexa-specific feature:

```javascript
// @language=javascript

this.$alexaSkill

// @language=typescript

this.$alexaSkill!
```

## Jovo Language Model

> For a general understanding of the Jovo Language Model, check out the [platform-independent docs](https://v3.jovo.tech/docs/model)

When using the Jovo Language Model you can add an `alexa` object to each intent. In there you can define the intent name for Alexa specifically:

```js
{
	"name": "NextIntent",
	"alexa": {
		"name": "AMAZON.NextIntent"
	},
	"phrases": [
		"skip",
		"next",
		"next one",
		"skip please",
		"next one please",
		"skip the episode",
		"skip to next episode",
		"skip to the next episode",
		"next episode",
		"would like the next episode",
		"I would like the next episode",
		"I would like to listen to the next episode"
	]
},
```

But, that way, the `AMAZON.NextIntent` would still be extended using the utterances in the `phrases` array. To specify Alexa-specific utterances you can add a `samples` array as well. If you keep the array empty, the intent won't be extended at all:

```js
{
	"name": "NextIntent",
	"alexa": {
		"name": "AMAZON.NextIntent",
		"samples": []
	},
	"phrases": [
		"skip",
		"next",
		"next one",
		"skip please",
		"next one please",
		"skip the episode",
		"skip to next episode",
		"skip to the next episode",
		"next episode",
		"would like the next episode",
		"I would like the next episode",
		"I would like to listen to the next episode"
	]
},
```

When using slots in your intents, you can define platform-specific slot types:

```js
{
	"name": "ChooseFromListIntent",
	"phrases": [
		"{ordinal}",
		"{ordinal} one please",
		"{ordinal} one",
		"{ordinal} episode"
	],
	"inputs": [
		{
			"name": "ordinal",
			"type": {
				"alexa": "ordinal",
				"dialogflow": "@sys.ordinal"
			}
		}
	]
},
```

Last but not least, you can add an `alexa` object at the root of the Jovo Language Model which has the same syntax as the original Alexa interaction model. Both the platform-independent Jovo Language Model and the `alexa` part will be merged when building:

```js
"alexa": {
	"interactionModel": {
		"languageModel": {
			"intents": [
				{
					"name": "AMAZON.CancelIntent",
					"samples": []
				},
				{
					"name": "AMAZON.HelpIntent",
					"samples": []
				},
				{
					"name": "AMAZON.StopIntent",
					"samples": []
				}
			]
		}
	}
}
```

### Dynamic Entities

If you want to augment your existing entities depending on a dynamic change in data or context, you can use Dynamic Entities to dynamically create new entities during your session. These will be resolved in addition to your static slot values and are valid for a total time of 30 minutes, even after the user session has ended, although we recommend to clear every dynamic entity as soon as the session ends.

Here is the official reference by Amazon: [Dynamic Entities](https://developer.amazon.com/en-US/docs/alexa/custom-skills/use-dynamic-entities-for-customized-interactions.html).

```javascript
// You can use either of these functions, depending on your use case.

// Adds a single dynamic entity.
this.$alexaSkill.addDynamicEntityType({
	name: 'FruitInput',
	values: [
		{
			name: {
				value: 'apple',
				synonyms: ['red apple', 'sweet apple']
			}
		},
		{
			name: {
				value: 'banana',
				synonyms: ['yellow banana'],
				id: 'banana'
			}
		}
	]
});

// Adds an array of dynamic entities.
this.$alexaSkill.addDynamicEntityTypes([
	{
		name: 'FruitInput',
		values: [
			{
				name: {
					value: 'peach'
				}
			}
		]
	}
]);

// Use this function to add one or multiple dynamic entities.
this.$alexaSkill.replaceDynamicEntities({
	name: 'FruitInput',
	values: [
		{
			name: {
				value: 'strawberry'
			}
		}
	]
});

// Or
this.$alexaSkill.replaceDynamicEntities([
	{
		name: 'FruitInput',
		values: [
			{
				name: {
					value: 'kiwi'
				}
			}
		]
	}
]);
```

## Permissions and Data

There are a lot of Alexa specific permissions and data that a Skill can use, such as:

* Location
* Contact Information
* Lists
* Reminders
* Settings
* Skill Events

> [You can find more about Alexa Permissions and Data here](https://v3.jovo.tech/marketplace/jovo-platform-alexa/permissions-data).

## Alexa Skill Interfaces

* [Audio Player](https://v3.jovo.tech/marketplace/jovo-platform-alexa/interfaces/audio-player)
* [Dialog](https://v3.jovo.tech/marketplace/jovo-platform-alexa/interfaces/dialog)
* [Game Engine & Gadget Controller](https://v3.jovo.tech/marketplace/jovo-platform-alexa/interfaces/game-engine-gadget-controller)
* [Proactive Events](https://v3.jovo.tech/marketplace/jovo-platform-alexa/interfaces/proactive-events)
* [Visual Output](https://v3.jovo.tech/marketplace/jovo-platform-alexa/interfaces/visual-output)

Learn more about the different Alexa Skill Interface types here: [Alexa Skill Interfaces](https://v3.jovo.tech/marketplace/jovo-platform-alexa/interfaces).

## Monetization

### Amazon Pay

Learn how to sell physical goods and services in your Alexa Skills using Amazon Pay and Jovo. Find out more here: [Amazon Pay Docs](https://v3.jovo.tech/marketplace/jovo-platform-alexa/monetization/amazon-pay).

### In-Skill-Purchasing (ISP)

Learn how to sell digital goods in your Alexa Skills using Alexa In-Skill Purchases (ISPs). Find out more here: [Alexa ISP Docs](https://v3.jovo.tech/marketplace/jovo-platform-alexa/monetization/in-skill-purchases).

## Progressive Responses

For responses that require long processing times, you can use progressive responses to tell your users that you are currently working on fulfilling their request.

Here is the official reference by Amazon: [Send the User a Progressive Response](https://developer.amazon.com/docs/custom-skills/send-the-user-a-progressive-response.html).

```javascript
// @language=javascript

this.$alexaSkill.progressiveResponse(speech);

// Example
this.$alexaSkill.progressiveResponse('Processing')
    .then(() => this.$alexaSkill.progressiveResponse('Still processing'));
await dummyApiCall(2000);

this.tell('Text after API call');

// @language=typescript

this.$alexaSkill!.progressiveResponse(speech: string);

// Example
this.$alexaSkill!.progressiveResponse('Processing')
    .then(() => this.$alexaSkill!.progressiveResponse('Still processing'));
await dummyApiCall(2000);

this.tell('Text after API call');
```

> Find an example file here: [`appProgressiveResponse.js`](https://github.com/jovotech/jovo-framework/blob/master/examples/javascript/01_alexa/progressive-response/src/app.js).
