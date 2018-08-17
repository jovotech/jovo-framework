# [Platform Specific Features](../) > Amazon Alexa

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

## Introduction to Alexa Specific Features

> Find an introduction to how Amazon Alexa works here: [Getting Started > Voice App Basics > Amazon Alexa](../../01_getting-started/voice-app-basics.md/#amazon-alexa './voice-app-basics#amazon-alexa').

You can access the `alexaSkill` object like this:

```javascript
let alexa = this.alexaSkill();
```


## Routing

This section provides an overview of Alexa specific features for routing. For the basic concept, take a look here: [App Logic > Routing](../../04_app-logic/01_routing './routing').

### Dialog Interface

You can find more about dialog interface here: [Platform specifics > Amazon Alexa > Dialog Mode](./dialog.md './amazon-alexa/dialog-interface').

## Data

This section provides an overview of Alexa specific features for user data. For the basic concept, take a look here: [App Logic > Data](../../04_app-logic/02_data './amazon-alexa/data').

### Shopping and To Do Lists

You can find more about lists here: [Platform specifics > Amazon Alexa > Lists](./lists.md './amazon-alexa/lists').

### Location

Learn how to access your user's location data here: [Platform specifics > Amazon Alexa > Data](./data.md#location './amazon-alexa/data#location').

### Contact information

Learn how to access your user's contact information data here: [Platform specifics > Amazon Alexa > Contact information](./data.md#contact-information './amazon-alexa/data#contact-information').

## Output

This section provides an overview of Alexa specific features for output. For the basic concept, take a look here: [App Logic > Output](../../04_app-logic/03_output './output').

### Progressive Responses

For responses that require long processing times, you can use progressive responses to tell your users that you are currently working on fulfilling their request.

Here is the official reference by Amazon: [Send the User a Progressive Response](https://developer.amazon.com/docs/custom-skills/send-the-user-a-progressive-response.html).

```javascript
this.alexaSkill().progressiveResponse(speech);
```

Find an example file here: [`appProgressiveResponse.js`](https://github.com/jovotech/jovo-framework-nodejs/blob/master/examples/alexa_specific/appProgressiveResponse.js).

### Visual Output

You can find out more about visual output here: [Platform specifics > Amazon Alexa > Visual](./visual.md './amazon-alexa/visual').


## AudioPlayer Skills

You can find more about Jovo Audioplayer support here: [Platform specifics > Amazon Alexa > Audioplayer](./audioplayer.md './amazon-alexa/audioplayer').


## Skill Events

Learn how to implement Alexa Skill Events in your Jovo project here: [Platform specifics > Amazon Alexa > Skill Events](./skillevents.md './amazon-alexa/skill-events')

## CanFulfillIntentRequest

Learn how to implement the CanFulfillIntentRequests in your Jovo project here: [Platform specifics > Amazon Alexa > CanFulfillIntentRequest](./canfulfill.md './amazon-alexa/canfulfill')

## GameEngine Interface

You can find more about Jovo GameEngine support here: [Platform specifics > Amazon Alexa > GameEngine](./game-engine.md './amazon-alexa/game-engine')

## GadgetController Interface

Learn how to implement the GadgetController Interface in your Jovo project here: [Platform specifics > Amazon Alexa > GadgetController](./gadget-controller.md './amazon-alexa/gadget-controller')

<!--[metadata]: {"title": "Amazon Alexa Specific Features", 
                 "description": "Build Alexa Skills with the Jovo Framework. Learn more about Alexa specific features here",                              "activeSections": ["platforms", "alexa", "alexa_index"], 
                 "expandedSections": "platforms", "inSections": "platforms", 
                 "breadCrumbs": {"Docs": "docs/", 
                                 "Platforms": "docs/platforms",
                                 "Amazon Alexa": "" }, 
                 "commentsID": "framework/docs/amazon-alexa", 
                 "route": "docs/amazon-alexa" 
}-->
