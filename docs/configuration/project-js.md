# project.js - Project Configuration

The `project.js` is an essential file that stores a lot of important project information that is used for deployment.

* [Introduction](#introduction)
* [Platforms](#platforms)
   * [alexaSkill](#alexaskill)
   * [googleAction](#googleaction)
   * [nlu](#nlu)
* [Language Model](#language-model)
   * [Override the Invocation Name](#override-the-invocation-name)
   * [Add Intents and Inputs](#add-intents-and-inputs)
* [Deployment](#deployment)
   * [Stages](#stages)
   * [Host](#host)


## Introduction

The `project.js` is used by many features of Jovo, for example to build platform specific project files with the [Jovo CLI](../basic-concepts/cli './cli'), or to add different stages for more convenient deployment.

Here is a list of all elements that can be added to the `project.js`:

Category | Name | Description
:--- | :--- | :---
[Platforms](#platforms) | [`alexaSkill`](#alexaSkill) | Alexa Skill project config
 | | [`googleAction`](#googleAction) | Google Action project config
 | | [`nlu`](#nlu) | Includes natural language understanding tools like `dialogflow`
[Deployment](#deployment) | `endpoint` | Endpoint for the voice platforms to reach your app. Default: Jovo Webhook.
 | | `host` | Deployment information (e.g. if hosted on Lambda, but endpoint is API Gateway)
 | | [`stages`](#stages) | Different deployment stages  
 | | `defaultStage` | Default stage to use if not defined differently in the environment variables


This is what the default `project.js` looks like:

```javascript
// ------------------------------------------------------------------
// JOVO PROJECT CONFIGURATION
// ------------------------------------------------------------------

{
	alexaSkill: {
		nlu: 'alexa',
	},
	googleAction: {
		nlu:  'dialogflow',
	},
	endpoint: '${JOVO_WEBHOOK_URL}',
}
```

As you can see above, an `endpoint` is automatically added to the file with your unique Jovo Webhook endpoint.

Alternatively, you can reference values from your `environment variables` like so:

```javascript
${process.env.KEY}

// Example: Get endpoint from env
endpoint: process.env.ENDPOINT,
```

These environment variables are usually stored in a `.env` file or in your cloud environment, for example AWS Lambda.

## Platforms

With the Jovo CLI, you can create and deploy project files (e.g. [language models](../basic-concepts/model './model')) that are specific to each voice platform. 

The [introduction](#introduction) already shows how a freshly created `project.js` looks like for both platforms [`alexaSkill`](#alexaskill) and [`googleAction`](#googleaction). In the following section, you will learn about additional configurations to the voice platform projects.

### alexaSkill

The following elements can be added to the `alexaSkill` object:

```javascript
{
    alexaSkill: {
        nlu: {
            name: 'alexa',
        },
        skillId: '<your-skill-id>',
        askProfile: '<your-ask-cli-profile>'
    },
}
```

In the deployment process with the Jovo CLI ([`jovo deploy`](../basic-concepts/cli/deploy './cli/deploy')), `skillId` and `askProfile` are by default taken from the existing `config` in the `/platforms/alexaSkill/.ask` folder. Specifying those in the `project.js` to override the existing platform files is especially useful if you have different versions of the Alexa Skill in separate developer accounts (see [Stages](#stages)).

#### skill.json Overrides

You can also add information to go into the `skill.json`. You can basically add or override any element that you can find in the skill manifest:

```javascript
{
    alexaSkill: {
        manifest: {
            // Add element to override here
        }
    },
}
```

To add an object, make sure to add the same path it has in the `skill.json`. The below example (from our [Alexa Audioplayer Template](https://github.com/jovotech/jovo-templates/tree/master/alexa/audioplayer)) adds the Audioplayer Directive to the Alexa Skill:

```javascript
{
    alexaSkill: {
        manifest: {
			apis: {
				custom: {
				  interfaces: [
					{
					  type: 'AUDIO_PLAYER',
					}
				  ]
				}
			}
		}
	},
}
```


### googleAction

The deployment communication between the Jovo CLI and the Google Action is going through a Dialogflow agent. This is why project configuration settings are added to a `dialogflow` object inside the `googleAction` block:

```javascript
googleAction: {
    dialogflow: {
        projectId: '<your-project-id>',
        keyFile: './path/to/key-file',
    }
}
```

Updating a Dialogflow Agent through the Jovo CLI needs an authentication process with a `keyFile`, which can be downloaded and placed in your project directory. For more information, take a look at the example in our [Tutorial: Deploy a Dialogflow Agent with the Jovo CLI](https://www.jovo.tech/tutorials/deploy-dialogflow-agent).

Similar to additional elements that go into the `skill.json` for the [`alexaSkill` object](#alexaSkill), you can also add specific elements to a Dialogflow agent by adding the whole in the the `agent.json` file, like so: 

```javascript
googleAction: {
    dialogflow: {
        agent: {
            // Add element to override here
        }
    }
}
```

For example, you can add a header to your `webhook` like this:

```javascript
googleAction: {
	dialogflow: {
		agent: {
			webhook: {
				headers: {
					headerKey: 'headerValue',
				}
			}
		}
	}
}
```

### nlu

For every platform, an `nlu` element is added for additional options regarding natural language understanding tooling. For example:

```javascript
googleAction: {
    nlu: {
        name: 'dialogflow',
    }
}
```

Right now, the built-in `alexa` nlu for Amazon Alexa and `dialogflow` for Google Assistant are supported.

#### Different Locales

For the language model conversion, a `lang` object can be added to the `nlu` block:

```javascript
alexaSkill: {
    nlu: {
      name: 'alexa',
      lang: {
        en: [
          'en-US',
        ]
      }
    }
  },
```

In the above example, the object specifies the following process for the [`jovo build` command](../basic-concepts/cli/build './cli/build'):

* Access an existing Jovo Language Model file `en.json` in the `/models` folder
* Convert it into an Alexa Interaction Model `en-US.json` in the `/platforms/alexaSkill/models` folder


## Language Model

In the `project.js`, you can also add or override specific elements of your language model in the `models` folder. 

> [Learn more about the Jovo Language Model here](../basic-concepts/model './model').

### Override the Invocation Name

Changing the invocation name is especially useful for different stages if you want to make sure you know which version of your voice app you're currently talking to.

For example, you can override the language model for the `en-US` locale like thos:

```javascript
languageModel: {
	'en-US': {
		invocation: 'my test app dev',
	}
}
```

*NOTE*: Currently, the invocation name can only be specified in the `models` folder for Alexa Skills. For Google Actions, you need to change them in the Actions on Google Console.


### Add Intents and Inputs

You can also add whole intents and inputs and any element that you can find in your e.g. `en-US.json` in the Jovo `models` folder. 

For example, you can add an intent to specific stages like so:

```javascript
languageModel: {
	'en-US': {
		intents: [
          	{
            	name: 'WhatEnvIntent',
            	samples: [
					'what\'s the stage',
					'what is the environment',
					'what environment is this deployed to'
            	]
          	}
        ]
	}
}
```


## Deployment

### Stages

Jovo allows you to define multiple staging environments like `dev`, `test`, and `prod` in your `project.js`:

```javascript
{
    stages: {
        dev: {
            
        },
        test: {
            
        },
        prod: {

        }
    }
}
```

The elements inside a stage are merged into the elements outside the stage with the ability to override configurations. You can also add a `defaultStage` element (although not necessary):

```javascript
{
    defaultStage: 'dev',
    stages: {
        dev: {
            //
        }
    }
}
```

> For an overview of staging examples, take a look at our [Staging Examples](https://www.jovo.tech/tutorials/staging-examples).

A stage is active when one of the following is true (by default, only the elements outside the `stages` are used):

* The default stage is set with `defaultStage: '<your-stage>'`
* The stage is set in the environment variables with `STAGE=<stage>`


### Host

Sometimes (for example, if you are using an API Gateway), your `endpoint` might differ from the destination where the code is located (the `host`). 

You can add a `host` object to specify where the code is hosted. Right now, `lambda` is supported to deploy your code to AWS Lambda. This is how you can set it up:
 
```javascript
host: {
    lambda: {
        arn: '<your-lambda-arn>',
        askProfile: '<your-ask-cli-profile>', // if left out: "default" profile is used
    }
}
```

Note: If you're only building an Alexa Skill, there is no need to specify a host with the same information that is already in the `endpoint`. This is mostly important if you also want to host your Google Action on AWS Lambda and make it accessible through an API Gateway.


<!--[metadata]: {"description": "The project.js is an essential file that stores a lot of important information that is used by the Jovo app and the Jovo CLI.", "route": "project-js"}-->
