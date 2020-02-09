[![Jovo Framework](./docs/img/jovo-header.png)](https://www.jovo.tech)

<p align="center">The development framework for cross-platform voice apps</p>

<p align="center">
<a href="https://www.jovo.tech/docs/"><strong>Documentation</strong></a> -
<a href="https://github.com/jovotech/jovo-cli"><strong>CLI </strong></a> -
<a href="https://github.com/jovotech/jovo-sample-voice-app-nodejs"><strong>Sample App </strong></a> - <a href="https://github.com/jovotech/jovo-framework/tree/master/.github/CONTRIBUTING.md"><strong>Contributing</strong></a> - <a href="https://twitter.com/jovotech"><strong>Twitter</strong></a></p>
<br/>

<p align="center">
<a href="https://travis-ci.org/jovotech/jovo-framework" target="_blank"><img src="https://travis-ci.org/jovotech/jovo-framework.svg?branch=master"></a>
<a href="https://www.npmjs.com/package/jovo-framework" target="_blank"><img src="https://badge.fury.io/js/jovo-framework.svg"></a>
<a href="./.github/CONTRIBUTING.md"><img src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg"></a>
<a href="https://slackin-uwinbxqkfx.now.sh" target="_blank"><img src="https://slackin-uwinbxqkfx.now.sh/badge.svg"></a>
<a href="https://twitter.com/intent/tweet?text=🔈 Build cross-platform voice apps for Alexa and Google Assistant with @jovotech https://github.com/jovotech/jovo-framework/" target="_blank"><img src="https://img.shields.io/twitter/url/http/shields.io.svg?style=social"></a>
</p>
<br/>

```javascript
app.setHandler({
    LAUNCH() {
        return this.toIntent('HelloWorldIntent');
    },

    HelloWorldIntent() {
        this.ask('Hello World! What\'s your name?', 'Please tell me your name.');
    },

    MyNameIsIntent() {
        this.tell('Hey ' + this.$inputs.name.value + ', nice to meet you!');
    },
});
```

Jovo is the first open source framework that lets you build voice apps for both Amazon Alexa and Google Assistant with only one code base. Besides cross-platform development, Jovo also offers a variety of integrations and easy prototyping capabilities.

The main features of the Jovo ecosystem are:
* [**Jovo Framework**](#features): Build voice apps for both Amazon Alexa and Google Assistant
* [**Jovo CLI**](./docs/workflows/cli): Create, build, and deploy Jovo projects (including [staging](./docs/configuration/project-js.md#stages))
* [**Jovo Webhook**](./docs/workflows/jovo-webhook.md): Develop and debug voice apps on your local computer
* [**Jovo Debugger**](https://www.jovo.tech/debugger): Test and debug voice apps in your browser
* [**Jovo Language Model**](./docs/basic-concepts/model): A consolidated language model that can be converted into Alexa Interaction Models and Dialogflow Agents

> 🚀 Join our newsletter for free courses on voice app development: www.jovo.tech/newsletter


## Table of Contents

* [Installation](#installation)
* [Features](#features)
  * [General](#general)
  * [Platform Specific Features](#platform-specific-features)
  * [Integrations](#integrations)
* [Tutorials](#tutorials)
* [Contributing](#contributing)

## Installation

> Read more in our [Getting Started Guide](./docs/getting-started).

Install the Jovo CLI:

```sh
$ npm install -g jovo-cli
```

Create a new Jovo project:

```sh
# Default: Create new JavaScript project
$ jovo new <directory>

# Alternative: Create new TypeScript project
$ jovo new <directory> --language typescript
```

## Features

### General

#### Basic Concepts

Name | Description | Docs
:--- | :--- | :---
Command Line Tools | Create and run Jovo projects from your command line | [📝](./docs/workflows/cli)
Routing | Easy routing capabilities for intents and states | [📝](./docs/basic-concepts/routing)
Data input | Deal with user specific data and request parameters (slots and entities) easily | [📝](./docs/basic-concepts/data)
Speech and visual output &nbsp; | Craft your responses, including speech an visual elements | [📝](./docs/basic-concepts/output)


#### Advanced Features

Name | Description | Docs
:--- | :--- | :---
Input Validation | Define and execute different methods of validation for your user's inputs | [📝](./docs/basic-concepts/routing/input.md#validation)
User object | Create contextual experiences with user specific data and services | [📝](./docs/basic-concepts/data/user.md)
Speech Builder | Helpful class to create speech output and add variety to your responses | [📝](./docs/basic-concepts/output/speechbuilder.md)
i18n | Create multilingual voice apps | [📝](./docs/basic-concepts/output/i18n.md)
Jovo Persistence Layer | Persist user specific data | [📝](./docs/integrations/databases)
Jovo Analytics Layer | Get usage statistics and logging with analytics integrations | [📝](./docs/integrations/analytics)
Staging | Create and maintain different environments | [📝](./docs/configuration/project-js.md#stages)
Plugins | Extend the Jovo Framework without having to mess with its core code and architecture | [📝](./docs/advanced-concepts/plugins.md)
Testing | Use the Jovo TestSuite to integrate unit tests into your voice app project | [📝](./docs/testing/unit-testing.md)


### Platform Specific Features

Jovo is not a common denominator solution. You can access platform specific features for Amazon Alexa and Google Assistant. See a list of supported features below.

#### Amazon Alexa

Name | Description | Docs
:--- | :--- | :---
Audioplayer | Build Alexa Audioplayer Skills | [📝](./docs/platforms/amazon-alexa/audioplayer.md)
VideoApp | Build Alexa VideoApp Skills | [📝](./docs/platforms/amazon-alexa/visual.md)
Alexa Cards | Create visual output with home cards for Alexa Skills  | [📝](./docs/platforms/amazon-alexa/visual.md#cards)
Alexa Device Address | Access users' device location | [📝](./docs/platforms/amazon-alexa/data.md#location)
Alexa Lists | Access users' To Do and Shopping Lists | [📝](./docs/platforms/amazon-alexa/lists.md)
Alexa Verifier | Makes it possible to host your Alexa skill on your own server instead of AWS Lambda | [📝](./docs/configuration/hosting/express-js.md#deploy-to-a-server)
Alexa Dialog Interface | Use Alexa's Dialog Directives for multi-turn conversations | [📝](./docs/platforms/amazon-alexa/dialog.md)
Echo Show Render Templates | Display visual elements on Echo Show | [📝](./docs/platforms/amazon-alexa/visual.md#display-templates)
Progressive Responses | Keep your users engaged while processing a longer request | [📝](./docs/platforms/amazon-alexa#progressive-responses)
Skill Events | Get notified when an event (e.g. Skill enabled/disabled) occurs | [📝](./docs/platforms/amazon-alexa/skillevents.md)
CanFulfillIntentRequest | Add name-free interaction to your skill and increase your skill's discoverability | [📝](./docs/platforms/amazon-alexa/canfulfill.md)
Game Engine | Provides the toolset to receive Echo Button events | [📝](./docs/platforms/amazon-alexa/game-engine.md)
Gadget Controller | Allows you to control the user's Echo Buttons | [📝](./docs/platforms/amazon-alexa/gadget-controller.md)
In-Skill-Purchasing (ISP) | Allows you to sell premium content | [📝](./docs/platforms/amazon-alexa/in-skill-purchases.md)
Amazon Pay | Sell physical goods and services through Alexa | [📝](./docs/platforms/amazon-alexa/pay.md)
Reminders API | Allows you to set reminders for your user | [📝](./docs/platforms/amazon-alexa/reminders.md)
Settings API | Allows you to get your user's settings information | [📝](./docs/platforms/amazon-alexa/settings.md)
Proactive Events API | Send proactive events,which work as notifications, to your user | [📝](./docs/platforms/amazon-alexa/proactive-events.md)
Playback Controller | Process audio player requests coming from, for example, touch controls on Alexa-enabled devices | [📝](./docs/platforms/amazon-alexa/audioplayer.md#playback-controller)

#### Google Assistant

Name | Description | Docs
:--- | :--- | :---
Google Assistant Cards &nbsp; &nbsp; &nbsp; | Create visual Output for the Google Assistant mobile app | [📝](./docs/platforms/google-assistant/visual.md#basic-card)
Suggestion Chips | Display buttons to allow your users to quickly reply on mobile phones | [📝](./docs/platforms/google-assistant/visual.md#suggestion-chips)
Location | Access your user's location data | [📝](./docs/platforms/google-assistant/data.md#location)
Media Response | Play longform audio | [📝](./docs/platforms/google-assistant/media-response.md)
Push Notifications | Send push notifications to your users | [📝](./docs/platforms/google-assistant/notifications.md)
Transactions | Sell digital and physical goods in your Google Actions | [📝](./docs/platforms/google-assistant/transactions.md)

### Integrations

#### Database Integrations

See the [Jovo Persistence Layer](./docs/integrations/databases) for more information on storing user specific data.

Name | Description | Docs
:--- | :--- | :---
File Persistence | Saves user specific data in JSON file for fast prototyping and development (default) | [📝](./docs/integrations/databases/file-db.md)
Dynamo DB | Save user specific data in AWS DynamoDB table | [📝](./docs/integrations/databases/dynamodb.md)
MongoDB | Save user specific data in a MongoDB database | [📝](./docs/integrations/databases/mongodb.md)
MySQL | Save user specific data in a MySQL database | [📝](./docs/integrations/databases/mysql.md)
Google Datastore | Save user specific data using Google Datastore | [📝](./docs/integrations/databases/google-datastore.md)
Azure Cosmos DB | Save user specific data using Azure CosmosDB | [📝](./docs/integrations/databases/cosmosdb.md)
Google Firestore | Save user specific data in a NoSQL database by Google Firebase | [📝](./docs/integrations/databases/firestore.md)

#### Analytics Integrations

See the [Jovo Analytics Layer](./docs/integrations/analytics) for more information on analytics features.

Name | Description | Docs
:--- | :--- | :---
Dashbot | Chatbot and Voice App Analytics including Usage Metrics, Behavior Flows, and Live Interaction Transcripts | [📝](./docs/integrations/analytics/dashbot.md)
Bespoken Analytics | Voice App Analytics including Usage Metrics, Logging, and Monitoring | [📝](./docs/integrations/analytics/bespoken.md)
Chatbase | Voice App Analytics including Usage Metrics, Session Flows and Link Tracking | [📝](./docs/integrations/analytics/chatbase.md)
Botanalytics | AI powered Chatbot Analytics and Voice Analytics | [📝](./docs/integrations/analytics/botanalytics.md)
VoiceHero | Voice App Analytics including actionable insights, session tracking, custom events, cohorts, usage data and behavior flows to immediately improve in-app experience | [📝](./docs/integrations/analytics/voicehero.md)

#### CMS Integrations

Name | Description | Docs
:--- | :--- | :---
Google Sheets | Manage content in a Google Spreadsheet | [📝](./docs/integrations/cms/google-sheets.md)
Airtable | Manage content using Airtable | [📝](./docs/integrations/cms/airtable.md)

#### CLI Integrations

See the [Jovo CLI Docs](./docs/workflows/cli) for more information on CLI features.

Name | Description | Docs
:--- | :--- | :---
nodemon | Monitor changes and automatically restart the server | [📝](./docs/workflows/cli/run.md#nodemon)


## Tutorials

Find a quickstart guide and comprehensive tutorials here:
* General:
    * [Build a cross-platform voice app in 5 simple steps](https://www.jovo.tech#getting-started)
    * [Build an Alexa Skill with Jovo](https://www.jovo.tech/blog/alexa-skill-tutorial-nodejs/)
    * [Build a Google Action with Jovo](https://www.jovo.tech/blog/google-action-tutorial-nodejs/)
* Account Linking:
    * [Amazon Alexa with Auth0](https://www.jovo.tech/blog/alexa-account-linking-auth0/)
    * [Google Action with Auth0](https://www.jovo.tech/blog/google-action-account-linking-auth0/)
    * [Login with Amazon](https://www.jovo.tech/blog/alexa-login-with-amazon-email/)
* Amazon Alexa:
    * [Skill Events](https://www.jovo.tech/blog/alexa-skill-events/)
* Google Action:
    * [Suggestion Chips](https://www.jovo.tech/blog/google-assistant-suggestion-chips/)


## Contributing
   
We strongly encourage everyone who wants to help the Jovo development take a look at the following resources:
* [CONTRIBUTING.md](./.github/CONTRIBUTING.md) 
* [Step by step process](https://github.com/jovotech/jovo-framework/blob/master/docs/advanced-concepts/contributing.md) 
* Take a look at our [issues](https://github.com/jovotech/jovo-framework/issues)
* Add your project to [jovotech/builtwithjovo](https://github.com/jovotech/builtwithjovo)


## We need your help

Jovo is a free, open source framework for voice developers. We're improving it every day and appreciate any feedback. How to support us? Just go ahead and build something cool with the framework and let us know at feedback@jovo.tech. Thanks!
