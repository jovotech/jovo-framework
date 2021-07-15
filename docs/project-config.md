# Project Configuration

The Jovo project config is used by the Jovo CLI to build and deploy your project to various platforms. [For app related configuration, take a look here](./app-config.md).

- [Introduction](#introduction)
- [Endpoint](#endpoint)
- [Plugins](#plugins)
  - [Installation](#installation)
  - [Configuration](#configuration)
  - [File Builder](#file-builder)
- [Staging](#staging)
- [Hooks](#hooks)

## Introduction

The Jovo project configuration is found in a file called `jovo.project.js` in your project's root folder.

Here is how it usually looks like for new Jovo projects:

```js
const { ProjectConfig } = require('@jovotech/cli-core');

// ...

const project = new ProjectConfig({
	endpoint: '${JOVO_WEBHOOK_URL}',
	plugins: [
		// Add Jovo CLI plugins here
	],
});
```

It consists of the following elements:

* [`endpoint`](#endpoint): How the platform can call your Jovo app, e.g. Jovo Webhook URL.
* [`plugins`](#plugins): CLI plugins that are used, e.g. Alexa.
* [Staging](#staging): Set up different staging environments, e.g. `dev` and `prod`.
* [`hooks`](#hooks): Hook into CLI commands, e.g. to retrieve data from an API before running the `build` command.


## Endpoint

The `endpoint` is being used to tell a platform where it can find the Jovo app.

The default is the Jovo Webhook for local development. The `'${JOVO_WEBHOOK_URL}'` string is automatically replaced with your webhook URL during the `build` process.

```js
const project = new ProjectConfig({
	endpoint: '${JOVO_WEBHOOK_URL}',
	// ...
});
```



## Plugins

Jovo CLI plugins can be used for many use cases. Here are some examples:

* Platform CLI integrations like `AlexaCli` provide the necessary tools to `build` the Alexa interaction model and `deploy` the project to the Alexa developer console.
* Deployment CLI integrations like `ServerlessCli` allow you to `deploy` your Jovo app to a cloud environment using the Serverless Framework.
* CLI plugins can even create their own Jovo CLI commands.
  
In the next few sections, we'll take a closer look how CLI plugins can be [installed](#installation), [configured](#configuration), and how the Jovo [File Builder](#file-builder) can be used in some cases.


### Installation

You can add CLI plugins to the `plugins` array of the project config. Here is an example for Amazon Alexa:

```js
const { ProjectConfig } = require('@jovotech/cli-core');
const { AlexaCli } = require('@jovotech/platform-alexa');

// ...

const project = new ProjectConfig({
	// ...
	plugins: [
		new AlexaCli()
	],
});
```

Many of the platforms or plugins that you add to your [app config](./app-config.md) already come with a CLI plugin. This means that you don't need to install the CLI package separately, if the plugin specific documentation doesn't tell you otherwise.


### Configuration

For each CLI plugin, you can add configurations as an array of options that you pass to the plugin when you instantiate it:

```js
const project = new ProjectConfig({
  // ...
	plugins: [
		new AlexaCli({
      // Configuration
    })
	],
});
```

Each plugin has its own set of options that you can find on the respective documentation pages.


### File Builder

For each CLI plugin that hooks into the `build` command, you can use the Jovo File Builder to write specific files into a path of the `build` directory.

You can add the paths and file content to the `files` property of the plugin config:

```js
const project = new ProjectConfig({
  // ...
	plugins: [
		new AlexaCli({
      files: {
        path: {
          to: {
            'file.json': 'Hello World!'
          }
        }
      }
    })
	],
});
```

The above example creates a file in `build/alexa/path/to/file.json` with the content `Hello World!`.

You can also use this shorthand for nested folders:

```js
const project = new ProjectConfig({
  // ...
	plugins: [
		new AlexaCli({
      files: {
        'path.to.file.json': 'Hello World!'
      }
    })
	],
});
```


## Staging

Project staging allows you to `build` for and `deploy` to specific staging environments. A common use case is to have a `dev` stage for local development and a `prod` stage hosted in the cloud.

Here is an example, how this could look like:

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
      endpoint: process.env.ENDPOINT_PROD,
      // ...
    }
  }
});
```

In the example above, each stage has its own [`endpoint`](#endpoint). The `dev` stage uses the Jovo Webhook URL, and the `prod` stage a URL to a hosted service that is provided via environment variables in a `.env` file.

You can add any stage name to the `stages` object:

```js
const project = new ProjectConfig({
	// ...
  stages: {
    someStage: {
      // ...
    }
  }
});
```

Inside this stage, you can add any configuration that you can also add outside a stage, even `plugins`:

```js
const project = new ProjectConfig({
	// ...
  stages: {
    someStage: {
      // ...
      plugins: {
        new AlexaCli({ skillId: 'someSkillId' });
      }
    }
  }
});
```

By default, only the elements outside the `stages` are used. If a specific stage is active, all content from this stage is merged into the generic config.

The active stage is determined in the following order (most active first):

* The stage is added as flag, e.g. `jovov4 build --stage someStage`
* The default stage is set with `defaultStage: 'someStage'`
* The stage is set in the environment variables with `NODE_ENV=someStage`


## Hooks

It's sometimes necessary to make small adjustments before running a Jovo CLI command. CLI Hooks provide a way, to do just that. For example, a hook could be used to retrieve data from an API or a CMS before running the `build` command.

Hooks can be added like this:

```js
const project = new ProjectConfig({
	// ...
  hooks: {
    // ...
  },
});
```

You can into any command, for example `before.build` or `after.build`:

```js
const project = new ProjectConfig({
	// ...
  hooks: {
    'before.build': [
      () => { /* Do something here */ }
    ]
  },
});
```

A first example to test hooks might be to log something:

```js
const project = new ProjectConfig({
	// ...
  hooks: {
    'before.build': [
      () => console.log('Starting the build process now');
    ]
  },
});
```

However, hooks usually require a few more lines of code. We recommend placing each function in a separate file in a `hooks` folder and then referencing it in the `jovo.project.js` file ([you can find an example of this hook here](https://github.com/rubenaeg/fetch-language-model-test/blob/master/hooks/fetchLanguageModel.hook.js)):

```js
const { ProjectConfig } = require('@jovotech/cli-core');
const { fetchLanguageModel } = require("./hooks/fetchLanguageModel.hook.js");

// ...

const project = new ProjectConfig({
	// ...
  hooks: {
    'before.build': [ fetchLanguageModel ],
  },
});
```

You can also pass the `context` to a hook to access specific information:

```js
const project = new ProjectConfig({
	// ...
  hooks: {
    'before.build': [
      (context) => console.log(`Skill ID: ${context.alexa.skillId}`),
    ]
  },
});
```