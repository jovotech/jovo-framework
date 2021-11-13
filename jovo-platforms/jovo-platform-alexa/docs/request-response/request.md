# Requests

> To view this page on the Jovo website, visit https://www.jovo.tech/marketplace/jovo-platform-alexa/request-response/request

* [Introduction](#introduction)
* [Basic Request Types](#basic-request-types)
  * [LaunchRequest](#launchrequest)
  * [IntentRequest](#intentrequest)
  * [SessionEndedRequest](#sessionendedrequest)
  * [CanFulfillIntentRequest](#canfulfillintentrequest)
* [$request Object](#request-object)

## Introduction

The request is the incoming data that the Alexa platform sends to your app's endpoint. It consists of information like:

* User ID,
* Intent, e.g. `MyNameIsIntent`
* Input, e.g. `name`
* Session data, e.g. a state

and other things that might be relevant to your app. You can access the incoming request with `this.$request`.

Here's an example request:

```js
{
  "version": "1.0",
  "session": {
    "new": false,
    "sessionId": "amzn1.echo-api.session.27e37d8e-3485-4f89-aa8a-4776b7a83ce9",
    "application": {
      "applicationId": "amzn1.ask.skill.5023bec0-da4f-4bfd-b17f-2df8826fce08"
    },
    "attributes": {
      "_JOVO_STATE_": "NameState"
      // other session attributes
    },
    "user": {
      "userId": "amzn1.ask.account.AEPN2D5SW3O36NGIVE3JKCTOX2B63G3ISBQIY4ZDSE",
      "permissions": {
        "consentToken": "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIs"
      }
    }
  },
  "context": {
    "System": {
      "application": {
        "applicationId": "amzn1.ask.skill.5023bec0-da4f-4bfd-b17f-2df8826fce08"
      },
      "user": {
        "userId": "amzn1.ask.account.AEPN2D5SW3O36NGIVE3J",
        "permissions": {
          "consentToken": "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUz"
        }
      },
      "device": {
        "deviceId": "amzn1.ask.device.AHENPV7J5ITROUGLIB73OVK6UMDYMO3FD7AEGJD2",
        "supportedInterfaces": {
          "Geolocation": {}
        }
      },
      "apiEndpoint": "https://api.eu.amazonalexa.com",
      "apiAccessToken": "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImtpZCI6IjEifQ.ey"
    }
  },
  "request": {
    "type": "IntentRequest",
    "requestId": "amzn1.echo-api.request.9b73f060-c894-460d-9b63-0cb858885156",
    "timestamp": "2018-12-18T09:47:45Z",
    "locale": "de-DE",
    "intent": {
      "name": "MyNameIsIntent",
      "confirmationStatus": "NONE",
      "slots": {
        "name": {
          "name": "name",
          "value": "jeff",
          "confirmationStatus": "NONE",
          "source": "USER"
        }
      }
    }
  }
}
```

You can find a detailed explanation of each of the request's properties [here](https://developer.amazon.com/en-US/docs/alexa/custom-skills/request-and-response-json-reference.html#request-body-parameters)

## Basic Request Types

Generally, we distinguish between three base request types, the `LaunchRequest`, `IntentRequest`, and the `SessionEndedRequest`. While there are a couple more request types, they are not enabled by default but rather depend on you adding one of the many interfaces, Alexa provides, to your Skill, e.g. Audio Player or Game Engine interface.

### LaunchRequest

A `LaunchRequest` is sent to your endpoint whenever the user starts your Skill without triggering a specific intent, e.g. `Alexa, start my test app`:

```js
{
  "type": "LaunchRequest",
  "requestId": "amzn1.echo-api.request.0000000-0000-0000-0000-00000000000",
  "timestamp": "2015-05-13T12:34:56Z",
  "locale": "en-US"
}
```

You can find a detailed explanation of each of the request's properties [here](https://developer.amazon.com/en-US/docs/alexa/custom-skills/request-types-reference.html#launchrequest)

### IntentRequest

A `IntentRequest` is sent whenever the user triggers one of the intents defined in your language model. Besides the general request information like the id, timestamp, and the locale, it also provides data about the triggered intent and its slots:

```js
{
  "type": "IntentRequest",
  "requestId": "amzn1.echo-api.request.9b73f060-c894-460d-9b63-0cb858885156",
  "timestamp": "2018-12-18T09:47:45Z",
  "locale": "de-DE",
  "intent": {
    "name": "MyNameIsIntent",
    "confirmationStatus": "NONE",
    "slots": {
      "name": {
        "name": "name",
        "value": "jeff",
        "confirmationStatus": "NONE",
        "source": "USER"
      }
    }
  }
}
```

You can find a detailed explanation of each of the request's properties [here](https://developer.amazon.com/en-US/docs/alexa/custom-skills/request-types-reference.html#intentrequest)

### SessionEndedRequest

A `SessionEndedRequest` is sent when the current session ends. That happens either when
* the user manually ends it using *"Alexa, exit"*,
* the user doesn't respond or says something that does not match any of your intents
* an error occurs

```js
{
  "type": "SessionEndedRequest",
  "requestId": "amzn1.echo-api.request.0000000-0000-0000-0000-00000000000",
  "timestamp": "2015-05-13T12:34:56Z",
  "reason": "USER_INITIATED",
  "locale": "en-US"
}
```

You can find a detailed explanation of each of the request's properties [here](https://developer.amazon.com/en-US/docs/alexa/custom-skills/request-types-reference.html#sessionendedrequest)

### CanFulfillIntentRequest

The name-free interaction allows Amazon to map user requests, which don't specify a skill and can't be handled by Alexa's built in features, to be mapped to a developer's skill that can handle it.

For example, the user might make the following request: **Alexa, play relaxing sounds with crickets**. Alexa's built-in features can't handle the request so the system looks for third party skills to fulfill it.

The system will then send `CanFullIntentRequests` the skills it believes might be able to fulfill the request. According to the response to that requests (`yes`, `no` or `maybe`) your skill will receive an `IntentRequest` just as if it the skill was invoked my the customer directly.

#### CanFulfillIntentRequest Requirements

To enable the `CanFulfillIntentRequest` feature you have to enable the interface in your skill's information. You can do that either in the Alexa Developer Console in the `Interfaces` subcategory or you do it with the Jovo CLI.

Open your `project.js` file and add the following to your `alexaSkill` object:

```javascript
alexaSkill: {
	manifest: {
		apis: {
			custom: {
				interfaces: [
					{
						type: 'CAN_FULFILL_INTENT_REQUEST',
					}
				],
			},
		},
	},
},
```
Don't forget to build and deploy your project after you've added the interface:

```sh
# Build platform specific files
$ jovo3 build

# Deploy to platforms
$ jovo3 deploy
```

#### CanFulfillIntentRequest Implementation

Incoming `CanFulfillIntentRequests` will be mapped to the Jovo built in `CAN_FULFILL_INTENT`.

```javascript
CAN_FULFILL_INTENT() {

},
```
After receiving an `CanFulfillIntentRequest` you have to answer the following question: _**Can my skill understand and fulfill every slot as well as understand and fulfill the whole request?**_.

Since every Skill is different, there is no universal recipe to use. You have to come up with our own way to handle these requests, which suits your skill, but there is a rough guideline:

##### Intent

The first step should be to check if the incoming intent is one, that your skill can handle. You can get the incoming intent name using `this.getIntentName()`

##### Slots

You also have to go over every slot in the request and decide if you can **understand** (`YES`, `NO` or `MAYBE`) and **fulfill** (`YES` or `NO`) the slot.

Use `this.$inputs` to get an object containing every slot. Iterate over the object and decide for each slot if you can understand it or not using: 
```javascript
this.canFulfillSlot(slotName, canUnderstandSlot, canFulfillSlot);
```

##### Request

After going through the slots, you have to decide if you can also handle the whole request (`YES`, `NO` or `MAYBE`):
```javascript
this.canFulfillRequest();
// or
this.cannotFulfillRequest();
// or
this.mayFulfillRequest();
```

It is recommended to go over the official Amazon documentation ([here](https://developer.amazon.com/docs/custom-skills/request-types-reference.html#CanFulfillIntentRequest) and [here](https://developer.amazon.com/docs/custom-skills/understand-name-free-interaction-for-custom-skills.html)) to get a better grasp about when to respond with `YES`, `NO` or `MAYBE` as well as other guidelines.

## $request Object

Besides the [cross-platform getter and setter methods](https://www.jovo.tech/docs/requests-responses/request#cross-platform-methods) the Alexa `$request` object supports the following general getter methods:

### Getters

Name | Description | Return Value
:--- | :--- | :---
`getApiAccessToken()` | Returns the API access token used for Alexa specific APIs | string
`getApiEndpoint()` | Returns the API endpoint | string
`getAudioPlayerToken()` | Returns the Audio Player token which you have set using the Play directive. Is only present if you played audio right before the request. | string or undefined
`getDeviceId()` |  Returns the unique identifier for the device | string
`getPersonId()` | Returns the unique identifier of the person who sent the request | string
`getRequestId()` | Returns the current request's id | string
`getScreenResolution()` | Returns the current devices screen resolution as "WidthxHeight". Undefined if the device has no screen. | string or undefined
`getSupportedInterfaces()` | Returns an object with each of its keys representing a supported interface | object
`hasAutomotive()` | Returns true if the `Automotive` object exists in the request's context | boolean

