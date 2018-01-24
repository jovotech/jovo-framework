# Models

In this section, you will learn more about the Jovo interaction model.

* [Introduction](#introduction)
  * [Invocation](#invocation)
  * [Intents](#intents)
  * [Inputs](#inputs)
  * [Input Types](#input-types)
  * [Alexa](#alexa)

## Introduction
The Jovo language model allows you to maintain only a single file, which can be used to create the platform specific language models with the help of the [`Jovo CLI`](). Every language you choose to support will have its very own interaction model (`en-US`, `de-DE`, etc.). Overall the Jovo model is similar to the Alexa interaction model with some small changes here and there.

```javascript
{  
    "invocation":"jovo beta",
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

### Invocation
Sets the invocation name of your voice application, although it only works on Alexa Skills, since the invocation name for Google Actions has to be set in the developer console.
```javascript
"invocation":"Your Invocation Name",
```

### Intents
Every Intent, which can be used across multiple platforms, will be defined here. Most of the times these are the intents you create yourself. Utterances are called phrases in the Jovo language model.
```javascript
"name": "OnboardingIntent",
"phrases": [
    "My name is {name} and I live in {city}",
    "My name is {name}",
    "I live in {city}",
    "I'm {name} from {city}",
    "I go by {name}"
],
```

### Inputs
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

### Alexa
Some of the features Alexa provides have to be implemented in the interaction model. For example the AudioPlayer interface, which requires you to add the AMAZON.PauseIntent and AMAZON.ResumeIntent.
Intents or Slots, that make use of Alexa speicifc features have to be added here. These specific intents and slots will be added to the intents and input types you defined before, to create the complete Alexa model.
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