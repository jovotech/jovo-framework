# config.js - App Configuration

In this section, you will learn more about the essential configurations of a Jovo Voice App.

* [Overview](#overview)
* [Adding Configurations](#adding-configurations)
   * [General Configurations](#general-configurations)
   * [Integrations](#integrations)
   * [Plugins](#plugins)
* [Staging](#staging)


## Overview

The `config.js` file in the `src` folder of a Jovo project is the place where all configuration of your voice app can be stored.

For example, the `config.js` for the "Hello World" Jovo project looks like this:

```javascript
// ------------------------------------------------------------------
// APP CONFIGURATION
// ------------------------------------------------------------------

module.exports = {
   logging: true,

   intentMap: {
      'AMAZON.StopIntent': 'END',
   },

   db: {
        FileDb: {
            pathToFile: '../db/db.json',
        }
    },
};
```

The above example shows three different elements:
* [`logging`](../basic-concepts/data/logging.md './data/logging'): Every request and response will be logged if this is `true`. [Learn more here](../basic-concepts/data/logging.md './data/logging').
* `intentMap`: Maps `AMAZON.StopIntent` to the `END` handler. [Learn more here](../basic-concepts/routing/intents.md#intentmap './routing/intents#intentmap').
* `db`:  Enables `FileDb` as database integration. [Learn more here](../integrations/databases './databases').


## Adding Configurations

There are several types of integrations that can be added to the `config.js` file:

* [General Configurations](#general-configurations)
* [Integrations](#integrations)
* [Plugins](#plugins)

### General Configurations

Below are references to all the general configurations that can be added to the `config.js` file. The general configurations are added to the root element of the config object.

Category | Name | Description
:--- | :--- | :---
Routing | [intentMap](../basic-concepts/routing/intents.md#intentmap './logic/intents#intentmap') | Maps incoming intents to specified intent names
 | | [intentsToSkipUnhandled](../basic-concepts/routing/intents.md#intentstoskipunhandled './routing/intents#intentstoskipunhandled') | Intents that should not be mapped to 'Unhandled' when not found in a certain state
 | | [inputMap](../basic-concepts/routing/input.md#inputmap './routing/input#inputmap') | Maps incoming input (slots and parameters) to specified input names
 Data | [logging](../basic-concepts/data/logging.md './data/logging') | Logs both requests and responses
 | | [user](../basic-concepts/data/user.md './data/user') | Configure the Jovo User object
Output | [i18n](../basic-concepts/output/i18n.md './output/i18n') | Enable multilingual output for your voice app


### Integrations

Jovo integrations are deeply integrated plugins that ususally implement an interface. Examples are:

* `db`: [Database integrations](../integrations/databases './databases')
* `analytics`: [Analytics integrations](../integrations/analytics './analytics')
* `cms`: [CMS integrations](../integrations/cms './cms')

Integration configurations are usually structured like this:

```javascript
// Integration type
db: {
    // Name of integration class
    FileDb: {
        pathToFile: '../db/db.json',
    }
},
```

> [Learn more about Jovo integrations here](../integrations './integrations').


### Plugins

Plugins can be added like this:

```javascript
// General plugin wrapper
plugin: {
    PluginName: {
        // Plugin config
    }
},
```


## Staging

Jovo uses [`node-config`](https://www.npmjs.com/package/config) to allow you to add config overrides for different stages.

For example, you could have several config files for different stages:
* `config.js`: Default config of the project
* `config.qa.js`: Config overrides for the QA environment (e.g. DynamoDB)
* `config.prod.js`: Config overrides for the production environment (e.g. DynamoDB + Analytics)

For the app to discover what environment it is currently in, use `NODE_ENV` or `STAGE` as environment variables.

Here is how the `db` parts could differ for different environments:

```javascript
// config.js file
db: {
    FileDb: {
        pathToFile: '../db/db.json',
    }
},

// config.prod.js files, NODE_ENV=prod
db: {
    DynamoDb: {
        tableName: 'yourTableName',
    }
},
```

> For project-related staging environments, take a look at [project.js](./project-js.md './project-js.md').


<!--[metadata]: {"description": "Learn how to configure your Jovo Voice App for Amazon Alexa and Google Assistant", "route": "config-js"}-->
