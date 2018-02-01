# Jovo Language Model

In this section, you will learn more about the Jovo Language Model, found in the `models` folder of your project. It can be used to created platform specific language models with the [Jovo CLI](../../02_cli).

* [Introduction](#introduction)
* [Language Model Elements](#language-model-elements)
    * [Intents](#intents)
        * [Phrases](#phrases)
        * [Inputs](#inputs)
    * [Input Types](#input-types)
* [Platform Specific Elements](#platform-specific-elements)
  * [Alexa](#alexa)
  * [Dialogflow](#dialogflow)

## Introduction
The Jovo Language Model allows you to maintain only a single file, which can be used to create the platform specific language models with the help of the [`Jovo CLI`](../../02_cli). 

You can find the language model files in the `models` folder of your Jovo project:

![Model Folder in a Jovo Project](../../img/folder-structure-models.png "Model Folder in a Jovo Project" )

Every language you choose to support will have its very own language model (`en-US`, `de-DE`, etc.). Overall the Jovo Language Model is similar to the Alexa interaction model with some small changes here and there.

For example, the `en-US.json` in the [Jovo Sample Voice App](https://github.com/jovotech/jovo-sample-voice-app-nodejs) looks like this:

```javascript
{  
    "invocation": "my test app",
    "intents":[  
        {  
            "name":"HelloWorldIntent",
            "phrases":[  
                "hello",
                "say hello",
                "say hello world"
            ]
        },
        {  
            "name":"MyNameIsIntent",
            "phrases":[  
                "{name}",
                "my name is {name}",
                "i am {name}",
                "you can call me {name}"
            ],
            "inputs":[  
                {  
                    "name":"name",
                    "type":{  
                        "alexa":"AMAZON.US_FIRST_NAME",
                        "dialogflow":"@sys.given-name"
                    }
                }
            ]
        }
    ],
    "alexa":{  
        "interactionModel":{  
            "languageModel":{  
                "intents":[  
                    {  
                        "name":"AMAZON.CancelIntent",
                        "samples":[  

                        ]
                    },
                    {  
                        "name":"AMAZON.HelpIntent",
                        "samples":[  

                        ]
                    },
                    {  
                        "name":"AMAZON.StopIntent",
                        "samples":[  

                        ]
                    }
                ]
            }
        }
    }
}
```
Let's go through the specific elements in detail.

## Language Model Elements

The Jovo Language Model consists of several elements, which we will go through step by step in this section:

* [Invocation](#invocation)
* [Intents](#intents)
    * [Phrases](#phrases)
    * [Inputs](#inputs)
* [Input Types](#input-types)

For platform specific language model elements, take a look at the sections below:

* [Platform Specific Elements](#platform-specific-elements)
    * [Alexa](#alexa)
    * [Dialogflow](#dialogflow)

### Invocation
Sets the invocation name of your voice application, although it only works on Alexa Skills, since the invocation name for Google Actions has to be set in the developer console.

```javascript
"invocation":"my test app",
```

### Intents
Every Intent, which can be used across multiple platforms, will be defined here. Each intent is an object that includes a `name`, sample `phrases`, and `inputs` (optional):

```javascript
{  
    "name":"MyNameIsIntent",
    "phrases":[  
        "{name}",
        "my name is {name}",
        "i am {name}",
        "you can call me {name}"
    ],
    "inputs":[  
        {  
            "name":"name",
            "type":{  
                "alexa":"AMAZON.US_FIRST_NAME",
                "dialogflow":"@sys.given-name"
            }
        }
    ]
}
```

#### Phrases


#### Inputs
While defining your inputs (slots on Amazon Alexa and entity on Google Action) you can choose to either provide seperate input types for each platform or you simply use your own input type.
```javascript
"inputs": [
    {
        "name": "name",
        "type": {
            // Use built in slots/entities from each platform
            "alexa": "AMAZON.US_FIRST_NAME", 
            "dialogflow": "@sys.given-name"
        }
    },
    {
        "name": "city",
        // Use your own input type
        "type": "myCityInputType"
    }
]
```

### Input Types
This is the place, where you can define your own input types.
```javascript
"inputTypes": [
    {
        "name": "myCityInputType",
        "values": [
            {
                "value": "Berlin"
            },
            {
                "value": "New York",
                "synonyms": [
                    "New York City",
                    "the city that never sleeps"
                ]
            }
        ]
    }
],
```

## Platform Specific Elements

If you only want to use certain features for one of the platforms, you can also add objects for their natural language understanding tools (`nlu`) to the model.

For Alexa Skills, Jovo currently supports the built-in nlu [`alexa`](#alexa), while for Google Assistant, [`dialogflow`](#dialogflow) is supported.

### Alexa

Some of the features Alexa provides have to be implemented separately in the `alexa` NLU section. 

Here are some examples:
* Built-in intents and slots (the ones with `AMAZON.` prepended to their names)
* Other Alexa-specific features like the Dialog Interface

// TODO

```javascript
"alexa": {
    "interactionModel": {
        "languageModel": {
            "intents": [
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

### Dialogflow

// TODO