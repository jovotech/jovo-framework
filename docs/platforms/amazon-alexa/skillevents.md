# Skill Events

Learn more about how to use Skill Events with the Jovo Framework.

* [Introduction to Skill Events](#introduction-to-skill-events)
* [Requirements](#requirements)
* [Events](#events)
	* [Skill Enabled](#skill-enabled)
	* [Skill Disabled](#skill-disabled)
	* [Account Linked](#account-linked)
	* [Skill Permission Accepted](#skill-permission-accepted)
	* [Skill Permission Changed](#skill-permission-changed)

## Introduction to Skill Events

Skill Events can be used to notify you if a certain event occurs, which range from the customer disabling your Skill to them linking their account using the Alexa app. The notification comes in form of a request to your Skill. 

[Official Documentation from Amazon](https://developer.amazon.com/docs/smapi/skill-events-in-alexa-skills.html).

## Requirements

To enable the Skill Events you have to make changes to the `skill.json` file (`/platforms/alexaSkill/`), which you can do by updating the `project.js` file in your Jovo project. 

Add the following to your `alexaSkill` object in the `project.js` file:

```javascript
// project.js

alexaSkill: {
	manifest: {
		events: {
			endpoint: {
				uri: '<your-endpoint-for-events>', // Needs to be Lambda!
			},
			subscriptions: [
				{
					eventName: 'SKILL_ENABLED',
				},
				{
					eventName: 'SKILL_DISABLED',
				},
				{
					eventName: 'SKILL_PERMISSION_ACCEPTED',
				},
				{
					eventName: 'SKILL_PERMISSION_CHANGED',
				},
				{
					eventName: 'SKILL_ACCOUNT_LINKED',
				},
				{
					eventName: 'SKILL_PROACTIVE_SUBSCRIPTION_CHANGED'
				}
			],
		},
	},
},
```

## Events

As described earlier, your Skill gets notified in form of request. To map that request to one of your handlers you have to add the following `state`:

```javascript
// @language=javascript

// src/app.js

app.setHandler({
	
	// ...

	ON_EVENT: {

	}
});

// @language=typescript

// src/app.ts

app.setHandler({
	
	// ...

	ON_EVENT: {

	}
});
```

Inside that state you can define the intents, which will be mapped to one of the events. Here's an example:

```javascript
ON_EVENT: {
    'AlexaSkillEvent.SkillEnabled'() {
		console.log('AlexaSkillEvent.SkillEnabled');		
    },
}
```

### Skill Enabled

This Skill Event gets triggered the moment your Skill gets enabled by the user.

Enable that event by adding the following to your `subscription` array inside your `events` object in your `project.js`:

```javascript
{
  eventName: 'SKILL_ENABLED',
},
```

And adding the `AlexaSkillEvent.SkillEnabled` inside your `ON_EVENT` state:

```javascript
ON_EVENT: {
    'AlexaSkillEvent.SkillEnabled'() {
		console.log('AlexaSkillEvent.SkillEnabled');
		console.log(`UserId: ${this.getUserId()}`);		
    },
}
```

[Official Documentation by Amazon](https://developer.amazon.com/docs/smapi/skill-events-in-alexa-skills.html#skill-enabled-event).


### Skill Disabled

This Skill Event gets triggered the moment your Skill gets disabled by the user. If you are using Database Integrations to store user specific data, then you should delete the user data. Otherwise you will have orphaned records in your database. The userId will not be re-used if the user re-enables the skill later: they will get a new userId.

Enable that event by adding the following to your `subscription` array inside your `events` object in your `project.js`:

```javascript
{
  eventName: 'SKILL_DISABLED',
},
```

And adding the `AlexaSkillEvent.SkillDisabled` inside your `ON_EVENT` state:

```javascript
ON_EVENT: {
    'AlexaSkillEvent.SkillDisabled'() {
        console.log('AlexaSkillEvent.SkillDisabled');
				console.log(`UserId: ${this.getUserId()}`);
				
				// Remove user from the database when the skill is disabled
				// if the user re-enables the skill, they will have a new userId anyway
				this.$user.delete();
    },
}
```

[Official Documentation by Amazon](https://developer.amazon.com/docs/smapi/skill-events-in-alexa-skills.html#skill-disabled-event).


### Account Linked

This Skill Event gets triggered, if the user links their account using the companion app/website. The incoming request will also contain the access token, which you can access using `this.getAccessToken()`.

Enable that event by adding the following to your `subscription` array inside your `events` object in your `project.js`:

```javascript
{
  eventName: 'SKILL_ACCOUNT_LINKED',
},
```

And adding the `AlexaSkillEvent.SkillAccountLinked` inside your `ON_EVENT` state:

```javascript
ON_EVENT: {
    'AlexaSkillEvent.SkillAccountLinked'() {
        console.log('AlexaSkillEvent.SkillAccountLinked');
				console.log(`UserId: ${this.getUserId()}`);		
    },
}
```

[Official Documentation by Amazon](https://developer.amazon.com/docs/smapi/skill-events-in-alexa-skills.html#account-linked-event).


### Skill Permission Accepted

This Skill Event gets triggered, if your user grants permissions for the first time or if they grant them after they were revoked. The request will include the most recently accepted permissions. You can access the body of the request using the `this.$alexaSkill.getSkillEventBody()` method, which will contain an array with the permissions. Check out the sample requests in the [official documentation](https://developer.amazon.com/docs/smapi/skill-events-in-alexa-skills.html#skill-permission-accepted-event) to get a feeling for the JSON structure.

Enable that event by adding the following to your `subscription` array inside your `events` object in your `project.js`:

```javascript
{
  eventName: 'SKILL_PERMISSION_ACCEPTED',
},
```

And adding the `AlexaSkillEvent.SkillPermissionAccepted` inside your `ON_EVENT` state:

```javascript
// @language=javascript

ON_EVENT: {
    'AlexaSkillEvent.SkillPermissionAccepted'() {
        console.log('AlexaSkillEvent.SkillPermissionAccepted');
				console.log(`UserId: ${this.getUserId()}`);		
				console.log(`Permissions: ${JSON.stringify(this.$alexaSkill.getSkillEventBody().acceptedPermissions)}`);	
	},
}

// @language=typescript

ON_EVENT: {
    'AlexaSkillEvent.SkillPermissionAccepted'() {
        console.log('AlexaSkillEvent.SkillPermissionAccepted');
				console.log(`UserId: ${this.getUserId()}`);		
				console.log(`Permissions: ${JSON.stringify(this.$alexaSkill!.getSkillEventBody().acceptedPermissions)}`);	
	},
}
```

[Official Documentation by Amazon](https://developer.amazon.com/docs/smapi/skill-events-in-alexa-skills.html#skill-permission-accepted-event).


### Skill Permission Changed

This Skill Event gets triggered, if your user grants your Skill additional permission or revokes existing ones. The request will include the most recently accepted permissions. You can access the body of the request using the `this.$alexaSkill.getSkillEventBody()` method, which will contain an array with the permissions. Check out the sample requests in the [official documentation](https://developer.amazon.com/docs/smapi/skill-events-in-alexa-skills.html#skill-permission-changed-event) to get a feeling for the JSON structure.

Enable that event by adding the following to your `subscription` array inside your `events` object in your `project.js`:
```javascript
{
  eventName: 'SKILL_PERMISSION_CHANGED',
},
```

And adding the `AlexaSkillEvent.SkillPermissionChanged` inside your `ON_EVENT` state:
```javascript
// @language=javascript

ON_EVENT: {
    'AlexaSkillEvent.SkillPermissionChanged'() {
        console.log('AlexaSkillEvent.SkillPermissionChanged');
				console.log(`UserId: ${this.$user.Id()}`);		
				console.log(`Permissions: ${JSON.stringify(this.$alexaSkill.getSkillEventBody().acceptedPermissions)}`);	
    },
}

// @language=typescript

ON_EVENT: {
    'AlexaSkillEvent.SkillPermissionChanged'() {
        console.log('AlexaSkillEvent.SkillPermissionChanged');
				console.log(`UserId: ${this.$user.Id()}`);		
				console.log(`Permissions: ${JSON.stringify(this.$alexaSkill!.getSkillEventBody().acceptedPermissions)}`);	
    },
}
```

[Official Documentation by Amazon](https://developer.amazon.com/docs/smapi/skill-events-in-alexa-skills.html#skill-permission-changed-event).


### Proactive Subscription Changed

Find a detailed description of the `Proactive Subscription Changed` event [here](./proactive-events.md#skill-event---proactivesubscriptionchanged './proactive-events#skill-event---proactivesubscriptionchanged').

<!--[metadata]: {
"description": "Build Alexa Skills with the Jovo Framework. Learn more about Alexa specific features here",
"route": "amazon-alexa/skill-events" 
}-->
