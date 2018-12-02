# Installation

Learn how to install the Jovo open-source framework. For a step-by-step introduction, see our [quickstart guide](../README.md './quickstart').

* [Introduction](#introduction)
  * [Technical Requirements](#technical-requirements)
* [Jovo CLI Installation](#1-jovo-cli-installation)
* [Alternatives](#alternatives)
  * [jovo-framework npm package](#jovo-framework-npm-package)
  * [Jovo Sample Voice App](#jovo-sample-voice-app)
* [Upgrading](#upgrading)


## Introduction

Jovo is an open-source framework based on [Typescript](https://www.typescriptlang.org/) which can be used with [Node.js](https://nodejs.org/). If you run into any problems while installing it, please let us know [in the comments](https://www.jovo.tech/framework/docs/installation#comments-and-questions), [create an issue on GitHub](https://github.com/jovotech/jovo-framework-nodejs/issues), or [join our Developer Slack community](https://www.jovo.tech/slack).

You can also find tutorials and courses here: [jovo.tech/learn](https://www.jovo.tech/learn). Happy coding!

### Technical Requirements

First, make sure you have the following installed on your computer/development environment:

* Node.js version 8.10 or later
* [npm](https://www.npmjs.com/) (node package manager)

Need help with that? Here are some tutorials to install Node.js and npm: [Mac](http://blog.teamtreehouse.com/install-node-js-npm-mac), [Windows](http://blog.teamtreehouse.com/install-node-js-npm-windows).

### Jovo CLI Installation

To use Jovo in the best and most efficient way, install the Jovo CLI globally with:

```sh
$ npm install -g jovo-cli
```

After successful installation, you should be able to see the Jovo CLI menu by just typing the following into your command line:

```sh
$ jovo
```

You can check the version number (and compare it to the [jovo-cli npm package](https://www.npmjs.com/package/jovo-cli) version) with this command:

```sh
$ jovo -V
```

[Find a full list of Jovo CLI Commands here](../workflows/cli './cli').

#### Troubleshooting

If you had the CLI installed before the release of Jovo Framework v1 or v2, and are running into problems after updating it to the newest version, please try to uninstall it globally before you install it again:

```sh
$ npm uninstall -g jovo-cli
```

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


## Upgrading

If you want to upgrade your existing voice app that uses Jovo, take a look at the following guides:

* [Upgrading](./upgrading.md './installation/upgrading'): General documentation about updating both the Jovo Framework and CLI.
* [v1 Migration](./v1-migration.md './installation/v1-migration'): Learn how to migrate to Jovo `v2` from `v1`.


<!--[metadata]: {"description": "Learn how to install the Jovo Framework and Jovo CLI to develop Cross-Platform Voice Apps for Alexa and Google Assistant", "route": "installation"}-->
