# Platforms

Platform integrations are responsible for communicating with platforms like Alexa, Google Assistant, the web, and more.

- [Introduction](#introduction)
- [Configuration](#configuration)
  - [App Configuration](#app-configuration)
  - [Project Configuration](#project-configuration)
- [Platform-Specific Features](#platform-specific-features)

## Introduction

A Jovo app can be connected to a lot of different platforms. For the framework to understand how to communicate with a platform like Alexa, you need to install a Jovo platform integration.

A platform integration is responsible for tasks across the [RIDR Lifecycle](./ridr-lifecycle.md), including:

* Understand a platform's request and extract the relevant information
* Provide [platform-specific features](#platform-specific-features) only relevant for the respective platform
* Translate [structured output](./output.md) into a native response that is understood by the platform

Additionally, many platform integrations also provide CLI plugins that make it easier to build and deploy platform projects using the Jovo CLI.

## Configuration

Platforms usually come with two plugin types and their configurations: [App plugins](#app-configuration) and [CLI plugins](#project-configuration).


### App Configuration

You can add a platform integration to the `plugins` array of the [app configuration](./app-config.md). The naming convention is an appended `Platform` after the platform's name. Here is an example for `AlexaPlatform`:

```typescript
import { AlexaPlatform } from '@jovotech/platform-alexa';

// ...

const app = new App({
  plugins: [
    new AlexaPlatform({
      // Configuration
    })
  ],
  // ...
});
```

You can find the specific configuration for each platform integration in its respective documentation.


### Project Configuration

You can add a platform CLI integration to the `plugins` array of the [project configuration](./project-config.md). The naming convention is an appended `Cli` after the platform's name. Here is an example for `AlexaCli`:


```js
const { AlexaCli } = require('@jovotech/platform-alexa');
// ...

const project = new ProjectConfig({
  // ...
  plugins: [
    new AlexaCli({
      // Configuration
    })
  ],
});
```

You can find the specific configuration for each platform CLI integration in its respective documentation.


## Platform-Specific Features

Each platform integration offers a variety of platform-specific features. You can access the platform's Jovo object by using the platform name:

```typescript
this.$alexa
```

If the request came from a different platform, the value of all other platform objects is `undefined`. This way you can distinguish between different platforms in your [handlers](./handlers.md) or [output classes](./output.md). 

```typescript
if(this.$alexa) {
  // ...
}
```

Potentially, a platform can have various platform specific features and classes. For example, you can `$alexa` specific Jovo objects like this:

```typescript
this.$alexa.$user
this.$alexa.$request
this.$alexa.$response
```

You can find all platform-specific features in the respective platform integration's documentation.
