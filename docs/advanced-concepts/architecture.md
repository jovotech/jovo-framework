# Jovo Framework Architecture

Learn more about the modular architecture of the Jovo Framework.

* [Introduction](#introduction)
* [Packages](#packages)
   * [jovo-core](#jovo-core)
   * [jovo-framework](#jovo-framework)
   * [jovo-integrations](#jovo-integrations)

## Introduction

Since `v2`, the Jovo Framework has a flexible and extensible architecture that is split into different modules.

With every [request and response](../basic-concepts/requests-responses.md './requests-responses') interaction pair, the framework runs through the following process:

Middleware | Description
--- | --- 
`setup` | First initialization with incoming request
`request` | Request gets processed
`platform.init` | Platform (e.g. AlexaSkill) gets initialized
`platform.nlu'` | NLU information gets extracted for built-in NLUs (e.g. Alexa)
`nlu` | Request gets routed through external NLU (e.g. Dialogflow standalone)
`initialize.user` | Uber object is initialized
`initialize.cms` | CMS is initialized
`logic.router` | Request and NLU data is passed to router
`logic.handler` | Handler logic
`output` | Output object is created from handler logic
`finalize.user` | User gets finalized, DB operations
`response` | Response gets created from output object
`sendresponse` | Response gets sent back to platform
`handleerror` | Errors get handled if applicable


## Packages

### jovo-core

The `jovo-core` package contains the interfaces of all of the main concepts of Jovo: `BaseApp`, `Conversation`, `Jovo`, `Middleware`, `SpeechBuilder`, `TestSuite`, and `User`.


### jovo-framework

The `jovo-framework` package is the main implementation of the Jovo Framework, and the probably most visible module for users. It contains all the relevant implementations for building an app with Jovo, like `App`, `Handler`, `Router`, `JovoUser`, as well as logging, hosting, and integration capabilities.


### jovo-integrations

The `jovo-integrations` packages offer several implementations of voice platforms, plugins, and other integrations like databases or analytics.

#### Platforms

Platforms like Amazon Alexa or Google Assistant have the prefix `jovo-platform-`, and currently include:

* `jovo-platform-alexa`
* `jovo-platform-googleassistant`
* `jovo-platform-dialogflow`

#### Databases

Database integrations like DynamoDB or MySQL have the prefix `jovo-db-`, and currently include:

* `jovo-db-filedb`
* `jovo-db-dynamodb`
* `jovo-db-mysql`

#### Analytics

Analytics integrations like Dashbot or Botanalytics have the prefix `jovo-analytics-`, and currently include:

* `jovo-analytics-dashbot`


#### Plugins

General plugins have the prefix `jovo-plugin-`, and currently include:

* `jovo-plugin-debugger`
* `jovo-plugin-lmtester`


<!--[metadata]: {
                "description": "Learn more about the modular architecture of the Jovo Framework.",
		        "route": "architecture"
                }-->
