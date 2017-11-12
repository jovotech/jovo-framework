# [Platform](../) > Google Assistant

Learn more about Google Assistant specific features that can be used with the Jovo Framework.

* [Introduction to Google Assistant Specific Features](#introduction-to-google-assistant-specific-features)
* [Google Assistant Cards](#google-assistant-cards)
* [Suggestion Chips](#suggestion-chips)


## Introduction to Google Assistant Specific Features

> Find an introduction to how Google Assistant works here: [Getting Started > Voice App Basics > Google Assistant](https://github.com/jovotech/jovo-framework-nodejs/tree/master/docs/01_getting-started/voice-app-basics.md/#google-assistant).

You can access the `googleAction` object like this:

```javascript
let google = app.googleAction();
```

## Google Assistant Cards

You can find an example file here: [`indexGoogleAssistantCards.js`](https://github.com/jovotech/jovo-framework-nodejs/blob/master/examples/google_action_specific/indexGoogleAssistantCards.js).


## Suggestion Chips

```javascript
app.googleAction().showSuggestionChips(['Chip1', 'Chip2', 'Chip3']);

```