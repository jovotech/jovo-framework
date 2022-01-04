---
title: 'Installation'
excerpt: 'Learn how to install Jovo, the open source framework for voice and chat apps.'
---

# Installation

Learn how to install Jovo, the open source framework for voice and chat apps.

## Introduction

Jovo is an open-source framework based on [TypeScript](https://www.typescriptlang.org/) which can be used with both TypeScript and JavaScript. If you run into any problems while installing it, please let us know [in the Jovo forum](https://community.jovo.tech/) or [create an issue on GitHub](https://github.com/jovotech/jovo-framework/issues).

Before getting started, make sure you have the following installed on your computer or development environment:

- [Node.js](https://nodejs.org/en/download/) version `12.x` or later
- [npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm) (node package manager)

There are two ways how you can install Jovo:

- [Install the Jovo CLI](#install-the-cli) (recommended way in our [getting started guide](https://www.jovo.tech/docs/getting-started))
- [Clone a sample app](#clone-a-sample-app)

If you're looking to migrate to Jovo `v4` from a `v3` project, take a look at our [migration guide](./migration-from-v3.md).

## Install the CLI

You can install the new Jovo CLI like this:

```sh
$ npm install -g @jovotech/cli
```

After successful installation, you should be able to see the Jovo CLI menu by typing the following into your command line:

```sh
$ jovo
```

### Create a new Project

After installing the Jovo CLI, you can install the template ([TypeScript](https://github.com/jovotech/jovo-v4-template) or [JavaScript](https://github.com/jovotech/jovo-v4-template-js)) using the [`new` command](https://www.jovo.tech/docs/new-command):

```sh
$ jovo new <directory>
```

This will download the template into a new `<directory>` folder and install all necessary dependencies.

### Run the Local Development Server

Change your working directory into your newly created project directory and run your app:

```sh
# Change working directory to your previously specified directory
$ cd <directory>

# Run the local development server
$ jovo run
```

You can now open the [Jovo Debugger](./debugger.md) with the `.` key.

## Clone a Sample App

You can find a sample project for a Jovo app on GitHub:

- [TypeScript version](https://github.com/jovotech/jovo-v4-template)
- [JavaScript version](https://github.com/jovotech/jovo-v4-template-js)

You can clone it like this:

```sh
# TypeScript version
$ git clone https://github.com/jovotech/jovo-v4-template.git

# JavaScript version
$ git clone https://github.com/jovotech/jovo-v4-template-js.git
```

Then go into the directory and install the dependencies:

```sh
$ npm install
```
