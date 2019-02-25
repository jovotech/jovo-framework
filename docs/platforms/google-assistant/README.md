# Google Assistant

Learn more about Google Assistant specific features that can be used with the Jovo Framework.

* [Introduction to Google Assistant Specific Features](#introduction-to-google-assistant-specific-features)
* [Output](#output)
  * [Multiple Reprompts](#multiple-reprompts)
  * [Screen Surfaces](#screen-surfaces)
  * [Media Response](#media-response)
* [Data](#data)
* [Push Notifications](#push-notifications)
* [Daily Update](#daily-update)
* [Routine Suggestion](#routine-suggestion)


## Introduction to Google Assistant Specific Features

You can access the `googleAction` object like this:

```javascript
this.$googleAction
```

## Output

This section provides an overview of Google Assistant specific features for output. For the basic concept, take a look here: [Basic Concepts > Output](../../basic-concepts/output './output'). 

### Multiple Reprompts

Google Assistant allows to add multiple reprompts that are spoken out in order if there is no response by the user. Here is the official reference by Google: [Static Reprompts](https://developers.google.com/actions/assistant/reprompts#static_reprompts).

The reprompts can be added to the [`ask`](../../basic-concepts/output#ask './output#ask') method by using an array.

```javascript
this.ask(speech, [reprompt1, reprompt2, goodbyeMessage]);
```

The first two messages are usually reprompt messages, the third one is used to say goodbye to the user.

### Screen Surfaces

> [You can find out more about visual output here](./visual.md './google-assistant/visual-output').

### Media Response

> [You can find out more about media responses here](./media-response.md './google-assistant/media-response').

## Data

> [You can find out more about your Google Action user's data here](./data.md './google-assistant/data').

## Push Notifications

> [Find out how to send push notifications to your Google Action's users here](./notifications.md '.google-assistant/notifications')

## Daily Update

> [You can find out more about Google Action routine suggestions here](./daily-update.md '.google-assistant/daily-update')

## Routine Suggestion

> [Find out how to send routine suggestions to your Google Action's users here](./routine-suggestion.md './google-assistant/routine-suggestion')

<!--[metadata]: {"description": "Build Google Actions (Apps for Google Home) with the Jovo Framework. Learn more about Google Assistant specific features here",
"route": "google-assistant" }
-->
