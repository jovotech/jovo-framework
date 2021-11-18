# Scenes

> To view this page on the Jovo website, visit https://v3.jovo.tech/marketplace/jovo-platform-googleassistantconv/concepts/scenes

Learn more about enhancing your Conversational Action with scenes.

* [Introduction](#introduction)
* [Custom Scenes](#custom-scenes)
  * [Activation](#activation)
  * [Execution](#execution)
    * [On Enter](#on-enter)
    * [Conditions](#conditions)
    * [Slot Filling](#slot-filling)
    * [Prompts](#prompts)
    * [Input](#input)
  * [Transition](transition)

## Introduction

Scenes are building blocks in your Conversational Action, that capture your conversational tasks into individual states. You can use scenes to instruct your Conversational Action to handle certain conversational flows automatically, such as [Account Linking](https://v3.jovo.tech/marketplace/jovo-platform-googleassistantconv/user-data#account-linking) or configuring [Push Notifications](https://v3.jovo.tech/marketplace/jovo-platform-googleassistantconv/interfaces/notifications). 

Google provides a handful of preconfigured [system scenes](https://developers.google.com/assistant/conversational/scenes#system_scenes) you can use for tasks such as [Account Linking](https://v3.jovo.tech/marketplace/jovo-platform-googleassistantconv/user-data#account-linking), but for more specialized tasks, you need to define your own custom scenes.

## Configuration

There are basically two ways to build and configure scenes, either in your [Actions Console](https://console.actions.google.com/) or in your [Jovo Language Model](https://v3.jovo.tech/docs/model):

```javascript
"googleAssistant": {
  "custom": {
    "scenes": {
      "MyCustonScene": {
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

Custom Scenes basically have three stages you can configure: 

* Activation: A scene must be activated, either by a scene transition or intent matching.
* Execution: Once activated, a scene executes it's lifecycle, containing a variation of tasks and conversational flows.
* Transition: When a scene's lifecycle has been completed, it follows it's defined transition, e.g. ending the conversation or transitioning to another scene.

### Activation

To activate a scene, you can actively invoke it with a global intent, or transition into it from another scene. You can also choose to transition into your scene from your Jovo app:

```javascript
// @language=javascript
this.$googleAction.setNextScene('MyCustomScene');
this.ask('What do you want to do?');

// @language=typescript
this.$googleAction!.setNextScene('MyCustomScene');
this.ask('What do you want to do?');
```

After the response has been sent, your scene has been activated, so your conversational flow will now be handled from within the scene.

### Execution

Once activated, your scene runs it's lifecycle, until meeting the transition criteria. This lifecycle runs in predefined stages, that'll execute your tasks in order. Except for [`On Enter`](#on-enter), all stages run through an execution loop, meaning that if no stage meets the transition criteria, the scene will execute all stages again, starting from the [`Conditions`](#conditions) stage.

### On Enter

This stage is triggered once on scene activation, useful for preconfiguration.

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

In this example, we require a slot `age`, which has the type `actions.type.Number`. Once the user has filled this slot, the Jovo handler is called and we can access the value with `this.$session.$data.age`.

#### Prompts

If you've configured the previous stages to prompt the user, Google Assistant will deliver it to the user and collects optional input in the next stage:

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

This is the last stage of the execution loop. Depending on your scene's configuration, Google Assistant will try to listen for input from the user, and matches it either to an intent, a slot, or will trigger a system intent (e.g. `NO_INPUT`). In the case of a slot match, the scene will return to the [`Slot Filling`](#slot-filling) stage. If the scene matches an intent or triggers a system intent, you can either call your webhook or transition to another scene:

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

Once your transition criteria has been met, you can define a transition to continue with your conversation.

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

[Example Javascript](https://github.com/jovotech/jovo-framework/blob/master/examples/javascript/02_googleassistantconv/scenes/) | [Example Typescript](https://github.com/jovotech/jovo-framework/blob/master/examples/typescript/02_googleassistantconv/scenes/)
