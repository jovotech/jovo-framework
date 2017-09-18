# Getting Started

> Other pages in this category: [Tutorials](tutorials.md), [Voice App Basics](voice-app-basics.md).

* [Installation](#installation)
  * [Technical Requirements](#technical-requirements)
  * [Jovo CLI](#jovo-cli)
  * [Jovo-Framework](#jovo-framework)
  * [Clone a Sample App](#clone-a-sample-app)


## Installation

There are three ways to get started with the Jovo Framework. You can either install our command line tools (recommended), save the jovo-framework npm package, or clone our sample voice app.

### Technical Requirements

Jovo is a [Node.js](https://nodejs.org/) framework. Before starting the installation, make sure you have the following installed on your computer/development environment:

* Node.js version 4 or later
* [NPM](https://www.npmjs.com/) (node package manager)

Here are some tutorials to install Node.js and NPM: [Mac](http://blog.teamtreehouse.com/install-node-js-npm-mac), [Windows](http://blog.teamtreehouse.com/install-node-js-npm-windows).

### Jovo CLI

The Jovo Command Line Tools offer an easy way to create new voice apps from templates. You can find a more detailed description in the section [02. Building a Voice App](../02_building-a-voice-app).

The open source GitHub repository can be found here: [jovotech/jovo-cli](https://github.com/jovotech/jovo-cli) (pull requests encouraged!)

```
$ npm install -g jovo-cli
```

You can create a Jovo project into a new directory with the following command:

```
$ jovo new <directory>
```

This will clone the [Jovo Sample App](#clone-a-sample-app) and install all the necessary dependencies so you can get started right away.

### Jovo Framework
If you want to use the Jovo Framework as a dependency in an already existing project, you can also use npm to save it to your package.json:

```
$ npm install --save jovo-framework
```

### Clone a Sample App

Right now, there is one sample app available, [which you can find here](https://github.com/jovotech/jovo-sample-voice-app-nodejs).

You can clone it like this:

```
$ git clone https://github.com/jovotech/jovo-sample-voice-app-nodejs.git
```