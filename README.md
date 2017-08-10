[![Jovo Framework](https://www.jovo.tech/img/github-logo.png)](https://www.jovo.tech)

<p align="center">The development framework for cross-platform voice apps</p>

<p align="center">
<a href="https://www.jovo.tech/framework/docs/"><strong>Documentation</strong></a> -
<a href="https://github.com/jovotech/jovo-cli"><strong>CLI </strong></a> -
<a href="https://github.com/jovotech/jovo-sample-voice-app-nodejs"><strong>Sample App </strong></a> - <a href="./CONTRIBUTING.md"><strong>Contributing</strong></a> - <a href="https://twitter.com/jovotech"><strong>Twitter</strong></a></p>
<br/>

<p align="center">
<a href="https://travis-ci.org/jovotech/jovo-framework-nodejs" target="_blank"><img src="https://travis-ci.org/jovotech/jovo-framework-nodejs.svg"></a>
<a href="https://www.npmjs.com/package/jovo-framework" target="_blank"><img src="https://badge.fury.io/js/jovo-framework.svg"></a>
<a href="./CONTRIBUTING.md"><img src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg"></a>
<a href="https://gitter.im/jovotech/jovo-framework-nodejs" target="_blank"><img src="https://badges.gitter.im/jovotech/jovo-framework-nodejs.svg"></a>
</p>

<br/>

## Table of Contents

* [Getting Started](#getting-started)
  * [Jovo CLI](#jovo-cli)
  * [Jovo Framework](#jovo-framework)
  * [Jovo Sample App](#jovo-sample-app)
* [Tutorials](#tutorials)
* [Development Roadmap](#development-roadmap)


## Getting Started

There are three ways to get started with the Jovo Framework. You can either install our command line tools (recommended), save the jovo-framework npm package, or clone our sample voice app.

Technical Requirements: Node.js version 4 or later & NPM (node package manager). Here are some tutorials to install Node.js and NPM: [Mac](http://blog.teamtreehouse.com/install-node-js-npm-mac), [Windows](http://blog.teamtreehouse.com/install-node-js-npm-windows).

### Jovo CLI

The [Jovo Command Line Tools](https://github.com/jovotech/jovo-cli) offer an easy way to create new voice apps from templates. Install them with:

```
$ npm install -g jovo-cli
```

You can create a Jovo project into a new directory with the following command:
```
$ jovo new <directory>
```
This will clone the [Jovo Sample App](https://github.com/jovotech/jovo-sample-voice-app-nodejs) and install all the necessary dependencies so you can get started right away.

### Jovo Framework

If you want to use the Jovo Framework as a dependency in an already existing project, you can also use npm to save it to your package.json:

```
$ npm install --save jovo-framework
```

### Jovo Sample App

Right now, there is one sample app available, [which you can find here](https://github.com/jovotech/jovo-sample-voice-app-nodejs).

You can clone it like this:

```
$ git clone https://github.com/jovotech/jovo-sample-voice-app-nodejs.git
```

Afterwards, go to the app directory and do

```
$ npm install
```

## Tutorials

Find a quickstart guide and comprehensive tutorials here:

* [Build a cross-platform voice app in 5 simple steps](https://www.jovo.tech/get-started)
* [Build an Alexa Skill with Jovo](https://www.jovo.tech/blog/alexa-skill-tutorial-nodejs/)
* [Build a Google Action with Jovo](https://www.jovo.tech/blog/google-action-tutorial-nodejs/)



## Development Roadmap

We still consider this a beta-version of the Jovo framework: We give it our all to make it as complete as possible (and it supports most of the Alexa and Google Assistant functions), but there are certain features that are currently in development.

What we're currently working on:
* Alexa Audioplayer Skills
* Dialog Mode
* Adding more DB integrations
* Adding more visual output options


## We need your help

Jovo is a free, open source framework for voice developers. We're improving it every day and appreciate any feedback. How to support us? Just go ahead and build something cool with the framework and let us know at feedback@jovo.tech. Thanks!
