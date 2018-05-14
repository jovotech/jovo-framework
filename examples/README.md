# Examples

This folder provides code examples for various Jovo features. These are mostly app.js files with enabled logging so you can start testing right away from your command line.

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
  * [Multiple Handler](#multiple-handler)
* [Integrations](#integrations)
  * [Analytics](#analytics)
  * [Azure Functions](#azure-functions)
* [Alexa-specific Features](#alexa-specific-features)
  * [Alexa Cards](#alexa-cards)
  * [Lists](#lists)
  * [Device Address](#device-address)
  * [Render Templates](#render-templates)
  * [Dialog Interface](#dialog-interface)
  * [Progressive Response](#progressive-response)
* [Actions on Google specific Features](#actions-on-google-specific-features)
  * [Permission](#permission)
  * [Account Linking](#account-linking)
  * [Google Action Cards](#google-action-cards)
  
## Basics and Routing

### Hello World
The file [appHelloWorld.js](./appHelloWorld.js) provides a simple voice app with "Hello World" output, similar to the [Jovo Sample Voice App](https://github.com/jovotech/jovo-sample-voice-app-nodejs).

### followUpState
The file [appFollowUpState.js](./appFollowUpState.js) shows how to add a state to an ask-call.

### Input (Slots and Entities)
The file [appInputs.js](./appInputs.js) shows how easy it is to access user data (slots, entities, parameters).

### Session Attributes
The file [appSession.js](./appSession.js) shows how to save data in a session (be careful, for persistence across sessions take a look at the [User Object](#user-object)).

## Advanced Jovo Features

### i18n for Multilingual Apps
The file [appI18n.js](./appI18n.js) shows how to use the npm package i18next for multilingual apps.

### Speech Builder
The file [appSpeechBuilder.js](./appSpeechBuilder.js) shows an introduction into the SpeechBuilder class, a powerful way to create speech output.

### User Object
The file [appUser.js](./appUser.js) shows examples of how the User Object can be used to access certain information and store user-specific data.

### Multiple Handler
The file [appMultiHandler.js](./appMultiHandler.js) shows the implementation of seperate handlers for each platform to overwrite specific intents and states for platform specific app logic.

## Integrations

### Analytics
The file [appAnalyticsIntegration.js](./appAnalyticsIntegration.js) shows how easy it is to add analytics integrations with just one line of code.

### Azure Functions
The files [index.js](./azure_functions/webhook/index.js) shows how to integrate azure functions.
Setup your local development environment by following [https://github.com/Azure/azure-functions-core-tools](https://github.com/Azure/azure-functions-core-tools), and then start server by executing `func host start` in `azure_functions` folder.

## Alexa-specific Features

### Alexa Cards
The file [appAlexaCards.js](./alexa_specific/appAlexaCards.js) provides examples for adding Home Cards as visual output to the Alexa companion app.

### Lists
The file [appAlexaLists.js](./alexa_specific/appAlexaLists.js) shows how to access Alexa List features.

### Device Address
The file [appAlexaDeviceAddress.js](./alexa_specific/appAlexaDeviceAddress.js) is an example of how to get information about the Alexa-enabled device's address.

### Render Templates
The file [appRenderTemplate.js](./alexa_specific/appRenderTemplate.js) offers examples for specific features of the Amazon Echo Show.

### Dialog Interface
The file [appDialog.js](./alexa_specific/appDialog.js) shows the implementation of the dialog interface.

### Progressive Response
The file [appProgressiveResponse.js](./alexa_specific/appProgressiveResponse.js) is an example for the progressive response feature.

## Actions on Google specific Features

### Permission
The file [appAskForPermission.js](./google_action_specific/appAskForPermission.js) provides examples for permission requests and how to access the information.

### Account Linking
The file [appAskForSignIn.js](./google_action_specific/appAskForSignIn.js) shows how to ask the user to link their account. 

### Google Action Cards
The file [appGoogleAssistantCards.js](./google_action_specific/appGoogleAssistantCards.js) provides examples for adding cards as visual output to the Google Home companion app.