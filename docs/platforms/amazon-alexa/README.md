# Amazon Alexa

Learn more about Alexa specific features that can be used with the Jovo Framework.

* [Introduction to Alexa Specific Features](#introduction-to-alexa-specific-features)
* [Routing](#routing)
  * [Dialog Interface](#dialog-interface)
* [Data](#data)
  * [Shopping and To Do Lists](#shopping-and-to-do-lists)
  * [Location](#location)
  * [Contact information](#contact-information)
* [Output](#output)
  * [Progressive Responses](#progressive-responses)
  * [Visual Output](#visual-output)
* [AudioPlayer Skills](#audioplayer-skills)
* [Skill Events](#skill-events)
* [CanFulfillIntentRequest](#canfulfillintentrequest)
* [GameEngine Interface](#gameengine-interface)
* [GadgetController Interface](#gadgetcontroller-interface)
* [In-Skill-Purchasing (ISP)](#in-skill-purchasing-isp)
* [Amazon Pay](#amazon-pay)
* [Reminders API](#reminders-api)
* [Settings API](#settings-api)
* [Proactive Events API](#proactive-events-api)
* [Playback Controller](#playback-controller)

## Introduction to Alexa Specific Features

> Find an introduction to how Amazon Alexa works here: [Getting Started > Voice App Basics > Amazon Alexa](../../01_getting-started/voice-app-basics.md/#amazon-alexa './voice-app-basics#amazon-alexa').

You can access the `alexaSkill` object like this:

```javascript
// @language=javascript

this.$alexaSkill

// @language=typescript

this.$alexaSkill!
```
## Routing

This section provides an overview of Alexa specific features for routing. For the basic concept, take a look here: [Basic Concepts > Routing](../../basic-concepts/routing './routing').

### Dialog Interface

> [You can find more about Dialog Interface here](./dialog.md './amazon-alexa/dialog-interface').

## Data

This section provides an overview of Alexa specific features for user data. For the basic concept, take a look here: [Basic Concepts > Data](../../basic-concepts/data './data').

> [You can find more about Alexa Data here](./data.md './amazon-alexa/data').

### Shopping and To Do Lists

> [You can find more about lists here](./lists.md './amazon-alexa/lists').

### Location

> [Learn how to access your user's location data here](./data.md#location './amazon-alexa/data#location').

### Contact information

> [Learn how to access your user's contact information data here](./data.md#contact-information './amazon-alexa/data#contact-information').

## Output

This section provides an overview of Alexa specific features for output. For the basic concept, take a look here: [Basic Concepts > Output](../../basic-concepts/output './output').

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

### Visual Output

> [You can find out more about visual output here](./visual.md './amazon-alexa/visual').


## AudioPlayer Skills

> [You can find more about Jovo Audioplayer support here](./audioplayer.md './amazon-alexa/audioplayer').


## Skill Events

> [Learn how to implement Alexa Skill Events in your Jovo project here](./skillevents.md './amazon-alexa/skill-events')

## CanFulfillIntentRequest

> [Learn how to implement the CanFulfillIntentRequests in your Jovo project here](./canfulfill.md './amazon-alexa/canfulfill')

## GameEngine Interface

> [You can find more about Jovo GameEngine support here](./game-engine.md './amazon-alexa/game-engine')

## GadgetController Interface

> [Learn how to implement the GadgetController Interface in your Jovo project here](./gadget-controller.md './amazon-alexa/gadget-controller')

## In-Skill-Purchasing (ISP)

> [Find out more about In-Skill-Purchasing here](./in-skill-purchases.md './amazon-alexa/in-skill-purchases')

## Amazon Pay

> [Find out more about Amazon Pay here](./pay.md './amazon-alexa/pay')

## Reminders API

> [Learn how to use the Reminders API to set reminders for your user](./reminders.md './amazon-alexa/reminders')

## Settings API

> [You can find out more about the Settings API here](./settings.md './amazon-alexa/settings')

## Proactive Events API

> [You can find out more about the Proactive Events API here](./proactive-events.md './amazon-alexa/proactive-events')

## Playback Controller

> [Learn how to use the Playback Controller interface with Jovo here](./audioplayer.md#playback-controller './amazon-alexa/audioplayer#playback-controller')


<!--[metadata]: {"description": "Build Alexa Skills with the Jovo Framework. Learn more about Alexa specific features here",
                "route": "amazon-alexa"}-->
