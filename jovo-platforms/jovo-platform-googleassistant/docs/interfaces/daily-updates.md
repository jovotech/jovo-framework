# Daily Updates

> To view this page on the Jovo website, visit https://v3.jovo.tech/marketplace/jovo-platform-googleassistant/interfaces/daily-updates

Learn how to use Google Action's daily updates with Jovo.

* [Introduction](#introduction)
* [Configuration](#configuration)
* [Suggest your Intent](#suggest-your-intent)

## Introduction

Daily updates allow you to send push notifications to your user at a scheduled time, which, if tapped, triggers a predefined intent. It allows you to add your Action to your user's daily routine.

Google does automatically suggest intents you configured as possible daily update intents to the user if a dialog ends successfully, but the following section will explain how you can suggest it manually inside a session.

## Configuration

To be able to use daily updates, you have to first configure your Google Action and your Dialogflow Agent the following way:

You have to specify the intents, which you want to suggest for daily updates, by first adding them to the set of intents, which can be triggered by implicit invocations inside your Dialogflow Agent:

![Dialogflow Implicit Invocation](../img/dialogflow-implicit-invocation.png)

After you've done that, you can find the intent as one of your `Actions` on your Google Actions `Actions` tab:

![Google Action Actions](../img/google-action-actions.png)

Select the intent and at the bottom of the tab you will find the `User engagement` section, where you can enable the daily updates as well as set a content title:

![Google Action Action User Engagement](../img/google-action-action-daily-updates.png)

## Suggest your Intent

To ask the user whether they want to add your intent as a daily update, you have to first ask them if they are interested using suggestion chips, after that you can ask them to add your intent as a daily update using the `askForRegisterUpdate(intent)` method:

```javascript
// @language=javascript

// src/app.js

app.setHandler({
    AskForRoutineSuggestion() {
        // You have to show them suggestion chips inviting them to opt-in, 
        // before you can send the actual daily update request
        this.$googleAction.showSuggestionChips(['yes', 'no']);
        this.ask('Would you be interested in me sending you the information daily?');
    },

    YesIntent() {
        this.$googleAction.$updates.askForRegisterUpdate('HelloWorldIntent');
    },

    HelloWorldIntent() {
        this.tell('Hello World');
    }
});

// @language=typescript

// src/app.ts

app.setHandler({
    AskForRoutineSuggestion() {
        // You have to show them suggestion chips inviting them to opt-in, 
        // before you can send the actual daily update request
        this.$googleAction!.showSuggestionChips(['yes', 'no']);
        this.ask('Would you be interested in me sending you the information daily?');
    },

    YesIntent() {
        this.$googleAction!.$updates.askForRegisterUpdate('HelloWorldIntent');
    },

    HelloWorldIntent() {
        this.tell('Hello World');
    }
});
```

After sending out the daily update request the user's response will be mapped to the `ON_REGISTER_UPDATE` intent:

```javascript
// @language=javascript

ON_REGISTER_UPDATE() {
    if (this.$googleAction.$updates.isRegisterUpdateOk()) {
        this.ask("Added as a daily update");
    } else {
        this.ask("Cancelled by the user");
    }
},

// @language=typescript

ON_REGISTER_UPDATE() {
    if (this.$googleAction!.$updates.isRegisterUpdateOk()) {
        this.ask("Added as a daily update");
    } else {
        this.ask("Cancelled by the user");
    }
},
```

Using `this.$googleAction.$updates.isRegisterUpdateOk()` you can check whether the user accepted your request.