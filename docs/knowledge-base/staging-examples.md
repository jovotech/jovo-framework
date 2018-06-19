# Staging Examples

This page offers a selection of examples to learn how to deploy your Alexa Skill and Google Action to different environments. To learn more about the essentials of different stages, take a look at [App Configuration > app.json](../03_app-configuration/app-json.md '../app-json') and [Advanced Features > Staging](../07_advanced#staging '../advanced#staging').

* [Basic setup](#basic-setup)
* [Different endpoints](#different-endpoints)
* [Different platform projects](#different-platform-projects)

## Basic Setup

This is how your `app.json` could look like with three stages `local`, `dev`, and `prod` that use different endpoints (the Jovo webhook for local development and AWS Lambda for testing and production):

```javascript
{
	// Other configurations

  "stages": {
    "local": {
      "endpoint": "https://webhook.jovo.cloud/<your-unique-id>"
    },
    "dev": {
      "endpoint": "<your-lambda-dev-arn>"
    },
    "prod": {
      "endpoint": "<your-lambda-prod-arn>"
    }
  }
}
```

You now have two options to specify which stage is in use:

* Add a `defaultStage` and update it accordingly, 
* Specify the stage in your environment variables, e.g. `STAGE=dev`.

You can add a `defaultStage` like this:

```javascript
{
	// Other configurations

  "defaultStage": "local",
  "stages": {
    "local": {
      "endpoint": "https://webhook.jovo.cloud/<your-unique-id>"
    },
    "dev": {
      "endpoint": "<your-lambda-dev-arn>"
    },
    "prod": {
      "endpoint": "<your-lambda-prod-arn>"
    }
  }
}
```

As the content inside the active stage is just merged into the other "stage-less" elements, there is no need to define a default stage for local, you can alternatively just define an endpoint and then override it for different stages:

```javascript
{
	// Other configurations

  "endpoint": "https://webhook.jovo.cloud/<your-unique-id>",
  "stages": {
    "dev": {
      "endpoint": "<your-lambda-dev-arn>"
    },
    "prod": {
      "endpoint": "<your-lambda-prod-arn>"
    }
  }
}
```

You can then update the platform specific files by using the `jovo build` command:

```sh
$ jovo build --stage dev
```

## Different Endpoints

The basic setup from above has one main problem: If you want to have both an Alexa Skill and a Google Action, you can't just use a Lambda ARN as an endpoint, you need to make it accessible with an API Gateways. This way you need to have different endpoints for both projects.

Here's how you can do it with a basic setup:

```javascript
{
	// Other configurations

  "endpoint": "https://webhook.jovo.cloud/<your-unique-id>",
  "stages": {
    "dev": {
      "alexaSkill": {
        "endpoint": "<your-lambda-dev-arn>"
      },
      "googleAction": {
        "dialogflow": {
          "endpoint": "<your-api-gateway-dev-link>"
        }
      }
    },
    "prod": {
      "alexaSkill": {
        "endpoint": "<your-lambda-prod-arn>"
      },
      "googleAction": {
        "dialogflow": {
          "endpoint": "<your-api-gateway-prod-link>"
        }
      }
    }
  }
}
```
As the Jovo CLI uses ASK CLI to deploy to Lambda, it is sufficient for deployment if only the Alexa `endpoint` references the Lambda function, because this is the one passed to ASK CLI. For a little more structure, however, you can also use the newly introduced `host` object and define which `askProfile` to use to deploy it:

```javascript
{
	// Other configurations

  "endpoint": "https://webhook.jovo.cloud/<your-unique-id>",
  "stages": {
    "dev": {
      "host": {
        "lambda": {
          "arn": "<your-lambda-dev-arn>",
          "askProfile": "<your-ask-cli-dev-profile>"
        }
      },
      "alexaSkill": {
        
      },
      "googleAction": {
        "dialogflow": {
          "endpoint": "<your-api-gateway-dev-link>"
        }
      }
    },
    "prod": {
      "host": {
        "lambda": {
          "arn": "<your-lambda-prod-arn>",
          "askProfile": "<your-ask-cli-prod-profile>"
        }
      },
      "alexaSkill": {
        
      },
      "googleAction": {
        "dialogflow": {
          "endpoint": "<your-api-gateway-prod-link>"
        }
      }
    }
  }
}
```

The above examples will add different endpoints to the `/platforms` folder project files by using the `$ jovo build --stage <your-stage>` command. To deploy the files to the right Lambda function, use `$ jovo deploys --stage <your-stage>`.

## Different Platform Projects

You may also want to use different platform projects (e.g. Alexa Skill IDs and Google Action project IDs) for different stages. You can do this like so:

```javascript
{
	// Other configurations

  "endpoint": "https://webhook.jovo.cloud/<your-unique-id>",
  "stages": {
    "dev": {
      "host": {
        "lambda": {
          "arn": "<your-lambda-dev-arn>",
          "askProfile": "<your-ask-cli-dev-profile>"
        }
      },
      "alexaSkill": {
        "skillId": "<your-dev-skill-id>"
      },
      "googleAction": {
        "dialogflow": {
          "endpoint": "<your-api-gateway-dev-link>",
          "projectId": "<your-dev-project-id>",
          "keyFile": "<path-to-dev-key-file>"
        }
      }
    },
    "prod": {
      "host": {
        "lambda": {
          "arn": "<your-lambda-prod-arn>",
          "askProfile": "<your-ask-cli-prod-profile>"
        }
      },
      "alexaSkill": {
        "skillId": "<your-prod-skill-id>"
      },
      "googleAction": {
        "dialogflow": {
          "endpoint": "<your-api-gateway-prod-link>",
          "projectId": "<your-prod-project-id>",
          "keyFile": "<path-to-prod-key-file>"
        }
      }
    }
  }
}
```

Again, the above examples will add different endpoints to the `/platforms` folder project files by using the `$ jovo build --stage <your-stage>` command. To deploy the files to the right Lambda function, use `$ jovo deploys --stage <your-stage>`.

<!--[metadata]: {"title": "Staging Examples", 
                "description": "Learn how to deploy your Alexa Skill and Google Action to different environments",
                "activeSections": ["kb"],
                "expandedSections": "kb",
                "inSections": "kb",
                "breadCrumbs": {"Docs": "docs",
				"Knowledge Base": "docs/kb"
                                },
		"commentsID": "framework/docs/kb/staging-examples",
		"route": "docs/kb/staging-examples"
                }-->
