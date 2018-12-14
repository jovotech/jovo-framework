# Migrating to v2 from Jovo v1

Learn how to migrate from a Jovo v1 project to the new v2 of the Jovo Framework.

* [Getting Started with v2](#getting-started-with-v2)
    * [Installation](#installation)
    * [Project Structure](#project-structure)
* [Updated Concepts](#updated-concepts)
    * [Plugins](#plugins)
    * [Jovo Objects](#jovo-variables)
    * [Integrations](#integrations)
    * [Response Execution](#response-execution)
* [Breaking Changes](#breaking-changes)
    * [Inputs](#inputs)
    * [Unit Testing](#unit-testing)
    * [Alexa Dialog Interface](#alexa-dialog-interface)
* [Optional Changes](#optional-changes)
    * [Intent Syntax](#intent-syntax)
* [Examples](#examples)


![Video: Jovo v2 Migration Guide](../../img/video-jovo-v2-migration.jpg 'youtube-video')

## Getting Started with v2

With the update to `v2` we've have completely refactored the code base of both the Jovo Framework and the Jovo CLI to make it more modular and easier to extend.

The code base now has a plugin architecture, where each platform (e.g. Amazon Alexa, Google Assistant), integration (e.g. DynamoDb, Dashbot) and tool (e.g. Jovo Debugger) can be added and removed as a plugin.

Although most of these changes were under the hood and don't directly affect the usage of the framework, we used the chance to make quality of life changes to the project structure and increased the consistency of the framework's interfaces.

### Installation

To get started with the new Jovo `v2`, install the Jovo CLI:

```sh
$ npm install -g jovo-cli@beta

# sudo may be required
$ sudo npm install -g jovo-cli@beta

# If you run into problems, uninstall v1 versions first
$ npm uninstall -g jovo-cli
```

Then, create a new Jovo project with:

```sh
$ jovo new <directory>
```


### Project Structure

New Jovo projects have an updated folder structure.

![New Jovo v2 Project Structure](../../img/jovo-v2-project-structure.png)

There are several changes that are important:
* [`project.js`](#projectjs) (previously `app.json`)
* `src` (including `index.js` and `app.js`)
* [`config.js`](#configjs)

#### project.js

> [Find everything about `project.js` here](../../configuration/project-js.md '../project-js').

The `project.js` file is the equivalent to the `app.json` file with small tweaks here and there. It stores all project related configurations and is only used for the build and deploy processes. 

That means overriding certain parts of your app config using (like different databases for different stages) the `project.js` file won't be possible anymore. That's now done with the [`config.js`](#config.js).

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

#### config.js

> [Find everything about `config.js` here](../../configuration/config-js.md '../config-js').

The `config.js` file is the equivalent to the configuration part at the top of the `app.js` file in the default project structure.

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

To override certain configurations in different stages we use individual config files for each stage: `config.dev.js`, `config.prod.js`, etc.

For example we could disable `logging` in our `prod` stage using the `config.prod.js` file:

```javascript
// config.prod.js file

module.exports = {
    logging: false,
}
```

## Updated Concepts

The Jovo architecture has a few new concepts:

* [Plugins](#plugins)
* [Jovo Objects](#jovo-variables)
* [Integrations](#integrations)
* [Response Execution](#response-execution)

### Plugins

> [Find everything about plugins here](../../advanced-concepts/plugins.md '../plugins').

With the new plugin architecture of the framework, the core `jovo-framework` npm package does not contain all the features anymore. Each platform, integration and tool has to be imported, configured and initialized individually.

Let's go over the process by integrating the `FileDb` plugin, which allows us to use a `JSON` file as a local database for development:

We first install the plugin and save it as `devDependency` as we don't need in production:

```text
npm install --save-dev jovo-db-filedb
```

After that we go our `app.js` file, which is now located in the `src` folder and import as well as initialize the plugin:

```javascript
// src/app.js file

const {App} = require('jovo-framework');
const {FileDb} = require('jovo-db-filedb');
// Other plugins

const app = new App();

app.use(
    // Other plugins
    new FileDb()
);

// Rest of the app.js file
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



### Jovo Objects

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
`getInputs()` | `$inputs`
`alexaSkill()` | `$alexaSkill`
`alexaSkill().audioPlayer()` | `$alexaSkill.$audioPlayer`
 `alexaSkill().dialogInterface()` | `$alexaSkill.$dialog`
`alexaSkill().gadgetController()` | `$alexaSkill.$gadgetController`
`alexaSkill().gameEngine()` | `$alexaSkill.$gameEngine`
`alexaSkill().inSkillPurchase()` | `$alexaSkill.$inSkillPurchase`
`googleAction()` | `$googleAction`
`googleAction().audioPlayer()` | `$googleAction.$audioPlayer`



### Integrations

With the new interface naming convention there is also a slight change to the Jovo Persistence Layer syntax:

```javascript
// v1
this.user().data.key = value;

// v2
this.$user.$data.key = value;
```


### Response Execution

Intents run through and send out a response at the end automatically, which means `this.endSession()` is obsolete.

Besides that, you now have to handle asynchronous tasks appropriately, otherwise the response will be sent out, before you, for example, fetched the data from the API. The most convenient way is using [`async` functions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function).


## Breaking Changes

* [Inputs](#inputs)
* [Alexa Dialog Interface](#alexa-dialog-interface)

### Inputs

With `v2` you won't be able to access user inputs by adding them as parameters to your intent anymore:

```javascript
// Does NOT work:
MyNameIsIntent(name) {
    this.tell('Hey ' + name.value + ', nice to meet you!');
},
```

Inputs can now be accessed by using a new `$inputs` object:

```javascript
// Recommended
MyNameIsIntent() {
    this.tell('Hey ' + this.$inputs.name.value + ', nice to meet you!');
},

// Still works
MyNameIsIntent() {
    this.tell('Hey ' + this.getInput('name').value + ', nice to meet you!');
}
```

Also, you won't be able to pass additional data in redirects anymore. Here is our recommended (more consistent) way to pass interaction specific data:

```javascript
this.$data.moreData = 'someData';
this.toIntent('PizzaIntent');


// Old: Go to PizzaIntent and pass more data
this.toIntent('PizzaIntent', moreData);
```

### Unit Testing

In `v1`, Jovo used a combination of `mocha` and `chai` for unit testing. In `v2`, we switched to `Jest` and provide a cleaner experience that leverages `async` and `await`.

> [Learn more about unit testing here](../../testing/unit-testing.md '../unit-testing').

### Alexa Dialog Interface

To increase consistency, the dialog feature of Alexa has its own interface now, `this.$alexaSkill.$dialog`, instead of being directly accessibly through the `$alexaSkill` interface.

As a result, there were also method name changes:

`v1` | `v2`
:--- | :---
`dialogDelegate()` | `$dialog.delegate()`
`dialogElicitSlot()` | `$dialog.elicitSlot()`
`dialogConfirmSlot()` | `$dialog.confirmSlot()`
`dialogConfirmIntent()` | `$dialog.confirmIntent()`
`getDialogState()` | `$dialog.getState()`
`isDialogCompleted()` | `$dialog.isCompleted()`
`isDialogInProgress()` | `$dialog.isInProgress()`
`isDialogStarted()` | `$dialog.isStarted()`



## Optional Changes

### Intent Syntax

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



## Examples

For more examples how all of these changes look in action, we've updated both the [`examples` folder](https://github.com/jovotech/jovo-framework-nodejs/tree/v2/examples) and the [templates repository](https://github.com/jovotech/jovo-templates/tree/v2) 


<!--[metadata]: {"description": "Learn how to migrate from a Jovo v1 project to the new v2 of the Jovo Framework.", "route": "installation/v1-migration"}-->
