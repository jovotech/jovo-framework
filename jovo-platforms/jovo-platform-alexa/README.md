# Amazon Alexa Platform Integration

Learn more about Alexa specific features that can be used with the Jovo Framework.

- [Introduction to Alexa Specific Features](#introduction-to-alexa-specific-features)
- [Routing](#routing)
  - [Dialog Interface](#dialog-interface)
- [Data](#data)
  - [Shopping and To Do Lists](#shopping-and-to-do-lists)
  - [Location](#location)
  - [Contact information](#contact-information)
- [Output](#output)
  - [Progressive Responses](#progressive-responses)
  - [Visual Output](#visual-output)
- [AudioPlayer Skills](#audioplayer-skills)
- [Skill Events](#skill-events)
- [CanFulfillIntentRequest](#canfulfillintentrequest)
- [GameEngine Interface](#gameengine-interface)
- [GadgetController Interface](#gadgetcontroller-interface)
- [In-Skill-Purchasing (ISP)](#in-skill-purchasing-isp)
- [Amazon Pay](#amazon-pay)
- [Reminders API](#reminders-api)
- [Settings API](#settings-api)
- [Proactive Events API](#proactive-events-api)
- [Playback Controller](#playback-controller)

## Introduction to Alexa Specific Features

> Find an introduction to how Amazon Alexa works here: [Getting Started > Voice App Basics > Amazon Alexa](https://www.jovo.tech/docs/voice-app-basics#amazon-alexa).

```sh
npm install --save jovo-platform-alexa
```

You can access the `alexaSkill` object like this:

```javascript
// @language=javascript

this.$alexaSkill

// @language=typescript

this.$alexaSkill!
```

## Routing

This section provides an overview of Alexa specific features for routing. For the basic concept, take a look here: [Basic Concepts > Routing](https://www.jovo.tech/docs/routing).

### Dialog Interface

> [You can find more about Dialog Interface here](./dialog-interface.md './dialog-interface').

## Data

This section provides an overview of Alexa specific features for user data. For the basic concept, take a look here: [Basic Concepts > Data](https://www.jovo.tech/docs/data).

> [You can find more about Alexa Data here](./data.md './data').

### Shopping and To Do Lists

> [You can find more about lists here](./lists.md './lists').

### Location

> [Learn how to access your user's location data here](./data.md#location './data#location').

### Contact information

> [Learn how to access your user's contact information data here](./data.md#contact-information './data#contact-information').

## Output

This section provides an overview of Alexa specific features for output. For the basic concept, take a look here: [Basic Concepts > Output](https://www.jovo.tech/docs/output).

### Progressive Responses

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

### Visual Output

> [You can find out more about visual output here](./visual-output.md './visual-output').

## AudioPlayer Skills

> [You can find more about Jovo Audioplayer support here](./audioplayer.md './audioplayer').

## Skill Events

> [Learn how to implement Alexa Skill Events in your Jovo project here](./skill-events.md './skill-events')

## CanFulfillIntentRequest

> [Learn how to implement the CanFulfillIntentRequests in your Jovo project here](./canfulfill.md './canfulfill')

## GameEngine Interface

> [You can find more about Jovo GameEngine support here](./game-engine.md './game-engine')

## GadgetController Interface

> [Learn how to implement the GadgetController Interface in your Jovo project here](./gadget-controller.md './gadget-controller')

## In-Skill-Purchasing (ISP)

> [Find out more about In-Skill-Purchasing here](./in-skill-purchases.md './in-skill-purchases')

## Amazon Pay

> [Find out more about Amazon Pay here](./amazon-pay.md './amazon-pay')

## Reminders API

> [Learn how to use the Reminders API to set reminders for your user](./reminders.md './reminders')

## Settings API

> [You can find out more about the Settings API here](./settings.md './settings')

## Proactive Events API

> [You can find out more about the Proactive Events API here](./proactive-events.md './proactive-events')

## Playback Controller

> [Learn how to use the Playback Controller interface with Jovo here](./audioplayer.md#playback-controller './audioplayer#playback-controller')