# Platform Specific Features

Jovo is not only about the common denominator. In this section, you will learn more about how to access features that are specific to the platforms Amazon Alexa and Google Assistant.

* [Introduction to Platform Specific Features](#introduction-to-platform-specific-features)
* [Amazon Alexa](#amazon-alexa)
* [Google Assistant](#google-assistant)

## Introduction to Platform Specific Features

To learn more about how to make most out of the platform-specific features, it's helpful to understand how the Jovo cross-platform architecture works.

![Jovo Platform Specific Tell Response](https://www.jovo.tech/img/docs/platform-specific-tell.jpg)

The Jovo `app` object figures out which platform the user is conversing with, and then uses this information to either call the functions of the `alexaSkill` or `googleAction` object.

As Amazon Alexa and Google Assistant both have platform specific features, you can access them directly by calling the `alexaSkill` or `googleAction` objects. By using those classes, keep in mind that, in the end, there needs to be a function call where an emit happens for the platforms you're using. For example, in the [tell](https://github.com/jovotech/jovo-framework-nodejs/tree/master/docs/03_app-logic/03_output#tell), [ask](https://github.com/jovotech/jovo-framework-nodejs/tree/master/docs/03_app-logic/03_output#ask), [endSession](https://github.com/jovotech/jovo-framework-nodejs/tree/master/docs/03_app-logic/03_output#no-speech-output), and raw [JSON response calls](https://github.com/jovotech/jovo-framework-nodejs/tree/master/docs/03_app-logic/03_output#raw-json-responses).

These emit methods can also be accessed directly with the platform specific objects, so you don't have to use `app.tell` when developing only for one platform:

```javascript
// Example
let alexa = app.alexaSkill();
alexa.tell('Hello World!');
```


## Amazon Alexa

> Find an introduction to how Amazon Alexa works here: [Getting Started > Voice App Basics > Amazon Alexa](https://github.com/jovotech/jovo-framework-nodejs/tree/master/docs/01_getting-started/voice-app-basics.md/#amazon-alexa).

You can access the `alexaSkill` object like this:

```javascript
let alexa = app.alexaSkill();
```

You can find the following Alexa specific features on the page [Platform Specifics > Amazon Alexa](https://github.com/jovotech/jovo-framework-nodejs/tree/master/docs/04_platform-specifics/amazon-alexa):

* Alexa Audioplayer Skills
* Dialog Mode
* Render Templates for Echo Show
* Shopping and To Do Lists


## Google Assistant

> Find an introduction to how Google Assistant works here: [Getting Started > Voice App Basics > Google Assistant](https://github.com/jovotech/jovo-framework-nodejs/tree/master/docs/01_getting-started/voice-app-basics.md/#google-assistant).

You can access the `googleAction` object like this:

```javascript
let google = app.googleAction();
```

You can find the following Google Assistant specific features on the page [Platform Specifics > Google Assistant](https://github.com/jovotech/jovo-framework-nodejs/tree/master/docs/04_platform-specifics/google-assistant):

* Google Assistant Cards
* Suggestion Chips