# [Tools](../) > CLI

The Jovo Command Line Tools (see [GitHub Repository](https://github.com/jovotech/jovo-cli)) offer the ability to create, prototype, test and deploy your voice app quickly.

* [Installation](#installation)
 * [Troubleshooting](#troubleshooting)
* [jovo new](#jovo-new)
* [jovo build](#jovo-build)
* [jovo get](#jovo-get)
* [jovo deploy](#jovo-deploy)
* [jovo run](#jovo-run)
  * [Integrations](#integrations)
* [Templates](#templates)

## Installation

To make best use of the Jovo CLI, install it globally via npm:

```sh
$ npm install -g jovo-cli
```

You can check the version number (and compare it to the [jovo-cli npm package](https://www.npmjs.com/package/jovo-cli) version) with this command:

```sh
$ jovo -V
```

### Troubleshooting

If you run into problems, please submit an issue here: [jovotech/jovo-cli](https://github.com/jovotech/jovo-cli). Thank you! 


## jovo new
You can create a Jovo project into a new directory with the following command:

```sh
$ jovo new <directory> [-t | --template <template-name>] [-l | --locale <en-US | de-DE | etc.>] [-b | --build <alexaSkill | googleAction>] [-d | --deploy]

# Help command:
$ jovo help new
```
**Options**:
`template`: Used to specify, which template should be used. Get a list of all the templates [here](). Default: `helloworld`


`locale`: Choose the language of the interaction models. Default: `en-US`

`build`: Speed up the creation of your voice application, by building the platform specific files right at the beginning.

`deploy`: Deploy the platform files to their respective developer site. It will deploy to the platform you specified with the **build** option. The Dialogflow API v1 does not support programmatic agent creation. Therefor you are not able to deploy the application using the Jovo CLI.  But you can use the CLI to create `zip` file, which you can then import into Dialogflow.

## jovo build
`jovo build` is the command to create and update the platform specific interaction models using the Jovo model.
```sh
# Create platform folder:
$ jovo build --platform <alexaSkill | googleAction> [-l | --locale <de-DE | en-US | etc.>] [-d | --deploy]

# Update platform folders:
$ jovo build [-p | --platform <alexaSkill | googleAction>] [-l | --locale <de-DE | en-US | etc.>] [-d | --deploy]

# Help command:
$ jovo help build
```
**Options**:
`--platform`, `-l`: It is required, if you want to initialise a platform. If you want to update your platform folders, you can leave it out and it will update the ones listed in `app.json`, but you can still use it, if you want to update a specific one.
`--locale`, `-l`: Specify the locale, which should be created/updated. Default: `en-US`

`--deploy`, `-d`: Deploy the platform files to their respective developer site. It will deploy to the platform you specified with with `--platform`. The Dialogflow API v1 does not support programmatic agent creation. Therefor you are not able to deploy the application using the Jovo CLI.  But you can use the CLI to create `zip` file, which you can then import into Dialogflow.

## jovo get
`jovo get` will import an existing Alexa Skill. Currently it is not possible to import a Google Action, since it is not supported by the Dialogflow API v1.
```sh
$ jovo get --platform alexaSkill --skill-id <skill ID> [-l | --list-skills]

# short version
$ jovo get -p alexaSkill -s <skill-id>

# Help command:
$ jovo help get
```
**Options**:
`--list-skills`, `l`: 

## jovo deploy
`jovo deploy` is used to upload the platform folders to their respective developer site. Since the Dialogflow API v1 does not support programmatic agent creation, the deploy command will create `zip` file, which you can then import into Dialogflow. To deploy to the Amazon developer console, you have to set up the [ASK CLI](https://developer.amazon.com/docs/smapi/quick-start-alexa-skills-kit-command-line-interface.html) first.
```sh
$ jovo deploy --platform <alexaSkill | googleAction> [-l | --locale <de-DE | en-US | etc.>] [-t | --target <model | skill | all>]

# Help command:
$ jovo help deploy
```
**Options**:
`--locale`, `-l`: Specify the locale, which should be deployed. Default: `en-US`

`--target`, `-t`: Specify, if you want to deploy the updated interaction model with `model`, the updated skill information with `skill` or all of it with `all`.

## jovo run

You can use the `jovo run` command to start the development server in your `index.js` file.

```sh
$ jovo run [-b | --bst-proxy] [-w | --watch]
```

You can also specify the file you want to run:
```sh
$ jovo run <file>

# Example
$ jovo run index.js

# Alternative
$ node index.js
```

You can then use ngrok or another tool (like [bst proxy](#bst-proxy)) to tunnel to your local server.

### Integrations

> If you want to see another integration, please feel free to submit an issue. Thanks!

Here is a list of integrations that work with `jovo run`:

Command | Description | Docs
------------ | ------------- | -------------
`--bst-proxy` | Creates a webhook URL for local testing | [📝](#bst-proxy)
`--watch` | Uses `nodemon` to monitor changes and automatically restart the server | [📝](#watch)


#### bst proxy

You can use the bst proxy to create a webhook URL easily:

```sh
$ jovo run --bst-proxy
```

The result should look like this:

![Jovo and bst proxy](https://www.jovo.tech/blog/wp-content/uploads/2017/10/terminal-bst-proxy-1.jpg)

The URL also comes with logging and analytics capabilities for prototyping and testing.

#### watch

With this integration, you don't have to manually restart your server with every change you make to the application:

```sh
$ jovo run --watch
```

For this, we're using [`nodemon`](https://github.com/remy/nodemon), a neat package that monitors your app files and automatically restarts the server.

## Templates

We're currently working on adding more starter templates, with `helloworld` being the default. 

```sh
$ jovo new <directory> --template <template>

# Example
$ jovo new HelloWorld --template helloworld
```

You can find a list of templates here:

Template | Description | Repository
------------ | ------------- | -------------
helloworld | Creates a "Hello World" sample voice app | [jovo-sample-voice-app-nodejs](https://github.com/jovotech/jovo-sample-voice-app-nodejs)
