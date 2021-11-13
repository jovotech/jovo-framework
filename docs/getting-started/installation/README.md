# Installation

> To view this page on the Jovo website, visit https://www.jovo.tech/docs/installation

Learn about different options to install the Jovo Framework and Jovo CLI.

- [Introduction](#introduction)
- [Jovo CLI Installation](#jovo-cli-installation)
  - [Create a new Jovo Project](#create-a-new-jovo-project)
  - [CLI Troubleshooting](#cli-troubleshooting)
- [Alternatives](#alternatives)
  - [jovo-framework npm package](#jovo-framework-npm-package)
  - [Jovo Sample Voice App](#jovo-sample-voice-app)
- [Upgrading](#upgrading)
- [Technical Requirements](#technical-requirements)

> For a step-by-step introduction, see our [quickstart guide](../README.md './quickstart').

## Introduction

Jovo is an open-source framework based on [Typescript](https://www.typescriptlang.org/) which can be used with [Node.js](https://nodejs.org/). If you run into any problems while installing it, please let us know [in the comments](https://www.jovo.tech/framework/docs/installation#comments-and-questions), [create an issue on GitHub](https://github.com/jovotech/jovo-framework-nodejs/issues), or [join our Developer Slack community](https://www.jovo.tech/slack).

There are several ways how you can install Jovo:

- [Install the Jovo CLI](#jovo-cli-installation) (recommended way in our [quickstart guide](../README.md './quickstart'))
- Download the [jovo-framework npm package](#jovo-framework-npm-package)
- Clone a [Jovo Sample Voice App](#jovo-sample-voice-app)

> You can also find tutorials and courses here: [learn jovo](https://www.jovo.tech/learn). Happy coding!

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
$ jovo3 -v
```

> [Find a full list of Jovo CLI Commands here](../tools/cli './cli').

#### Create a new Jovo Project

After installing the Jovo CLI, you can create a new project with the following command:

```sh
$ jovo3 new <directory>
```

This will download a new Jovo "Hello World" project into a new `<directory>` folder and install all necessary dependencies.

> For next steps with the Jovo CLI, please see our [quickstart guide](../README.md './quickstart').

#### CLI Troubleshooting

If you run into any problems with permissions while installing the Jovo CLI, try to use `sudo`:

```sh
$ sudo npm install -g jovo-cli
```

If you had the CLI installed before the release of Jovo Framework v1 or v2, and are running into problems after updating it to the newest version, please try to uninstall it globally before you install it again:

```sh
$ npm remove -g jovo-cli
```

or

```sh
$ sudo npm remove -g jovo-cli
```

## Alternatives

For other examples of getting started with the Jovo Framework without using the Jovo CLI, please see below:

- [jovo-framework npm package](#jovo-framework-npm-package)
- [Jovo Sample Voice App](#jovo-sample-voice-app)

### jovo-framework npm package

If you want to use the Jovo Framework as a dependency in an already existing project, you can use npm to save it to your package.json:

```sh
$ npm install --save jovo-framework
```

You can find the npm package here: [npmjs.com/package/jovo-framework](https://www.npmjs.com/package/jovo-framework).

### Jovo Sample Voice App

You can find a sample project for a simple voice app with the Jovo framework on GitHub: [jovotech/jovo-sample-voice-app-nodejs](https://github.com/jovotech/jovo-sample-voice-app-nodejs).

You can clone it like this:

```sh
$ git clone https://github.com/jovotech/jovo-sample-voice-app-nodejs.git
```

Then go into the directory and install the dependencies:

```sh
$ npm install
```

> You can find other examples and templates here: [Jovo Template Directory](https://www.jovo.tech/templates).

## Upgrading

If you want to upgrade your existing voice app that uses Jovo, take a look at the following guides:

- [Upgrading](./upgrading.md './installation/upgrading'): General documentation about updating both the Jovo Framework and CLI.
- [v2 Migration](./v2-migration.md './installation/v2-migration'): Learn how to migrate to Jovo `v3` from `v2`.

## Technical Requirements

First, make sure you have the following installed on your computer/development environment:

- Node.js version 10.8 or later
- [npm](https://www.npmjs.com/) (node package manager)

Need help with that? Here are some tutorials to install Node.js and npm: [Mac](http://blog.teamtreehouse.com/install-node-js-npm-mac), [Windows](http://blog.teamtreehouse.com/install-node-js-npm-windows).

<!--[metadata]: {"description": "Learn how to install the Jovo Framework and Jovo CLI to develop Cross-Platform Voice Apps for Alexa and Google Assistant", "route": "installation"}-->
