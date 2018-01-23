# App Configuration

In this section, you will learn more about the essential configurations of a Jovo Voice App.

* [Jovo App Structure](#jovo-app-structure)
  * [Index.js - Server Configuration](#index.js---server-configuration)
  * [App.js - Application Logic](#app.js---application-logic)
  * [Models - Language Model](#models---language-model)
* [How to Add Configurations](#how-to-add-configurations)
  * [Available Configurations](#available-configurations)


## Jovo App Structure
A Jovo voice app is divided into three main building blocks: [`index.js`](https://github.com/jovotech/jovo-patterns/blob/master/hello-world/hello-world/index.js), [`app.js`](https://github.com/jovotech/jovo-patterns/blob/master/hello-world/hello-world/app/app.js) and [`models`](https://github.com/jovotech/jovo-patterns/blob/master/hello-world/hello-world/models/en-US.json).

### Index.js - Server Configuration
Everything related to running your voice application, either in Lambda or using a webhook (recommended for local prototyping), is dealt with in [`index.js`](https://github.com/jovotech/jovo-patterns/blob/master/hello-world/hello-world/index.js). 

```javascript
'use strict';

const {Webhook} = require('jovo-framework');
const {app} = require('./app/app.js');

// =================================================================================
// Server Configuration
// =================================================================================

if (isWebhook()) {
    const port = process.env.PORT || 3000;
    Webhook.listen(port, () => {
        console.log(`Example server listening on port ${port}!`);
    });
    Webhook.post('/webhook', (req, res) => {
        app.handleWebhook(req, res);
    });
}

exports.handler = (event, context, callback) => {
    app.handleLambda(event, context, callback);
};
```
You can find all the information regarding server configuration in this section: [App Configuration > Server](https://github.com/jovotech/jovo-framework-nodejs/tree/master/docs/02_app-configuration/server).

### App.js - Application Logic
[`App.js`]() is used for the logic of your voice application, which contains handlers, intents and the configuration of your voice app (we will get to that shortly). 

```javascript
'use strict';

// =================================================================================
// App Configuration
// =================================================================================

const {App} = require('jovo-framework');

const config = {
    logging: true,
};

const app = new App(config);


// =================================================================================
// App Logic
// =================================================================================

app.setHandler({
    'LAUNCH': function() {
        this.toIntent('HelloWorldIntent');
    },

    'HelloWorldIntent': function() {
        this.ask('Hello World! What is your name?', 'Please tell me your name.');
    },

    'MyNameIsIntent': function(name) {
        this.tell('Hey ' + name + ', nice to meet you!');
    },
});

module.exports.app = app;
```

You can find everythign related to the app logic here: [App Logic](https://github.com/jovotech/jovo-framework-nodejs/tree/master/docs/03_app-logic).

### Models - Language Model
The models folder contains the Jovo language model, which can be used to create and update platform specific language models using the [`Jovo CLI`](LINK ZU JOVO CLI FOLDER). The idea is to maintain a single language model instead of multiple ones for every platform you choose to deploy your voice application to. 

```javascript
{  
    "invocation":"jovo beta",
    "intents":[  
        {  
            "name":"HelloWorldIntent",
            "phrases":[  
                "hello",
                "say hello",
                "say hello world"
            ]
        },
        {  
            "name":"MyNameIsIntent",
            "phrases":[  
                "{name}",
                "my name is {name}",
                "i am {name}",
                "you can call me {name}"
            ],
            "inputs":[  
                {  
                    "name":"name",
                    "type":{  
                        "alexa":"AMAZON.US_FIRST_NAME",
                        "dialogflow":"@sys.given-name"
                    }
                }
            ]
        }
    ],
    "alexa":{  
        "interactionModel":{  
            "languageModel":{  
                "intents":[  
                    {  
                        "name":"AMAZON.CancelIntent",
                        "samples":[  

                        ]
                    },
                    {  
                        "name":"AMAZON.HelpIntent",
                        "samples":[  

                        ]
                    },
                    {  
                        "name":"AMAZON.StopIntent",
                        "samples":[  

                        ]
                    }
                ]
            }
        }
    }
}
```

You can find out more about that here [App Logic > Models]()

## How to Add Configurations
To add configurations, you have two options: You can either add them at the beginning of [`app.js`](#app.js) in the constructor or you use the setter function of each configuration.

You can find a list of all [available configurations below](#available-configurations).

To add them with the constructor you simply change the content of the config object at the beginning of [`app.js`](#app.js):

```javascript
const config = {
    requestLogging: true,
    responseLogging: true,
    // Add other configurations
};

const app = new App(config);
```

The other possibility is to use one of the setter functions:

```javascript
// Enable logging with setters
app.enableRequestLogging();
app.enableResponseLogging();
```

This is the default configuration:

```javascript
const config = {
    logging: false,
    requestLogging: false,
    responseLogging: false,
    requestLoggingObjects: [],
    responseLoggingObjects: [],
    saveUserOnResponseEnabled: true,
    userDataCol: 'userData',
    inputMap: {},
    intentMap: {},
    intentsToSkipUnhandled: [],
    saveBeforeResponseEnabled: false,
    allowedApplicationIds: [],
    db: {
        type: 'file',
        localDbFilename: 'db',
    },
    userMetaData: {
        lastUsedAt: true,
        sessionsCount: true,
        createdAt: true,
        requestHistorySize: 0,
        devices: false,
    },
    i18n: {
        overloadTranslationOptionHandler: sprintf.overloadTranslationOptionHandler,
        load: 'all',
    },
    analytics: {
        intentsToSkip: [],
        usersToSkip: [],
        services: {},
    },
};
```


### Available Configurations

Below is a list of all configurations:

Category | Name | Description | Docs
:--- | :--- | :--- | :---
Routing | intentMap | Maps incoming intents to specified intent names | [📝](https://github.com/jovotech/jovo-framework-nodejs/tree/master/docs/01_routing#intentmap)
 | | intentsToSkipUnhandled | Intents which should not be mapped to 'Unhandled' when not found in a certain state | [📝](https://github.com/jovotech/jovo-framework-nodejs/tree/master/docs/01_routing#intentstoskipunhandled)
Data | inputMap | Maps incoming input (slots and parameters) to specified input names | [📝](https://github.com/jovotech/jovo-framework-nodejs/tree/master/docs/02_data#inputmap)
 | | logging | Logs both requests and responses | [📝](https://github.com/jovotech/jovo-framework-nodejs/tree/master/docs/02_data#logging)
 | | requestLogging | Logs incoming requests | [📝](https://github.com/jovotech/jovo-framework-nodejs/tree/master/docs/02_data#log-requests)
 | | responseLogging | Logs outgoing responses | [📝](https://github.com/jovotech/jovo-framework-nodejs/tree/master/docs/02_data#log-responses)
 | | requestLoggingObjects | Limits request logs to the provided objects | [📝](https://github.com/jovotech/jovo-framework-nodejs/tree/master/docs/02_data#request-logging-objects)
 | | responseLoggingObjects | Limits response logs to the provided objects | [📝](https://github.com/jovotech/jovo-framework-nodejs/tree/master/docs/02_data#response-logging-objects)
User | userDataCol | Changes the name of the user data column in the database | [📝](https://github.com/jovotech/jovo-framework-nodejs/tree/master/docs/02_data/user.md#user-data)
 | | userMetaData | Change the default configurations for storing user meta data | [📝](https://github.com/jovotech/jovo-framework-nodejs/tree/master/docs/02_data/user.md#user-meta-data)
Output | i18n | Enable multilingual output for your voice app | [📝](https://github.com/jovotech/jovo-framework-nodejs/blob/master/docs/03_app-logic/i18n.md#configuration)
Integrations | Databases | Switch between supported database integrations | [📝](https://github.com/jovotech/jovo-framework-nodejs/tree/master/docs/06_integrations/databases)
 | | Analytics | Enable analytics integrations | [📝](https://github.com/jovotech/jovo-framework-nodejs/tree/master/docs/06_integrations/analytics)
