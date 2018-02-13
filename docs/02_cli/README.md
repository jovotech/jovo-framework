# Jovo CLI

> Other pages in this category: [Workflows](./workflows.md).

The Jovo Command Line Tools offer the ability to create, prototype, test, and deploy your voice app quickly.

* [Introduction](#introduction)
* [Installation](#installation)
  * [Troubleshooting](#troubleshooting)
* [Commands](#commands)
  * [Basic Commands](#basic-commands)
    * [jovo new](#jovo-new)
    * [jovo run](#jovo-run)
  * [Platform Commands](#platform-commands)
    * [jovo init](#jovo-init)
    * [jovo build](#jovo-build)
    * [jovo get](#jovo-get)
    * [jovo deploy](#jovo-deploy)


## Introduction

The Jovo CLI (GitHub Repository: [jovotech/jovo-cli](https://github.com/jovotech/jovo-cli)) is the center of voice app development with the Jovo Framework. With it, you can quickly create new Jovo projects, create language models and deploy them to the voice platforms, and run your voice apps locally for easy prototyping and testing.

## Installation

To make best use of the Jovo CLI, install it globally via npm:

```sh
$ npm install -g jovo-cli
```

After successful installation, you should be able to see the jovo menu by just typing the following into your command line:

```sh
$ jovo
```

You can check the version number (and compare it to the [jovo-cli npm package](https://www.npmjs.com/package/jovo-cli) version) with this command:

```sh
$ jovo -V
```

### Troubleshooting

Find out more about technical requirements here: [Getting Started > Installation](../01_getting-started#technical-requirements).

If you had the CLI installed before the release of `v1.0`, and are running into problems after updating it to the newest version, please try to uninstall it globally before you install it again:

```sh
$ npm uninstall -g jovo-cli
```

If you run into other problems, please submit an issue here: [jovotech/jovo-cli](https://github.com/jovotech/jovo-cli). Thank you! 

## Commands

Jovo CLI commands can be divided into [basic commands](#basic-commands) (to create and run projects) and [platform commands](#platform-commands) (to interact with a voice platform).

|| Command | Description 
------------ | ------------ | ------------- 
[Basic Commands](#basic-commands) | [`jovo new`](#jovo-new) | Creates a new Jovo project || [`jovo run`](#jovo-run) | Runs a local development server (webhook)
|| [`jovo run`](#jovo-run) | Runs a local development server (webhook)
[Platform Commands](#platform-commands) | [`jovo init`](#jovo-init) | Initializes platform-specific projects in `app.json`
| | [`jovo build`](#jovo-build) | Builds platform-specific language model files into `/platforms` based on  `/models` folder
|| [`jovo get`](#jovo-get) | Downloads an existing platform project into the `/platforms` folder
|| [`jovo deploy`](#jovo-deploy) | Deploys the `/platforms` project files to the voice platforms


### Basic Commands

These are the basic commands that help you develop Jovo voice apps faster, without interacting with the voice platforms (see [platform commands](#platform-commands) for features that are language model specific).

#### jovo new

![jovo new command](../img/jovo-new.png "jovo new command")

You can create a Jovo project into a new directory with the following command:

```sh
## Default
$ jovo new <directory>

## Options
$ jovo new <directory> [-t | --template <template-name>] [-l | --locale <en-US | de-DE | etc.>] 
  [-b | --build <alexaSkill | googleAction>] [-d | --deploy]
```
**Options**

`--template`, `-t`: Used to specify which template should be used. Get a list of all the templates below, or on GitHub: [jovotech/jovo-templates](https://github.com/jovotech/jovo-templates). Default: `helloworld`.

`--locale`, `-l`: Choose the language of the interaction models in the `/models` folder. Default: `en-US`.

`--init`, `-i`: This is a shortcut to the [`jovo init`](#jovo-init) command. Speed up the creation of your voice application by creating the `app.json` file right at the beginning. Requires either `alexaSkill` or `googleAction` as argument.

`--build`, `-b`: This is a shortcut to the [`jovo build`](#jovo-build) command. Speed up the creation of your voice application by building the platform specific files into the `/platforms` folder right at the beginning. Requires `--init` before.

`--deploy`, `-d`: This is a shortcut to the [`jovo deploy`](#jovo-deploy) command. Deploy the platform files to their respective developer console. It will deploy to the platform you specified with the `--init` and `--build` options.

**Templates**

Below is a list of templates that can currently be used with the `jovo new` command.

You can find the complete repository on GitHub: [jovotech/jovo-templates](https://github.com/jovotech/jovo-templates).

Name | Description 
:--- | :---
[`helloworld`](https://github.com/jovotech/jovo-templates/01_helloworld) | `Default`. Jovo Sample Voice App with a simple "Hello World!" + asking for the user's name
[`alexa-audioplayer`](https://github.com/jovotech/jovo-templates/02_alexa-audioplayer) | Sample Alexa Audioplayer Skill that plays a longform audio file with the Audioplayer directive


#### jovo run

![jovo run command](../img/jovo-run.png "jovo run command")

You can use the `jovo run` command to start the development server in your `index.js` file, and then add the [Jovo Webhook](../03_app-configuration/02_server/webhook#jovo-webhook) as an endpoint to the respective developer consoles.

Learn more here: [App Configuration > Server Configuration](../03_app-configuration/server).

```sh
# Default
$ jovo run

# Options
$ jovo run [-b | --bst-proxy] [-w | --watch] [-p, --port <port>]
```

You can also specify the file you want to run:
```sh
$ jovo run <file>

# Example
$ jovo run index.js

# Alternative
$ node index.js
```

You can also use other tools like [bst proxy](#bst-proxy) to tunnel to your local server.

**Options**

`--port`, `-p`: Defines the port that will be used to run the local development server. Default: `3000`.

**Integrations**

> If you want to see another integration, please feel free to [submit an issue](https://github.com/jovotech/jovo-cli/issues). Thanks!

Here is a list of integrations that work with `jovo run`:

Command | Description 
------------ | ------------- 
[`--bst-proxy`](#bst-proxy) | Creates a webhook URL for local testing and integrates with [Bespoken Analytics](../06_integrations/analytics)
[`--watch`](#watch) | Uses `nodemon` to monitor changes and automatically restart the server


##### bst proxy

You can use the bst proxy to create a webhook URL easily:

```sh
$ jovo run --bst-proxy
```

The result should look like this:

![Jovo and bst proxy](../img/terminal-bst-proxy-1.jpg)

The URL also comes with logging and analytics capabilities for prototyping and testing.

##### watch

With this integration, you don't have to manually restart your server with every change you make to the application:

```sh
$ jovo run --watch
```

For this, we're using [`nodemon`](https://github.com/remy/nodemon), a neat package that monitors your app files and automatically restarts the server.


### Platform Commands

Platform commands are used to interact with the voice platforms (Amazon Alexa or Google Assistant/Dialogflow). You don't have to use these commands if you just want to maintain the language/interaction models on the respective developer platforms.

See the following tutorials for alternative ways to create language models on the respective developer platforms:

* [Alexa Skill Beginner Tutorial](https://www.jovo.tech/blog/alexa-skill-tutorial-nodejs/) 
* [Google Action Beginner Tutorial](https://www.jovo.tech/blog/google-action-tutorial-nodejs/)

#### jovo init

![jovo init command](../img/jovo-init.png "jovo init command")

`jovo init` is the command to initialize a voice platform project to use with the Jovo Framework. This will create or update a file `app.json` with all the information needed to later [`build`](#jovo-build) the language models.

To create it, use the following command: 

```sh
# Default
$ jovo init <alexaSkill | googleAction>

# Options
$ jovo init <alexaSkill | googleAction> [-e | --endpoint <jovo-webhook | ngrok | bst-proxy>]
```
The resulting `app.json` file looks like this:

```javascript
{
  "alexaSkill": {
    "nlu": "alexa"
  },
  "googleAction": {
    "nlu": {
      "name": "dialogflow",
      "version": 1
    }
  },
  "endpoint": "https://webhook.jovo.cloud/[jovo-endpoint-id]"
}
```
Currently, the platform `nlu` (natural language understanding) services are:
* Amazon Alexa: The built-in `alexa` interaction model
* Google Assistant: `dialogflow` API version `1`

The default `endpoint` uri is automatically generated and provides a simple solution to run a local webserver for easy debugging. Learn more here: [App Configuration > Server Configuration > Webhook](../03_app-configuration/02_server/webhook.md). For more options, see below.

**Options**

`--enpoint`, `-e`: This specifies which endpoint you want to include in the `app.json` file. Options: `jovo-framework` (default), `bst-proxy` (see [`jovo run`](#bst-proxy)), and `ngrok` (will extract the url if ngrok is running in the background on port `3000`).


#### jovo build

![jovo build command](../img/jovo-build.png "jovo build command")

`jovo build` is the command to create and update the platform specific interaction models using the Jovo model. Using the files in the `/models` folder and converting them into files in the `/platforms` folder.

To learn more about Jovo Language Models, take a look at [App Configuration > Models](../03_app-configuration/models).

After the initial [`init`](#jovo-init) process, you can either run `build`  separately for each platform, or just let the CLI fetch the right information from the `app.json` file.

```sh
# Default
$ jovo build

# Options
$ jovo build [-p | --platform <alexaSkill | googleAction>] [-l | --locale <de-DE | en-US | etc.>] [-d | --deploy]
```
**Options**

`--platform`, `-p`: If you want to update your platform folders, you can leave it out and it will update the ones listed in `app.json`. You can still use it, if you want to only update a specific platform. If you haven't  initialized a platform yet, this will trigger the [`jovo init`](#jovo-init) command.

`--locale`, `-l`: Specify the locale, which should be created/updated. Default: `en-US`.

`--deploy`, `-d`: This is a shortcut to the [`jovo deploy`](#jovo-deploy) command. Deploy the platform files to their respective developer console.

`--reverse`, `-r`: In this reverse process, you can create a [Jovo Language Model](../03_app-configuration/01_models) from an existing `/platforms` folder, e.g. after you fetched the files with [`jovo get`](#jovo-get). Currently only works with Amazon Alexa: `jovo build -p alexaSkill --reverse`:

![jovo build reverse converter](../img/jovo-build-reverse.png "jovo build reverse command")


#### jovo get

![jovo get command](../img/jovo-get.png "jovo get command")

`jovo get` will import an existing Alexa Skill (Skill Information and Interaction Model) into the `/platforms` folder. Dialogflow API v1 does not support importing agents, this is why this command is currently limited to Amazon Alexa.

To get the Skill from the Amazon developer console, you have to set up [ASK CLI](https://developer.amazon.com/docs/smapi/quick-start-alexa-skills-kit-command-line-interface.html) first.

```sh
# Choose from list of Skills
$ jovo get alexaSkill

# Get specific Skill ID
$ jovo get alexaSkill --skill-id <skill ID>

# Options
$ jovo get alexaSkill [-s | --skill-id <skill ID>] [--list-skills] [-l | --locale] [-t | --target] [--ask-profile]
```

**Options**

`--locale`, `-l`: Specify the locale, which should be created/updated. Default: all languages available for the Skill.

`--list-skills`: Shows a list of all available Skill projects for the specific ASK Profile.

`--skill-id`, `-s`: Gets a specific Skill ID.

`--ask-profile`: Specifies which profile set up in [ASK CLI](https://developer.amazon.com/docs/smapi/quick-start-alexa-skills-kit-command-line-interface.html) should be used to get the information. Default: `default`.

`--target`, `-t`: Specifies which information should be fetched from the Skill. Arguments: `info` (Skill Information), `model` (Interaction Model), `all`. Default: `all`.


#### jovo deploy

![jovo deploy command](../img/jovo-deploy.png "jovo deploy command")

`jovo deploy` is used to upload the platform folders to their respective developer site. Since the Dialogflow API v1 does not support programmatic agent creation, the deploy command will create `zip` file, which you can then import into Dialogflow:

![jovo deploy command](../img/folder-structure-googleAction-agent-zip.png "jovo deploy command")

To deploy to the Amazon developer console, you have to set up [ASK CLI](https://developer.amazon.com/docs/smapi/quick-start-alexa-skills-kit-command-line-interface.html) first.

```sh
# Default
$ jovo deploy

# Options
$ jovo deploy --platform <alexaSkill | googleAction> [-l | --locale <de-DE | en-US | etc.>] [-t | --target <model | skill | all>]
```
**Options**:

`--platform`, `-p`: Specify the platform that should be deployed. Default: Every platform found in the `/platforms` folder.

`--locale`, `-l`: Specify the locale that should be deployed. Default: Every locale found for each platform.

`--target`, `-t`: Specify, what type of information to deploy. Arguments: `info` (for Skill or Agent information), `model` (for language models), `lambda` (for AWS Lambda deployment), `all`. Default: all.