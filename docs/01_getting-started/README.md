# Getting Started > Installation

* [Introduction](#introduction)
  * [Technical Requirements](#technical-requirements)
* [Getting Started](#getting-started)
  * [Jovo CLI Installation](#jovo-cli-installation)
  * [Create a New Jovo Project](#create-a-new-jovo-project)
  * [Build a Language Model](#build-a-language-model)
  * [Run and Test the Code](#run-and-test-the-code)
* [Alternatives](#alternatives)
  * [Jovo-Framework NPM Package](#jovo-framework-npm-package)
  * [Jovo Sample Voice App](#jovo-sample-voice-app)
* [Build Your First Voice App](#build-your-first-voice-app)
* [Voice App Basics](#voice-app-basics)


## Introduction

Jovo is an open-source framework based on [Node.js](https://nodejs.org/). If you run into any problems while installing it, please let us know [in the comments](https://www.jovo.tech/framework/docs/installation#comments-and-questions), [create an issue on GitHub](https://github.com/jovotech/jovo-framework-nodejs/issues), or [join ask for help in our Developer Slack community](https://www.jovo.tech/slack).

You can also find tutorials and courses here: [jovo.tech/learn](https://www.jovo.tech/learn). Happy coding!

### Technical Requirements

Before starting the installation, make sure you have the following installed on your computer/development environment:

* Node.js version 6 or later
* [NPM](https://www.npmjs.com/) (node package manager)

Need help with that? Here are some tutorials to install Node.js and NPM: [Mac](http://blog.teamtreehouse.com/install-node-js-npm-mac), [Windows](http://blog.teamtreehouse.com/install-node-js-npm-windows).

## Getting Started

We highly recommend using the Jovo CLI if you want to benefit from all the features coming with Jovo. [Find the full CLI Docs here](../02_cli), and the open source GitHub repository here: [jovotech/jovo-cli](https://github.com/jovotech/jovo-cli) (pull requests encouraged!)

You can find other ways to get started wit Jovo below: Install the [Jovo Framework NPM Pckage](jovo-framework-npm-package), or clone the [Jovo Sample Voice App](#jovo-sample-voice-app). 

### Jovo CLI Installation

To use Jovo in the best and most efficient way, install the Jovo CLI globally with:

```sh
$ npm install -g jovo-cli
```

After successful installation, you should be able to see the jovo menu by just typing the following into your command line:

```sh
$ jovo
```

[Find a full list of Jovo CLI Commands here](../02_cli).

#### Troubleshooting

If you had the CLI installed before the release of Jovo Framework v1, and are running into problems after updating it to the newest version, please try to uninstall it globally before you install it again:

```sh
$ npm remove -g jovo-cli
```

### Create a new Jovo Project

You can create a Jovo project into a new directory with the following command:

```sh
$ jovo new <directory>
```

This will create a new folder, clone the [Jovo Sample App](#jovo-sample-voice-app) and install all the necessary dependencies so you can get started right away.

This is how a typical Jovo project looks like:

```javascript
app/
  └── app.js
index.js
models/
  └── en-US.json
```

You can find out more about the Jovo project structure in [App Configuration](../03_app-configuration).

### Build a Language Model

Before building out the logic of your voice application, you need to create a language model (also called interaction models) on the voice platform(s) you want to interact with.

If you're new to how the voice platforms and language models work, take a look at [Voice App Basics](voice-app-basics.md).

There are several ways how to do that:
* Create the language models manually for each platform in the respective developer console
  * [Amazon Alexa Tutorial](https://www.jovo.tech/blog/alexa-skill-tutorial-nodejs/)
  * [Google Assistant Tutorial (Dialogflow)](https://www.jovo.tech/blog/google-action-tutorial-nodejs/)
* Create a Jovo language model in the `models` folder and deploy it to the platforms with the Jovo CLI
  * [Language Model Docs](../03_app-configuration/models)

### Run and Test the Code

For your first "Hello World!", you need to run the software on either
* a local development server with `$ jovo run` (recommended), as described in [Server Configuration > Webhook](../03_app-configuration/server/webhook.md)
* or on AWS Lambda, as described in [Server Configuration > AWS Lambda](../03_app-configuration/server/aws-lambda.md)

You can find a full step-by-step course for both Amazon Alexa and Google Assistant here: [Voice App Project 1: Hello World](https://www.jovo.tech/blog/project-1-hello-world/). 

## Alternatives

For other examples of getting started with the Jovo Framework without using the Jovo CLI, please see below.

### Jovo Framework
If you want to use the Jovo Framework as a dependency in an already existing project, you can use npm to save it to your package.json:

```sh
$ npm install --save jovo-framework
```

### Clone a Sample App

You can find a sample project for a simple voice app with the Jovo framework on GitHub:  [jovotech/jovo-sample-voice-app-nodejs](https://github.com/jovotech/jovo-sample-voice-app-nodejs).

You can clone it like this:

```sh
$ git clone https://github.com/jovotech/jovo-sample-voice-app-nodejs.git
```

Then go into the directory and install the dependencies:

```sh
$ npm install
```



## Build Your First Voice App

To get started building voice apps with Jovo, take a look at the list of tutorials and courses [on GitHub](tutorials.md) and on the [Jovo Website](https://www.jovo.tech/learn).


## Voice App Basics

New to developing for voice platforms like Amazon Alexa and Google Assistant? Go to [ Voice App Basics](voice-app-basics.md) to get an introduction to voice and language models.
