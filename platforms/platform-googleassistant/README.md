---
title: 'Google Assistant Platform Integration'
excerpt: 'The Google Assistant platform integration allows you to build custom Google Conversational Actions using Jovo.'
---
# Google Assistant Platform Integration

The Google Assistant [platform integration](https://v4.jovo.tech/docs/platforms) allows you to build custom Google Conversational Actions using Jovo.

## Getting Started

You can install the plugin like this:

```sh
$ npm install @jovotech/platform-googleassistant
```

Add it as plugin to your [app configuration](https://v4.jovo.tech/docs/app-config), e.g. `app.ts`:

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

You can also add the CLI plugin to your [project configuration](https://v4.jovo.tech/docs/project-config) in `jovo.project.js`:

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

## Platform-Specific Features

You can access the Google Assistant specific object like this:

```typescript
this.$googleAssistant
```

You can also use this object to see if the request is coming from Google Assistant (or a different platform):

```typescript
if(this.$googleAssistant) {
  // ...
}
```

### Google Assistant Concepts

Google Conversational Actions have a few concepts that are different compared to other platforms, for example:

* [Scenes](https://v4.jovo.tech/marketplace/platform-googleassistant/project-config/scenes)


### User

There are various Google Assistant specific features added to the user class that can be accessed like this:

```typescript
this.$googleAssistant.$user
```

Google Assistant has the concept of *verified* users. Only if a user is verified (for example logged into their Google account on their mobile phone), data about the user can be stored. Learn more about the [expiration of user storage data in the official Google Assistant docs](https://developers.google.com/assistant/conversational/storage-user#expiration_of_user_storage_data).

You can check is a user is verified like this:

```typescript
this.$googleAssistant.$user.isVerified()
```

If a verified user interacts with the Google Action the first time, Jovo generates a user ID and store it into the `user.params._GOOGLE_ASSISTANT_USER_ID_` [user storage](https://developers.google.com/assistant/conversational/storage-user?hl=en) property. This ID will then be used to write and retrieve data using one of the [Jovo database integrations](https://v4.jovo.tech/docs/databases).

Learn more about user specific methods here:

* [Account Linking](https://v4.jovo.tech/marketplace/platform-googleassistant/account-linking)



### Output

There are various Google Assistant specific elements that can be added to the [output](https://v4.jovo.tech/docs/output).

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

## Deployment

You can use the Jovo CLI plugin `GoogleAssistantCli` (learn how to set it up in the [getting started section](#getting-started)) to build and deploy the Google Assistant project to the Google Actions console.

The `build` command uses the Jovo Model and [project configuration](https://v4.jovo.tech/docs/project-config) to generate all files needed for the deployment:

```sh
# Build files into build/platform.googleAssistant
$ jovo build
```

You can then use the `deploy` command to push the files to the Actions console:

```sh
# Deploy files to Actions console
$ jovo deploy:platform googleAssistant
```

You can also learn more about Google Assistant specific features here:

* [Model](https://v4.jovo.tech/marketplace/platform-googleassistant/model)
