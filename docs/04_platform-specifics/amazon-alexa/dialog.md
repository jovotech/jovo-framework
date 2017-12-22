# [Platform Specific Features](../) > [Amazon Alexa](./README.md) > Dialog Interface

In this section, you are going to learn how to manage multi-turn conversations with the Alexa Dialog Interface.

* [Introduction](#introduction)
* [Requirements](#requirements)
* [Dialog State](#dialog-state)
* [Features](#features)
    * [Dialog Delegate](#dialog-delegate)
    * [Control the Dialog in your Code](#control-the-dialog-in-your-code)
        * [Slot Value](#slot-value)
        * [Elecit Slot](#elecit-slot)
        * [Confirm Slot](#confirm-slot)
        * [Confirm Intent](#confirm-intent)
        * [Update Intent](#update-intent)

## Introduction

The Amazon Alexa Dialog Interface helps you manage multi-turn conversations with your user to gather the information needed to for your intent.
Here is the [official documentation by Amazon](https://developer.amazon.com/docs/custom-skills/dialog-interface-reference.html).
Every conversation is connected to an intent and it is maintained until all the required slots are filled or confirmed by the user. 

## Requirements

To use the Dialog Interface, you need a dialog model, which you can create with the Skill Builder. In the dialog model, you select which slots are required for your intent and whether the user has to confirm them or the whole intent. You also define, which prompts Alexa should use and how the user might answer (utterances).

Please consider that you're not allowed to use:
* `AMAZON.YesIntent`, `AMAZON.NoIntent` built-in intents
* `AMAZON.LITERAL` slot type
* Single-slot utterances in your intents' utterances

## Dialog State

If the Dialog Interface is enabled, you will get a `dialogState` property with every request. It is used to determine whether the dialog has just `STARTED`, is `IN_PROGRESS` or already `COMPLETED`. 
When the intent is invoked for the first time, `dialogState` will be set to `STARTED`. It is only set to `COMPLETED`, if you let Alexa handle the whole conversation. We will get to that later on.

To check the dialog state, use: 
```javascript
app.alexaSkill().getDialogState()
```

Jovo also allows you to check for a specific state:
```javascript
// STARTED
app.alexaSkill().isDialogStarted()

// IN PROGRESS
app.alexaSkill().isDialogInProgress()

// COMPLETED
app.alexaSkill().isDialogCompleted()
```

## Features

When using the dialog interface, you can decide between letting Alexa handle the conversation or controlling each step yourself. There is also the possibility to combine both options.

### Dialog Delegate

If you decide to delegate the conversation, Alexa will use the prompts you defined in your dialog model to fill the required slots. Alexa will also confirm both slots or the whole intent if you selected that in the dialog model.

To delegte the conversation, use:
```javascript
app.alexaSkill().dialogDelegate()
```

### Control the Dialog in Your Code

The Dialog Interface allows you to jump in and control the conversation yourself. Keep in mind that the prompts you prepared in the Skill Builder are only used if you delegate the conversation to Alexa. The utterances are still beeing used.

You have the possibility the ask the user to fill a certain slot, confirm a slot, or confirm the whole intent. You can also update the intent if you have certain values, for example the user's name, saved in a database. 

From now on parameters, which are between these `[]` brackets, are optional. These parameters are `repromptText` and `updatedIntent`. If you don't specifiy a `repromptText`, the speechText will be used twice. 

#### Slot Value

To check, whether a slot has value or not, use:
```javascript
app.alexaSkill().hasSlotValue(slotName)

// Example
app.alexaSkill().hasSlotValue('name');
```

#### Elecit Slot

If you want the user to fill a slot, use:
```javascript
app.alexaSkill().dialogElecitSlot(slotName, speechText[, repromptText, updatedIntent])

// Example
app.alexaSkill().dialogElecitSlot('name', 'What\'s your name?', 'Can you tell me your name, please?');
```

#### Confirm Slot

To confirm a slot use:
```javascript
app.alexaSkill().dialogConfirmSlot(slotname, speechText[, repromptText, updatedIntent])

// Example
app.alexaSkill().dialogConfirmSlot('name', 'Your name is ' + app.getInput('name') + ', right?');
```

#### Confirm Intent

To confirm the whole intent, use:
```javascript
app.alexaSkill().dialogConfirmIntent(speechText[, repromptText, updatedIntent])

// Example
app.alexaSkill().dialogConfirmIntent('Your name is ' + app.getInput('name') + ' and you are from ' + app.getInput('city') + ', correct?');
```
#### Update Intent

Updating an intent gives you the possibility to change slot values or the confirmation status for slots or intents. Here's an example:

You already have the user's name stored in the database, so you don't want to ask for it again. Therefor you just update the intent and add the slot value.
```javascript
let updatedIntent = {
    name: 'TestIntent',
    confirmationStatus: 'NONE',
    slots: {
        name:{
            name: 'name',
            value: app.user().data.name,
            confirmationStatus: 'CONFIRMED',
        },
        city:{
            Name: 'city',
            confirmationStatus: 'NONE',
        }
    }
};
// You update the intent an fill the name slot. There is only city slot left, so you can manually ask the user to fill that

app.alexaSkill().dialogElecitSlot('city', 'Which city are you living in?', updatedIntent);
```
