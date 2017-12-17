[![Jovo Framework](https://www.jovo.tech/downloads/jovo-header.png)](https://www.jovo.tech)

<p align="center">The development framework for cross-platform voice apps</p>

<p align="center">
<a href="https://www.jovo.tech/framework/docs/"><strong>Documentation</strong></a> -
<a href="https://github.com/jovotech/jovo-cli"><strong>CLI </strong></a> -
<a href="https://github.com/jovotech/jovo-sample-voice-app-nodejs"><strong>Sample App </strong></a> - <a href="https://github.com/jovotech/jovo-framework-nodejs/tree/master/CONTRIBUTING.md"><strong>Contributing</strong></a> - <a href="https://twitter.com/jovotech"><strong>Twitter</strong></a></p>
<br/>

<p align="center">
<a href="https://travis-ci.org/jovotech/jovo-framework-nodejs" target="_blank"><img src="https://travis-ci.org/jovotech/jovo-framework-nodejs.svg?branch=master"></a>
<a href="https://www.npmjs.com/package/jovo-framework" target="_blank"><img src="https://badge.fury.io/js/jovo-framework.svg"></a>
<a href="./CONTRIBUTING.md"><img src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg"></a>
<a href="https://slackin-uwinbxqkfx.now.sh" target="_blank"><img src="https://slackin-uwinbxqkfx.now.sh/badge.svg"></a>
 <a href="https://twitter.com/intent/tweet?text=🔈 Build cross-platform voice apps for Alexa and Google Assistant with @jovotech https://github.com/jovotech/jovo-framework-nodejs/" target="_blank"><img src="https://img.shields.io/twitter/url/http/shields.io.svg?style=social"></a>
</p>

<br/>

Jovo is the first open source framework that lets you build voice apps for both Amazon Alexa and Google Assistant with only one code base. Besides cross-platform development, Jovo also offers a variety of integrations and easy prototyping capabilities. [Check out our features below.](#features)

> 🚀 Join our newsletter for free courses on voice app development: www.jovo.tech/newsletter 


## Table of Contents

* [Features](#features)
  * [General](#general)
  * [Platform Specific Features](#platform-specific-features)
  * [Integrations](#integrations)
* [Getting Started](#getting-started)
  * [Jovo CLI](#jovo-cli)
  * [Jovo Framework](#jovo-framework)
  * [Jovo Sample App](#jovo-sample-app)
* [Tutorials](#tutorials)
* [Community Projects](#community-projects)
* [Development Roadmap](#development-roadmap)

## Features

### General

#### Basic Concepts

Name | Description | Docs
:--- | :--- | :---
Command Line Tools | Create and run Jovo projects from your command line | [📝](https://github.com/jovotech/jovo-framework-nodejs/tree/master/docs/05_tools/cli)
Routing | Easy routing capabilities for intents and states | [📝](https://github.com/jovotech/jovo-framework-nodejs/tree/master/docs/03_app-logic/01_routing)
Data input | Deal with user specific data and request parameters (slots and entities) easily| [📝](https://github.com/jovotech/jovo-framework-nodejs/tree/master/docs/03_app-logic/02_data)
Speech and visual output &nbsp; | Craft your responses, including speech an visual elements | [📝](https://github.com/jovotech/jovo-framework-nodejs/tree/master/docs/03_app-logic/03_output)


#### Advanced Features

Name | Description | Docs
:--- | :--- | :---
User object | Create contextual experiences with user specific data and services | [📝](https://github.com/jovotech/jovo-framework-nodejs/tree/master/docs/03_app-logic/02_data/user.md)
Speech Builder | Helpful class to create speech output and add variety to your responses | [📝](https://github.com/jovotech/jovo-framework-nodejs/tree/master/docs/03_app-logic/03_output/speechbuilder.md)
i18n | Create multilingual voice apps | [📝](https://github.com/jovotech/jovo-framework-nodejs/tree/master/docs/03_app-logic/03_output/i18n.md)
Jovo Persistence Layer &nbsp; &nbsp; &nbsp;| Persist user specific data | [📝](https://github.com/jovotech/jovo-framework-nodejs/tree/master/docs/04_platform-specifics/databases)
Jovo Analytics Layer | Get usage statistics and logging with analytics integrations| [📝](https://github.com/jovotech/jovo-framework-nodejs/tree/master/docs/04_platform-specifics/analytics)


### Platform Specific Features

Jovo is not a common denominator solution. You can access platform specific features for Amazon Alexa and Google Assistant. See a list of supported features below.

#### General

Name | Description | Docs
:--- | :--- | :---
Multi-platform handler &nbsp; &nbsp; &nbsp; &nbsp; | Add or overwrite specific intents and states for platform specific app logic | [Example](https://github.com/jovotech/jovo-framework-nodejs/blob/master/examples/indexMultiHandler.js)


#### Amazon Alexa

Name | Description | Docs
:--- | :--- | :---
Audioplayer | Build Alexa Audioplayer Skills | [📝](https://github.com/jovotech/jovo-framework-nodejs/tree/master/docs/04_platform-specifics/amazon-alexa/audioplayer.md)
VideoApp | Build Alexa VideoApp Skills | [Example](https://github.com/jovotech/jovo-framework-nodejs/blob/master/examples/alexa_specific/indexVideoApp.js)
Alexa Cards | Create visual output with home cards for Alexa Skills  | [Example](https://github.com/jovotech/jovo-framework-nodejs/blob/master/examples/alexa_specific/indexAlexaCards.js)
Alexa Device Address | Access a users' device location | [Example](https://github.com/jovotech/jovo-framework-nodejs/blob/master/examples/alexa_specific/indexAlexaDeviceAddress.js)
Alexa Lists | Access users' To Do and Shopping Lists | [Example](https://github.com/jovotech/jovo-framework-nodejs/blob/master/examples/alexa_specific/indexAlexaLists.js)
Alexa Verifier | Makes it possible to host your Alexa skill on your own server instead of AWS Lambda | [📝](https://github.com/jovotech/jovo-framework-nodejs/tree/master/docs/02_app-configuration/server/#host-the-webhook-on-a-server)
Alexa Dialog Interface | Use Alexa's Dialog Directives for multi-turn conversations | [📝](https://github.com/jovotech/jovo-framework-nodejs/blob/master/docs/04_platform-specifics/amazon-alexa/dialog.md)
Echo Show Render Templates | Display visual elements on Echo Show | [Example](https://github.com/jovotech/jovo-framework-nodejs/blob/master/examples/alexa_specific/indexRenderTemplate.js)
Progressive Responses | Keep your users engaged while processing a longer request | [📝](https://github.com/jovotech/jovo-framework-nodejs/tree/master/docs/04_platform-specifics/amazon-alexa#progressive-responses)


#### Google Assistant

Name | Description | Docs
:--- | :--- | :---
Google Assistant Cards &nbsp; &nbsp; &nbsp; | Create visual Output for the Google Assistant mobile app | [Example](https://github.com/jovotech/jovo-framework-nodejs/blob/master/examples/google_action_specific/indexGoogleAssistantCards.js)
Suggestion Chips | Display buttons to allow your users to quickly reply on mobile phones | [📝](https://github.com/jovotech/jovo-framework-nodejs/tree/master/docs/04_platform-specifics/google-assistant/#suggestion-chips) 

### Integrations

#### Database Integrations

See the [Jovo Persistence Layer](https://github.com/jovotech/jovo-framework-nodejs/tree/master/docs/06_integrations/databases) for more information on storing user specific data.

Name | Description | Docs
:--- | :--- | :---
File Persistence &nbsp; &nbsp; &nbsp; &nbsp; | Saves user specific data in JSON file for fast prototyping and development (default) | [📝](https://github.com/jovotech/jovo-framework-nodejs/tree/master/docs/06_integrations/databases/#filepersistence)
Dynamo DB | Saves user specific data in AWS DynamoDB table | [📝](https://github.com/jovotech/jovo-framework-nodejs/tree/master/docs/06_integrations/databases/#dynamodb)

#### Analytics Integrations

See the [Jovo Analytics Layer](https://github.com/jovotech/jovo-framework-nodejs/tree/master/docs/06_integrations/analytics) for more information on analytics features.

Name | Description | Docs
:--- | :--- | :---
VoiceLabs | Voice App Analytics including Usage Metrics and Behavior Paths | [📝](https://github.com/jovotech/jovo-framework-nodejs/tree/master/docs/06_integrations/analytics/#voicelabs)
Dashbot | Chatbot and Voice App Analytics including Usage Metrics, Behavior Flows, and Live Interaction Transcripts | [📝](https://github.com/jovotech/jovo-framework-nodejs/tree/master/docs/06_integrations/analytics/#dashbot)
Bespoken Analytics | Voice App Analytics including Usage Metrics, Logging, and Monitoring | [📝](https://github.com/jovotech/jovo-framework-nodejs/tree/master/docs/06_integrations/analytics/#bespoken)

#### CLI Integrations

See the [Jovo CLI Docs](https://github.com/jovotech/jovo-framework-nodejs/tree/master/docs/02_building-a-voice-app/cli.md) for more information on CLI features.

Name | Description | Docs
:--- | :--- | :---
bst proxy &nbsp; &nbsp; &nbsp; &nbsp; | Proxy service that creates a webhook link for local prototyping, with additional logging and analytics features | [📝](https://github.com/jovotech/jovo-framework-nodejs/tree/master/docs/05_tools/cli/#bst-proxy)
nodemon | Monitor changes and automatically restart the server | [📝](https://github.com/jovotech/jovo-framework-nodejs/tree/master/docs/05_tools/cli/#watch)


## Getting Started

There are three ways to get started with the Jovo Framework. You can either install our command line tools (recommended), save the jovo-framework npm package, or clone our sample voice app.

Technical Requirements: Node.js version 4 or later & NPM (node package manager). Here are some tutorials to install Node.js and NPM: [Mac](http://blog.teamtreehouse.com/install-node-js-npm-mac), [Windows](http://blog.teamtreehouse.com/install-node-js-npm-windows).

### Jovo CLI

The [Jovo Command Line Tools](https://github.com/jovotech/jovo-cli) offer an easy way to create new voice apps from templates. Install them with:

```sh
$ npm install -g jovo-cli
```

You can create a Jovo project into a new directory with the following command:
```sh
$ jovo new <directory>
```
This will clone the [Jovo Sample App](https://github.com/jovotech/jovo-sample-voice-app-nodejs) and install all the necessary dependencies so you can get started right away.

### Jovo Framework

If you want to use the Jovo Framework as a dependency in an already existing project, you can also use npm to save it to your package.json:

```
$ npm install --save jovo-framework
```

### Jovo Sample App

Right now, there is one sample app available, [which you can find here](https://github.com/jovotech/jovo-sample-voice-app-nodejs).

You can clone it like this:

```
$ git clone https://github.com/jovotech/jovo-sample-voice-app-nodejs.git
```

Afterwards, go to the app directory and do

```
$ npm install
```

## Tutorials

Find a quickstart guide and comprehensive tutorials here:

* [Build a cross-platform voice app in 5 simple steps](https://www.jovo.tech/get-started)
* [Build an Alexa Skill with Jovo](https://www.jovo.tech/blog/alexa-skill-tutorial-nodejs/)
* [Build a Google Action with Jovo](https://www.jovo.tech/blog/google-action-tutorial-nodejs/)


## Community Projects

Name | Description | Repository
------------ | ------------- | -------------
ASK CLI Jovo Starter Template | Alexa Skill starter template using ASK CLI and Jovo Framework | [rmtuckerphx/ask-cli-jovo-starter](https://github.com/rmtuckerphx/ask-cli-jovo-starter)
Advanced Sample Voice App | Advanced folder structure and improvements for more complex voice applications | [tjbenton/jovo-sample-voice-app-nodejs](https://github.com/tjbenton/jovo-sample-voice-app-nodejs)
Jovo Babel Project | An example project using Jovo Framework alongside JavaScript ES6. | [Cawfree/jovo-babel-project](https://github.com/Cawfree/jovo-babel-project)


## Development Roadmap

We still consider this a beta-version of the Jovo framework: We give it our all to make it as complete as possible (and it supports most of the Alexa and Google Assistant functions), but there are certain features that are currently in development.

What we're currently working on:
* Adding more DB integrations
* Extending the User class


## We need your help

Jovo is a free, open source framework for voice developers. We're improving it every day and appreciate any feedback. How to support us? Just go ahead and build something cool with the framework and let us know at feedback@jovo.tech. Thanks!
