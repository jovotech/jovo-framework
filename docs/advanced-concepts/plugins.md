# Plugins

Learn how you can build your own plugins to customize and extend the Jovo Framework.

* [Introduction](#introduction)
* [Using Plugins](#using-plugins)
* [Building Plugins](#building-plugins)


## Introduction

Plugins allow you to easily extend the Jovo Framework without having to mess with its core code and architecture.

Plugins allow you to "hook" into several parts of the request execution, called `middlewares`. Here is a list of all available middlewares:

Middleware | Description
--- | --- 
`setup` | First initialization of `app` object with first incoming request. Is executed once as long as `app` is alive
`request` | Raw JSON request from platform gets processed. Can be used for authentication middlewares.
`platform.init` | Determines which platform (e.g. `Alexa`, `GoogleAssistant`) sent the request. Initialization of abstracted `jovo` (`this`) object.
`platform.nlu'` | Natural language understanding (NLU) information gets extracted for built-in NLUs (e.g. `Alexa`). Intents and inputs are set.
`nlu` | Request gets routed through external NLU (e.g. `Dialogflow` standalone). Intents and inputs are set.
`user.load` | Initialization of user object. User data is retrieved from database.
`router` | Request and NLU data (intent, input, state) is passed to router. intentMap and inputMap are executed. Handler path is generated. 
`handler` | Handler logic is executed. Output object is created and finalized.
`user.save` | User gets finalized, DB operations.
`platform.output` | Platform response JSON gets created from output object.
`response` | Response gets sent back to platform.
`fail` | Errors get handled if applicable.


## Using Plugins

Download the plugin:

```sh
$ npm install --save jovo-plugin-name
```

Enable it in `app.js`:

```javascript
// app.js file

const { PluginName } = require('jovo-plugin-name');

app.use(new PluginName());
```

Add configurations in `config.js`:

```javascript
// config.js file

plugin: {
    PluginName: {
        // Plugin config
    }
}
```


## Building Plugins

```javascript
// Typescript

import { Plugin, PluginConfig, BaseApp } from 'jovo-core';

interface Config extends PluginConfig {
    //
}

export class PluginName implements Plugin {
    config: Config = {
        // Default config
    };

    constructor(config?: Config) {
        if (config) {
            this.config = _merge(this.config, config);
        }
    }

    install(app: BaseApp) {
        app.middleware('middleware')!.use()

    }
}
```

<!--[metadata]: {
                "description": "Learn how you can build your own plugins to extend the Jovo Framework.",
		        "route": "plugins"
                }-->
