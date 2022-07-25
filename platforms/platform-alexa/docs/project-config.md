---
title: 'Alexa Project Configuration'
excerpt: 'Learn how to configure your Alexa projects using the Jovo CLI.'
---

# Alexa Project Configuration

Learn how to configure your Alexa projects using the `jovo.project.js` file.

## Introduction

The Alexa project configuration defines how the Alexa CLI plugin builds and deploys Alexa project files using the Jovo CLI. [Learn more about all Alexa CLI commands here](./cli-commands.md).

You can add the Alexa plugin for the Jovo CLI and its configurations to your [project configuration](https://www.jovo.tech/docs/project-config) in `jovo.project.js`:

```js
const { ProjectConfig } = require('@jovotech/cli-core');
const { AlexaCli } = require('@jovotech/platform-alexa');
// ...

const project = new ProjectConfig({
  // ...
  plugins: [
    new AlexaCli({
      locales: {
        // ...
      },
      skillId: '<yourSkillId>',
      askProfile: 'default',
      endpoint: '<yourEndpoint>',
      files: {
        // ...
      },
      conversations: {
        // ...
      },
    }),
    // ...
  ],
});
```

The following options are currently supported:

- [`locales`](#locales): Defines how the locales in the [`models` folder](https://www.jovo.tech/docs/models) should be mapped to Alexa locales.
- [`skillId`](#skillid): The Skill ID that the project should be deployed to.
- [`askProfile`](#askprofile): The ASK profile that should be used for the deployment.
- [`endpoint`](#endpoint): The endpoint to your Jovo app's code, for example on AWS Lambda.
- [`files`](#files): This can be used to add or override files in your Alexa `build` folder, for example to make updates to the `skill.json` file.
- [`conversations`](#conversations): This includes configurations for [Alexa Conversations](./alexa-conversations.md).

## locales

During the [`build` command](./cli-commands.md#build), the Jovo Model files in the [`models` folder](https://www.jovo.tech/docs/models) get turned into Alexa Interaction Models in the `build` folder.

The `models` folder can include files for generic languages (like `en`) as well as localized ones (like `en-US`). If you use files like `en.json`, you need to add a mapping to the `locales` configuration to make sure they're translated into locales supported by Alexa (see the [official Alexa documentation for supported locales](https://developer.amazon.com/en-US/docs/alexa/custom-skills/develop-skills-in-multiple-languages.html)).

The below example uses an `en` Jovo Model and creates `en-US` and `en-GB` Alexa Interaction Models:

```js
new AlexaCli({
  locales: {
    en: ['en-US', 'en-GB'],
  },
  // ...
});
```

## skillId

The first time you run the [`deploy` command](./cli-commands.md#deploy) for a new project, a new Alexa Skill project with a new ID is created in the [Alexa Developer Console](https://developer.amazon.com/alexa/console/ask#/).

You can then copy the ID and add it to your project configuration like this:

```js
new AlexaCli({
  skillId: '<yourSkillId>',
  // ...
});
```

This ensures that your project is always deployed to the right Skill. During the [`build` command](./cli-commands.md#build), the `skillId` is written into the `build/platform.alexa/.ask/ask-states.json` file, which is used during the deployment.

The `skillId` property can be especially helpful for [staging](https://www.jovo.tech/docs/staging), where different stages deploy to different Skills:

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
        }),
      ],
      // ...
    },
    prod: {
      endpoint: process.env.ENDPOINT_PROD,
      plugins: [
        new AlexaCli({
          skillId: '<prodSkillId>',
          // ...
        }),
      ],
      // ...
    },
  },
});
```

## askProfile

You can use the Jovo CLI together with the ASK CLI to deploy to different profiles (accounts). [Learn more about how to set up ASK profiles in the official Alexa docs](https://developer.amazon.com/en-US/docs/alexa/smapi/manage-credentials-with-ask-cli.html).

You can define which profile to deploy to using the `askProfile` property. This is the default configuration:

```js
new AlexaCli({
  askProfile: 'default',
  // ...
});
```

The `askProfile` property can be especially helpful for [staging](https://www.jovo.tech/docs/staging), where different stages deploy to different Alexa developer accounts:

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
        }),
      ],
      // ...
    },
    prod: {
      endpoint: process.env.ENDPOINT_PROD,
      plugins: [
        new AlexaCli({
          askProfile: '<prodAskProfile>',
          // ...
        }),
      ],
      // ...
    },
  },
});
```

You can also add the ASK profile as a flag in the `deploy:platform` command:

```sh
$ jovo deploy:platform alexa --ask-profile default
```

The CLI decides in the following order which ASK profile should be used:

- The one passed to the CLI using the `--ask-profile` flag
- The one in the current stage in `jovo.project.js`
- The one in the root Alexa configuration in `jovo.project.js`
- The `default` ASK profile

## endpoint

The [generic `endpoint` property](https://www.jovo.tech/docs/project-config#endpoint) can also be overridden by the Alexa CLI plugin. This is useful if you build for multiple platforms that need to use different endpoints.

```js
new AlexaCli({
  endpoint: '<yourEndpoint>',
  // ...
});
```

This can be especially helpful for [staging](https://www.jovo.tech/docs/staging). For example, the `dev` stage could use the [Jovo Webhook](https://www.jovo.tech/docs/webhook) for local development, and a `prod` stage for Alexa could reference an ARN that points to the hosted code on [AWS Lambda](https://www.jovo.tech/marketplace/server-lambda):

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
        new AlexaCli({
          endpoint: '<yourProdEndpoint>',
          // ...
        }),
      ],
      // ...
    },
  },
});
```

## files

You can use the [Jovo CLI File Builder](https://www.jovo.tech/docs/project-config#file-builder) to add or override files in a path of the Alexa folder in the `build` directory.

For example, you can make changes to the [`skill.json` file](https://developer.amazon.com/docs/alexa/smapi/skill-manifest.html) like this:

```js
new AlexaCli({
  files: {
    'skill-package/skill.json': {
      // Override skill.json content here
    },
  },
  // ...
});
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
                    maxWidth: 1920,
                  },
                  // ...
                ],
              },
            ],
          },
        },
      },
    },
  },
  // ...
});
```

You can find all [supported APL viewports in the official Alexa docs](https://developer.amazon.com/en-US/docs/alexa/alexa-presentation-language/apl-select-the-viewport-profiles-your-skill-supports.html#configure-the-supported-viewports-with-the-ask-cli-or-smapi).
