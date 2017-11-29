# [Getting Started](../) > Voice App Basics

> Other pages in this category: [Getting Started](./), [Tutorials](./tutorials.md).

This section provides an overview of how voice applications work, and the differences between voice platforms. Currently, Jovo supports [Amazon Alexa](#amazon-alexa) and [Google Assistant](#google-assistant).

* [How Voice Apps Work](#how-voice-apps-work)
  * [Natural Language Lingo](#natural-language-lingo)
* [Voice Platforms](#voice-platforms)
  * [Amazon Alexa](#amazon-alexa)
  * [Google Assistant](#google-assistant)


## How Voice Apps Work

Below, you can see a high-level illustration, how a voice app works:

![How Voice Apps Work](https://www.jovo.tech/img/docs/voice-app-process.jpg)

The user first converses with the smart speaker and then prompts it to open your app (which is also called invocation) with a certain `speech input`. The voice platform recognizes this and sends a `request` to your app. It is now up to you to use this request to craft a `response`, which is returned to the platform's API. The response is then turned into `speech output`, what your user is hearing.

In the next section, we will go a little deeper into the underlying principles of natural language processing and understanding:


### Natural Language Lingo

In order to find out what a user wants when they’re talking to your app, platforms like Alexa or Google Assistant do a lot of underlying work for you to interpret the natural language of user voice input. To build for these platforms, it’s important to understand a few elements of natural language understanding. Simplified, a language model can be divided in "what the user wants" (`intent`) and "what the user says" (`utterances` and specific `entities` or `slots`).

![Language Model Elements](https://www.jovo.tech/img/docs/voice-intents-utterances-entities.jpg)

In the example above, possible sentences a user could say can be grouped to a `'FindRestaurantIntent'`, while there are potential slots like `restaurant type`. Please note that this is a very simple example, other slot types like `area` or `price range` could also be considered.

### Intents

In natural language processing (NLP), an intent is something users want to achieve when they are conversing with technology. When developing your voice app, you can create intents to handle different user needs and interactions.

Find more detailed information here: [App Logic > Routing](https://github.com/jovotech/jovo-framework-nodejs/tree/master/docs/03_app-logic/01_routing).

### Utterances and User Expressions

What are all the potential phrases someone could use to express what they want? Having a good set of utterances increases your chances of reacting to a user's input.

### Slots, Parameters, and Entities

This element has different wordings on various NLP platforms. It describes a specific, variable element in a set of utterances. For example, your intent could be to find a restaurant, but you could search for a pizza place, sushi, or even something cheap or very close.

Find more detailed information here: [App Logic > Data](https://github.com/jovotech/jovo-framework-nodejs/tree/master/docs/03_app-logic/02_data).


## Voice Platforms

The Jovo framework currently supports Skills for Amazon Alexa and Actions for Google Assistant (on Google Home). In this section, you can learn more about what you need to set up on the respective Developer Consoles in order to make your voice apps work.

### Amazon Alexa

> See also: Beginner Tutorial: [Build an Alexa Skill in Node.js with Jovo](https://www.jovo.tech/blog/alexa-skill-tutorial-nodejs/).

On the Amazon Echo product suite or other devices that support Amazon Alexa, users can access so-called Skills by asking the device something like this:

```
// Standard invocation
'Alexa, open Pizza Temple.'
'Alexa, start Pizza Temple.'

// Deep invocation
'Alexa, ask Pizza Temple to find me a restaurant.'
```

In order to build a skill for Amazon Alexa, you need to create an account at the Amazon Developer Portal. You can find an [official step-by-step guide by Amazon here](https://developer.amazon.com/public/solutions/alexa/alexa-skills-kit/docs/registering-and-managing-alexa-skills-in-the-developer-portal).

Another helpful guide for setting up a first Alexa skill [can be found here](https://github.com/alexa/skill-sample-nodejs-fact/blob/master/README.md).

### Google Assistant

> See also: Beginner Tutorial: [Build an Google Action in Node.js with Jovo](https://www.jovo.tech/blog/google-action-tutorial-nodejs/).

![Google Home, Google Assistant, and Google Actions](https://www.jovo.tech/img/docs/voice-app-basics/google-home-google-assistant.png)

On Google Home, users converse with the Google Assistant. Apps for the Assistant are called Actions on Google. They can be accessed like this:

```
// Standard invocation
'OK Google, talk to Pizza Temple.'

// Deep invocation
'OK Google, tell Pizza Temple to find me a restaurant.'
```

Here is the official Google resource: [Invocation and Discovery](https://developers.google.com/actions/discovery/).

To build a voice app for Google Assistant and Google Home, you need to create a project on the [Actions on Google Console](https://console.actions.google.com/). For interpreting the natural language of your users' speech input, you can use different kinds of integrations. Most developers use [Dialogflow](https://dialogflow.com/) (formerly API.AI) for the language model.

Here are some helpful guides to get started with Google Actions: [Overview](https://developers.google.com/actions/) and a [tutorial for Dialogflow](https://developers.google.com/actions/dialogflow/).
