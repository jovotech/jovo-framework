# Google Assistant Platform Integration

## Getting Started

You can install the plugin like this:

```sh
$ npm install @jovotech/platform-googleassistant --save
```

Add it as plugin to your [app configuration](../docs/app-config.md), e.g. `app.ts`:

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

You can also add the CLI plugin to your [project configuration](../docs/project-config.md) in `jovo.project.js`:

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

* [Scenes](./docs/scenes.md)


### User

There are various Google Assistant specific features added to the user class that can be accessed like this:

```typescript
this.$googleAssistant.$user
```

Learn more about user specific methods here:

* [Account Linking](./docs/account-linking.md)



### Output

There are various Google Assistant specific elements that can be added to the [output](../../docs/output.md).

For output that is only used for Google Assistant, you can add the following to the output object:

```typescript
{
  // ...
  platforms: {
    GoogleAssistant: {
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
    GoogleAssistant: {
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

The `build` command uses the Jovo Model and [project configuration](../../docs/project-config.md) to generates all files needed for the deployment:

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

* [Model](./docs/model.md)
