# jovo build

Learn more about how to translate your Jovo Language Model into an Alexa Skill Interaction Model or a Dialogflow Agent with the `jovo build` CLI command.

* [Introduction](#introduction)


## Introduction

![jovo build command](../img/jovo-build.png "jovo build command")

`jovo build` is the command to create and update the platform specific interaction models using the Jovo model. Using the files in the `/models` folder and converting them into files in the `/platforms` folder.

To learn more about Jovo Language Models, take a look at [App Configuration > Models](../03_app-configuration/models './model').

After the initial [`init`](#jovo-init) process, you can either run `build`  separately for each platform, or just let the CLI fetch the right information from the `app.json` file.

```sh
# Default
$ jovo build

# Options
$ jovo build [-p | --platform <platform>] [-r | --reverse] [-l | --locale <locale>] [-d | --deploy]
  [-t | --target <target>] [-s | --src <src>] [--stage <stage>] [--endpoint <endpoint>] [--ask-profile <profileName>]
```

**Options**

`--platform`, `-p`: If you want to update your platform folders, you can leave it out and it will update the ones listed in `app.json`. If you want to update a specific platform folder you can parse the platform name as an argument: `alexaSkill` or `googleAction`. If you haven't  initialized a platform yet, this will trigger the [`jovo init`](#jovo-init) command.

`--reverse`, `-r`: In this reverse process, you can create a [Jovo Language Model](../03_app-configuration/01_models './model') from an existing `/platforms` folder, e.g. after you fetched the files with [`jovo get`](#jovo-get).

`--locale`, `-l`: Specify the locale, which should be created/updated. Arguments: `en-US`, `de-DE`, et cetera. Default: `en-US`.

`--deploy`, `-d`: This is a shortcut to the [`jovo deploy`](#jovo-deploy) command. Deploy the platform files to their respective developer console.

`--target`, `-t`: Used works in combination with `--deploy` to specify target of deployment. Arguments: `info` (Skill Information), `model` (Interaction Model), `all`. Default: `all`.

`--src`, `-s`: Used works in combination with `--deploy`. Path to source files. Default: project directory. 

`--stage`: Specify the stage where the configuration will be taken from.

`--endpoint`: Type of endpoint: <`jovo-webhook` | `bst-proxy` | `ngrok` | `none`>. Default: `jovo-webhook`.

`--ask-profile`: Used in combination with `--deploy`. Specifies which profile set up in [ASK CLI](https://developer.amazon.com/docs/smapi/quick-start-alexa-skills-kit-command-line-interface.html) should be used to deploy. Default: `default`.

```sh
# Alexa Skill
$ jovo build -p alexaSkill --reverse

# Google Action
$ jovo build -p googleAction --reverse
```

![jovo build reverse converter](../img/jovo-build-reverse.png "jovo build reverse command")


<!--[metadata]: {"description": "Learn more about how to translate your Jovo Language Model into an Alexa Skill Interaction Model or a Dialogflow Agent with the jovo build CLI command.",
                "route": "cli/build"}-->
