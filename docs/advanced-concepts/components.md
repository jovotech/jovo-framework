# Conversational Components

Learn how to utilize and build Conversational Components.

> Note: The feature is still in beta. Everything mentioned here is bound to change as we receive feedback and iterate.

* [Introduction](#introduction)
* [Component Structure](#component-structure)
  * [index.js](#indexjs)
* [Using Components](#using-components)
  * [Installation](#installation)
  * [$components](#components)
  * [Delegate to the Component](#delegate-to-the-component)
  * [$response](#response)
  * [Configuration](#configuration)
* [Building Components](#building-components)
  * [Handler](#handler)
  * [Configuration](#configuration-1)
  * [Models](#models)
  * [i18n](#i18n)

## Introduction

The idea behind Conversational Components is to provide solutions for recurring problems you might encounter while creating voice apps.

They are pre-built npm packages containing the necessary **language model**, **handler** (logic) and **i18n** (cms) files, which you utilize by delegating the task to the component.

## Component Structure

Each component has the following structure:

```
models/
  └── en-US.json
  └── de-DE.json
  └── ...
src/
  └── i18n/
    └── en-US.json
    └── de-DE.json
    └── ...
  └── handler.js
  └── config.js
index.js
```

The `models` folder contains the language model, the `src` folder contains the logic and the `i18n` folder contains the components responses.

### index.js

The `index.js` file at the root is the entry point of each component. It exports a class which contains references to the handler and config object as well as the path to the i18n folder.

```js
// @language=javascript
// index.js

const {Component} = require('jovo-framework');

class PHONE_NUMBER extends Component {
    constructor(config) {
        super(config);
        this.handler = require('./src/handler');
        this.config = require('./src/config');
        this.pathToI18n = './src/i18n/';
    }
}

module.exports = PHONE_NUMBER;
```

Name | Description | Value | Required 
--- | --- | --- | ---
`handler` | Contains the logic of your component, i.e. states & intents | `object` | Yes
`config` | Contains the default configuration | `object` | Yes
`pathToI18n` | Specifies the path to your i18n folder containing the responses used in your component | `string` | Yes

## Using Components

### Installation

Components are hosted on npm to make it easy to share them.

After installing the package you have to, for now, manually copy the files to the new `components` folder:

```sh
$ npm install jovo-component-phone-number
```

```
// root folder
components/
  └── models/
  └── src/
    └── i18n/
    └── config.js
    └── handler.js
models/
src/
project.js
```

That process will soon be automatized using the Jovo CLI.

After that have the enable the component using the the `useComponent(...components)` function:

```js
// @language=javascript
// src/app.js
const PHONE_NUMBER = require("../components/PHONE_NUMBER/index");

app.useComponents(new PHONE_NUMBER());
```

### $components

Installed components can be referenced at runtime using the `$components` object, e.g. `this.$components.PHONE_NUMBER` will reference the PHONE_NUMBER component.

### Delegate to the Component

To delegate the task to one of the components, you use the `delegate(componentName, onCompletedIntent)` function.

Name | Description | Value | Required 
--- | --- | --- | ---
`componentName` | The name of the component to which you want to delegate the task to | `string` | Yes
`onCompletedIntent` | The name of the intent to which the component should route to as soon as it finished the task | `string` | Yes

At that point the component will go through the necessary steps to fulfill the task and route back to your specified intent with a response.

### $response

The response you receive from a component will have the following interface:

```js
// @language=javascript
const response = {
    status: 'SUCCESSFUL' | 'REJECTED' | 'ERROR',
    data: {
      // ...
    }
}
```

Name | Description | Value | Required 
--- | --- | --- | ---
`status` | Represents the status of the component. Will be set to `SUCCESSFUL` if the component managed to collect the data without problems. Will be set to `REJECTED` if the user tried to stop the app at any point, e.g. *Alexa, stop*. Will be set `ERROR` if an error occurred at some point. | Either `SUCCESSFUL`, `REJECTED`, or `ERROR` | Yes
`data` | An object containing the data the component was supposed to collect. The content of the object will different for each component | `object` | Yes

That means, that you have to be prepared to handle all three possibilities of a response in your `onCompletedIntent`

```js
// @language=javascript
CompletedIntent() {
    const response = this.$components.PHONE_NUMBER.$response;

    if (response.status === 'REJECTED') {
        // handle REJECTED
    }
    else if (response.status === 'ERROR') {
        // handle ERROR
    }
    else {
        // handle SUCCESSFUL
    }
}
```

### Configuration

It's generally not recommended to make any kind of changes to the component's handler. Any necessary changes should be able to be made using your project's root config file, which can be done the following way:

```js
// @language=javascript
// config.js

module.exports = {
    // ...
    components: {
        PHONE_NUMBER: {
            numberOfFails: 5
        }
    }
};
```

As for customizing the component's responses, simply edit its respective i18n values.

## Building Components

> You can find an example [here](https://github.com/jovotech/jovo-component-phone-number).

Your component has to follow the structure described above. Besides that, it's recommended to comply with naming conventions, especially while using i18n as the keys your component uses might overlap with the user's existing ones.

### Handler

The component's handler has to be inside a state, which is named after the component:

```js
// @language=javascript
// src/handler.js

module.exports = {
    PHONE_NUMBER: {
        // intents and states
    }
};
```

Also, every component has to have a `START` intent at its root. That intent can be used to initialize any kind of data you will need throughout the component as well as begin the conversation to obtain the necessary data:

```js
// @language=javascript
// src/handler.js

module.exports = {
    PHONE_NUMBER: {
        START() {
            // initialize COMPONENT_PHONE_NUMBER object which will be used to store session attributes needed for the component,
            // so we don't overlap with the user's existing session attributes
            this.$session.$data.COMPONENT_PHONE_NUMBER: {};

            return this.ask('To proceed, I need your phone number!');
        }
    }
};
```

At the time the component finished, you have set the component's `$response` object and route back to the `onCompletedIntent`.

```js
// @language=javascript

const response = {
    status: 'SUCCESSFUL',
    data: {
        // ...
    }
};

this.$components.PHONE_NUMBER.$response = response;

return this.toStateIntent(this.$components.PHONE_NUMBER.stateBeforeDelegate, this.$components.PHONE_NUMBER.onCompletedIntent);
```

To route back, use the `toStateIntent` method and parse the `stateBeforeDelegate` property, which, as the name says, is the state in which the `delegate()` method was called, to route the system back to the spot in which the component was used. That property was saved automatically at the time `delegate()` was called.

Besides that, it's recommended to include an `ON_ERROR`, `END` and `Unhandled` intent.

In this case of `ON_ERROR` and `END` you should route back to the `onCompletedIntent` just like above, but set the status to `ERROR` or `REJECTED` respectively:

```js
// @language=javascript
// src/handler.js

END() {
    const response = {
        status: 'REJECTED',
    };

    this.$components.PHONE_NUMBER.$response = response;

    return this.toStateIntent(this.$components.PHONE_NUMBER.stateBeforeDelegate, this.$components.PHONE_NUMBER.onCompletedIntent);
},

ON_ERROR() {
    const response = {
        status: 'ERROR',
    };

    this.$components.PHONE_NUMBER.$response = response;

    return this.toStateIntent(this.$components.PHONE_NUMBER.stateBeforeDelegate, this.$components.PHONE_NUMBER.onCompletedIntent);
},

Unhandled() {
    return this.toIntent('HelpIntent');
},
```

### Configuration

Specify the component's default configuration in its `config.js` file. There's no blueprint, which means you can set the config options as you wish.

### Models

The language model you provide has to have every intent needed to get the component working. It shouldn't expect the user to have any kind of intent (e.g. `AMAZON.StopIntent`) or input type predefined. Its structure is the same as the language model you use in your default Jovo project.

### i18n

To allow the user to customize the component's responses easily, it is recommended to use the i18n integration instead of hard coding responses. For that it is also recommended to use a naming convention with a low chance of running into conflicts with the user's existing i18n keys. Here's an example where everything was stored inside an object with a distinct key:

```js
{
    "translation": {
        "component-phone-number": {
            "start-question": "Please tell me your phone number.",
            "fail-empty": " Sorry, I didn't get that. Could you please repeat your phone number?"
        }
    }
}
```

<!--[metadata]: {
  "description": "Learn how to utilize and build Conversational Components",
  "route": "components"
}-->