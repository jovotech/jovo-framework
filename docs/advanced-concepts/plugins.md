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
