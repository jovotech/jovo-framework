# Google Assistant Project Configuration

Learn how to build and deploy Google Assistant projects using the Jovo CLI.

- [Introduction](#introduction)
- [Configuration](#configuration)
  - [projectId](#projectid)
  - [locales](#locales)
  - [files](#files)
- [build Command](#build-command)
- [deploy Command](#deploy-command)
- [get Command](#get-command)

## Introduction

You can add the Google Assistant plugin for the Jovo CLI to your [project configuration](https://github.com/jovotech/jovo-framework/blob/v4dev/docs/project-config.md) in `jovo.project.js`:

```js
const { ProjectConfig } = require('@jovotech/cli');
const { GoogleAssistantCli } = require('@jovotech/platform-googleassistant');
// ...

const project = new ProjectConfig({
  // ...
  plugins: [
    new GoogleAssistantCli(),
    // ...
  ]
});
```

The CLI plugin hooks into the [`build` command](#build-command) to generate Google Assistant project files, including a conversation model based on the Jovo Model in the [`models` folder](https://github.com/jovotech/jovo-framework/blob/v4dev/docs/models.md) of your project.

You can then use the [`deploy` command](#deploy-command) to update your Google Action project in the [Google Actions Console](https://console.actions.google.com/). You can also use the [`get` command](#get-command) to synchronize local files after making edits to the project in the console.

This CLI plugin uses the official `gactions` CLI provided by Google for deployment. [Follow the official Google Assistant docs to install and configure `gactions` CLI](https://developers.google.com/assistant/actionssdk/gactions#install_the_gactions_command-line_tool). A tip: To find the right path where to put the `gactions` binary, you can for example type `which jovov4` into your command line and place it into the same parent folder.


## Configuration

You can add configurations like this:

```js
new GoogleAssistantCli({
  projectId: '<yourProjectId>',
  locales: { /* ... */ },
  files: { /* ... */ },
})
```

The following options are currently supported:

* [`projectId`](#projectid) (required): The Google Action project ID that the project should be deployed to.
* [`locales`](#locales): Defines how the locales in the [`models` folder](https://github.com/jovotech/jovo-framework/blob/v4dev/docs/models.md) should be mapped to Google Assistant locales.
* [`files`](#files): This can be used to add or override files in your Google Assistant `build` folder.



### projectId

The `gactions` CLI can't create Google Actions projects, so before the first time you use the the [`deploy` command](#deploy-command), you need to head to the [Google Actions Console](https://console.actions.google.com/) and create a new Google Action project using the Actions Builder. [Learn how to create a project in the official Google Assistant docs](https://developers.google.com/assistant/conversational/build/projects?tool=builder#create_a_project).

It is important that the project has the "Actions API" enabled in the [Google Cloud API Console](https://console.developers.google.com/) so that the CLI can access it. You can use this URL structure to reach the setting: `https://console.cloud.google.com/apis/library/actions.googleapis.com?project=<yourProjectId>` (if you're logged into multiple accounts, you need to potentially add the number of the logged in account, e.g. `&authuser=1`).

You can then head to the project settings (they can be found by clicking the three dots next to your profile picture at the top right), copy the project ID, and add it to your project configuration like this:

```js
new GoogleAssistantCli({
  projectId: '<yourProjectId>',
  // ...
})
```

This ensures that your project is always deployed to the right Google Action project.

The `projectId` property can be especially helpful for [staging](https://github.com/jovotech/jovo-framework/blob/v4dev/docs/staging.md), where different stages deploy to different Actions:

```js
const project = new ProjectConfig({
  // ...

  defaultStage: 'dev',
  stages: {
    dev: {
      endpoint: '${JOVO_WEBHOOK_URL}',
      plugins: [
        new GoogleAssistantCli({
          projectId: '<devProjectId>',
          // ...
        })
      ]
      // ...
    },
    prod: {
      endpoint: process.env.ENDPOINT_PROD,
      plugins: [
        new GoogleAssistantCli({
          projectId: '<prodProjectId>',
          // ...
        })
      ]
      // ...
    }
  }
});
```


### locales

During the [`build` command](#build-command), the Jovo Model files in the [`models` folder](https://github.com/jovotech/jovo-framework/blob/v4dev/docs/models.md) get turned into Google Assistant conversation models in the `build` folder.

The `models` folder can include files for generic languages (like `en`) as well as localized ones (like `en-US`). Google Assistant requires you to use generic locales like `en`. Additionally, you can add localized ones like `en-US`. See the [official Google Assistant documentation for supported locales](https://developers.google.com/assistant/console/languages-locales?hl=en)).

If you only want to go with generic models like `en` and for example have an `en.json` Jovo Model, there is nothing you need to configure. However, if you use files like `en-US.json`, you need to add a mapping to the `locales` configuration to make sure that an `en` model is added to the Google Action as well. 

The below example uses an `en-US` Jovo Model and creates `en` and `en-US` Google Action models:

```js
new GoogleAssistantCli({
  locales: {
    'en-US': [ 'en', 'en-US' ],
  },
  // ...
})
```


### files

You can use the [Jovo CLI File Builder](https://github.com/jovotech/jovo-framework/blob/v4dev/docs/project-config.md#file-builder) to add or override files in a path of the Google Assistant folder in the `build` directory.

For example, you can make changes to the `settings.yaml` file like this:

```js
new GoogleAssistantCli({
  files: {
    'settings/settings.yaml': {
      localizedSettings: {
        displayName: 'My App Name',
      },
    },
  },
  // ...
})
```

The JSON content will be turned into YAML content to fit the `settings.yaml` file structure.

One use case for this is to edit the settings in the [Google Actions Console](https://console.actions.google.com/), retrieve the files using the [`get` command](#get-command), and then add all necessary settings to `files` to keep `jovo.project.js` as single source of truth.



## build Command

The `build` command creates a `platform.googleAssistant` folder inside the `build` directory in the root of your Jovo project.

```sh
$ jovov4 build
```

It uses [configuration](#configuration) from the `jovo.project.js` and files in the [`models` folder](https://github.com/jovotech/jovo-framework/blob/v4dev/docs/models.md) to create Google Assistant-specific project files that are ready for deployment.

The folder then contains several files and folders, including `actions`, `custom`, `settings`, and `webhooks`.


## deploy Command

After generating the files using the [`build` command](#build-command), you can deploy the Google Action project like this:

```sh
$ jovov4 deploy:platform googleAssistant
```

After successful deployment, you can open the [Google Actions Console](https://console.actions.google.com/) and see the changes there.

It is possible that the deployment process results in a few warnings, for example `Short description is required`. This is not a problem for deployment. Before you want to release the Action, make sure to fill out all directory information. We recommend doing that using the [Google Actions Console](https://console.actions.google.com/) and then retrieving the settings using the [`get` command](#get-command). They can then be added to the build process using the [`files` configuration](#files).



## get Command

You can synchronize a Google Action by pulling files from the [Google Actions Console](https://console.actions.google.com/) into your `build` directory like this.

```sh
$ jovov4 get googleAssistant
```

This is helpful if you've made any updates to the Action's configuration (for example directory information) that you now want to add to the `jovo.project.js` file using the [`files` configuration](#files).