---
title: 'Google Assistant Platform Integration'
excerpt: 'The Google Assistant platform integration allows you to build custom Google Conversational Actions using Jovo.'
---

# Google Assistant Platform Integration

The Google Assistant [platform integration](https://www.jovo.tech/docs/platforms) allows you to build custom Google Conversational Actions using Jovo.

## Introduction

Apps for Google Assistant are called Google Actions. In 2020, Google introduced a new suite of tools called Google Conversational Actions and the Actions Builder. You can find a general introduction into building Google Actions in the [official Google Assistant documentation](https://developers.google.com/assistant/conversational/overview).

In the [installation](#installation) section, we're going to set up a Jovo project that works with Google Assistant.

An Google Conversational Action usually consists of two parts:

- The Google Action project in the Actions on Google Console (Actions Builder)
- The code that handles the logic of your Action

In the Actions on Google Console, the Google Action project is configured, including intents, entities, and scenes. Learn more about how to use the Jovo CLI to create and deploy Google Action projects in the [Actions on Google Console project](#actions-on-google-console-project) section.

If a user converses with your Action, Google Assistant sends API requests to your Action's code endpoint. The code is then responsible for returning an appropriate response. Learn more about how you can build this with the Jovo Framework in the [Google Action code](#google-action-code) section.

Jovo is a framework that allows you to build apps that work across devices and platforms. However, this does not mean that you can't build highly complex Google Actions with Jovo. Any custom Google Conversational Action that can be built with the official Actions SDK can also be built with the Jovo Framework. In the [platform-specific features](#platform-specific-features) section, we're going to take a look at Google Action features in Jovo.

## Installation

To create a new Google Assistant project with Jovo, we recommend installing the Jovo CLI, creating a new Jovo project, and selecting Google Assistant as platform using the CLI wizard. Learn more in our [getting started guide](https://www.jovo.tech/docs/getting-started).

```sh
# Install Jovo CLI globally
$ npm install -g @jovotech/cli

# Start new project wizard
# In the platform step, use the space key to select Google Assistant
$ jovo new <directory>
```

If you want to add Google Assistant to an existing Jovo project, you can install the plugin like this:

```sh
$ npm install @jovotech/platform-googleassistant
```

Add it as plugin to your [app configuration](https://www.jovo.tech/docs/app-config), e.g. `app.ts`:

```typescript
import { App } from '@jovotech/framework';
import { GoogleAssistantPlatform } from '@jovotech/platform-googleassistant';
// ...

const app = new App({
  plugins: [
    new GoogleAssistantPlatform(),
    // ...
  ],
});
```

You can also add the CLI plugin to your [project configuration](https://www.jovo.tech/docs/project-config) in `jovo.project.js`. [Learn more about the Google Assistant specific project configuration here](https://www.jovo.tech/marketplace/platform-googleassistant/project-config).

```js
const { ProjectConfig } = require('@jovotech/cli');
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

The Google Assistant CLI plugin uses the official `gactions` CLI provided by Google for deployment. [Follow the official Google Assistant docs to install and configure `gactions` CLI](https://developers.google.com/assistant/actionssdk/gactions#install_the_gactions_command-line_tool). A tip: To find the right path where to put the `gactions` binary, you can for example type `which jovov4` into your command line and place it into the same parent folder.

After successfully installing the Jovo Google Assistant packages, you can do the following:

- Use the Jovo CLI to [create a project in the Actions on Google Console](#actions-on-google-console-project)
- Use the Jovo Framework to [build the Google Action code](#google-action-code)

## Actions on Google Console Project

Jovo helps you manage your Google Action project in the [Actions on Google Console](https://console.actions.google.com/) using the Jovo CLI.

You can use the [`build` command](https://www.jovo.tech/marketplace/platform-googleassistant/cli-commands#build) to turn the [Google Assistant project configuration](https://www.jovo.tech/marketplace/platform-googleassistant/project-config) into Google Assistant specific files.

```sh
$ jovo build:platform googleAssistant
```

These files can be found in a folder called `platform.googleAssistant` in the `build` directory of your project. They include the [Google Assistant Conversational Model](https://www.jovo.tech/marketplace/platform-googleassistant/model) that is responsible for training Google Assistant's natural language understanding service.

The resulting files can then be deployed to the Actions on Google Console using the [`deploy:platform` command](https://www.jovo.tech/marketplace/platform-googleassistant/cli-commands#deploy).

```sh
$ jovo deploy:platform googleAssistant
```

Learn more on the following pages:

- [Google Assistant CLI Commands](https://www.jovo.tech/marketplace/platform-googleassistant/cli-commands)
- [Google Assistant Project Configuration](https://www.jovo.tech/marketplace/platform-googleassistant/project-config)
- [Google Assistant Language Model](https://www.jovo.tech/marketplace/platform-googleassistant/model)

## Google Action Code

The Jovo Google Assistant platform package is a [platform integration](https://www.jovo.tech/docs/platforms) that understands the types of requests Google Assistant sends and knows how to translate output into a Google Assistant response. To learn more about the Jovo request lifecycle, take a look at the [RIDR documentation](https://www.jovo.tech/docs/ridr-lifecycle).

When a user interacts with your Action through Google Assistant, the platform turns user input (usually speech or text) into structured meaning (usually _intents_ and _slots_). It then sends a request with this data to your Jovo app. [Learn more about the webhook request structure in the official Google Assistant docs](https://developers.google.com/assistant/conversational/webhooks?tool=builder#example-request).

The Jovo app then uses this request information to return output. For example, the code snippet below asks the user if they like pizza:

```typescript
LAUNCH() {
  return this.$send(YesNoOutput, { message: 'Do you like pizza?' });
}
```

If you want to learn more about how to return the right response, take a look at these concepts:

- [Components](https://www.jovo.tech/docs/components)
- [Handlers](https://www.jovo.tech/docs/handlers)
- [Output](https://www.jovo.tech/docs/output)

The output is then translated into a response that is returned to Google Assistant. [Learn more about the response structure in the official Google Assistant docs](https://developers.google.com/assistant/conversational/webhooks?tool=builder#example-response).

## Platform-Specific Features

You can access the Google Assistant specific object like this:

```typescript
this.$googleAssistant;
```

You can also use this object to see if the request is coming from Google Assistant (or a different platform):

```typescript
if (this.$googleAssistant) {
  // ...
}
```

### Google Assistant Concepts

Google Conversational Actions have a few concepts that are different compared to other platforms, for example:

- [Scenes](https://www.jovo.tech/marketplace/platform-googleassistant/project-config/scenes)

### User

There are various Google Assistant specific features added to the user class that can be accessed like this:

```typescript
this.$googleAssistant.$user;
```

Google Assistant has the concept of _verified_ users. Only if a user is verified (for example logged into their Google account on their mobile phone), data about the user can be stored. Learn more about the [expiration of user storage data in the official Google Assistant docs](https://developers.google.com/assistant/conversational/storage-user#expiration_of_user_storage_data).

You can check is a user is verified like this:

```typescript
this.$googleAssistant.$user.isVerified();
```

If a verified user interacts with the Google Action the first time, Jovo generates a user ID and store it into the `user.params._GOOGLE_ASSISTANT_USER_ID_` [user storage](https://developers.google.com/assistant/conversational/storage-user?hl=en) property. This ID will then be used to write and retrieve data using one of the [Jovo database integrations](https://www.jovo.tech/docs/databases).

Learn more about user specific methods here:

- [Account Linking](https://www.jovo.tech/marketplace/platform-googleassistant/account-linking)

### Output

There are various Google Assistant specific elements that can be added to the [output](https://www.jovo.tech/docs/output).

For output that is only used for Google Assistant, you can add the following to the output object:

```typescript
{
  // ...
  platforms: {
    googleAssistant: {
      // ...
    }
  }
}
```

You can add response objects that should show up exactly like this in the Google Assistant response object using the `nativeResponse` object:

```typescript
{
  // ...
  platforms: {
    googleAssistant: {
      nativeResponse: {
        // ...
      }
      // ...
    }
  }
}
```

### Health Checks

When your Action is live, Google sends requests they call _health checks_ to test if the code keeps returning an appropriate response. [Learn more in the official Google Assistant docs](https://developers.google.com/assistant/console/health-checks).

Jovo handles the health checks for you and automatically returns a valid response in the [`before.request.start` middleware](https://www.jovo.tech/docs/ridr-lifecycle#middlewares). Health check requests do not affect analytics or database integrations.

## Deployment

You can use the Jovo CLI plugin `GoogleAssistantCli` (learn how to set it up in the [installation section](#installation)) to build and deploy the Google Assistant project to the Actions on Google console.

The [`build` command](https://www.jovo.tech/marketplace/platform-googleassistant/cli-commands#build) uses the Jovo Model and [project configuration](https://www.jovo.tech/docs/project-config) to generate all files needed for the deployment:

```sh
# Build files into build/platform.googleAssistant
$ jovo build:platform googleAssistant
```

You can then use the `deploy` command to push the files to the Actions console:

```sh
# Deploy files to Actions console
$ jovo deploy:platform googleAssistant
```

You can also learn more about Google Assistant specific features here:

- [Model](https://www.jovo.tech/marketplace/platform-googleassistant/model)
