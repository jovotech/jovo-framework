# Routine Suggestions

> To view this page on the Jovo website, visit https://v3.jovo.tech/marketplace/jovo-platform-googleassistant/interfaces/routine-suggestions

Learn how to use Google Action routine suggestions with Jovo.

* [Introduction](#introduction)
* [Configuration](#configuration)
* [Suggest your Intent](#suggest-your-intent)

## Introduction

Routine suggestions allows you to ask the user to add your action and its intent to their routines, which allow them to execute multiple Action's intents with a single command.

For example, the user might have a routine, where one action tells informs her about the current news, another one might tell them that a new episode of their favorite podcast is up, etc.

Google will also automatically suggest your intents, which are configured correctly, to the user to add to their routines, but the following section will explain how to do it manually inside a session.

## Configuration

To be able to use routine suggestions, you have to first configure your Google Action and your Dialogflow Agent the following way:

You have to specify the intents, which you want to suggest for routines, by first adding them to the set of intents, which can be triggered by implicit invocations inside your Dialogflow Agent:

![Dialogflow Implicit Invocation](../img/dialogflow-implicit-invocation.png)

After you've done that, you can find the intent as one of your `Actions` on your Google Actions `Actions` tab:

![Google Action Actions](../img/google-action-actions.png)

Select the intent and at the bottom of the tab you will find the `User engagement` section, where you can enable the routine suggestions as well as set a content title:

![Google Action Action User Engagement](../img/google-action-action-routines.png)


## Suggest your Intent

To ask the user whether they want to add your intent to their routines, you have to first ask them if they are interested using suggestion chips, after that you can ask them to add your intent to their routines:

```javascript
// @language=javascript

AskForRoutineSuggestion() {
    // You have to show them suggestion chips inviting them to opt-in, 
    // before you can send the actual routine suggestions
    this.$googleAction.showSuggestionChips(['yes', 'no']);
    this.ask('Would you be interested in adding the HelloWorldIntent to your routine?');
},

YesIntent() {
    this.$googleAction.$updates.askForRegisterUpdate('HelloWorldIntent', 'ROUTINES');
},

HelloWorldIntent() {
    this.tell('Hello World');
},

// @language=typescript

AskForRoutineSuggestion() {
    // You have to show them suggestion chips inviting them to opt-in, 
    // before you can send the actual routine suggestions
    this.$googleAction!.showSuggestionChips(['yes', 'no']);
    this.ask('Would you be interested in adding the HelloWorldIntent to your routine?');
},

YesIntent() {
    this.$googleAction!.$updates.askForRegisterUpdate('HelloWorldIntent', 'ROUTINES');
},

HelloWorldIntent() {
    this.tell('Hello World');
},
```

After sending out the routine suggestion the user's response will be mapped to the `ON_REGISTER_UPDATE` intent:

```javascript
// @language=javascript

ON_REGISTER_UPDATE() {
    if (this.$googleAction.$updates.isRegisterUpdateOk()) {
        this.ask("Added to the routine");
    } else {
        this.ask("Cancelled by the user");
    }
},

// @language=typescript

ON_REGISTER_UPDATE() {
    if (this.$googleAction!.$updates.isRegisterUpdateOk()) {
        this.ask("Added to the routine");
    } else {
        this.ask("Cancelled by the user");
    }
},
```

Using `this.$googleAction.$updates.isRegisterUpdateOk()` you can check whether the user accepted your suggestion.