# [Platform Specific Features](../) > [Amazon Alexa](./README.md) > CanFulfillIntentRequest

Learn more about how to implement the `CanFulfillIntentRequest` feature in your Jovo project

- [Introduction to CanFulfill](#introduction-to-canfulfill)
- [Requirements](#requirements)
- [Code Implementation](#code-implementation)
	- [Slots](#slots)
	- [Intent](#intent)

## Introduction to CanFulfill

The name-free interaction allows Amazon to map user requests, which don't specify a skill and can't be handled by Alexa's built in features, to be mapped to andevelopers skill that can handle it.

For example the user might make the following request: **Alexa, play relaxing sounds with crickets**. Alexa's built in features can't handle the request so the system looks for third party skills to fulfill it.

The system will then send `CanFullIntentRequests` the skills it believes might be able to fulfill the request. According to the response to that requests (`yes`, `no` or `maybe`) your skill will receive an `IntentRequest` just as if it the skill was invoked my the customer directly.

## Requirements

To enable the `CanFulfillIntentRequest` feature you have to enable the interface in your skill's information. You can do that either in the Alexa Developer Console in the `Interfaces` subcategory or you do it with the Jovo CLI.

Simply open your `app.json` file and add the following to your `alexaSkill` object:
```javascript
"manifest": {
	"apis": {
		"custom": {
			"interfaces": [
				{
					"type": "CAN_FULFILL_INTENT_REQUEST"
				}
			]
		}
	}
}
```
After that run `jovo build --deploy` to rebuild and deploy your project.

## Code Implementation

Incoming `CanFulfillIntentRequests` will be mapped to the Jovo built in `CAN_FULFILL_INTENT`.
```javascript
'CAN_FULFILL_INTENT': function() {

},
```
After receiving an `CanFulfillIntentRequest` you have to answer the following question: _**Can my skill understand and fulfill every slot as well as understand and fulfill the whole request?**_.

Since every Skill is different, there is no universal recipe to use. You have to come up with our own way to handle these requests, which suits your skill, but there is a rough guideline:

### Intent

The first step should be to check if the incoming intent is one, that your skill can handle. You can get the incoming intent name using `this.getIntentName()`

### Slots

You also have to go over every slot in the request and decide if you can **understand** (`YES`, `NO` or `MAYBE`) and **fulfill** (`YES` or `NO`) the slot.

Use `this.getInputs()` to get an object containing every slot. Iterate over the object and decide for each slot if you can understand it or not using: 
```javascript
this.canFulfillSlot(slotName, canUnderstandSlot, canFulfillSlot);
```

### Request

After going through the slots, you have to decide if you can also handle the whole request (`YES`, `NO` or `MAYBE`):
```javascript
this.canFulfillRequest();
// or
this.cannotFulfillRequest();
// or
this.mayFulfillRequest();
```

It's recommended to go over the official Amazon documentation ([here](https://developer.amazon.com/docs/custom-skills/request-types-reference.html#CanFulfillIntentRequest) and [here](https://developer.amazon.com/docs/custom-skills/understand-name-free-interaction-for-custom-skills.html)) to get a better grasp about when to respond with `YES`, `NO` or `MAYBE` as well as other guidelines.

<!--[metadata]: {"title": "Alexa CanFulfillIntentRequest", 
"description": "Learn how to implement CanFulfillRequests in your Jovo project", "activeSections": ["platforms", "alexa", "alexa_canfulfill"], 
"expandedSections": "platforms", "inSections": "platforms", 
"breadCrumbs": {"Docs": "docs/", "Platforms": "docs/platforms",
"Amazon Alexa": "" }, 
"commentsID": "framework/docs/canfulfill", 
"route": "docs/amazon-alexa/canfulfill" 
}-->
