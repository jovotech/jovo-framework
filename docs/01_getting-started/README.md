# Getting Started > Installation

* [Introduction](#introduction)
  * [Technical Requirements](#technical-requirements)
* [Getting Started](#getting-started)
  * [1. Jovo CLI Installation](#1-jovo-cli-installation)
  * [2. Create a New Jovo Project](#2-create-a-new-jovo-project)
  * [3. Create a Language Model](#3-create-a-language-model)
  * [4. Run and Test the Code](#4-run-and-test-the-code)
* [Alternatives](#alternatives)
  * [jovo-framework npm package](#jovo-framework-npm-package)
  * [Jovo Sample Voice App](#jovo-sample-voice-app)
* [Build Your First Voice App](#build-your-first-voice-app)
* [Voice App Basics](#voice-app-basics)


## Introduction

Jovo is an open-source framework based on [Node.js](https://nodejs.org/). If you run into any problems while installing it, please let us know [in the comments](https://www.jovo.tech/framework/docs/installation#comments-and-questions), [create an issue on GitHub](https://github.com/jovotech/jovo-framework-nodejs/issues), or [join our Developer Slack community](https://www.jovo.tech/slack).

You can also find tutorials and courses here: [jovo.tech/learn](https://www.jovo.tech/learn). Happy coding!

### Technical Requirements

First, make sure you have the following installed on your computer/development environment:

* Node.js version 6 or later
* [npm](https://www.npmjs.com/) (node package manager)

Need help with that? Here are some tutorials to install Node.js and npm: [Mac](http://blog.teamtreehouse.com/install-node-js-npm-mac), [Windows](http://blog.teamtreehouse.com/install-node-js-npm-windows).

## Getting Started

We highly recommend using the Jovo CLI if you want to benefit from all the features coming with Jovo. [Find the full CLI Docs here](../02_cli './cli'), and the open source GitHub repository here: [jovotech/jovo-cli](https://github.com/jovotech/jovo-cli) (pull requests encouraged!)

You can find other ways to get started wit Jovo below: Install the [jovo-framework npm package](#jovo-framework-npm-package), or clone the [Jovo Sample Voice App](#jovo-sample-voice-app). 

### 1. Jovo CLI Installation

To use Jovo in the best and most efficient way, install the Jovo CLI globally with:

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

[Find a full list of Jovo CLI Commands here](../02_cli).

#### Troubleshooting

If you had the CLI installed before the release of Jovo Framework v1, and are running into problems after updating it to the newest version, please try to uninstall it globally before you install it again:

```sh
$ npm uninstall -g jovo-cli
```

### 2. Create a new Jovo Project

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

You can find out more about the Jovo project structure in [App Configuration](../03_app-configuration './app-configuration').

### 3. Create a Language Model

Before building out the logic of your voice application, you need to create a language model (also called interaction model) on the voice platform(s) you want to interact with.

If you're new to how the voice platforms and language models work, take a look at [Voice App Basics](./voice-app-basics.md './voice-app-basics').

There are several ways how to do that:
* Create the language models manually for each platform in the respective developer console
  * [Amazon Alexa Tutorial](https://www.jovo.tech/blog/alexa-skill-tutorial-nodejs/)
  * [Google Assistant Tutorial (Dialogflow)](https://www.jovo.tech/blog/google-action-tutorial-nodejs/)
* Create a Jovo language model in the `/models` folder and deploy it to the platforms with the Jovo CLI
  * [Language Model Docs](../03_app-configuration/models '.model')

### 4. Run and Test the Code

For your first "Hello World!", you need to run the software on
* a local development server with `$ jovo run` (recommended), as described in [App Configuration > Server Configuration > Webhook](../03_app-configuration/02_server/webhook.md './server/webhook')
* AWS Lambda, as described in [App Configuration > Server Configuration > AWS Lambda](../03_app-configuration/02_server/aws-lambda.md './server/aws-lambda')
* or Azure Functions, as described in [App Configuration > Server Configuration > Azure Functions](../03_app-configuration/02_server/azure-functions.md './server/azure-functions')

You can find a full step-by-step course for both Amazon Alexa and Google Assistant here: [Voice App Project 1: Hello World](https://www.jovo.tech/blog/project-1-hello-world/). 

## Alternatives

For other examples of getting started with the Jovo Framework without using the Jovo CLI, please see below:

* [jovo-framework npm package](#jovo-framework-npm-package)
* [Jovo Sample Voice App](#jovo-sample-voice-app) 

### jovo-framework npm package
If you want to use the Jovo Framework as a dependency in an already existing project, you can use npm to save it to your package.json:

```sh
$ npm install --save jovo-framework
```

You can find the npm package here: [npmjs.com/package/jovo-framework](https://www.npmjs.com/package/jovo-framework).

### Jovo Sample Voice App

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

To get started building voice apps with Jovo, take a look at the list of tutorials and courses [on GitHub](./tutorials.md '../learn') and on the [Jovo Website](https://www.jovo.tech/learn).


## Voice App Basics

New to developing for voice platforms like Amazon Alexa and Google Assistant? Go to [ Voice App Basics](./voice-app-basics.md './voice-app-basics') to get an introduction to voice and language models.


<!--[metadata]: {"title": "Installation", 
                "description": "Learn how to install the Jovo Framework and Jovo CLI to develop Cross-Platform Voice Apps for Alexa and Google Assistant",
                "activeSections": ["gettingstarted", "installation"],
                "expandedSections": "installation",
                "inSections": "gettingstarted",
                "breadCrumbs": {"Docs": "docs/",
                "Getting Started": "docs",
                                "Installation": ""
                                },
"commentsID": "framework/docs/getting-started",
"route": "docs/installation"
                }-->
