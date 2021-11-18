# Deployment

> To view this page on the Jovo website, visit https://v3.jovo.tech/docs/deployment

Learn more about the deployment workflow and what options you have.

- [Introduction](#introduction)
- [Deploying Platform Files](#deploying-platform-files)
  - [Alexa Skill Deployment](#alexa-skill-deployment)
  - [Google Action Deployment](#google-action-deployment)
- [Deploying Source Code](#deploying-source-code)

## Introduction

Deployment of a Jovo project consists of deploying the logic as well as the platform files.

To make deploying easier you can use the [Jovo CLI](../tools/cli/README.md '../cli'). The CLI currently supports the deployment to AWS Lambda, Alexa Developer Console, Dialogflow.

## Deploying Platform Files

> Note: Platform files are currently supported for Alexa Skills and Google Actions.

Platform files are split between the language model and general configuration files (e.g. app name, description, etc.) of your app.

Before being able to deploy the platform files, you first need to build them. In the build process, the following files are used:

- `project.js`: [Project Configuration](../configuration/project-js.md './project-js'), e.g. endpoint, project ID, etc.
- `models` folder: [Jovo Language Model](../basic-concepts/model './model') files
- `platforms` folder: Platform specific files (created after first build and reused in consecutive builds)

> Note: It's generally recommended to not commit the `platforms` folder. It contains client-specific data like the `skillId` of Alexa Skills which can cause an error if someone tries to deploy the platforms folder to an account that doesn't have a Skill with the same ID.

The platform files are automatically built using the Jovo CLI:

```sh
$ jovo3 build
```

Check out the [`jovo build` documentation page](../tools/cli/build.md './cli/build') for a detailed guide on the command's options and workflows.

### Alexa Skill Deployment

To be able to deploy your Alexa Skill, you have to set up the [ASK CLI](https://developer.amazon.com/docs/smapi/quick-start-alexa-skills-kit-command-line-interface.html) first.

> With the recent update to ASK CLI v2, Amazon made some changes to the Alexa Skill project structure. Until the next update of the Jovo CLI, we recommmend to install ASK CLI v1.7.

```sh
# Install ASK CLI
$ npm install -g ask-cli@1.7.23

# Initialize a profile
$ ask init
```

For more information on how to set up the ASK CLI, see the [official ASK CLI reference from Amazon](https://developer.amazon.com/docs/smapi/quick-start-alexa-skills-kit-command-line-interface.html).

You can then deploy your Alexa Skill project with the Jovo CLI:

```sh
# Deploy to all platforms in project.js
$ jovo3 deploy

# Deploy only to Alexa
$ jovo3 deploy --platform alexaSkill

# Deploy to specific ASK Profile
$ jovo3 deploy --ask-profile <profileName>
```

### Google Action Deployment

Deploying your Google Action is not as easy. First, you can't deploy your Google Action itself. You can only deploy the language model to Dialogflow and that takes a couple more steps the first time you do it. We've created a step by step tutorial for that purpose. You can find it [here](https://v3.jovo.tech/tutorials/deploy-dialogflow-agent).

After going through the setup process, `jovo deploy` will upload your language model to Dialogflow.

```sh
# Deploy to all platforms in project.js
$ jovo3 deploy

# Deploy only to Dialogflow
$ jovo3 deploy --platform googleAction
```

## Deploying Source Code

For testing and running your app in production, you need to deploy the code to various [hosting providers](../configuration/hosting './hosting') Jovo offers integrations for.

The most popular one is AWS Lambda since it works out of the box with Alexa Skills. Google Actions need a little bit more work because you have to set up an API Gateway and use that as the endpoint. You can find a detailed guide about it [here](https://v3.jovo.tech/tutorials/host-google-action-on-lambda#create-a-lambda-function).

Besides event-driven solutions like AWS Lambda, Google Cloud Functions, and Microsoft Azure Functions, Jovo also offers the option to deploy the ExpressJS webhook to a server or to use the NodeJS HTTP package to deploy to platforms like Google Cloud's App Engine.

You can find the complete guide on hosting and how to get started with each platform [here](../configuration/hosting/README.md './hosting)

To create a ready-to-deploy `bundle.zip` file use either one of the following commands:

```sh
# Bundle files
$ jovo3 deploy --target zip

# Alternative
$ npm run bundle
```

This will copy the `src` files into a `bundle` folder, run a production-only npm install, and then zip it.

If you have a Lambda endpoint defined in your `project.js` file, and your ask profile has an AWS IAM user set up, the `jovo deploy` command will not only [deploy platform projects](#deploy-platform-projects) but also bundle and upload your source code to AWS Lambda:

```sh
# Deploy platform projects and source code
$ jovo3 deploy
```

<!--[metadata]: {"description": "Learn how to deploy your Jovo projects to Alexa, Google Assistant, and more voice platforms.", "route": "deployment"}-->
