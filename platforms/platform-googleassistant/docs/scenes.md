---
title: 'Google Assistant Scenes'
excerpt: 'Learn how to use scenes when building Google Conversational Actions with Jovo.'
---

# Google Assistant Scenes

Learn how to use scenes when building Google Conversational Actions with Jovo.

## Introduction

Scenes are a concept of Google Conversational Actions that are similar to Jovo Components. They are configurable building blocks or flows that are responsible for specific tasks. You can learn more in the [official documentation by Google](https://developers.google.com/assistant/conversational/scenes).

You can configure scenes either in the [Actions Console](https://console.actions.google.com/) or in your Jovo Model. [Learn more about model configuration below](#model-configuration).

Google provides a handful of pre-configured [system scenes](https://developers.google.com/assistant/conversational/scenes#system_scenes) you can use for tasks such as [account linking](https://v4.jovo.tech/marketplace/platform-googleassistant/account-linking). For more specialized tasks, it is possible to define your own [custom scenes](#custom-scenes).

## Model Configuration

We recommend adding scenes to the [Jovo Model](https://v4.jovo.tech/marketplace/platform-googleassistant/model) files of your project. Here is an example scene `MyCustomScene` that is added to the `googleAssistant` specific element of the model:

```javascript
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

The syntax is the same as in your Action's `.yaml` files, but in JSON format.

## Custom Scenes

Custom Scenes have three stages you can configure:

- [Activation](#activation): A scene must be activated either by a scene transition or intent matching.
- [Execution](#execution): Once activated, a scene executes it's lifecycle, containing a variation of tasks and conversational flows.
- [Transition](#transition): When a scene's lifecycle has been completed, it follows it's defined transition, e.g. ending the conversation or transitioning to another scene.

You can also learn more about [custom scenes in the official Google documentation](https://developers.google.com/assistant/conversational/scenes#custom_scenes).

### Activation

To activate a scene, you can actively invoke it with a global intent, or transition to it from another scene or your Jovo app. The latter ([as explained in the webhook section in the official Google documentation](https://developers.google.com/assistant/conversational/webhooks?tool=builder#response-json_4)) is done by adding a scene to your output:

```typescript
{
  // ...
  platforms: {
    googleAssistant: {
      nativeResponse: {
        scene: {
          next: {
            name: 'SomeScene',
          }
        }
      }
    }
  }
}
```

After the response has been sent, your scene gets activated, so your conversational flow will now be handled from within the scene.

### Execution

Once activated, your scene runs its lifecycle until meeting the transition criteria. This lifecycle runs in predefined stages, that will execute your tasks in order.

Except for [`On Enter`](#on-enter), all stages run through an execution loop, meaning that if no stage meets the transition criteria, the scene will execute all stages again, starting from the [`Conditions`](#conditions) stage.

#### On Enter

This stage is triggered once on scene activation, useful for pre-configuration.

```javascript
"MyCustomScene": {
  "onEnter": {
    "webhookHandler": "Jovo"
  }
}
```

#### Conditions

Here you can evaluate certain criteria, depending on which you can then choose to carry on with the lifecycle or exit the scene by calling your webhook, for example.

```javascript
"MyCustomScene": {
  "conditionalEvents": [
		{
		  "condition": "user.verificationStatus == \"VERIFIED\"",
		  "transitionToScene": "AnotherCustomScene"
		},
  ],
}
```

For example, in this scene, if the user is verified, the scene will transition to another scene to continue with the conversational flow.

#### Slot Filling

You can instruct a scene to collect required data for you. Once all slots have been collected, the attribute `scene.slots.status` will be set to `FINAL`, which you can act upon in the [`Conditions`](#conditions) stage. Once a slot has been filled, you can find the value in the session attributes under the property you specified with `writeSessionParam`.

In the below example, we require a slot `age`, which has the type `actions.type.Number`. Once the user has filled this slot, the Jovo handler is called and we can access the value with `this.$session.data.age`.

```javascript
"MyCustomScene": {
  "conditionalEvents": [
    {
      "condition": "scene.slots.status == \"FINAL\"",
      "handler": {
        "webhookHandler": "Jovo"
      }
    }
  ],
  "slots": [
    {
      "commitBehavior": {
        "writeSessionParam": "age"
      },
      "name": "age",
      "required": true,
      "type": {
        "name": "actions.type.Number"
      }
    }
  ]
}
```

#### Prompts

If you've configured the previous stages to prompt the user, Google Assistant will deliver it to the user and collect optional input in the next stage:

```javascript
"MyCustomScene": {
  "conditionalEvents": [
    {
      "condition": "scene.slots.status == \"FINAL\"",
      "handler": {
        "webhookHandler": "Jovo"
      }
    }
  ],
  "slots": [
    {
      "commitBehavior": {
        "writeSessionParam": "age"
      },
      "name": "age",
      "promptSettings": {
        "initialPrompt": {
          "staticPrompt": {
            "candidates": [
              {
                "promptResponse": {
                  "firstSimple": {
                    "variants": [
                      {
                        "speech": "Please tell me your age."
                      }
                    ]
                  }
                }
              }
            ]
          }
        }
      },
      "required": true,
      "type": {
        "name": "actions.type.Number"
      }
    }
  ]
}
```

#### Input

This is the last stage of the execution loop. Depending on your scene's configuration, Google Assistant will try to listen for input from the user, and then match it either to an intent, a slot, or trigger a system intent (e.g. `NO_INPUT`).

In the case of a slot match, the scene will return to the [`Slot Filling`](#slot-filling) stage. If the scene matches an intent or triggers a system intent, you can either call your webhook or transition to another scene:

```javascript
"MyCustomScene": {
  "intentEvents": [
	  {
		  "intent": "MyNameIsIntent",
			"transitionToScene": "NameHandlerScene"
		}
	]
}
```

In this example, if your scene is active and `MyNameIsIntent` is matched, the scene will exit and transition to `NameHandlerScene` to prompt the user for more input.

### Transition

Once your transition criteria have been met, you can define a transition to continue with your conversation.

```javascript
"MyCustomScene": {
  "conditionalEvents": [
		{
		  "condition": "user.verificationStatus == \"VERIFIED\"",
		  "transitionToScene": "AnotherCustomScene"
		},
  ],
}
```
