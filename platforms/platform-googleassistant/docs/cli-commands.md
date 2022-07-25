---
title: 'Google Assistant CLI Commands'
excerpt: 'Learn how to build and deploy Google Assistant projects using the Jovo CLI.'
---

# Google Assistant CLI Commands

Learn how to build and deploy Google Assistant projects using the Jovo CLI.

## Introduction

The Google Assistant CLI plugin allows you to interact with the [Actions on Google Console](https://console.actions.google.com/) using the Jovo CLI.

To use the Google Assistant CLI, add it as plugin to your `jovo.project.js` file. [Learn more about Google Assistant project configuration here](./project-config.md).

```js
const { ProjectConfig } = require('@jovotech/cli-core');
const { GoogleAssistantCli } = require('@jovotech/platform-googleassistant');
// ...

const project = new ProjectConfig({
  // ...
  plugins: [
    new GoogleAssistantCli(),
    // ...
  ],
});
```

This CLI plugin uses the official `gactions` CLI provided by Google for deployment. [Follow the official Google Assistant docs to install and configure `gactions` CLI](https://developers.google.com/assistant/actionssdk/gactions#install_the_gactions_command-line_tool). A tip: To find the right path where to put the `gactions` binary, you can for example type `which jovov4` into your command line and place it into the same parent folder.

The `gactions` CLI is also available as an [NPM package](https://www.npmjs.com/package/@assistant/gactions) since 2021. Instead of downloading the binary, you can alo install it like this:

```sh
$ npm install -g @assistant/gactions
```

The Google Assistant CLI plugin hooks into the following commands:

- [`build`](#build): Create Google Assistant project files based on the project config and `models` folder
- [`deploy`](#deploy): Deploy project files to the Actions on Google Console
- [`get`](#get): Synchronize your local project files with the Actions on Google Console

## build

The Google Assistant CLI plugin hooks into the `build` command and creates a `platform.googleAssistant` folder inside the `build` directory in the root of your Jovo project. [Learn more about the `build` command here](https://www.jovo.tech/docs/build-command).

```sh
$ jovo build:platform googleAssistant
```

It uses [Google Assistant `jovo.project.js` configuration](./project-config.md) and files in the [`models` folder](https://www.jovo.tech/docs/models) to create Google Assistant-specific project files that are ready for deployment.

The folder then contains several files and folders, including `actions`, `custom`, `settings`, and `webhooks`.

The Google Assistant CLI plugin adds the following flags to the [`build:platform` command](https://www.jovo.tech/docs/build-command#build:platform):

| Flag           | Description                                                                                                                                          | Examples                       |
| -------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------ |
| `--project-id` | Add the specified project ID to the Google Assistant project files. [Learn more about project ID configuration here](./project-config.md#projectid). | `--project-id <yourProjectId>` |

## deploy

The Google Assistant CLI plugin hooks into the `deploy:platform` command to deploy the Google Assistant project files (which were previously generated using the [`build` command](#build)) to the Actions on Google Console. [Learn more about the `deploy:platform` command here](https://www.jovo.tech/docs/deploy-command#deploy:platform).

```sh
$ jovo deploy:platform googleAssistant
```

After successful deployment, you can open the [Google Actions Console](https://console.actions.google.com/) and see the changes there.

It is possible that the deployment process results in a few warnings, for example `Short description is required`. This is not a problem for deployment. Before you want to release the Action, make sure to fill out all directory information. We recommend doing that using the [Google Actions Console](https://console.actions.google.com/) and then retrieving the settings using the [`get` command](#get-command). They can then be added to the build process using the [`files` configuration](./project-config.md#files).

The Google Assistant CLI plugin adds the following flags to the [`deploy:platform` command](https://www.jovo.tech/docs/deploy-command#deploy:platform):

| Flag           | Description                                                                                                          | Examples                       |
| -------------- | -------------------------------------------------------------------------------------------------------------------- | ------------------------------ |
| `--project-id` | Deploy to the specified project ID. [Learn more about project ID configuration here](./project-config.md#projectid). | `--project-id <yourProjectId>` |

## get

The Google Assistant CLI plugin hooks into the `get:platform` command to synchronize the files in your `build` directory with the project data from the [Actions on Google Console](https://console.actions.google.com/). [Learn more about the `get:platform` command here](https://www.jovo.tech/docs/deploy-command#get:platform).

```sh
$ jovo get:platform googleAssistant
```

This is helpful if you've made any updates to the Action's configuration (for example directory information) that you now want to add to the `jovo.project.js` file using the [`files` configuration](./project-config.md#files).

The Google Assistant CLI plugin adds the following flags to the [`get:platform` command](https://www.jovo.tech/docs/get-command#get:platform):

| Flag           | Description                                                                                                                    | Examples                       |
| -------------- | ------------------------------------------------------------------------------------------------------------------------------ | ------------------------------ |
| `--project-id` | Retrieve files from the specified project ID. [Learn more about project ID configuration here](./project-config.md#projectid). | `--project-id <yourProjectId>` |
