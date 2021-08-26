# Alexa Project Configuration

Learn how to build and deploy Alexa projects using the Jovo CLI.

- [Introduction](#introduction)
- [Configuration](#configuration)
  - [locales](#locales)
  - [skillId](#skillid)
  - [askProfile](#askprofile)
  - [files](#files)
- [Build Command](#build-command)
- [Deploy Command](#deploy-command)

## Introduction

You can add the Alexa plugin for the Jovo CLI to your [project configuration](https://github.com/jovotech/jovo-framework/blob/v4dev/docs/project-config.md) in `jovo.project.js`:

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

The CLI plugin hooks into the [`build` command](#build-command) to generate Alexa project files, including an Alexa Interaction Model based on the Jovo Model in the [`models` folder](https://github.com/jovotech/jovo-framework/blob/v4dev/docs/models.md) of your project.

You can then use the [`deploy` command](#deploy-command) to update your Alexa Skill project in the [Alexa Developer Console](https://developer.amazon.com/alexa/console/ask#/).

This CLI plugin uses the official ASK (Alexa Skills Kit) CLI provided by Amazon for deployment. [Follow the official Alexa docs to install and configure ASK CLI](https://developer.amazon.com/en-US/docs/alexa/smapi/quick-start-alexa-skills-kit-command-line-interface.html).


## Configuration

You can add configurations like this:

```js
new AlexaCli({
  locales: { /* ... */ },
  skillId: '<yourSkillId>',
  askProfile: 'default',
  files: { /* ... */ },
})
```

The following options are currently supported:

* [`locales`](#locales): Defines how the locales in the [`models` folder](https://github.com/jovotech/jovo-framework/blob/v4dev/docs/models.md) should be mapped to Alexa locales.
* [`skillId`](#skillid): The Skill ID that the project should be deployed to.
* [`askProfile`](#askprofile): The ASK profile that should be used for the deployment.
* [`files`](#files): This can be used to add or override files in your Alexa `build` folder, for example to make updates to the `skill.json` file.

### locales

During the [`build` command](#build-command), the Jovo Model files in the [`models` folder](https://github.com/jovotech/jovo-framework/blob/v4dev/docs/models.md) get turned into Alexa Interaction Models in the `build` folder.

The `models` folder can include files for generic languages (like `en`) as well as localized ones (like `en-US`). If you use files like `en.json`, you need to add a mapping to the `locales` configuration to make sure they're translated into locales supported by Alexa (see the [official Alexa documentation for supported locales](https://developer.amazon.com/en-US/docs/alexa/custom-skills/develop-skills-in-multiple-languages.html)).

The below example uses an `en` Jovo Model and creates `en-US` and `en-GB` Alexa Interaction Models:

```js
new AlexaCli({
  locales: {
    en: [ 'en-US', 'en-GB' ],
  },
  // ...
})
```

### skillId

The first time you run the [`deploy` command](#deploy-command) for a new project, a new Alexa Skill project with a new ID is created in the [Alexa Developer Console](https://developer.amazon.com/alexa/console/ask#/).

You can then copy the ID and add it to your project configuration like this:

```js
new AlexaCli({
  skillId: '<yourSkillId>',
  // ...
})
```

This ensures that your project is always deployed to the right Skill.

The `skillId` property can be especially helpful for [staging](https://github.com/jovotech/jovo-framework/blob/v4dev/docs/staging.md), where different stages deploy to different Skills:

```js
const project = new ProjectConfig({
  // ...

  defaultStage: 'dev',
  stages: {
    dev: {
      endpoint: '${JOVO_WEBHOOK_URL}',
      plugins: [
        new AlexaCli({
          skillId: '<devSkillId>',
          // ...
        })
      ]
      // ...
    },
    prod: {
      endpoint: process.env.ENDPOINT_PROD,
      plugins: [
        new AlexaCli({
          skillId: '<prodSkillId>',
          // ...
        })
      ]
      // ...
    }
  }
});
```


### askProfile

You can use the Jovo CLI together with the ASK CLI to deploy to different profiles (accounts). [Learn more about how to set up ASK profiles in the official Alexa docs](https://developer.amazon.com/en-US/docs/alexa/smapi/manage-credentials-with-ask-cli.html).

You can define which profile to deploy to using the `askProfile` property. This is the default configuration:

```js
new AlexaCli({
  askProfile: 'default',
  // ...
})
```

The `askProfile` property can be especially helpful for [staging](https://github.com/jovotech/jovo-framework/blob/v4dev/docs/staging.md), where different stages deploy to different Alexa developer accounts:

```js
const project = new ProjectConfig({
  // ...

  defaultStage: 'dev',
  stages: {
    dev: {
      endpoint: '${JOVO_WEBHOOK_URL}',
      plugins: [
        new AlexaCli({
          askProfile: '<devAskProfile>',
          // ...
        })
      ]
      // ...
    },
    prod: {
      endpoint: process.env.ENDPOINT_PROD,
      plugins: [
        new AlexaCli({
          askProfile: '<prodAskProfile>',
          // ...
        })
      ]
      // ...
    }
  }
});
```

### files

You can use the [Jovo CLI File Builder](https://github.com/jovotech/jovo-framework/blob/v4dev/docs/project-config.md#file-builder) to add or override files in a path of the Alexa folder in the `build` directory.

For example, you can make changes to the `skill.json` file like this:

```js
new AlexaCli({
  files: {
    'skill-package/skill.json': {
      // Override skill.json content here
    },
  },
  // ...
})
```

You can add content to `skill.json` by using the same path of the file's content. For example, this is how you can add APL as supported interface:

```js
new AlexaCli({
  files: {
    'skill-package/skill.json': {
      manifest: {
        apis: {
          custom: {
            interfaces: [
              {
                type: 'ALEXA_PRESENTATION_APL',
                supportedViewports: [
                  {
                    mode: 'HUB',
                    shape: 'RECTANGLE',
                    minHeight: 600,
                    maxHeight: 1279,
                    minWidth: 1280,
                    maxWidth: 1920
                  },
                  // ...
                ]
              }
            ],
          },
        },
      },
    },
  },
  // ...
})
```

You can find all [supported APL viewports in the official Alexa docs](https://developer.amazon.com/en-US/docs/alexa/alexa-presentation-language/apl-select-the-viewport-profiles-your-skill-supports.html#configure-the-supported-viewports-with-the-ask-cli-or-smapi).


## Build Command

The `build` command creates a `platform.alexa` folder inside the `build` directory in the root of your Jovo project.

```sh
$ jovov4 build
```

It uses [configuration](#configuration) from the `jovo.project.js` and files in the [`models` folder](https://github.com/jovotech/jovo-framework/blob/v4dev/docs/models.md) to create Alexa-specific project files that are ready for deployment.

The folder then contains an `ask-resources.json` file and a `skill-package` folder as explained in the [official Alexa docs](https://developer.amazon.com/en-US/docs/alexa/smapi/ask-cli-intro.html#skill-project-structure).


## Deploy Command

After generating the files using the [`build` command](#build-command), you can deploy the Skill project like this:

```sh
$ jovov4 deploy:platform alexa
```

After successful deployment, you can open the [Alexa Developer Console](https://developer.amazon.com/alexa/console/ask#/) and see the changes there.