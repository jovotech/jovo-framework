# Plugins

Learn how you can build your own plugins to extend the Jovo Framework.

* [Introduction](#introduction)

## Introduction

Plugins allow you to easily extend the Jovo Framework without having to mess with its core code and architecture.

You can find an example file that uses the plugin system on GitHub: [examples/appPlugins.js](https://github.com/jovotech/jovo-framework-nodejs/blob/master/examples/appPlugins.js).

Make sure you `require` the Jovo `Plugin` class. In the example, we do that by modifying the part in our `app.js` that imports the `jovo-framework` package.

```javascript
const {App, Plugin} = require('jovo-framework');
```

A plugin with the name `PluginName` can be created like this.

```javascript
class PluginName extends Plugin {
    constructor(options) {
        super(options);
    }
    init() {
        // Specify what it does at certain events
    }
}
```
In the app, the plugin can then get registered. The `constructor` part of the plugin can be used to define certain `options` that the plugin needs to work (e.g. credentials):

```javascript
app.register(new PluginName());

// If you define options in your constructor
app.register(new PluginName(options));
```

In `init()`, you can define listeners and what to do when a certain event happens. The example below logs the `Request Type` for any incoming request: 

```javascript
this.app.on(event, (arguments) => {
    // Do something
});

// Example
this.app.on('request', (jovo) => {
    console.log(`Request-Type: ${jovo.getPlatform().getRequestType()}`);
});
```

Here is a list of all events that can be used:

Category | Name | Method | Arguments
:--- | :--- | :--- | :---
Routing | request | `this.app.on('request')` | `jovo`
 | | response | `this.app.on('response')` | `jovo`
 | | followUpState | `this.app.on('followUpState')` | `jovo`, `state`
 | | removeState | `this.app.on('removeState')` | `jovo`
 | | toIntent | `this.app.on('toIntent')` | `jovo`, `intent`
 | | toStateIntent | `this.app.on('toStateIntent')` | `jovo`, `state`, `intent`
 | | toStatelessIntent | `this.app.on('toStatelessIntent')` | `jovo`, `intent`
 | | endSession | `this.app.on('endSession')` | `jovo`
Output | tell | `this.app.on('tell')` | `jovo`, `speech`
 | | ask | `this.app.on('ask')` | `jovo`, `speech`, `repromptSpeech`
 | | showSimpleCard | `this.app.on('showSimpleCard')` | `jovo`, `title`, `content`
 | | showImageCard | `this.app.on('showImageCard')` | `jovo`, `title`, `content`, `imageUrl`
 | | showAccountLinkingCard | `this.app.on('showAccountLinkingCard')` | `jovo`
 Error | handlerError | `this.app.on('handlerError')` | `jovo`, `error`
 | | responseError | `this.app.on('responseError')` | `jovo`, `error`



### Plugin Example

The plugin below is called `CustomLogging` and enables you to modify what is being logged when. You can find the full example file here: [CustomLogging Plugin](https://github.com/jovotech/jovo-framework-nodejs/blob/master/examples/appPlugins.js).

For example, the `Request Type` of every request is logged. Also, if a redirect `toIntent` is done, this is also logged to be able to follow the user's flow through the app. Finally, the `tell` output is logged as well.

```javascript
class CustomLogging extends Plugin {
    constructor(options) {
        super(options);
    }
    init() {
        this.app.on('request', (jovo) => {
            console.log();
            console.log(`Request-Type: ${jovo.getPlatform().getRequestType()}`);
        });
        this.app.on('toIntent', (jovo, intent) => {
            console.log(`toIntent -> ${intent} `);
        });
        this.app.on('tell', (jovo, speech) => {
            console.log(`tell -> ${speech} `);
        });
    }

}
app.register('CustomLogging', new CustomLogging());
```

<!--[metadata]: {
                "description": "Learn how you can build your own plugins to extend the Jovo Framework.",
		        "route": "plugins"
                }-->
