# jovo get

Learn how to import an existing Alexa Skill or Google Action into Jovo with the `jovo get` CLI command.

* [Introduction](#introduction)



## Introduction

![jovo get command](../img/jovo-get.png "jovo get command")

`jovo get` will import an existing Alexa Skill (Skill Information and Interaction Model) or Dialogflow agent (work in progress) into the `/platforms` folder. 

To get the Skill from the Amazon developer console, you have to set up [ASK CLI](https://developer.amazon.com/docs/smapi/quick-start-alexa-skills-kit-command-line-interface.html) first.

```sh
# Choose from list of Skills
$ jovo get <alexaSkill|googleAction>

# Get specific Alexa Skill using the Skill ID
$ jovo get alexaSkill --skill-id <skill ID>

# Get specific Dialogflow agent using the Project ID
# Coming soon
$ jovo get googleAction --project-id <project ID>

# Options
$ jovo get alexaSkill [-s | --skill-id <skill ID>] [--project-id <project ID>] [-l | --locale] [--list-skills] [--ask-profile] [-t | --target <target>] [--stage <stage>] [-r | --reverse] [-b | --build]
```

**Options**

`--skill-id`, `-s`: Get specific Alexa Skill using the Skill ID.

`--project-id`: Get a specific Dialogflow agent using the Project ID.

`--locale`, `-l`: Specify the locale, which should be created/updated. Default: all languages available for the Skill.

`--list-skills`: Shows a list of all available Skill projects for the specific ASK Profile.

`--ask-profile`: Specifies which profile set up in [ASK CLI](https://developer.amazon.com/docs/smapi/quick-start-alexa-skills-kit-command-line-interface.html) should be used to get the information. Default: `default`.

`--target`, `-t`: Specifies which information should be fetched from the Skill. Arguments: `info` (Skill Information), `model` (Interaction Model), `all`. Default: `all`.

`--stage`: Specify the stage where the configuration will be taken from.

`--reverse`, `-r`: Builds the Jovo language model out of the platform's language model.

`--build`, `-b`: Only works in combination with `--reverse`. Will run `jovo build` after reversing the platform's language model.


#### jovo deploy

![jovo deploy command](../img/jovo-deploy.png "jovo deploy command")

`jovo deploy` is used to upload the platform folders to their respective developer consoles. 

To deploy to the Amazon developer console, you have to set up [ASK CLI](https://developer.amazon.com/docs/smapi/quick-start-alexa-skills-kit-command-line-interface.html) first.

To deploy a Dialogflow agent you have 2 options:
* Import the dialogflow_agent.zip file into your Dialogflow agent (we recommend using the option RESTORE)
* If you're using the Dialogflow v2 API (default since April 17, 2018), you can also deploy the agent directly to the platform. Learn more here: [Deploy a Dialogflow Agent with the Jovo CLI](../knowledge-base/deploy-dialogflow-agent.md './kb/deploy-dialogflow-agent')

To learn more about how to deploy your app to AWS Lambda, take a look here: [Deploy your Voice App to AWS Lambda with the Jovo CLI](../knowledge-base/deploy-lambda-cli.md './kb/deploy-lambda-cli').

```sh
# Default
$ jovo deploy

# Deploy Dialogflow agent
$ jovo deploy --project-id <project ID>

# Options
$ jovo deploy --platform <platform> [--project-id <project ID>] [-l | --locale <locale>] [-t | --target <target>] [--stage <stage>] [-s | --src <src>] [--endpoint <endpoint>] [--ask-profile <profileName>]
```
**Options**:

`--platform`, `-p`: Specify the platform that should be deployed. Arguments: `googleAction` or `alexaSkill` Default: Every platform found in the `/platforms` folder.

`--project-id`: Determine, which project to deploy to.

`--locale`, `-l`: Specify the locale that should be deployed. Default: Every locale found for each platform.

`--target`, `-t`: Specify, what type of information to deploy. Arguments: `info` (for Skill or Agent information), `model` (for language models), `lambda` (for AWS Lambda deployment), `all`. Default: all.

`--stage`: Specify the stage where the configuration will be taken from.

`--src`, `-s`: Path to source files. Default: project directory.

`--endpoint`: Type of endpoint. Arguments: `jovo-webhook`, `bst-proxy`, `ngrok` or `none`. Default: `jovo-webhook`.

`--ask-profile`: Specifies which profile set up in [ASK CLI](https://developer.amazon.com/docs/smapi/quick-start-alexa-skills-kit-command-line-interface.html) should be used to deploy. Default: `default`.

<!--[metadata]: {"description": "Learn how to import an existing Alexa Skill or Google Action into Jovo with the jovo get CLI command.",
                "route": "cli/get"}-->
