---
title: 'Google Assistant Project Configuration'
excerpt: 'Learn how to configure your Google Assistant projects using the Jovo CLI.'
---

# Google Assistant Project Configuration

Learn how to configure your Google Assistant projects using the `jovo.project.js` file.

## Introduction

The Google Assistant project configuration defines how the Google Assistant CLI plugin builds and deploys Google Assistant project files using the Jovo CLI. [Learn more about all Google Assistant CLI commands here](./cli-commands.md).

You can add the Google Assistant plugin for the Jovo CLI and its configurations to your [project configuration](https://www.jovo.tech/docs/project-config) in `jovo.project.js`:

```js
const { ProjectConfig } = require('@jovotech/cli-core');
const { GoogleAssistantCli } = require('@jovotech/platform-googleassistant');
// ...

const project = new ProjectConfig({
  // ...
  plugins: [
    new GoogleAssistantCli({
      projectId: '<yourProjectId>',
      locales: {
        /* ... */
      },
      endpoint: '<yourEndpoint>',
      resourcesDirectory: 'resources',
      files: {
        /* ... */
      },
    }),
    // ...
  ],
});
```

The following options are currently supported:

- [`projectId`](#projectid) (required): The Google Action project ID that the project should be deployed to.
- [`locales`](#locales): Defines how the locales in the [`models` folder](https://www.jovo.tech/docs/models) should be mapped to Google Assistant locales.
- [`endpoint`](#endpoint): The endpoint to your Jovo app's code, for example on AWS Lambda.
- [`resourcesDirectory`](#resourcesdirectory): The folder where resources are maintained.
- [`files`](#files): This can be used to add or override files in your Google Assistant `build` folder.

## projectId

The `gactions` CLI can't create Google Actions projects, so before the first time you use the the [`deploy` command](./cli-commands.md#deploy), you need to head to the [Google Actions Console](https://console.actions.google.com/) and create a new Google Action project using the Actions Builder. [Learn how to create a project in the official Google Assistant docs](https://developers.google.com/assistant/conversational/build/projects?tool=builder#create_a_project).

It is important that the project has the "Actions API" enabled in the [Google Cloud API Console](https://console.developers.google.com/) so that the CLI can access it. You can use this URL structure to reach the setting: `https://console.cloud.google.com/apis/library/actions.googleapis.com?project=<yourProjectId>` (if you're logged into multiple accounts, you need to potentially add the number of the logged in account, e.g. `&authuser=1`).

You can then head to the project settings (they can be found by clicking the three dots next to your profile picture at the top right), copy the project ID, and add it to your project configuration like this:

```js
new GoogleAssistantCli({
  projectId: '<yourProjectId>',
  // ...
});
```

This ensures that your project is always deployed to the right Google Action project.

The `projectId` property can be especially helpful for [staging](https://www.jovo.tech/docs/staging), where different stages deploy to different Actions:

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
        }),
      ],
      // ...
    },
    prod: {
      endpoint: process.env.ENDPOINT_PROD,
      plugins: [
        new GoogleAssistantCli({
          projectId: '<prodProjectId>',
          // ...
        }),
      ],
      // ...
    },
  },
});
```

## locales

During the [`build` command](./cli-commands.md#build), the Jovo Model files in the [`models` folder](https://www.jovo.tech/docs/models) get turned into Google Assistant conversation models in the `build` folder.

The `models` folder can include files for generic languages (like `en`) as well as localized ones (like `en-US`). Google Assistant requires you to use generic locales like `en`. Additionally, you can add localized ones like `en-US`. See the [official Google Assistant documentation for supported locales](https://developers.google.com/assistant/console/languages-locales?hl=en)).

If you only want to go with generic models like `en` and for example have an `en.json` Jovo Model, there is nothing you need to configure. However, if you use files like `en-US.json`, you need to add a mapping to the `locales` configuration to make sure that an `en` model is added to the Google Action as well.

The below example uses an `en-US` Jovo Model and creates `en` and `en-US` Google Action models:

```js
new GoogleAssistantCli({
  locales: {
    'en-US': ['en', 'en-US'],
  },
  // ...
});
```

## endpoint

The [generic `endpoint` property](https://www.jovo.tech/docs/project-config#endpoint) can also be overridden by the Google Assistant CLI plugin. This is useful if you build for multiple platforms that need to use different endpoints.

```js
new GoogleAssistantCli({
  endpoint: '<yourEndpoint>',
  // ...
});
```

This can be especially helpful for [staging](https://www.jovo.tech/docs/staging). For example, the `dev` stage could use the [Jovo Webhook](https://www.jovo.tech/docs/webhook) for local development, and a `prod` stage for Google Assistant could reference an API Gateway URL that points to the hosted code on [AWS Lambda](https://www.jovo.tech/marketplace/server-lambda):

```js
const project = new ProjectConfig({
  // ...

  defaultStage: 'dev',
  stages: {
    dev: {
      endpoint: '${JOVO_WEBHOOK_URL}',
      // ...
    },
    prod: {
      plugins: [
        new GoogleAssistantCli({
          endpoint: '<yourProdEndpoint>',
          // ...
        }),
      ],
      // ...
    },
  },
});
```

## resourcesDirectory

Google Assistant offers the ability to maintain resources/assets in a local folder and reference them in your settings using a `$resources` variable. [Learn more in the official Google Assistant docs](https://developers.google.com/assistant/conversational/build/projects?hl=en&tool=sdk#add_resources).

To enable this feature, you need to set the `resourcesDirectory` option in the Google Assistant CLI config:

```js
new GoogleAssistantCli({
  resourcesDirectory: 'resources',
});
```

In the example above, the directory is called `resources` in the root of your Jovo project.

During the [`build` command](./cli-commands.md#build), the files from the specified folder are then copied over to a `resources` folder in the `build/platform.googleAssistant` folder.

## files

You can use the [Jovo CLI File Builder](https://www.jovo.tech/docs/project-config#file-builder) to add or override files in a path of the Google Assistant folder in the `build` directory.

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
});
```

The JSON content will be turned into YAML content to fit the `settings.yaml` file structure.

One use case for this is to edit the settings in the [Actions on Google Console](https://console.actions.google.com/), retrieve the files using the [`get` command](./cli-commands.md#get), and then add all necessary settings to `files` to keep `jovo.project.js` as single source of truth.
