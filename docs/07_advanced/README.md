# Advanced Features

Learn more about features for advanced voice applications.

* [Overview](#overview)
* [Staging](#staging)
* [Extending the Framework](#extending-the-framework)
* [Testing](#testing)

## Overview

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

## Extending the Framework

## Testing



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
