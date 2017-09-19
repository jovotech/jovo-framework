# Platform Specifics

> Other pages in this category: [Amazon Alexa](amazon-alexa.md), [Google Assistant](google-assistant.md).

Jovo is not only about the common denominator. In this section, you will learn more about how to access features that are specific to the platforms Amazon Alexa and Google Assistant.

* [Introduction to Platform Specific Features](#introduction-to-platform-specific-features)
* [Amazon Alexa](#amazon-alexa)
* [Google Assistant](#google-assistant)

## Introduction to Platform Specific Features

To learn more about how to make most out of the platform-specific features, it's helpful to understand how the Jovo cross-platform architecture works.

![Jovo Platform Specific Tell Response](https://www.jovo.tech/img/docs/platform-specific-tell.jpg)

The Jovo `app` object figures out which platform the user is conversing with, and then uses this information to either call the functions of the `alexaSkill` or `googleAction` object.

As Amazon Alexa and Google Assistant both have platform specific features, you can access them directly by calling the `alexaSkill` or `googleAction` objects. By using those classes, keep in mind that, in the end, there needs to be a function call where an emit happens for the platforms you're using. For example, in the `tell`, `ask`, `endSession`, and `raw JSON response` calls.

## Amazon Alexa

> Find an introduction to how Amazon Alexa works here: [Voice App Basics/Amazon Alexa](../getting-started/voice-app-basics#amazon-alexa).

```
let alexa = app.alexaSkill();
```

You can find the following Alexa specific features on the page [03. Platform Specifics > Amazon Alexa](amazon-alexa.md):

* Alexa Audioplayer Skills
* Dialog Mode
* Render Templates for Echo Show
* Shopping and To Do Lists


## Google Assistant

> Find an introduction to how Google Assistant works here: [Voice App Basics/Google Assistant](../getting-started/voice-app-basics#google-assistant).

```
let google = app.googleAction();
```

You can find the following Google Assistant specific features on the page [03. Platform Specifics > Google Assistant](google-assistant.md):

* Google Assistant Cards
* Suggestion Chips