# Models/Platforms

Learn more about the `platforms` folder, which is represents the voice platform projects, including information and language models.

* [Introduction](#introduction)
* [Alexa Skill](#alexa-skill)
    * [.ask](#.ask)
    * [Models](#models)
    * [skill.json](#skilljson)
* [Google Action](#google-action)
    * [Dialogflow](#dialogflow)


## Introduction

// TODO

## Alexa Skill

The `alexaSkill` folder contains all the information of your Alexa Skill needed to deploy the skill to the Amazon developer portal using the [`Jovo CLI`](https://github.com/jovotech/jovo-cli).

### .ask
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

### models
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

### skill.json
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

## Google Action

// TODO

### Dialogflow
The Dialogflow API v1 does not support programmatic agent creation. Therefor you are not able to deploy the application using the Jovo CLI.  But you can use the CLI to create `zip` file, which you can then import into Dialogflow.

#### Intents
Here you will find the intents, which were created using the Jovo interaction model. 

#### Entities
The input types, which you created yourself, will be stored here. 