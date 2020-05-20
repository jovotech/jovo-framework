# Amazon Alexa Platform Integration

Learn more about Alexa specific features that can be used with the Jovo Framework.

* [Introduction](#introduction)
   * [Installation](#installation)
   * [Quickstart](#quickstart)
* [Alexa-specific Features](#alexa-specific-features)
   * [Interaction Model](#interaction-model)
   * [Permissions and Data](#permissions-and-data)
   * [Output](#output)
   * [Alexa Skill Interfaces](#alexa-skill-interfaces)
   * [Monetization](#monetization)


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

We highly recommend using the Jovo CLI if you want to benefit from all the features coming with Jovo. You can learn more and find alternatives on our [installation page](https://www.jovo.tech/docs/installation).

```sh
$ npm install -g jovo-cli
```


#### Create a new Jovo Project

You can create a Jovo project into a new directory with the following command:

```sh
// @language=javascript

# Create default Jovo project (Alexa and Google Assistant)
$ jovo new <directory>

# Create Alexa-only Jovo project
$ jovo new <directory> --template alexa


// @language=typescript

# Create default Jovo project (Alexa and Google Assistant)
$ jovo new <directory> --language typescript

# Create Alexa-only Jovo project
$ jovo new <directory> --template alexa --language typescript
```

This will create a new folder, download the [Jovo "Hello World" template](https://www.jovo.tech/templates/helloworld), and install all the necessary dependencies so you can get started right away.

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

> [Find out more about the Jovo project structure here](https://www.jovo.tech/docs/project-structure).


#### Run and Test the Code

To test the logic of your code, you can use the local development server provided by Jovo, and the [Jovo Debugger](https://www.jovo.tech/marketplace/jovo-plugin-debugger). 

To get started, use the following command:

```sh
// @language=javascript

# Run local development server
$ jovo run

// @language=typescript

# Run compiler
$ npm run tsc

# Run local development server
$ jovo run
```

This will start the development server on port `3000` and create a Jovo Webhook URL that can be used for local development. Copy this link and open it in your browser to use the [Jovo Debugger](https://www.jovo.tech/marketplace/jovo-plugin-debugger).

![Jovo Debugger](https://www.jovo.tech/img/docs/v3/jovo-debugger-helloworld.gif)

In the Debugger, you can quickly test if the flow of your voice app works. For this example, click on the `LAUNCH` button, and then specify a name on the `MyNameIsIntent` button. The Debugger will create requests and run them against your local webhook.
 
> [Find out more about requests and responses here](https://www.jovo.tech/docs/requests-responses).


## Alexa-specific Features

You can access the `alexaSkill` object like this:

```javascript
// @language=javascript

this.$alexaSkill

// @language=typescript

this.$alexaSkill!
```


### Interaction Model

#### Dialog Interface

The Amazon Alexa Dialog Interface helps you manage multi-turn conversations with your user to gather the information needed to for your intent.
Here is the [official documentation by Amazon](https://developer.amazon.com/docs/custom-skills/dialog-interface-reference.html).
Every conversation is connected to an intent and it is maintained until all the required slots are filled or confirmed by the user. 

##### Requirements

To use the Dialog Interface, you need a dialog model, which you can create with the Skill Builder. In the dialog model, you select which slots are required for your intent and whether the user has to confirm them or the whole intent. You also define, which prompts Alexa should use and how the user might answer (utterances).

Please consider that you're not allowed to use the `AMAZON.LITERAL` slot type.

##### Dialog State

If the Dialog Interface is enabled, you will get a `dialogState` property with every request. It is used to determine whether the dialog has just `STARTED`, is `IN_PROGRESS` or already `COMPLETED`. 
When the intent is invoked for the first time, `dialogState` will be set to `STARTED`. It is only set to `COMPLETED`, if you let Alexa handle the whole conversation. We will get to that later on.

To check the dialog state, use: 

```javascript
// @language=javascript

this.$alexaSkill.$dialog.getState()

// @language=typescript

this.$alexaSkill!.$dialog.getState()
```

Jovo also allows you to check for a specific state:

```javascript
// @language=javascript

// STARTED
this.$alexaSkill.$dialog.isStarted()

// IN PROGRESS
this.$alexaSkill.$dialog.isInProgress()

// COMPLETED
this.$alexaSkill.$dialog.isCompleted()

// @language=typescript

// STARTED
this.$alexaSkill!.$dialog.isStarted()

// IN PROGRESS
this.$alexaSkill!.$dialog.isInProgress()

// COMPLETED
this.$alexaSkill!.$dialog.isCompleted()
```

##### Dialog Delegate

If you decide to delegate the conversation, Alexa will use the prompts you defined in your dialog model to fill the required slots. Alexa will also confirm both slots or the whole intent if you selected that in the dialog model.

To delegate the conversation, use:

```javascript
// @language=javascript

this.$alexaSkill.$dialog.delegate()

// @language=typescript

this.$alexaSkill!.$dialog.delegate()
```

Optionally you can also pass in an `Intent` object as described [here](https://developer.amazon.com/docs/custom-skills/dialog-interface-reference.html#pass-a-new-intent):

```javascript
// @language=javascript

const updatedIntent = {
    name: 'SearchFlightIntent',
    confirmationStatus: 'NONE'
};

this.$alexaSkill.$dialog.delegate(updatedIntent)

// @language=typescript

const updatedIntent = {
    name: 'SearchFlightIntent',
    confirmationStatus: 'NONE'
};

this.$alexaSkill!.$dialog.delegate(updatedIntent)
```

##### Control the Dialog in Your Code

The Dialog Interface allows you to jump in and control the conversation yourself. Keep in mind that the prompts you prepared in the Skill Builder are only used if you delegate the conversation to Alexa. The utterances are still being used.

You have the possibility the ask the user to fill a certain slot, confirm a slot, or confirm the whole intent. You can also update the intent if you have certain values, for example the user's name, saved in a database. 

From now on, parameters which are between these `[]` brackets are optional. These parameters are `repromptText` and `updatedIntent`. If you don't specifiy a `repromptText`, the speechText will be used twice. 

##### Slot Value

To check, whether a slot has a value or not, use:

```javascript
// @language=javascript

this.$alexaSkill.hasSlotValue('slotName')

// Example
this.$alexaSkill.hasSlotValue('name');

// @language=typescript

this.$alexaSkill!.hasSlotValue('slotName')

// Example
this.$alexaSkill!.hasSlotValue('name');
```

##### Elicit Slot

If you want the user to fill a slot, use:

```javascript
// @language=javascript

this.$alexaSkill.$dialog.elicitSlot(slotName, speechText[, repromptText, updatedIntent])

// Example
this.$alexaSkill.$dialog.elicitSlot('name', 'What\'s your name?', 'Can you tell me your name, please?');

// @language=typescript

this.$alexaSkill!.$dialog.elicitSlot(slotName, speechText[, repromptText, updatedIntent])

// Example
this.$alexaSkill!.$dialog.elicitSlot('name', 'What\'s your name?', 'Can you tell me your name, please?');
```

##### Confirm Slot

To confirm a slot use:

```javascript
// @language=javascript

this.$alexaSkill.$dialog.confirmSlot(slotname, speechText[, repromptText, updatedIntent])

// Example
this.$alexaSkill.$dialog.confirmSlot('name', 'Your name is ' + this.getInput('name').value + ', right?');

// @language=typescript

this.$alexaSkill!.$dialog.confirmSlot(slotname, speechText[, repromptText, updatedIntent])

// Example
this.$alexaSkill!.$dialog.confirmSlot('name', 'Your name is ' + this.getInput('name').value + ', right?');
```

##### Confirm Intent

To confirm the whole intent, use:

```javascript
// @language=javascript

this.$alexaSkill.$dialog.confirmIntent(speechText[, repromptText, updatedIntent])

// Example
this.$alexaSkill.$dialog.confirmIntent('Your name is ' + this.$inputs.name.value + ' and you are from ' + this.$inputs.city.value + ', correct?');

// @language=typescript

this.$alexaSkill!.$dialog.confirmIntent(speechText[, repromptText, updatedIntent])

// Example
this.$alexaSkill!.$dialog.confirmIntent('Your name is ' + this.$inputs.name.value + ' and you are from ' + this.$inputs.city.value + ', correct?');
```

##### Update Intent

Updating an intent gives you the ability to change slot values or the confirmation status for slots or intents. Here's an example:

You already have the user's name stored in the database, so you don't want to ask for it again. Therefor you just update the intent and add the slot value.

```javascript
// @language=javascript

let updatedIntent = {
    name: 'TestIntent',
    confirmationStatus: 'NONE',
    slots: {
        name:{
            name: 'name',
            value: this.$user.data.name,
            confirmationStatus: 'CONFIRMED',
        },
        city:{
            name: 'city',
            confirmationStatus: 'NONE',
        }
    }
};
// You update the intent and fill the name slot. There is only city slot left, so you can manually ask the user to fill that

this.$alexaSkill.$dialog.elicitSlot('city', 'Which city are you living in?', updatedIntent);

// @language=typescript

let updatedIntent = {
    name: 'TestIntent',
    confirmationStatus: 'NONE',
    slots: {
        name:{
            name: 'name',
            value: this.$user.data.name,
            confirmationStatus: 'CONFIRMED',
        },
        city:{
            Name: 'city',
            confirmationStatus: 'NONE',
        }
    }
};
// You update the intent and fill the name slot. There is only city slot left, so you can manually ask the user to fill that

this.$alexaSkill!.$dialog.elicitSlot('city', 'Which city are you living in?', updatedIntent);
```

##### Jovo Language Model

You can check out a sample implementation of the Dialog Interface in the Jovo language model here: [Alexa Dialog Interface Template](https://github.com/jovotech/jovo-templates/blob/master/alexa/dialoginterface/javascript/models/en-US.json)

#### Dynamic Entities

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

### Permissions and Data

There are a lot of Alexa specific permissions and data that a Skill can use, such as:

* Location
* Contact Information
* Lists
* Reminders
* Settings
* Skill Events
* CanFulfillIntentRequest

> [You can find more about Alexa Permissions and Data here](https://www.jovo.tech/marketplace/jovo-platform-alexa/permissions-data).




### Output

This section provides an overview of Alexa specific features for output. For the basic concept, take a look here: [Docs: Basic Concepts > Output](https://www.jovo.tech/docs/output).

* [Progressive Responses](#progressive-responses)
* [Visual Output](#visual-output)
* [Proactive Events](#proactive-events)


#### Progressive Responses

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


#### Visual Output

* Home Cards
* Display Interface (Render Templates)
* Alexa Presentation Language (APL)

> [You can find more about Alexa visual output here](https://www.jovo.tech/marketplace/jovo-platform-alexa/visual-output).


#### Proactive Events

The Proactive Events API allows you to send out events to your user, which work as notifications.

There are four steps to send out events:

1. You have to first add the Proactive Events API and other necessary settings to your Skill.
2. You have to request an access token from Amazon, which you get after authorizing to be able to send out the events.
3. You have to prepare the event object containing the data, that will be sent.
4. You have to send out the event object.

##### Skill Permissions and Publications

To use the Proactive Events API you have to add it to your skill's permissions as well as specify the [event schemas](#event) that you are going to use. For that add the following to your `project.js` file:

```javascript
// project.js

module.exports = {
    alexaSkill: {
        nlu: 'alexa',
        manifest: {
            permissions: [
                {
                    name: 'alexa::devices:all:notifications:write'
                }
            ],
            events: {
                publications: [
                    {
                        eventName: 'AMAZON.WeatherAlert.Activated'
                    },
                    {
                        eventName: 'AMAZON.SportsEvent.Updated'
                    },
                    {
                        eventName: 'AMAZON.MessageAlert.Activated'
                    },
                    {
                        eventName: 'AMAZON.OrderStatus.Updated'
                    },
                    {
                        eventName: 'AMAZON.Occasion.Updated'
                    },
                    {
                        eventName: 'AMAZON.TrashCollectionAlert.Activated'
                    },
                    {
                        eventName: 'AMAZON.MediaContent.Available'
                    },
                    {
                        eventName: 'AMAZON.SocialGameInvite.Available'
                    }
                ],
            }
        }
    },

    // ...
};
```

After that build and deploy the files:

```text
$ jovo build -p alexaSkill --deploy --target info
```

After the deployment finished, you can find the `clientId` and `clientSecret` on the `PERMISSIONS` tab of your Skill on the Alexa Developer Console, which you will need later on:

![Proactive Events API Client ID and Client Secret](../img/proactive_events_clientid_clientsecret.png)


##### Proactive Event Object

The Proactive Event object contains the data you want to send your users.

```javascript
{
    "timestamp": "2019-02-13T14:00:00.00Z",
    "referenceId": "test-0001",
    "expiryTime": "2019-02-14T13:00:00.00Z",
    "event": {
        "name": "AMAZON.WeatherAlert.Activated",
        "payload": {
            "weatherAlert": {
                "source": "localizedattribute:source",
                "alertType": "TORNADO"
            }
        }
    },
    "localizedAttributes": [
        {
            "locale": "en-US",
            "source": "English Weather Channel"
        }
    ],
    "relevantAudience": {
        "type": "Unicast",
        "payload": {
            "user": "<user-id>"
        }
    }
}
```

Name | Description | Value | Required
:--- | :--- | :--- | :---
`timestamp` | The time of the event's creation | `string` - ISO 8601 | Yes
`referenceId` | Unique id which identifies the event. You may use the same id for different customers, but each customer can only have received a single event associated with that id | `string` - Must be alphanumeric values, including `~`. Max 100 characters | Yes
`expiryTime` | Timestamp at which the notification will be deleted automatically. | `string` - ISO 8601. Must be 5 minutes after and 24 hours before the `timestamp` value | Yes
`event` | The event data, which will be sent to the customer. Check [Event](#Event) for more info | `object` | Yes
`localizedAttributes` | An array containing localized event attributes. Check [Localized Attributes](#Localized-Attributes) for more info | `object[]` | Yes
`relevantAudience.type` | Who to send the event to. Either every user (`Multicast`) or a specific user `Unicast` | `enum` - either `Multicast` or `Unicast` | Yes
`relevantAudience.payload` | If `type` is `Multicast`, `payload` has to be an empty object. If it's `Unicast`, the `payload` object will contain the `user`, to which the event will be sent | `object` | Yes
`relevantAudience.payload.user` | User ID representing the user, who shall receive the event | `string` | Yes, if `relevantAudience.type` is `Unicast`

##### Event

The event object contains the information, which will be sent to the user, by implementing one of the many schemas Amazon provides. You are not able to create your own event scheme, but have to use one of the available ones. Saying that, Amazon offers a wide variety of schemas, which will be expanded in the future.

For each event scheme you provide attributes, which will be added to a predefined utterance.

##### AMAZON.WeatherAlert.Activated

Utterance: `There is a <weatherAlert> alert for your area. Provided by <Source>.`

```javascript
{
    "name": "AMAZON.WeatherAlert.Activated",
    "payload": {
        "weatherAlert": {
            "source": "localizedattribute:source",
            "alertType": "TORNADO"
        }
    }
}
```

Name | Description | Value | Localization Supported | Required
:--- | :--- | :--- | :--- | :---
`weatherAlert` | Contains information about the weather alert the event is about | `object` | No | Yes
`weatherAlert.source` | The source of the weather alert, i.e. who the information is from | `string` | Yes | Yes
`weatherAlert.alertType` | What kind of extreme weather situation is the alert about | `enum` - either `TORNADO`, `HURRICANE`, `SNOW_STORM` or `THUNDER_STORM` | No | Yes

##### AMAZON.SportsEvent.Updated

Utterance: `<eventLeagueName> match update, <updateTeamName> scored! <homeTeamName> <homeTeamScore>, <awayTeamName> <awayTeamScore>`

```javascript
{
    "name": "AMAZON.SportsEvent.Updated",
    "payload": {
        "update": {
            "scoreEarned": 1,
            "teamName": "Apples"
        },
        "sportsEvent": {
            "eventLeague": {
                "name": "localizedattribute:eventLeagueName"
            },
            "homeTeamStatistic": {
                "team": {
                    "name": "Oranges"
                },
                "score": 1
            },
            "awayTeamStatistic": {
                "team": {
                    "name": "Apples"
                },
                "score": 2
            }
        }
    }
}
```

Name | Description | Value | Localization Supported | Required
:--- | :--- | :--- | :--- | :---
`update` | Contains information about changes to the current sports event | `object` | No | No
`update.scoreEarned` | For how much did the score change | `integer` | No | Yes 
`update.teamName` | Which team did score | `string` | No | Yes
`sportsEvent` | Contains information about the sports event the update is about | `object` | No | Yes
`sportsEvent.eventLeague` | Contains information about the league the event is from | `object` | No | Yes
`sportsEvent.eventLeague.name` | The name of the league | `string` | Yes | Yes
`sportsEvent.homeTeamStatistic` | Contains information about the home team for this specific event | No | Yes
`sportsEvent.homeTeamStatistic.team` | Contains information about the home team | No | Yes
`sportsEvent.homeTeamStatistic.team.name` | The name of the home team | `string` | No | Yes
`sportsEvent.homeTeamStatistic.score` | The current score of the home team | `integer` | No | Yes
`sportsEvent.awayTeamStatistic` | Contains information about the away team for this specific event | No | Yes
`sportsEvent.awayTeamStatistic.team` | Contains information about the away team | No | Yes
`sportsEvent.awayTeamStatistic.team.name` | The name of the away team | `string` | No | Yes
`sportsEvent.awayTeamStatistic.score` | The current score of the away team | `integer` | No | Yes

##### AMAZON.MessageAlert.Activated

Utterance: `You have <messageCount> <messageFreshness> <messageStatus> <urgency> <message/messages> from <sender>`

```javascript
{
    "name": "AMAZON.MessageAlert.Activated",
    "payload": {
        "state": {
            "status": "UNREAD",
            "freshness": "NEW"
        },
        "messageGroup": {
            "creator": {
                "name": "Andy"
            },
            "count": 5,
            "urgency": "URGENT"
        }
    }
}
```

Name | Description | Value | Localization Supported | Required
:--- | :--- | :--- | :--- | :---
`state` | Contains information about the state of the message | `object` | No | Yes
`state.status` | The status of the message | `enum` - either `UNREAD` or `FLAGGED` | No | Yes
`state.freshness` | Specifies how recent the message is | `enum` - either `NEW` or `OVERDUE` | No | No
`messageGroup` | Contains information about the message itself | `object` | No | Yes
`messageGroup.creator` | Contains information about the creator of the message | `object` | No | Yes
`messageGroup.creator.name` | The name of the creator | `string` | No | Yes
`messageGroup.count` | The number of messages | `integer` | No | Yes
`messageGroup.urgency` | The urgency of the messages | `enum` - Only `URGENT` | No | No 

##### AMAZON.OrderStatus.Updated

Multiple possible utterances depending on `state.status`.

Utterances: `Your preorder from <company> has been received`, `Your order from <company> was delivered <date>`

```javascript
{
    "name": "AMAZON.OrderStatus.Updated",
    "payload": {
        "state": {
            "status": "ORDER_SHIPPED",
            "deliveryDetails": {
                "expectedArrival": "2018-12-14T23:32:00.463Z"
            }
        },
        "order": {
            "seller": {
                "name": "localizedattribute:sellerName"
            }
        }
    }
}
```

```javascript
{
    "name": "AMAZON.OrderStatus.Updated",
    "payload": {
        "state": {
            "status": "ORDER_DELIVERED",
            "enterTimestamp": "2018-09-16T03:00:00.463Z"
        },
        "order": {
            "seller": {
                "name": "localizedattribute:sellerName"
            }
        }
    }
}
```

Name | Description | Value | Localization Supported | Required
:--- | :--- | :--- | :--- | :---
`state` | Contains information about the state of the order | `object` | No | Yes
`state.status` | Specifies the status of the order | `enum` - either `PREORDER_RECEIVED`, `ORDER_RECEIVED`, `ORDER_PREPARING`, `ORDER_SHIPPED`, `ORDER_OUT_FOR_DELIVERY`, `ORDER_OUT_FOR_DELIVERY` or `ORDER_DELIVERED` | No | Yes
`state.enterTimeStamp` | Specifies the timestamp of the event | `string` - ISO 8601 | No | No
`state.deliveryDetails` | Contains information about the delivery | `object` | No | No
`state.deliveryDetails.expectedArrival` | Specifies the expected arrival time | `string` - ISO 8601 | No | No
`order` | Contains information about the order | `object` | No | Yes
`order.seller` | Contains information about the seller | `object` | No | Yes
`order.seller.name` | Specifies the name of the seller | `string` | Yes | Yes

##### AMAZON.Occasion.Updated

Utterance: `Your <occasionType> at <providerName> for <subject> on <bookingTime> has been <confirmationStatus>`

```javascript
{
    "name": "AMAZON.Occasion.Updated",
    "payload": {
        "state": {
            "confirmationStatus": "CONFIRMED"
        },
        "occasion": {
            "occasionType": "APPOINTMENT",
            "subject": "localizedattribute:subject",
            "provider": {
                "name": "localizedattribute:providerName"
            },
            "bookingTime": "2018-11-20T19:16:31Z",
            "broker": {
                "name": "localizedattribute:brokerName"
            }
        }
    }
}
```

Name | Description | Value | Localization Supported | Required
:--- | :--- | :--- | :--- | :---
`state` | Contains information about the state of the occasion | `object` | No | Yes
`state.confirmationStatus` | Specifies the status of the occasion | `string` - either `CONFIRMED`, `CANCELED`, `RESCHEDULED`, `REQUESTED`, `CREATED` or `UPDATED` | No | Yes
`occasion` | Contains information about the occasion | `object` | No | Yes
`occasion.occasionType` | Specifies the type of the occasion | `string` - either `RESERVATION_REQUEST`, `RESERVATION`, `APPOINTMENT_REQUEST` or`APPOINTMENT`| No | Yes
`occasion.subject` | Specifies the subject of the occasion | `string` | Yes | Yes
`occasion.provider` | Contains information about the provider of the occasion | `object` | No | Yes
`occasion.provider.name` | Specifies the name of the provider | `string` | Yes | Yes
`occasion.bookingTime` | Specifies the time of the occasion | `string` - ISO 8601 | No | Yes
`occasion.broker` | Contains information about broker | `object` | No | No
`occasion.broker.name` | Specifies the name of the broker | `string` | Yes | Yes

##### AMAZON.TrashCollectionAlert.Activated

Utterance: `The coming <dayOfTheWeek> is <garbageType> garbage collection day`

```javascript
{
    "name": "AMAZON.TrashCollectionAlert.Activated",
    "payload": {
        "alert": {
            "garbageTypes": [
                "COMPOSTABLE",
                "RECYCLABLE_PLASTICS"
            ],
            "collectionDayOfWeek": "TUESDAY"
        }
    }
}
```

Name | Description | Value | Localization Supported | Required
:--- | :--- | :--- | :--- | :---
`alert` | Contains information about the alert | `object` | No | Yes
`alert.garbageTypes` | Specifies the garbage types which are scheduled for collection | `enum[]` - possible values: `BOTTLES`, `BULKY`, `BURNABLE`, `CANS`, `CLOTHING`, `COMPOSTABLE`, `CRUSHABLE`, `GARDEN_WASTE`, `GLASS`, `HAZARDOUS`, `HOME_APPLIANCES`, `KITCHEN_WASTE`, `LANDFILL`, `PET_BOTTLES`, `RECYCLABLE_PLASTICS`, `WASTE_PAPER`. Max 5 items | No | Yes
`alert.collectionDayOfWeek` | Specifies the day of the week at which the garbage types will be collected | `enum` - either `MONDAY`, `TUESDAY`, `WEDNESDAY`, `THURSDAY`, `FRIDAY`, `SATURDAY` or `SUNDAY` | No | Yes

##### AMAZON.MediaContent.Available

Utterance: `<contentName> will <method> on <startTime> on <providerName>`

```javascript
{
    "name": "AMAZON.MediaContent.Available",
    "payload": {
        "availability": {
            "startTime": "2018-11-20T21:00:00Z",
            "provider": {
                "name": "localizedattribute:providerName"
            },
            "method":"AIR"
        },
        "content": {
            "name": "localizedattribute:contentName",
            "contentType":"BOOK"
        }
    }
}
```

Name | Description | Value | Localization Supported | Required
:--- | :--- | :--- | :--- | :---
`availability` | Contains information about the availability of the media content | `object` | No | Yes
`availability.startTime` | Specifies the time at which the content will be available | `string` - ISO 8601 | No | Yes
`availability.provider` | Contains information about the provider | `object` | No | No
`availability.provider.name` | Specifies the name of the provder | `string` | Yes | Yes
`availability.method` | Specifies the distribution method of the content | `enum` - either `STREAM`, `AIR`, `RELEASE`, `PREMIERE` or `DROP` | No | Yes
`content` | Contains information about the content | `object` | No | Yes
`content.name` | Specifies the name of the content | `string` | Yes | Yes
`content.contentType` | Specifies the media type | `enum` - either `BOOK`, `EPISODE`, `ALBUM`, `SINGLE`, `MOVIE` or `GAME` | No | Yes

##### AMAZON.SocialGameInvite.Available

Utterance: `Your <relationshipToInvitee> <inviterName> has <inviteType> you to a <gameOffer> of <gameName>`

```javascript
{
    "name": "AMAZON.SocialGameInvite.Available",
    "payload": {
        "invite": {
            "inviter": {
                "name": "Max",
                "relationshipToInvitee": "FRIEND"
            },
            "inviteType": "CHALLENGE"
        },
        "game": {
            "offer": "MATCH",
            "name": "localizedattribute:gameName"
        }
    }
}
```

Name | Description | Value | Localization Supported | Required
:--- | :--- | :--- | :--- | :---
`invite` | Contains information about the invite | `object` | No | Yes
`invite.inviter` | Contains information about the inviter | `object` | No | Yes
`invite.inviter.name` | Specifies the name of the inviter | `string` | No | Yes
`invite.inviter.relationshipToInvitee` | Specifies the relationship of the inviter to the invitee | `enum` - either `FRIEND` or `CONTACT` | No | Yes
`invite.inviteType` | Specifies the type of the invite | `enum` - either `CHALLENGE` or `INVITE` | No | Yes
`game` | Contains information about the game | `object` | No | Yes
`game.offer` | Specifies the offer type | `enum` - either `MATCH`, `REMATCH` or `GAME` | No | Yes
`game.name` | Specifies the name of the game | `string` | Yes | Yes

#### Localized Attributes

The `localizedAttributes` array is used specify the attributes and their values for each locale. You set the value of the attribute, which should be localized, to `localizedattribute:key` and use the key to specify the value for that attribute inside the array.

For example, here's the `AMAZON.MediaContent.Available` event with two localized attributes, `providerName` and `contentName`:

```javascript
{
    "name": "AMAZON.MediaContent.Available",
    "payload": {
        "availability": {
            "startTime": "2018-11-20T21:00:00Z",
            "provider": {
                "name": "localizedattribute:providerName"
            },
            "method":"AIR"
        },
        "content": {
            "name": "localizedattribute:contentName",
            "contentType":"BOOK"
        }
    }
}
```

The `localizedAttribute` array for this particular event would look like this:

```javascript
"localizedAttributes": [
    {
        "locale": "en-US",
        "providerName": "English Provider Name",
        "contentName": "English Content Name"
    },
    {
        "locale": "de-DE",
        "providerName": "German Provider Name",
        "contentName": "German Content Name"
    }
    // ...
],
```

##### Get the Access Token

To be able to send out events, you have to first authorize yourself with Amazon to receive an access token.

For authorization, you send a request to one of Amazon APIs, which will return you the following object containing your access token:

```javascript
{
    "access_token":"<access_token>",
    "expires_in":3600,
    "scope":"alexa::proactive_events",
    "token_type":"Bearer"
}
```

Name | Description | Value
:--- | :--- | :--- 
`access_token` | An access token used to send out events | `string`
`expires_in` | The number of seconds the token is valid for | `integer`
`scope` | The scope the access token is valid for | `string`
`status` | The token type | `string`

To authorize yourself you can either call the `sendAuthRequest()` method, which will return you the whole response object, or the `getAccessToken()`, which will return you only the access token. Both methods need your Alexa Skill's `clientId` and `clientSecret` as parameters:

```javascript
// @language=javascript

// Get the whole response object
const result = this.$alexaSkill.$proactiveEvent.sendAuthRequest(clientId, clientSecret);

// Get only the access token
const accessToken = this.$alexaSkill.$proactiveEvent.getAccessToken(clientId, clientSecret);

// @language=typescript

// Get the whole response object
const result = this.$alexaSkill!.$proactiveEvent.sendAuthRequest(clientId, clientSecret);

// Get only the access token
const accessToken = this.$alexaSkill!.$proactiveEvent.getAccessToken(clientId, clientSecret);
```

##### Send the Event

After you got your token, you can send the event to your users:

```javascript
// @language=javascript

const result = await this.$alexaSkill.$proactiveEvent.sendProactiveEvent(proactiveEvent, accessToken);

// @language=typescript

const result = await this.$alexaSkill!.$proactiveEvent.sendProactiveEvent(proactiveEvent, accessToken);
```

##### Skill Event - ProactiveSubscriptionChanged

With the Proactive Events API there was also a new Skill Event added. The `ProactiveSubscriptionChanged` event notifies you, if an user subscribes or unsubscribes from an event.

```javascript
{
    "version": "string",
    "context": {
        "System": {
            "application": {
                "applicationId": "string"
            },
            "user": {
                "userId": "string"
            },
            "apiEndpoint": 'https://api.amazonalexa.com'
        }
    },
    "request": {
        "type": "AlexaSkillEvent.ProactiveSubscriptionChanged",
        "requestId": "string",
        "timestamp": "string",
        "body": {
            "subscriptions": [{
                "eventName": "string"
            }]
        }
    }
}
```

The request will contain a `subscriptions` array, which will contain the events to which the user is currently subscribed to. That means, if an user unsubscribes you will have to compare the past subscribed events with the new array to find out, which one the user unsubscribed from. Also keep in mind, that these requests can arrive out of order, which is why you should always use the `timestamp` sent with the request to ensure, that you use the latest changes.

> Learn how to enable Skill Events [here](#skill-events)

### Alexa Skill Interfaces

* Audio Player Skills
* Echo Button and Gadget Skills
* Display Interface
* Video App

Learn more about the different Alexa Skill Interface types hers: [Alexa Skill Interfaces](https://www.jovo.tech/marketplace/jovo-platform-alexa/interfaces).



### Monetization

#### Amazon Pay

Learn how to sell physical goods and services in your Alexa Skills using Amazon Pay and Jovo. Find out more here: [Amazon Pay Docs](https://www.jovo.tech/marketplace/jovo-platform-alexa/amazon-pay).


#### In-Skill-Purchasing (ISP)

Learn how to sell digital goods in your Alexa Skills using Alexa In-Skill Purchases (ISPs). Find out more here: [Alexa ISP Docs](https://www.jovo.tech/marketplace/jovo-platform-alexa/in-skill-purchases).
