# Getting Started

* [Installation](#installation)
  * [Technical Requirements](#technical-requirements)
  * [Jovo CLI](#jovo-cli)
  * [Jovo-Framework](#jovo-framework)
  * [Clone a Sample App](#clone-a-sample-app)
* [Build Your First Voice App](#build-your-first-voice-app)
* [Voice App Basics](#voice-app-basics)


## Installation

There are three ways to get started with the Jovo Framework. You can either install our command line tools (recommended), use the jovo-framework npm package in your code, or clone our sample voice app.

### Technical Requirements

Jovo is a [Node.js](https://nodejs.org/) framework. Before starting the installation, make sure you have the following installed on your computer/development environment:

* Node.js version 4 or later
* [NPM](https://www.npmjs.com/) (node package manager)

Here are some tutorials to install Node.js and NPM: [Mac](http://blog.teamtreehouse.com/install-node-js-npm-mac), [Windows](http://blog.teamtreehouse.com/install-node-js-npm-windows).

### Jovo CLI

The Jovo Command Line Tools offer an easy way to create new voice apps from templates. You can find a more detailed description in the section [05. Tools](https://github.com/jovotech/jovo-framework-nodejs/tree/master/docs/05_tools).

The open source GitHub repository can be found here: [jovotech/jovo-cli](https://github.com/jovotech/jovo-cli) (pull requests encouraged!)

```sh
$ npm install -g jovo-cli
```

You can create a Jovo project into a new directory with the following command:

```sh
$ jovo new <directory>
```

This will clone the [Jovo Sample App](#clone-a-sample-app) and install all the necessary dependencies so you can get started right away.

### Jovo Framework
If you want to use the Jovo Framework as a dependency in an already existing project, you can also use npm to save it to your package.json:

```sh
$ npm install --save jovo-framework
```

### Clone a Sample App

Right now, there is one sample app available, [which you can find here](https://github.com/jovotech/jovo-sample-voice-app-nodejs).

You can clone it like this:

```sh
$ git clone https://github.com/jovotech/jovo-sample-voice-app-nodejs.git
```


## Build Your First Voice App

To get started building voice apps with Jovo, take a look at the list of tutorials and courses [on GitHub](tutorials.md) and on the [Jovo Website](https://www.jovo.tech/learn).


## Voice App Basics

New to developing for voice platforms like Amazon Alexa and Google Assistant? Go to [> Voice App Basics](voice-app-basics.md) to get an introduction to voice and language models.

