# Migrating to v2 from Jovo v1

Learn how to migrate from a Jovo v1 project to the new v2 of the Jovo Framework.

* [Introduction](#introduction)
* [Project Structure](#project-structure)
    * [project.js](#projectjs)
    * [config.js](#configjs)
* [Plugins](#plugins)
* [Intent Syntax](#intent-syntax)
* [Inputs](#inputs)
* [Jovo Variables](#jovo-variables)
* [Responses are sent automatically](#responses-are-sent-automatically)
* [Alexa Dialog Interface](#alexa-dialog-interface)
* [Jovo Persistence Layer](#jovo-persistence-layer)
* [Examples](#examples)


## Introduction

With the update to `v2` we've have completely refactored the code base of both the framework and the CLI to make it easier for us and you as well to maintain everything going forward. 

The code base now has a plugin architecture, where each platform (e.g. Amazon Alexa, Google Assistant), integration (e.g. DynamoDb, Dashbot) and tool (e.g. Jovo Debugger) was outsourced as a plugin.

Although most of these changes were under the hood and don't directly affect the usage of the framework, we used the chance to make quality of life changes to the project structure and increased the consistency of the framework's interfaces.

## Project Structure

```javascript
// old                              new
app/                                src/                  
  └── app.js                          |── app.js  
models/                               |── config.js
  └── en-US.json                      └── index.js
app.json                            models/
index.js                              └── en-US.json
                                    project.js
```

We've moved the files needed for the fulfillment to the `src` folder

### project.js

The `project.js` file is the equivalent to the `app.json` file with small tweaks here and there.

First of all, it is a `js` file now instead of a `json`, simply to allow you to comment stuff out.

Secondly, the `project.js` file will be only used for the build and deploy processes, instead of being a jack of all trades like the `app.json`. That means, overriding certain parts of your config using the `project.js` file won't be possible anymore. That's now done with the [`config.js`](#config.js).

Besides that, everything works the same as with `v1`.

```javascript
// ------------------------------------------------------------------
// JOVO PROJECT CONFIGURATION
// ------------------------------------------------------------------

module.exports = {
    alexaSkill: {
        nlu: 'alexa',
    },
    googleAction: {
        nlu: 'dialogflow',
    },
    endpoint: `${JOVO_WEBHOOK_URL}`,
};
```

### config.js

The `config.js` file is the equivalent to the configuration part at the top of the `app.js` file in the default project structure.

```javascript
// config.js

module.exports = {
    logging: true,

    intentMap: {
      'AMAZON.StopIntent': 'END',
    }
};
```

To override certain configurations in different stages we use individual config files for each stage: `config.dev.js`, `config.prod.js`, etc.

For example we could disable `logging` in our `prod` stage using the `config.prod.js` file:

```javascript
// config.prod.js
module.exports = {
    logging: false,
}
```

The framework will merge the default config with the stage's config file, which means in the `prod` stage our actual configuration will look like this:

```javascript
// prod configuration

module.exports = {
    logging: false,

    intentMap: {
      'AMAZON.StopIntent': 'END',
    }
};
```

## Plugins

With the new plugin architecture of the framework, the core `jovo-framework` npm package does not contain all the features anymore. Each platform, integration and tool has to be imported, configured and initialized individually.

Let's go over the process by integrating the `FileDb` plugin, which allows us to use a `JSON` file as a local database for development:

We first install the plugin and save it as `devDependency` as we don't need in production:

```text
npm install --save-dev jovo-db-filedb
```

After that we go our `app.js` file, which is now located in the `src` folder and import as well as initialize the plugin:

```javascript
// ./src/app.js

const {App} = require('jovo-framework');
const {FileDb} = require('jovo-db-filedb');
// other plugins

const app = new App();

app.use(
    // other plugins
    new FileDb()
);

// rest of the app.js file
```

The same procedure has to be done for each plugin. 

By default, a new `v2` project comes with the `Alexa`, `GoogleAssistant` and `JovoDebugger` plugin:

```javascript
// src/app.js

const {App} = require('jovo-framework');
const {Alexa} = require('jovo-platform-alexa');
const {GoogleAssistant} = require('jovo-platform-googleassistant');
const {JovoDebugger} = require('jovo-plugin-debugger');

const app = new App();

app.use(
    new Alexa(),
    new GoogleAssistant(),
    new JovoDebugger()
);
```

Here's a full list of plugins:

Name | Description | Package Name
:--- | :--- | :---
Alexa | Allows you to build Skills for Amazon Alexa | `jovo-platform-alexa`
Google Assistant | Allows you to build Actions for the Google Assistant | `jovo-platform-googleassistant`
Debugger | Allows you to use the [Jovo Debugger](../../testing/debugger.md './testing/debugger') | `jovo-plugin-debugger`
FileDb | Local database inside `JSON` file for local development | `jovo-db-filedb`
MySQL | 

## Intent Syntax

In `v2` we use the method syntax introduced with ES6:

```javascript
// old
app.setHandler({
    'LAUNCH': function() {

    },
    'HelloWorldState': {
        'HelloWorldIntent': function() {

        }
    },
    'AUDIOPLAYER': {
        'AudioPlayer.PlaybackStarted': function() {

        },
    }
});

// new
app.setHandler({
    LAUNCH() {

    },
    HelloWorldState: {
        HelloWorldIntent() {

        }
    },
    AUDIOPLAYER: {
        'AlexaSkill.PlaybackStarted'() {

        },
    }

})
```

## Inputs

With `v2` you won't be able to access user inputs by adding them as parameters to your intent anymore:

```javascript
// Does NOT work:
MyNameIsIntent(name) {
    this.tell('Hey ' + name.value + ', nice to meet you!');
},
```

Inputs can now only be accessed either using the `$inputs` object or `getInput()`:

```javascript
MyNameIsIntent() {
    this.tell('Hey ' + this.$inputs.name.value + ', nice to meet you!');
},

MyNameIsIntent() {
    this.tell('Hey ' + this.getInput('name').value + ', nice to meet you!');
}
```

Also, you won't be able to pass additional data in redirects anymore:

```javascript
// Old: Go to PizzaIntent and pass more data
this.toIntent('PizzaIntent', moreData);

// Recommended
this.$data.moreData = 'someData';
this.toIntent('PizzaIntent');
```

## Jovo Objects

For `v2` we've updated the way interfaces are called to make it easily distinguishable from actual method calls:

```javascript
// v1:
this.alexaSkill().audioPlayer().stop();

// v2:
this.$alexaSkill.$audioPlayer.stop();
```

Here's the list of changes:

`v1` | `v2`
:--- | :---
`request()` | `$request`
`response()` | `$response`
`user()` | `$user`
 - | `$inputs`
`alexaSkill()` | `$alexaSkill`
`alexaSkill().audioPlayer()` | `$alexaSkill.$audioPlayer`
 - | `$alexaSkill.$dialog`
`alexaSkill().gadgetController()` | `$alexaSkill.$gadgetController`
`alexaSkill().gameEngine()` | `$alexaSkill.$gameEngine`
`alexaSkill().inSkillPurchase()` | `$alexaSkill.$inSkillPurchase`
`googleAction()` | `$googleAction`
`googleAction().audioPlayer()` | `$googleAction.$audioPlayer`

## Responses are sent automatically

Intents run through and send out a response at the end automatically, which means `this.endSession()` is obsolete.

Besides that, you now have to handle asynchronous tasks appropriately, otherwise the response will be sent out, before you, for example, fetched the data from the API. The most convenient way is using [`async` functions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function).

## Alexa Dialog Interface

To increase consistency, the dialog feature of Alexa has its own interface now, `this.$alexaSkill.$dialog`, instead of being directly accessibly through the `$alexaSkill` interface.

As a result, there were also method name changes:

`v1` | `v2`
:--- | :---
`dialogDelegate()` | `delegate()`
`dialogElicitSlot()` | `elicitSlot()`
`dialogConfirmSlot()` | `confirmSlot()`
`dialogConfirmIntent()` | `confirmIntent()`
`getDialogState()` | `getState()`
`isDialogCompleted()` | `isCompleted()`
`isDialogInProgress()` | `isInProgress()`
`isDialogStarted()` | `isStarted()`

## Jovo Persistence Layer

With the new interface naming convention there is also a slight change to the Jovo Persistence Layer syntax:

```javascript
// v1
this.user().data.key = value;

// v2
this.$user.$data.key = value;
```

## Examples

For more examples how all of these changes look in action, we've updated both the [`examples` folder](PLACEHOLDER) and the [templates repository](https://github.com/jovotech/jovo-templates) 


<!--[metadata]: {"description": "Learn how to migrate from a Jovo v1 project to the new v2 of the Jovo Framework.", "route": "installation/v1-migration"}-->
