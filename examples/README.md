# Examples

This folder provides code examples for various Jovo features. These are mostly index.js files with enabled logging so you can start testing right away from your command line.

## Overview

* [Basics and Routing](#basics-and-routing)
  * [Hello World](#hello-world)
  * [followUpState](#followupstate)
  * [Input (Slots and Entities)](#input-slots-and-entities)
  * [Session Attributes](#session-attributes)
* [Advanced Jovo Features](#advanced-jovo-features)
  * [i18n for Multilingual Apps](#i18n-for-multilingual-apps)
  * [Speech Builder](#speech-builder)
  * [User Object](#user-object)
* [Integrations](#integrations)
  * [Analytics](#analytics)
* [Alexa-specific Features](#alexa-specific-features)
  * [Cards](#cards)
  * [Lists](#lists)
  * [Device Address](#device-address)
  * [Alexa Verifier](#alexa-verifier)
  * [Render Templates](#render-templates)
  
## Basics and Routing

### Hello World
The file [indexHelloWorld.js](./indexHelloWorld.js) provides a simple voice app with "Hello World" output, similar to the [Jovo Sample Voice App](https://github.com/jovotech/jovo-sample-voice-app-nodejs).

### followUpState
The file [indexFollowUpState.js](./indexFollowUpState.js) shows how to add a state to an ask-call.

### Input (Slots and Entities)
The file [indexInputs.js](./indexInputs.js) shows how easy it is to access user data (slots, entities, parameters).

### Session Attributes
The file [indexSession.js](./indexSession.js) shows how to save data in a session (be careful, for persistence across sessions take a look at the [User Object](#user-object)).

## Advanced Jovo Features

### i18n for Multilingual Apps
The file [indexi18n.js](./indexi18n.js) shows how to use the npm package i18next for multilingual apps.

### Speech Builder
The file [indexSpeechBuilder.js](./indexSpeechBuilder.js) shows an introduction into the SpeechBuilder class, a powerful way to create speech output.

### User Object
The file [indexUser.js](./indexUser.js) shows examples of how the User Object can be used to access certain information and store user-specific data.

## Integrations

### Analytics
The file [indexAnalytics.js](./indexAnalytics.js) shows how easy it is to add analytics integrations with just one line of code.

## Alexa-specific Features

### Cards
The file [indexAlexaCards.js](./indexAlexaCards.js) provides examples for adding Home Cards as visual output to the Alexa companion app.

### Lists
The file [indexAlexaLists.js](./indexAlexaLists.js) shows how to access Alexa List features.

### Device Address
The file [indexAlexaDeviceAddress.js](./indexAlexaDeviceAddress.js) is an example of how to get information about the Alexa-enabled device's address.

### Alexa Verifier
The file [indexAlexaVerifier.js](./indexAlexaVerifier.js) is helpful for verification when you want to host your Alexa Skill with a webhook, not on Lambda.

### Render Templates
The file [indexRenderTemplate.js](./indexRenderTemplate.js) offers examples for specific features of the Amazon Echo Show.


