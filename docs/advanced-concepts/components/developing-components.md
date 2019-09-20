# Developing Conversational Components

Get an overview on how to develop your own Conversational Components.

* [Developing Conversational Components](#developing-conversational-components)
  * [Handler](#handler)
  * [Configuration](#configuration)
  * [Models](#models)
  * [i18n](#i18n)
  * [Components using Components](#components-using-components)
    * [Installation](#installation)
    * [Configuration](#configuration-1)
    * [General Usage](#general-usage)

You're component has to have the whole package of language model, handler, configuration and i18n for people to be able to use it. We will skip, the general description of each of these blocks and go into more detail about the small stuff that's important to develop components. You can revisit the basics [here](./README.md 'components').

> You can find an example of a basic Conversational Component [here](https://github.com/jovotech/jovo-component-get-phone-number).

## Handler

The component's handler has to be inside a state, which is named after the component, so you don't overwrite any of the user's own intents:

```js
// @language=javascript
// src/handler.js

module.exports = {
    GetPhoneNumber: {
        // intents and states
    }
};
```

Also, every component has to have a `START` intent at its root, which the system will route to on delegation. That intent can be used to initialize any kind of data you will need throughout the component as well as begin the conversation with the user:

```js
// @language=javascript
// src/handler.js

module.exports = {
    GetPhoneNumber: {
        START() {
            // initialize COMPONENT_GetPhoneNumber object which will be used to store session attributes needed for the component,
            // so we don't overlap with the user's existing session attributes
            this.$session.$data.COMPONENT_GetPhoneNumber = {};
            this.$speech.t('start');

            this.ask(this.$speech);
        }
    }
};
```

At the time the component finished, or if there was an error, or the user tried to stop the app, you have to send the component's response using `sendComponentResponse(response)` function. The `response` object has to have the following interface:

Name | Description | Value | Required 
--- | --- | --- | ---
`status` | Represents the status of the component. Will be set to `SUCCESSFUL` if the component managed to collect the data without problems. Will be set to `REJECTED` if the user tried to stop the app at any point, e.g. *Alexa, stop*. Will be set `ERROR` if an error occurred at some point. | Either `SUCCESSFUL`, `REJECTED`, or `ERROR` | Yes
`data` | An object containing the data the component was supposed to collect. The content of the object will be different for each component | `object` | Yes
`error` | An error object, which is only present if the status is set to `ERROR` | `Error` | Yes, if there was an error

```js
// @language=javascript
const response = {
    status: 'SUCCESSFUL',
    data: {
        phoneNumber: '0123456789'
    }
};

this.sendComponentResponse(response);
```

Besides that, it's recommended to include an `ON_ERROR`, `END` and `Unhandled` intent.

In this case of `ON_ERROR` and `END` you should route back to the `onCompletedIntent` just like above, but set the status to `ERROR` or `REJECTED` respectively:

```js
// @language=javascript
// src/handler.js

END() {
    const response = {
        status: 'REJECTED',
    };

    this.sendComponentResponse(response);
},

ON_ERROR() {
    const response = {
        status: 'ERROR',
        error: this.$handleRequest.error;
    };

    this.sendComponentResponse(response);
},

Unhandled() {
    return this.toIntent('HelpIntent');
},
```

## Configuration

Specify the component's default configuration in its `config.js` file. There's no blueprint, which means you can set the config options as you wish, but you should always include an [intentMap](../../basic-concepts/routing/intents.md#intentMap 'routing/intents#intentMap') for your handler.

```js
// @language=typescript
// config.ts
import { ComponentConfig } from 'jovo-framework';

interface SurveyConfig extends ComponentConfig {
    numberOfQuestions: number;
}

const config: SurveyConfig = {
    intentMap: {
        'AMAZON.HelpIntent': 'HelpIntent',
        'AMAZON.StopIntent': 'END',
        'StopIntent': 'END'
    },
    numberOfQuestions: 3
};

export {SurveyConfig, config as Config};
```

## Models

The language model you provide has to have every intent needed to get the component working. It shouldn't expect the user to have any kind of intent (e.g. `AMAZON.StopIntent`) or input type predefined. Its structure is the same as the language model you use in your default Jovo project, besides the invocation name

```js
{
	"intents": [
		{
			"name": "AnswerIntent",
			"phrases": [
				"{answer}",
				"I'd say {answer}",
				"I would say {answer}",
				"it is a {answer}",
				"it's a {answer}"
			],
			"inputs": [
				{
					"name": "answer",
					"type": {
						"alexa": "AMAZON.NUMBER",
						"dialogflow": "@sys.number"
					}
				}
			]
		},
        {
			"name": "HelpIntent",
			"alexa": {
				"name": "AMAZON.HelpIntent"
			},
			"phrases": [
				"help",
				"help me",
				"i don't understand this",
				"i need help",
				"what do you mean",
				"what does that mean",
				"how",
				"why"
			]
		},
		{
			"name": "StopIntent",
			"phrases": [
				"stop",
				"cancel",
				"stop the app"
			],
			"alexa": {
				"name": "AMAZON.StopIntent"
			},
			"dialogflow": {
				"events": [
					{
						"name": "actions_intent_CANCEL"
					}
				]
			}
		}
	]
}
```

## i18n

To allow the user to customize the component's responses easily, it is recommended to use the i18n integration instead of hard coding responses. For that it is also recommended to use a naming convention with a low chance of running into conflicts with the user's existing i18n keys. Here's an example where everything was stored inside an object with a distinct key:

```js
{
    "translation": {
        "component-GetPhoneNumber": {
            "start-question": "Please tell me your phone number.",
            "fail-empty": " Sorry, I didn't get that. Could you please repeat your phone number?"
        }
    }
}
```

## Components using Components

Naturally, components can use components as well. But, the process is slightly different from the usage with a normal Jovo project. In the next bit, we will run through the process of integrating a component within a component.

### Installation

Again, the component has to be installed using npm and saved as a dependency:

```sh
$ npm install --save jovo-component-get-phone-number
```

After that, you add the component to your own component by calling the `useComponents(...components)` function inside your component's constructor:

```js
// @language=typescript
// index.ts

export class TestComponent1 extends ComponentPlugin {
    // ...

    constructor(config?: PluginConfig) {
        super(config);

        this.useComponents(new TestComponent2());
    }
}
```

With all these set, the Jovo CLI and framework will load your component's component's files on `load` and add it to the project's active components.

### Configuration

Configuration of n-th layer components work in a strict hierarchy. Let's say we have two components: component A and component B, where component A uses B.

At the very bottom of our configuration is component B's own default configuration. After that, we merge the configuration that the developer of component A made into the default config of component B.

Component A adds its configuration using its own config file using the name of component B:

```js
// @language=javascript
// component A config.js

import { ComponentConfig } from 'jovo-framework';
import { TestComponent2Config } from 'TestComponent2';

interface SurveyConfig extends ComponentConfig {
    numberOfQuestions: number;
    TestComponent2: TestComponent2Config
}

const config: SurveyConfig = {
    intentMap: {
        'AMAZON.HelpIntent': 'HelpIntent',
        'AMAZON.StopIntent': 'END',
        'StopIntent': 'END'
    },
    numberOfQuestions: 3
    TestComponent2: {
        // ...
    }
};

export {SurveyConfig, config as Config};
```

Now, the only one left is the end user, who can also make changes. Their configuration will merged as the very last, which means it can overwrite anything.

```js
// user's project's config.js

module.exports = {
   logging: true,
    intentMap: {
        'AMAZON.HelpIntent': 'HelpIntent',
    },
    db: {
        FileDb: {
            pathToFile: './../db/db.json'
        }
    },
    components: {
        TestComponent1: {
            // TestComponent1 configuration
            TestComponent2: {
                // configuration of TestComponent2
            }
        }
    }
};
```

The deeper the nesting of components using components, the deeper the configuration will be as well.

### General Usage

There's no difference here. Inside your component's handler you can simply delegate to the component, the same way you would do it in a normal Jovo project. 

<!--[metadata]: {
  "description": "Learn how to develop your own Conversational Components",
  "route": "components/developing-components"
}-->