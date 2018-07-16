# How to Extend Built-in Slots with the Jovo Language Model

Learn how to extend Alexa built-in slots like `AMAZON.US_CITY` and Dialogflow system entities like `@sys.geo-city-us` with the Jovo Language Model.

* [Introduction to Built-in Slots and Entities](#introduction-to-built-in-slots-and-entities)
* [How to Extend Built-in Slots](#how-to-extend-built-in-slots)
   * [Create a new Input Type](#create-a-new-input-type)
   * [Reference Alexa and Dialogflow Types](#reference-alexa-and-dialogflow-types)
   * [Add Additional Values](#add-additional-values)
* [Build the new Language Model](#build-the-new-language-model)


## Introduction to Built-in Slots and Entities

The [Jovo Language Model](../03_app-configuration/01_models '../model') is an abstraction layer for Alexa Interaction Models and Dialogflow Agents.

With the Jovo Language Model, you can reference built-in slot and entity types like this:

```
{
    "intents": [
        {
            "name": "ILiveInCityIntent",
            "phrases": [
                "I live in {city}"
            ],
            "inputs": [
                {
                    "name": "city",
                    "type": {
                        "alexa": "AMAZON.US_CITY",
                        "dialogflow": "@sys.geo-city-us"
                    }
                }
            ]
        }
    ]
}
```
In the example above, we have an intent called `ILiveInCityIntent` that uses a single entity that references the Alexa built-in slot `AMAZON.US_CITY` and the Dialogflow sytem entity `@sys.geo-city-us`.

Although these entities work well often, it might sometimes be helpful to extend them with certain values to make sure they fit for your use case. In this case, it might be helpful to add a smaller town that could otherwise not be found, but is critical for the conversation.

Let's update the language model to make that work.

## How to Extend Built-in Slots

These are the steps you need to take to extend your built-in slots and system entities:

* [Create a new Input Type](#create-a-new-input-type)
* [Reference Alexa and Dialogflow Types](#reference-alexa-and-dialogflow-types)
* [Add Additional Values](#add-additional-values)

### Create a new Input Type

Instead of directly referencing the built-in entities in the `inputs` array of your intent, let's create a new input type called `US_CITY`:

```
{
    "intents": [
        {
            "name": "ILiveInCityIntent",
            "phrases": [
                "I live in {city}"
            ],
            "inputs": [
                {
                    "name": "city",
                    "type": "US_CITY"
                }
            ]
        }
    ]
}
```

Add this new type to the `inputTypes` object of your language model file:

```
{
    "inputTypes": [
        {
            "name": "US_CITY"
        }
    ]
}
```

You can learn more about input types here: [Jovo Docs > Language Model > Input Types](../03_app-configuration/01_models#input-types '../model#input-types').


### Reference Alexa and Dialogflow Types

In your input type, you can now reference the built-in slots like you did in the intent inputs above:

```
{
    "inputTypes": [
        {
            "name": "US_CITY",
            "alexa": "AMAZON.US_CITY",
            "dialogflow": "@sys.geo-city-us",
        }
    ]
}
```

### Add Additional Values

Finally, you can add additional values like this:

```
{
    "inputTypes": [
        {
            "name": "US_CITY",
            "alexa": "AMAZON.US_CITY",
            "dialogflow": "@sys.geo-city-us",
            "values": [
				{
					"value": "new city"
				}
			]
        }
    ]
}
```

## Build the new Language Model

After updating the `models/en-US.json` (or other locale) file in your Jovo project, run the following command to build the platform specific language model files:

```shell
$ jovo build
```




<!--[metadata]: {"title": "How to Extend Built-in Slots with the Jovo Language Model", 
                "description": "Learn how to extend Alexa built-in slots like AMAZON.US_CITY and Dialogflow system entities like @sys.geo-city-us with the Jovo Language Model.",
                "activeSections": ["kb"],
                "expandedSections": "kb",
                "inSections": "kb",
                "breadCrumbs": {"Docs": "docs",
				"Knowledge Base": "docs/kb"
                                },
		"commentsID": "framework/docs/kb/exend-built-in-slots",
		"route": "docs/kb/extend-built-in-slots"
                }-->
