---
title: 'Alexa CLI Commands'
excerpt: 'Learn how to build and deploy Alexa projects using the Jovo CLI.'
---

# Alexa CLI Commands

Learn how to build and deploy Alexa projects using the Jovo CLI.

## Introduction

The Alexa CLI plugin allows you to interact with the [Alexa Developer Console](https://developer.amazon.com/alexa/console/ask#/) using the Jovo CLI. 

To use the Alexa CLI, add it as plugin to your `jovo.project.js` file. [Learn more about Alexa project configuration here](./project-config.md).

```js
const { ProjectConfig } = require('@jovotech/cli');
const { AlexaCli } = require('@jovotech/platform-alexa');
// ...

const project = new ProjectConfig({
  // ...
  plugins: [
    new AlexaCli(),
    // ...
  ]
});
```

The Alexa CLI plugin uses the official ASK (Alexa Skills Kit) CLI provided by Amazon for deployment. For the deployment to work, you need to at least set up a `default` ASK profile using the ASK CLI. [Follow the official Alexa docs to install and configure ASK CLI](https://developer.amazon.com/en-US/docs/alexa/smapi/quick-start-alexa-skills-kit-command-line-interface.html).

The Alexa CLI plugin hooks into the following commands:

- [`build`](#build): Create Alexa project files based on the project config and `models` folder
- [`deploy`](#deploy): Deploy project files to the Alexa Developer Console
- [`get`](#get): Synchronize your local project files with the Alexa Developer Console


## build

The Alexa CLI plugin hooks into the `build` command and creates a `platform.alexa` folder inside the `build` directory in the root of your Jovo project. [Learn more about the `build` command here](https://v4.jovo.tech/docs/build-command).

```sh
$ jovov4 build:platform alexa
```

It uses the [Alexa `jovo.project.js` configuration](./project-config.md) and files in the [`models` folder](https://v4.jovo.tech/docs/models) to create Alexa-specific project files that are ready for deployment.

The folder then contains an `ask-resources.json` file and a `skill-package` folder as explained in the [official Alexa docs](https://developer.amazon.com/en-US/docs/alexa/smapi/ask-cli-intro.html#skill-project-structure).

The Alexa CLI plugin adds the following flags to the [`build` command](https://v4.jovo.tech/docs/build-command):

| Flag | Description | Examples |
|---|---|---|
| `--ask-profile` | Add the specified ASK profile to the `ask-states.json` file. [Learn more about ASK profile configuration here](./project-config.md#askprofile).  | `--ask-profile default`  |



## deploy

The Alexa CLI plugin hooks into the `deploy:platform` command to deploy the Alexa project files (which were previously generated using the [`build` command](#build)) to the Alexa Developer Console. [Learn more about the `deploy:platform` command here](https://v4.jovo.tech/docs/deploy-command#deploy:platform).

```sh
$ jovov4 deploy:platform alexa
```

After successful deployment, you can open the [Alexa Developer Console](https://developer.amazon.com/alexa/console/ask#/) and see the changes there.

The Alexa CLI plugin adds the following flags to the [`deploy:platform` command](https://v4.jovo.tech/docs/deploy-command#deploy:platform):

| Flag | Description | Examples |
|---|---|---|
| `--ask-profile` | Deploy to using the specified ASK profile. [Learn more about ASK profile configuration here](./project-config.md#askprofile). | `--ask-profile default`  |



## get

The Alexa CLI plugin hooks into the `get:platform` command to synchronize the files in your `build` directory with the project data from the [Alexa Developer Console](https://developer.amazon.com/alexa/console/ask#/). [Learn more about the `get:platform` command here](https://v4.jovo.tech/docs/deploy-command#get:platform).

```sh
$ jovov4 get:platform alexa
```

This is helpful if you've made any updates to the Skill's configuration (for example updating interfaces) that you now want to add to the `jovo.project.js` file using the [`files` configuration](/.project-config.md#files).

The Alexa CLI plugin adds the following flags to the [`get:platform` command](https://v4.jovo.tech/docs/get-command#get:platform):

| Flag | Description | Examples |
|---|---|---|
| `--ask-profile` | Retrieve data using the specified ASK profile. [Learn more about ASK profile configuration here](./project-config.md#askprofile). | `--ask-profile default`  |