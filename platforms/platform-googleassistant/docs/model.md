---
title: 'Google Assistant Language Model'
excerpt: 'Learn more about Jovo output templates for Alexa.'
---
# Google Assistant Language Model

Learn more about how to configure a Google Assistant language model using the [Jovo Model](https://v4.jovo.tech/docs/models).

## Introduction

The Jovo model files get turned into Google Assistant specific files during the `build` process.

The CLI turns all intents into global intents for Google Assistant and adds the `Jovo` webhook for fulfillment:

```json
"actions.intent.MAIN": {
  "handler": {
    "webhookHandler": "Jovo"
  }
}
```

You can also create Google Assistant specific intents using the [googleAssistant object](#googleassistant-object).


## googleAssistant Object

You can add a `googleAssistant` object to the root of the Jovo Model to add Google Assistant specific stuff using their original syntax. During the `build` process, it will be merged with the platform-independent configuration:


```json
"googleAssistant": {
  "custom": {
    "intents": {
      "ActionsIntent": {
        "trainingPhrases": [
          "foo",
          "bar"
        ]
      }
    },
    "types": {
      "NameType": {
        "synonym": {
          "entities": {
            "max": {
              "synonyms": [
                "maximilian"
              ]
            },
            "john": {
              "synonyms": [
                "johnathan"
              ]
            }
          }
        }
      }
    }
  }
}
```


### Global Intents

The Jovo CLI automatically creates an entry for the Jovo Webhook and registers it for every intent. However, if you choose to use customized webhooks, you'll need to overwrite the global intents as well.

```js
"googleAssistant": {
  "custom": {
    "global": {
      "actions.intent.MAIN": {
        "handler": {
          "webhookHandler": "MyOwnWebhook"
        }
      }
    }
  }
} 
```


### Scenes

You can also add scenes to the Jovo model. [Learn more here](https://v4.jovo.tech/marketplace/platform-googleassistant/model).

```json
"googleAssistant": {
  "custom": {
    "scenes": {
      "MyCustomScene": {
        "conditionalEvents": [{
          "condition": "scene.slots.status == \"FINAL\"",
          "handler": {
            "staticPrompt": {
              "candidates": [
                {
                  "promptResponse": {
                    "firstSimple": {
                      "variants": [
                        {
                          "speech": "Hello World!"
                        }
                      ] 
                    },
                    "suggestions": [
                      {
                        "title": "Foo"
                      },
                      {
                        "title": "Bar"
                      }
                    ]
                  }
                }
              ]
            }
          }
        }]
      }
    }
  }
}
```