# Jovo Framework Architecture

> To view this page on the Jovo website, visit https://v3.jovo.tech/docs/architecture

Learn more about the modular architecture of the Jovo Framework.

- [Introduction](#introduction)
- [Packages](#packages)
  - [jovo-core](#jovo-core)
  - [jovo-framework](#jovo-framework)
  - [jovo-integrations](#jovo-integrations)

## Introduction

The Jovo Framework has a flexible and extensible architecture that is split into different modules.

With every [request and response](../basic-concepts/requests-responses './requests-responses') interaction pair, the framework runs through the following process:

| Middleware        | Description                                                                                                                        |
| ----------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| `setup`           | First initialization of `app` object with first incoming request. Is executed once as long as `app` is alive                       |
| `request`         | Raw JSON request from platform gets processed. Can be used for authentication middlewares.                                         |
| `platform.init`   | Determines which platform (e.g. `Alexa`, `GoogleAssistant`) sent the request. Initialization of abstracted `jovo` (`this`) object. |
| `platform.nlu`    | Natural language understanding (NLU) information gets extracted for built-in NLUs (e.g. `Alexa`). Intents and inputs are set.      |
| `nlu`             | Request gets routed through external NLU (e.g. `Dialogflow` standalone). Intents and inputs are set.                               |
| `user.load`       | Initialization of user object. User data is retrieved from database.                                                               |
| `router`          | Request and NLU data (intent, input, state) is passed to router. intentMap and inputMap are executed. Handler path is generated.   |
| `handler`         | Handler logic is executed. Output object is created and finalized.                                                                 |
| `user.save`       | User gets finalized, DB operations.                                                                                                |
| `platform.output` | Platform response JSON gets created from output object.                                                                            |
| `response`        | Response gets sent back to platform.                                                                                               |
| `fail`            | Errors get handled if applicable.                                                                                                  |

## Packages

### jovo-core

The `jovo-core` package contains the interfaces of all of the main concepts of Jovo: `BaseApp`, `Conversation`, `Jovo`, `Middleware`, `SpeechBuilder`, `TestSuite`, and `User`.

### jovo-framework

The `jovo-framework` package is the main implementation of the Jovo Framework, and the probably most visible module for users. It contains all the relevant implementations for building an app with Jovo, like `App`, `Handler`, `Router`, `JovoUser`, as well as logging, hosting, and integration capabilities.

### jovo-integrations

The `jovo-integrations` packages offer several implementations of voice platforms, plugins, and other integrations like databases or analytics.

#### Platforms

Platforms like Amazon Alexa or Google Assistant have the prefix `jovo-platform-`, and currently include:

- `jovo-platform-alexa`
- `jovo-platform-googleassistant`
- `jovo-platform-dialogflow`

#### Databases

Database integrations like DynamoDB or MySQL have the prefix `jovo-db-`, and currently include:

- `jovo-db-filedb`
- `jovo-db-dynamodb`
- `jovo-db-mysql`

#### Analytics

Analytics integrations like Dashbot or Botanalytics have the prefix `jovo-analytics-`, and currently include:

- `jovo-analytics-dashbot`

#### Plugins

General plugins have the prefix `jovo-plugin-`, and currently include:

- `jovo-plugin-debugger`
- `jovo-plugin-lmtester`

<!--[metadata]: {
                "description": "Learn more about the modular architecture of the Jovo Framework.",
		        "route": "architecture"
                }-->
