# Advanced Features

Learn more about features for advanced voice applications.

* [Staging](#staging)
   * [Staging Example](#staging-example)
* [Plugins](#plugins)
* [Testing](#testing)

## Staging

Jovo allows you to define multiple staging environments like `dev`, `test`, and `prod` in your `app.json`:

```javascript
{
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

In a stage, you can define elements that merge with the default options, for example `endpoint`, or whole objects like `alexaSkill` that include a `skillId` (see [Staging Example](#staging-example) below).

For example, if your endpoint usually is the Jovo Webhook for local development, you can define a different endpoint (e.g. a Lambda ARN) for the `dev` environment:

```javascript
{
    "endpoint": "${JOVO_WEBHOOK_URL}",
    "stages": {
        "dev": {
            "endpoint": "<your lambda arn>"    
        }
    }
}
```

Alternatively, you can also define a `defaultStage` if you prefer to have the default options organized in one place:

```javascript
{
    "defaultStage": "local",
    "stages": {
        "local": {
            "endpoint": "${JOVO_WEBHOOK_URL}",
        },
        "dev": {
            "endpoint": "<your lambda arn>"    
        }
    }
}
```

Different endpoints require changes to the platform specific files. You can build and deploy them for required stage with the following Jovo CLI commands:

```sh
# Uses default options or defaultStage, if set
$ jovo build

# Alternative: Uses dev stage
$ jovo build --stage dev

# Then: Deploy to platform
$ jovo deploy
```


The staging also offers the ability to overwrite `config` elements specified in the [App Configuration](../03_app-configuration/README.md#available-configurations './app-configuration#available-configurations') in your `app.js`. This way, you can change certain elements, like logging, analytics, or database integrations depending on the stage. Just add a `config` object to a stage like this:


```javascript
{
    "stages": {
        "dev": {
            "endpoint": "<your lambda arn>",
            "config": {
                "db": {
                    "type": "dynamodb",
                    "tableName": "<your table name>"
                }
            } 
        }
    }
}
```

To let the framework know which stage the app is currently in, you have two options:

1) Define an environment variable `STAGE=<your stage>` and change it according to the current stage. For example, this can be done in an `.env` file in the project directory. For AWS Lambda, you can define environment variable in the function configuration:

![Staging environment variable in AWS Lambda](../img/staging-env-lambda.png "How to set the stage variable in Lambda")

2) Update the `defaultStage` element in the `app.json`.

You can also reference environment variables in the `app.json` with `${process.env.<VARIABLE_NAME>}`:

```javascript
{
    "stages": {
        "dev": {
            "endpoint": "<your lambda arn>",
            "config": {
                "db": {
                    "type": "dynamodb",
                    "tableName": "${process.env.TABLE_NAME}"
                }
            } 
        }
    }
}
```


### Staging Example

Let's assume we want to build an Alexa Skill that has the following stages:

* A default option for local development that uses the [Jovo Webhook](../03_app-configuration/02_server/webhook.md#jovo-webhook './server/webhook#jovo-webhook') and the local [FileDB](../06_integrations/databases/README.md#filepersistence './databases#filepersistence') for fast prototyping. The Skill is deployed to the developer's Amazon developer account (`default` ASK profile).
* A `dev` stage that is hosted on [AWS Lambda](../03_app-configuration/02_server/aws-lambda.md './server/aws-lambda') with [DynamoDB](../06_integrations/databases/README.md#dynamodb './databases#dynamodb') as database. The Skill is deployed to the company's Amazon developer account (`company` ASK profile).

```javascript
{
    "alexaSkill": {
        "nlu": "alexa",
        "skillId": "amzn1.ask.skill.XXX"
    },
    "endpoint": "${JOVO_WEBHOOK_URL}",
    "stages": {
        "dev": {
            "endpoint": "arn:aws:lambda:us-east-1:XXX",
            "alexaSkill": {
                "skillId": "amzn1.ask.skill.YYY",
                "ask-profile": "company"
            },
            "config": {
                "db": {
                    "type": "dynamodb",
                    "tableName": "${process.env.TABLE_NAME}"
                }
            }
        }
    }
}
```

For the local development, it automatically grabs the user's Jovo Webhook url by using the placeholder `${JOVO_WEBHOOK_URL}`. For the `alexaSkill` object, there is no need to specify the `ask-profile`, as the `default` is used.

For the `dev` stage, an AWS Lambda ARN is used as `endpoint`. Additionally to a different `skillId`, the `company` profile is used for deployment to the Amazon Developer Portal. Also, this stage specifies a new `db` config that differs from the default FileDB and uses a table name referenced in the environment variables in Lambda: `${process.env.TABLE_NAME}`.

You can find even more examples in our [knowledge base article](../knowledge-base/staging-examples.md).

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


## Testing

You can now use the Jovo TestSuite to integrate unit tests into your voice app project.

```javascript
for (let rb of getPlatformRequestBuilder('AlexaSkill', 'GoogleActionDialogFlow')) {
    describe('LAUNCH_INTENT', function () {
        it('should successfully go into LaunchIntent for ' + rb.type(), function (done) {
            send(rb.launch())
                .then((res) => {
                    expect(res.isAsk('Hello World! What\'s your name?', 'Please tell me your name.')).to.equal(true);
                    done();
                });
        });
    });
}
```

Unit Testing is a feature that is currently in `beta`. For a sample project that uses testing, take a look at this GitHub repository: [milksnatcher/DefaultTests](https://github.com/Milksnatcher/DefaultTests).


<!--[metadata]: {"title": "Advanced Features", 
                "description": "Learn more about features for advanced voice applications with the Jovo Framework.",
                "activeSections": ["advanced", "advanced_index"],
                "expandedSections": "advanced",
                "inSections": "advanced",
                "breadCrumbs": {"Docs": "docs/",
				"Advanced Features": ""
                                },
		"commentsID": "framework/docs/advanced",
		"route": "docs/advanced"
                }-->
