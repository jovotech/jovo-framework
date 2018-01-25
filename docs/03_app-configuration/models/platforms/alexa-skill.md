# Alexa Skill

In this section, you will learn more about the contents of the `platforms/alexaSkill` folder.

* [Overview](#overview)
* [.ask](#.ask)
* [Models](#models)
* [Skill.json](#skill.json)

## Overview
The `alexaSkill` folder contains all the information of your Alexa Skill needed to deploy the skill to the Amazon developer portal using the [`Jovo CLI`]().

## .ask
The `.ask` folder contains the `config` file, which has the basic deploy settings of your skill. We recommend you to not make any changes to this file.
```javascript
{
	"deploy_settings": {
		"default": {
			"skill_id": "Your Skill ID",
			"was_cloned": false
		}
	}
}
```

## Models
The Alexa interaction model, which was created with the Jovo model, will be stored here. 
```javascript
{
	"interactionModel": {
		"languageModel": {
			"invocationName": "jovo beta",
			"types": [],
			"intents": [
				{
					"name": "HelloWorldIntent",
					"samples": [
						"hello",
						"say hello",
						"say hello world"
					]
				},
				{
					"name": "MyNameIsIntent",
					"samples": [
						"{name}",
						"my name is {name}",
						"i am {name}",
						"you can call me {name}"
					],
					"slots": [
						{
							"name": "name",
							"type": "AMAZON.US_FIRST_NAME"
						}
					]
				},
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

## Skill.json
`Skill.json` contains the publication and configuration information of your Skill. 
```javascript
{
	"skillManifest": {
		"publishingInformation": {
			"locales": {
				"en-US": {
					"summary": "Sample Short Description",
					"examplePhrases": [
						"Alexa open hello world"
					],
					"name": "hello-world",
					"description": "Sample Full Description"
				}
			},
			"isAvailableWorldwide": true,
			"testingInstructions": "Sample Testing Instructions.",
			"category": "EDUCATION_AND_REFERENCE",
			"distributionCountries": []
		},
		"apis": {
			"custom": {}
		},
		"manifestVersion": "1.0"
	}
}
```