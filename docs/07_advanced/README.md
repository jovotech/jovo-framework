# Advanced Features

Learn more about features for advanced voice applications.

* [Staging](#staging)
* [Plugins](#plugins)
* [Testing](#testing)

## Staging

If you want to use several stages like `dev`, `test`, and `prod` in your development environment, you can do so by adding them to your `app.json`.

```javascript
{
    "defaultStage": "dev",
    "stages": {
        "dev": {
            
        },
        "test": {
            
        },
        "prod": {

        }
    }
}
```
In a stage, you can define elements that overwrite the default option, for example `endpoint`, or whole objects like `alexaSkill` that include a `skillId` (see [Staging Example](#staging-example) below).

The staging also offers the ability to overwrite `config` elements specified in the [App Configuration](../03_app-configuration/README.md#available-configurations) in your `app.js`. This way, you can change certain elements, like logging, analytics, or database integrations depending on the stage. Just add a `config` object to a stage like this:


```javascript
{
    "defaultStage": "dev",
    "stages": {
        "dev": {
            
        },
        "test": {
            "config": {
                
            }
        },
        "prod": {

        }
    }
}
```
See the example below for more details.

### Staging Example

Let's assume we want to build an Alexa Skill that has the following stages:

* A `dev` stage that uses the [Jovo Webhook](../03_app-configuration/02_server/webhook.md#jovo-webhook) and the local [FileDB](../06_integrations/databases/README.md#filepersistence) for fast prototyping. The Skill is deployed to the developer's Amazon developer account (`default` ASK profile).
* A `test` stage that is hosted on [AWS Lambda](../03_app-configuration/02_server/aws-lambda.md) with [DynamoDB](../06_integrations/databases/README.md#dynamodb) as database. The Skill is deployed to the company's Amazon developer account (`company` ASK profile).

```javascript
{
    "alexaSkill": {
        "nlu": "alexa"
    },
    "defaultStage": "dev",
    "stages": {
        "dev": {
            "endpoint": "${JOVO_WEBHOOK_URL}",
            "alexaSkill": {
                "skillId": "amzn1.ask.skill.XXX"
            }
        },
        "test": {
            "endpoint": "arn:aws:lambda:us-east-1:XXX",
            "alexaSkill": {
                "skillId": "amzn1.ask.skill.YYY",
                "ask-profile": "company"
            },
            "config": {
                "db": {
                    "type": "dynamodb",
                    "tableName": "SomeTableName"
                }
            }
        }
    }
}
```

For the `dev` stage, it automatically grabs the user's Jovo Webhook url by using the placeholder `${JOVO_WEBHOOK_URL}`. For the `alexaSkill` object, there is no need to specify the `ask-profile`, as the `default` is used.

For the `test` stage, an AWS Lambda ARN is used as `endpoint`. Additionally to a different `skillId`, the `company` profile is used for deployment to the Amazon Developer Portal. Also, this stage specifies a new `db` config that differs from the default FileDB.

## Plugins

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
app.register('PluginName', new PluginName());

// If you define options in your constructor
app.register('PluginName', new PluginName(options));
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
 | | ShowSimpleCard | `this.app.on('showSimpleCard')` | `jovo`, `title`, `content`
 | | ShowImageCard | `this.app.on('showImageCard')` | `jovo`, `title`, `content`, `imageUrl`
 | | ShowAccountLinkingCard | `this.app.on('showAccountLinkingCard')` | `jovo`



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


## Testing

Unit Testing is a feature that is currently in `beta`. For a sample project that uses testing, take a look at this GitHub repository: [milksnatcher/jovo-framework-test](https://github.com/milksnatcher/jovo-framework-test/).


<!--[metadata]: {"title": "Advanced Features", 
                "description": "Learn more about features for advanced voice applications with the Jovo Framework.",
                "activeSections": ["advanced", "advanced_index"],
                "expandedSections": "advanced",
                "inSections": "advanced",
                "breadCrumbs": {"Docs": "framework/docs",
				"Advanced Features": ""
                                },
		"commentsID": "framework/docs/advanced"
                }-->
