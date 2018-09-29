# [Platform Specific Features](../) > [Amazon Alexa](./README.md) > Skill Events

Learn more about how to use Skill Events with the Jovo Framework.

* [Introduction to Skill Events](#introduction-to-skill-events)
* [Requirements](#requirements)
   * [Events](#events)
      * [Skill Enabled](#skill-enabled)
      * [Skill Disabled](#skill-disabled)
      * [Account Linked](#account-linked)
      * [Skill Permission Accepted](#skill-permission-accepted)
      * [Skill Permission Changed](#skill-permission-changed)
   * [Staging](#staging)

## Introduction to Skill Events

Skill Events can be used to notify you if a certain event occurs, which range from the customer disabling your Skill to them linking their account using the Alexa app. The notification comes in form of a request to your Skill. 

[Official Documentation](https://developer.amazon.com/docs/smapi/skill-events-in-alexa-skills.html)

## Requirements

To enable the Skill Events you have to make changes to the `skill.json` file, which you can find under `/platforms/alexaSkill/` in your Jovo project. 

The `skill.json` of a newly created project looks like this:
```javascript
{
	"manifest": {
		"publishingInformation": {
			"locales": {
				"en-US": {
					"summary": "Sample Short Description",
					"examplePhrases": [
						"Alexa open hello world"
					],
					"name": "skillEvents",
					"description": "Sample Full Description"
				}
			},
			"isAvailableWorldwide": true,
			"testingInstructions": "Sample Testing Instructions.",
			"category": "EDUCATION_AND_REFERENCE",
			"distributionCountries": []
		},
		"apis": {
			"custom": {
				"endpoint": {
					"sslCertificateType": "Wildcard",
					"uri": "https://webhook.jovo.cloud/xyz"
				}
			}
		},
		"manifestVersion": "1.0"
	}
}
```

To use the Skill Events you have to add the `events` object, which contains an endpoint (in most cases your lambda function) and the events, which you want to enable. Here's an example:
```javascript
{
	"manifest": {
		"publishingInformation": {
			"locales": {
				"en-US": {
					"summary": "Sample Short Description",
					"examplePhrases": [
						"Alexa open hello world"
					],
					"name": "skillEvents",
					"description": "Sample Full Description"
				}
			},
			"isAvailableWorldwide": true,
			"testingInstructions": "Sample Testing Instructions.",
			"category": "EDUCATION_AND_REFERENCE",
			"distributionCountries": []
		},
		"apis": {
			"custom": {
				"endpoint": {
					"sslCertificateType": "Wildcard",
					"uri": ""
				}
			}
		},
		"events": {
			"endpoint": {
				"uri": "arn:aws:lambda:us-east-1:040623927470:function:sampleSkill"
			},
			"subscriptions": [
				{
					"eventName": "SKILL_ENABLED"
				},
				{
					"eventName": "SKILL_DISABLED"
				},
				{
					"eventName": "SKILL_PERMISSION_ACCEPTED"
				},
				{
					"eventName": "SKILL_PERMISSION_CHANGED"
				},
				{
					"eventName": "SKILL_ACCOUNT_LINKED"
				}
			]
		},
		"manifestVersion": "1.0"
	}
}
```

## Events

As described earlier, your Skill gets notified in form of request. To map that request to one of your handlers you have to add the following `state`:
```javascript
'ON_EVENT': {

}
```

Inside that state you can define the intents, which will be mapped to one of the events. Here's an example:
```javascript
'ON_EVENT': {
    'AlexaSkillEvent.SkillEnabled': function() {
		console.log('AlexaSkillEvent.SkillEnabled');		
    },
}
```

### Skill Enabled

This Skill Event gets triggered the moment your Skill gets enabled by the user.

Enable that event by adding the following to your `subscription` array inside your `events` object in your `skill.json`:
```javascript
{
  "eventName": "SKILL_ENABLED"
},
```

And adding the `AlexaSkillEvent.SkillEnabled` inside your `ON_EVENT` state:
```javascript
'ON_EVENT': {
    'AlexaSkillEvent.SkillEnabled': function() {
		console.log('AlexaSkillEvent.SkillEnabled');
		console.log(`UserId: ${this.getUserId()}`);		
    },
}
```

[Official Documentation](https://developer.amazon.com/docs/smapi/skill-events-in-alexa-skills.html#skill-enabled-event)
### Skill Disabled

This Skill Event gets triggered the moment your Skill gets disabled by the user. If you are using Database Integrations to store user specific data, then you should delete the user data. Otherwise you will have orphaned records in your database. The userId will not be re-used if the user re-enables the skill later: they will get a new userId.

Enable that event by adding the following to your `subscription` array inside your `events` object in your `skill.json`:
```javascript
{
  "eventName": "SKILL_DISABLED"
},
```

And adding the `AlexaSkillEvent.SkillDisabled` inside your `ON_EVENT` state:
```javascript
'ON_EVENT': {
    'AlexaSkillEvent.SkillDisabled': function() {
        console.log('AlexaSkillEvent.SkillDisabled');
		console.log(`UserId: ${this.getUserId()}`);
		
		// remove user from the database when the skill is disabled
		// if the user re-enables the skill, they will have a new userId anyway
		this.user().delete();
    },
}
```

[Official Documentation](https://developer.amazon.com/docs/smapi/skill-events-in-alexa-skills.html#skill-disabled-event)
### Account Linked

This Skill Event gets triggered, if the user links their account using the companion app/website. The incoming request will also contain the access token, which you can access using `this.getAccessToken()`.

Enable that event by adding the following to your `subscription` array inside your `events` object in your `skill.json`:
```javascript
{
  "eventName": "SKILL_ACCOUNT_LINKED"
},
```

And adding the `AlexaSkillEvent.SkillAccountLinked` inside your `ON_EVENT` state:
```javascript
'ON_EVENT': {
    'AlexaSkillEvent.SkillAccountLinked': function() {
        console.log('AlexaSkillEvent.SkillAccountLinked');
		console.log(`UserId: ${this.getUserId()}`);		
    },
}
```

[Official Documentation](https://developer.amazon.com/docs/smapi/skill-events-in-alexa-skills.html#account-linked-event)
### Skill Permission Accepted

This Skill Event gets triggered, if your user grants permissions for the first time or if they grant them after they were revoked. The request will include the most recently accepted permissions. You can access the body of the request using the `this.alexaSkill().getSkillEventBody()` method, which will contain an array with the permissions. Check out the sample requests in the [official documentation](https://developer.amazon.com/docs/smapi/skill-events-in-alexa-skills.html#skill-permission-accepted-event) to get a feeling for the JSON structure.

Enable that event by adding the following to your `subscription` array inside your `events` object in your `skill.json`:
```javascript
{
  "eventName": "SKILL_PERMISSION_ACCEPTED"
},
```

And adding the `AlexaSkillEvent.SkillPermissionAccepted` inside your `ON_EVENT` state:
```javascript
'ON_EVENT': {
    'AlexaSkillEvent.SkillPermissionAccepted': function() {
        console.log('AlexaSkillEvent.SkillPermissionAccepted');
		console.log(`UserId: ${this.getUserId()}`);		
		console.log(`Permissions: ${JSON.stringify(this.alexaSkill().getSkillEventBody().acceptedPermissions)}`);	
	},
}
```

[Official Documentation](https://developer.amazon.com/docs/smapi/skill-events-in-alexa-skills.html#skill-permission-accepted-event)
### Skill Permission Changed

This Skill Event gets triggered, if your user grants your Skill additional permission or revokes existing ones. The request will include the most recently accepted permissions. You can access the body of the request using the `this.alexaSkill().getSkillEventBody()` method, which will contain an array with the permissions. Check out the sample requests in the [official documentation](https://developer.amazon.com/docs/smapi/skill-events-in-alexa-skills.html#skill-permission-changed-event) to get a feeling for the JSON structure.

Enable that event by adding the following to your `subscription` array inside your `events` object in your `skill.json`:
```javascript
{
  "eventName": "SKILL_PERMISSION_CHANGED"
},
```

And adding the `AlexaSkillEvent.SkillPermissionChanged` inside your `ON_EVENT` state:
```javascript
'ON_EVENT': {
    'AlexaSkillEvent.SkillPermissionChanged': function() {
        console.log('AlexaSkillEvent.SkillPermissionChanged');
		console.log(`UserId: ${this.getUserId()}`);		
		console.log(`Permissions: ${JSON.stringify(this.alexaSkill().getSkillEventBody().acceptedPermissions)}`);	
    },
}
```

[Official Documentation](https://developer.amazon.com/docs/smapi/skill-events-in-alexa-skills.html#skill-permission-changed-event)

## Staging

With staging, you can define multiple staging environments like `dev`, `test`, and `prod` in your `app.json`. You can also override values in the `skill.json` file that relate to skill events and the endpoint that will handle them.

For example, if you want the same lambda function to handle all events for your skill (including skill events), then you can add the following to the `app.json` for each stage:

```javascript
{
    "stages": {
        "dev": {
            "endpoint": "arn:aws:lambda:us-east-1:XXX",
            "alexaSkill": {
                "skillId": "amzn1.ask.skill.XXX",
                "askProfile": "company",
                "manifest": {
                    "events": {
                        "endpoint": {
                            "uri": "arn:aws:lambda:us-east-1:XXX"
                        },
                        "subscriptions": [
                            {
                                "eventName": "SKILL_ENABLED"
                            },
                            {
                                "eventName": "SKILL_DISABLED"
                            },
                            {
                                "eventName": "SKILL_PERMISSION_ACCEPTED"
                            },
                            {
                                "eventName": "SKILL_PERMISSION_CHANGED"
                            },
                            {
                                "eventName": "SKILL_ACCOUNT_LINKED"
                            }
                        ]
                    }
                }
            }
        }
    }
}
```

Notice how the exact same Lambda ARN is used for both endpoints.

You then build and deploy the `dev` stage using the JOVO CLI:

```sh
# Uses dev stage
$ jovo build --stage dev

# Then: Deploy to platform
$ jovo deploy
```

This will update the `skill.json` file to include the skill events and the endpoint that will handle them.



<!--[metadata]: {"title": "Alexa Skill Events", 
"description": "Build Alexa Skills with the Jovo Framework. Learn more about Alexa specific features here", "activeSections": ["platforms", "alexa", "alexa_skillevents"], 
"expandedSections": "platforms", "inSections": "platforms", 
"breadCrumbs": {"Docs": "docs/", "Platforms": "docs/platforms",
"Amazon Alexa": "" }, 
"commentsID": "framework/docs/skill-events", 
"route": "docs/amazon-alexa/skill-events" 
}-->
