# Google Assistant Conversational Actions Platform Integration

> To view this page on the Jovo website, visit https://www.jovo.tech/marketplace/jovo-platform-googleassistantconv

Learn more about Google Assistant specific features that can be used with the Jovo Framework.

* [Introduction](#introduction)
	* [Installation](#installation)
	* [Quickstart](#quickstart)
* [Configuration](#configuration)
  * [Overrides](#overrides)
    * [Settings](#settings)
      * [Default Locale](#default-locale)
      * [Localized Settings](#localized-settings)
    * [Webhooks](#webhooks)
    * [Actions](#actions)
* [$googleAction Object](#googleaction-object)
* [Jovo Language Model](#jovo-language-model)
* [Interfaces](#interfaces)
* [Concepts](#concepts)
  * [Scenes](#scenes)

## Introduction

### Installation

```sh
$ npm install --save jovo-platform-googleassistantconv
```

Import the installed module, initialize and add it to the `app` object:

```javascript
// @language=javascript

// src/app.js
const { GoogleAssistant } = require('jovo-platform-googleassistantconv');

app.use(new GoogleAssistant());

// @language=typescript

// src/app.ts
import { GoogleAssistant } from 'jovo-platform-googleassistantconv';

app.use(new GoogleAssistant());
```

### Quickstart

#### Install the Jovo CLI

We highly recommend using the Jovo CLI if you want to benefit from all the features coming with Jovo. You can learn more and find alternatives on our [installation page](https://www.jovo.tech/docs/installation).

```sh
$ npm install -g jovo-cli
```

#### Create a new Jovo Project

You can create a Jovo project into a new directory with the following command:

```sh
// @language=javascript

# Create default Jovo project (Alexa and Google Assistant)
$ jovo3 new <directory>

# Create Google Assistant only Jovo project
$ jovo3 new <directory> --template google-conversational-actions-helloworld


// @language=typescript

# Create default Jovo project (Alexa and Google Assistant)
$ jovo3 new <directory> --language typescript

# Create Google Assistant only Jovo project
$ jovo3 new <directory> --template google-conversational-actions-helloworld --language typescript
```

This will create a new folder, download the [Jovo "Hello World" template](https://www.jovo.tech/templates/helloworld), and install all the necessary dependencies so you can get started right away.

This is how a typical Jovo project looks like:

```javascript
// @language=javascript

models/
  └── en-US.json
src/
  |── app.js
  |── config.js
  └── index.js
project.js

// @language=typescript

models/
  └── en-US.json
src/
  |── app.ts
  |── config.ts
  └── index.ts
project.js
```

> [Find out more about the Jovo project structure here.](https://www.jovo.tech/docs/project-structure)

#### Run and Test the Code

To test the logic of your code, you can use the local development server provided by Jovo, and the [Jovo Debugger](https://www.jovo.tech/marketplace/jovo-plugin-debugger). 

To get started, use the following command:

```sh
// @language=javascript

# Run local development server
$ jovo3 run

// @language=typescript

# Run compiler
$ npm run tsc

# Run local development server
$ jovo3 run
```

This will start the development server on port `3000` and create a Jovo Webhook URL that can be used for local development. Copy this link and open it in your browser to use the [Jovo Debugger](https://www.jovo.tech/marketplace/jovo-plugin-debugger).

![Jovo Debugger](https://www.jovo.tech/img/docs/v3/jovo-debugger-helloworld.gif)

In the Debugger, you can quickly test if the flow of your voice app works. For this example, click on the `LAUNCH` button, and then specify a name on the `MyNameIsIntent` button. The Debugger will create requests and run them against your local webhook.
 
> [Find out more about requests and responses here](https://www.jovo.tech/docs/requests-responses).

## Configuration

Using the `project.js` in your project directory, you can configure your Conversational Action specifically for your needs. Using [stages](https://www.jovo.tech/docs/project-js#stages), you can also utilize different configurations for different environments.

The following element can be added to the `googleAction` object:

```js
{
  googleAction: {
    projectId: '<your-project-id>'
  },
}
```

### Overrides

You also have the option to override your Action's settings, as well as create custom webhooks. These properties follow the style of the `.yaml` configuration files in JSON format:

```js
googleAction: {
  manifest: {
    settings: {
      defaultLocale: 'en',
      localizedSettings: {
        en: {
          displayName: 'My Test Conversational Action',
        },
        de: {
          displayName: 'Meine Test Conversational Action',
        },
      }
    }
  }
}
```

You can basically add or override any element that you could normally find in your Action's `settings.yaml`, `actions.yaml` or any file inside the `webhooks` folder.

#### Settings

You can override any setting for your Conversational Action inside the `settings` property. For localized settings, you have to set the specific locale:

```js
googleAction: {
  manifest: {
    settings: {
      defaultLocale: 'en',
      localizedSettings: {
        en: {
          developerEmail: '',
          developerName: '',
          displayName: 'My Test Conversational Action',
          pronunciation: 'my test conversational action',
          fullDescription: '',
          privacyPolicyUrl: '',
          shortDescription: '',
          smallLogoImage: '',
          termsOfServiceUrl: '',
        },
      }
    }
  }
}
```

##### Default Locale

This property specifies the default locale of your Action. If you omit this propery, the default locale will be determined based on your language models.

##### Localized Settings

These settings describe locale specific settings such as your Action's display name or it's description. With an exception to `displayName` and `pronunciation`, all of these fields are optional, but you will get a warning on deployment if you don't include them. If you omit either `displayName` or `pronunciation`, the Jovo CLI will automatically create them based on your language model.

#### Webhooks

Per default, [`jovo build`](https://www.jovo.tech/marketplace/jovo-cli/build) automatically creates an entry for the Jovo Webhook and registers it for every intent. However, if you want to use your own webhook configuration, you can overwrite this behavior inside the `project.js`:

```js
googleAction: {
  manifest: {
    webhooks: {
      ActionsOnGoogleFulfillment: {
        handlers: [
          {
            name: 'MyOwnWebhook'
          }
        ],
        httpsEndpoint: {
          baseUrl: 'https://my-own-webhook.com/', 
        }
      }
    }
  }
}
```

#### Actions

Similar the webhooks, the Jovo CLI automatically registers your intents as events in the `actions.yaml` file. However, if you want to create a custom action, you can do so like this:

```js
googleAction: {
  manifest: {
    actions: {
      custom: {
        MyCustomIntent: {
          engagement: {
            title: 'My Custom Intent Action'
          }
        }
      }
    }
  }
}
```

## $googleAction Object

The `$googleAction` object holds references to every Google Action specific feature:

```javascript
// @language=javascript

this.$googleAction

// @language=typescript

this.$googleAction!
```

## Jovo Language Model

> For a general understanding of the Jovo Language Model, check out the [platform-independent docs](https://www.jovo.tech/docs/model).

You can add a `googleAssistant` object at the root of the Jovo Language Model to add Google Assistant specific stuff using their original syntax. While building, it will be merged with the platform-independent configuration:

```js
"googleAssistant": {
  "custom": {
    "intents": {
      "ActionsIntent": {
        "trainingPhrases": [
          "foo",
          "bar"
        ]
      }
    },
    "types": {
      "NameType": {
        "synonym": {
          "entities": {
            "max": {
              "synonyms": [
                "maximilian"
              ]
            },
            "john": {
              "synonyms": [
                "johnathan"
              ]
            }
          }
        }
      }
    }
  }
}
```

### Global Intents

As mentioned, the Jovo CLI automatically creates an entry for the Jovo Webhook and registers it for every intent. However, if you choose to use customized webhooks, you'll need to overwrite the global intents as well.

```js
"googleAssistant": {
  "custom": {
    "global": {
      "actions.intent.MAIN": {
        "handler": {
          "webhookHandler": "MyOwnWebhook"
        }
      }
    }
  }
} 
```

## Interfaces

* [Media Response](https://www.jovo.tech/marketplace/jovo-platform-googleassistantconv/interfaces/media-response)
* [Visual Output](https://www.jovo.tech/marketplace/jovo-platform-googleassistantconv/interfaces/visual-output)
* [Push Notifications](https://www.jovo.tech/marketplace/jovo-platform-googleassistantconv/interfaces/notifications)
* [Transactions](https://www.jovo.tech/marketplace/jovo-platform-googleassistantconv/interfaces/transactions)

## Concepts

### Scenes

Scenes are building blocks in your Conversational Action, that capture your conversational tasks into individual states. Learn more about using scenes with the Jovo Framework [here](https://www.jovo.tech/marketplace/jovo-platform-googleassistantconv/concepts/scenes).


