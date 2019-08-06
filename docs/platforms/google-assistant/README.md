# Google Assistant

Learn more about Google Assistant specific features that can be used with the Jovo Framework.

* [Introduction to Google Assistant Specific Features](#introduction-to-google-assistant-specific-features)
* [Output](#output)
   * [Multiple Reprompts](#multiple-reprompts)
   * [Screen Surfaces](#screen-surfaces)
   * [Media Response](#media-response)
* [Data](#data)
   * [User ID](#user-id)
* [Push Notifications](#push-notifications)
* [Daily Update](#daily-update)
* [Routine Suggestion](#routine-suggestion)
* [Confirmation](#confirmation)

## Introduction to Google Assistant Specific Features

You can access the `googleAction` object like this:

```javascript
// @language=javascript

this.$googleAction

// @language=typescript

this.$googleAction!
```

## Output

This section provides an overview of Google Assistant specific features for output. For the basic concept, take a look here: [Basic Concepts > Output](../../basic-concepts/output './output'). 

### Multiple Reprompts

Google Assistant allows to add multiple reprompts that are spoken out in order if there is no response by the user. Here is the official reference by Google: [Static Reprompts](https://developers.google.com/actions/assistant/reprompts#static_reprompts).

The reprompts can be added to the [`ask`](../../basic-concepts/output#ask './output#ask') method adding more parameters (Version < 2.2 was using an array https://www.jovo.tech/news/2019-04-04-jovo-v2-2-typescript#breaking-changes). 

```javascript
this.ask(speech, reprompt1, reprompt2, goodbyeMessage);
```

The first two messages are usually reprompt messages, the third one is used to say goodbye to the user.

### Screen Surfaces

> [You can find out more about visual output here](./visual.md './google-assistant/visual-output').

### Media Response

> [You can find out more about media responses here](./media-response.md './google-assistant/media-response').

## Data

> [You can find out more about your Google Action user's data here](./data.md './google-assistant/data').

### User ID

In previous versions of Jovo, the `userId` for Google Actions was taken from the request's user ID. In 2018, Google [deprecated this element of the request JSON](https://developers.google.com/actions/identity/user-info) and recommended [webhook generated user IDs](https://developers.google.com/actions/identity/user-info#migrating_to_webhook-generated_ids) as an alternative way to store user data.

Since Jovo `2.0`, a Google Action `userId` is created in the following process:
* If there is a `userId` defined in the [userStorage](https://developers.google.com/actions/assistant/save-data), take this
* If not, use the `userId` from the request (if there is one) and then save it in userStorage
* If there is no `userId` in the request, generate one using `uuidv4`, and then save it to userStorage

Note: userStorage only works for Google Assistant users who have voice match enabled. [Learn more in the official Google Docs](https://developers.google.com/actions/assistant/save-data#user_storage_expiration).


## Push Notifications

> [Find out how to send push notifications to your Google Action's users here](./notifications.md './google-assistant/notifications')

## Daily Update

> [You can find out more about Google Action routine suggestions here](./daily-update.md './google-assistant/daily-update')

## Routine Suggestion

> [Find out how to send routine suggestions to your Google Action's users here](./routine-suggestion.md './google-assistant/routine-suggestion')

## Confirmation

You can ask your user to confirm something using the following method:

```javascript
// @language=javascript

this.$googleAction.askForConfirmation(text);

// Example
this.$googleAction.askForConfirmation('Is this correct?');

// @language=typescript

this.$googleAction!.askForConfirmation(text: string);

// Example
this.$googleAction!.askForConfirmation('Is this correct?');
```

The question should be one which can be answered with yes or no.

The user's response will be mapped to the `ON_CONFIRMATION` intent, where you can check wether they confirmed or not using `this.$googleAction.isConfirmed()`:

```javascript
// @language=javascript

ON_CONFIRMATION() {
    if (this.$googleAction.isConfirmed()) {
        this.tell('Confirmed')
    } else {
        this.tell('Not confirmed');
    }
}

// @language=typescript

ON_CONFIRMATION() {
    if (this.$googleAction!.isConfirmed()) {
        this.tell('Confirmed')
    } else {
        this.tell('Not confirmed');
    }
}
```

<!--[metadata]: {"description": "Build Google Actions (Apps for Google Home) with the Jovo Framework. Learn more about Google Assistant specific features here",
"route": "google-assistant" }
-->
