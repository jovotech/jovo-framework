# Dialog Interface

> To view this page on the Jovo website, visit https://v3.jovo.tech/marketplace/jovo-platform-alexa/interfaces/dialog

The Amazon Alexa Dialog Interface helps you manage multi-turn conversations with your user to gather the information needed to for your intent.
Here is the [official documentation by Amazon](https://developer.amazon.com/docs/custom-skills/dialog-interface-reference.html).
Every conversation is connected to an intent and it is maintained until all the required slots are filled or confirmed by the user. 

* [Requirements](#requirements)
* [Dialog State](#dialog-state)
* [Dialog Delegate](#dialog-delegate)
* [Control the Dialog in Your Code](#control-the-dialog-in-your-code)
  * [Slot Value](#slot-value)
  * [Elicit Slot](#elicit-slot)
  * [Confirm Slot](#confirm-slot)
  * [Confirm Intent](#confirm-intent)
  * [Update Intent](#update-intent)

## Requirements

To use the Dialog Interface, you need a dialog model, which you can create with the Skill Builder. In the dialog model, you select which slots are required for your intent and whether the user has to confirm them or the whole intent. You also define, which prompts Alexa should use and how the user might answer (utterances).

You can also check out a sample implementation of the Dialog Interface in the Jovo language model here: [Alexa Dialog Interface Template](https://github.com/jovotech/jovo-templates/blob/master/alexa/dialoginterface/javascript/models/en-US.json)

Please consider that you're not allowed to use the `AMAZON.LITERAL` slot type.

## Dialog State

If the Dialog Interface is enabled, you will get a `dialogState` property with every request. It is used to determine whether the dialog has just `STARTED`, is `IN_PROGRESS` or already `COMPLETED`.
When the intent is invoked for the first time, `dialogState` will be set to `STARTED`. It is only set to `COMPLETED`, if you let Alexa handle the whole conversation. We will get to that later on.

To check the dialog state, use: 

```javascript
// @language=javascript

this.$alexaSkill.$dialog.getState()

// @language=typescript

this.$alexaSkill!.$dialog.getState()
```

Jovo also allows you to check for a specific state:

```javascript
// @language=javascript

// STARTED
this.$alexaSkill.$dialog.isStarted()

// IN PROGRESS
this.$alexaSkill.$dialog.isInProgress()

// COMPLETED
this.$alexaSkill.$dialog.isCompleted()

// @language=typescript

// STARTED
this.$alexaSkill!.$dialog.isStarted()

// IN PROGRESS
this.$alexaSkill!.$dialog.isInProgress()

// COMPLETED
this.$alexaSkill!.$dialog.isCompleted()
```

## Dialog Delegate

If you decide to delegate the conversation, Alexa will use the prompts you defined in your dialog model to fill the required slots. Alexa will also confirm both slots or the whole intent if you selected that in the dialog model.

To delegate the conversation, use:

```javascript
// @language=javascript

this.$alexaSkill.$dialog.delegate()

// @language=typescript

this.$alexaSkill!.$dialog.delegate()
```

Optionally you can also pass in an `Intent` object as described [here](https://developer.amazon.com/docs/custom-skills/dialog-interface-reference.html#pass-a-new-intent):

```javascript
// @language=javascript

const updatedIntent = {
    name: 'SearchFlightIntent',
    confirmationStatus: 'NONE'
};

this.$alexaSkill.$dialog.delegate(updatedIntent)

// @language=typescript

const updatedIntent = {
    name: 'SearchFlightIntent',
    confirmationStatus: 'NONE'
};

this.$alexaSkill!.$dialog.delegate(updatedIntent)
```

## Control the Dialog in Your Code

The Dialog Interface allows you to jump in and control the conversation yourself. Keep in mind that the prompts you prepared in the Skill Builder are only used if you delegate the conversation to Alexa. The utterances are still being used.

You have the possibility the ask the user to fill a certain slot, confirm a slot, or confirm the whole intent. You can also update the intent if you have certain values, for example the user's name, saved in a database. 

From now on, parameters which are between these `[]` brackets are optional. These parameters are `repromptText` and `updatedIntent`. If you don't specifiy a `repromptText`, the speechText will be used twice. 

### Slot Value

To check, whether a slot has a value or not, use:

```javascript
// @language=javascript

this.$alexaSkill.hasSlotValue('slotName')

// Example
this.$alexaSkill.hasSlotValue('name');

// @language=typescript

this.$alexaSkill!.hasSlotValue('slotName')

// Example
this.$alexaSkill!.hasSlotValue('name');
```

### Elicit Slot

If you want the user to fill a slot, use:

```javascript
// @language=javascript

this.$alexaSkill.$dialog.elicitSlot(slotName, speechText[, repromptText, updatedIntent])

// Example
this.$alexaSkill.$dialog.elicitSlot('name', 'What\'s your name?', 'Can you tell me your name, please?');

// @language=typescript

this.$alexaSkill!.$dialog.elicitSlot(slotName, speechText[, repromptText, updatedIntent])

// Example
this.$alexaSkill!.$dialog.elicitSlot('name', 'What\'s your name?', 'Can you tell me your name, please?');
```

### Confirm Slot

To confirm a slot use:

```javascript
// @language=javascript

this.$alexaSkill.$dialog.confirmSlot(slotname, speechText[, repromptText, updatedIntent])

// Example
this.$alexaSkill.$dialog.confirmSlot('name', 'Your name is ' + this.getInput('name').value + ', right?');

// @language=typescript

this.$alexaSkill!.$dialog.confirmSlot(slotname, speechText[, repromptText, updatedIntent])

// Example
this.$alexaSkill!.$dialog.confirmSlot('name', 'Your name is ' + this.getInput('name').value + ', right?');
```

### Confirm Intent

To confirm the whole intent, use:

```javascript
// @language=javascript

this.$alexaSkill.$dialog.confirmIntent(speechText[, repromptText, updatedIntent])

// Example
this.$alexaSkill.$dialog.confirmIntent('Your name is ' + this.$inputs.name.value + ' and you are from ' + this.$inputs.city.value + ', correct?');

// @language=typescript

this.$alexaSkill!.$dialog.confirmIntent(speechText[, repromptText, updatedIntent])

// Example
this.$alexaSkill!.$dialog.confirmIntent('Your name is ' + this.$inputs.name.value + ' and you are from ' + this.$inputs.city.value + ', correct?');
```

### Update Intent

Updating an intent gives you the ability to change slot values or the confirmation status for slots or intents. Here's an example:

You already have the user's name stored in the database, so you don't want to ask for it again. Therefor you just update the intent and add the slot value.

```javascript
// @language=javascript

let updatedIntent = {
    name: 'TestIntent',
    confirmationStatus: 'NONE',
    slots: {
        name:{
            name: 'name',
            value: this.$user.data.name,
            confirmationStatus: 'CONFIRMED',
        },
        city:{
            name: 'city',
            confirmationStatus: 'NONE',
        }
    }
};
// You update the intent and fill the name slot. There is only city slot left, so you can manually ask the user to fill that

this.$alexaSkill.$dialog.elicitSlot('city', 'Which city are you living in?', updatedIntent);

// @language=typescript

let updatedIntent = {
    name: 'TestIntent',
    confirmationStatus: 'NONE',
    slots: {
        name:{
            name: 'name',
            value: this.$user.data.name,
            confirmationStatus: 'CONFIRMED',
        },
        city:{
            Name: 'city',
            confirmationStatus: 'NONE',
        }
    }
};
// You update the intent and fill the name slot. There is only city slot left, so you can manually ask the user to fill that

this.$alexaSkill!.$dialog.elicitSlot('city', 'Which city are you living in?', updatedIntent);
```