---
title: 'Alexa Platform Integration'
excerpt: 'The Amazon Alexa platform integration allows you to build custom Alexa Skills using Jovo.'
---

# Amazon Alexa Platform Integration

The Amazon Alexa [platform integration](https://www.jovo.tech/docs/platforms) allows you to build custom Alexa Skills using Jovo.

## Introduction

Apps for Alexa are called Alexa Skills. The official suite of services, frameworks, and APIs to build Alexa Skills provided by Amazon is called Alexa Skills Kit (ASK). You can find a general introduction into building Alexa Skills in the [official Alexa documentation](https://developer.amazon.com/en-US/docs/alexa/ask-overviews/what-is-the-alexa-skills-kit.html).

In the [installation](#installation) section, we're going to set up a Jovo project that works with Amazon Alexa.

An Alexa Skill usually consists of two parts:

- The Alexa Skill project in the Alexa Developer Console
- The code that handles the logic of your Skill

In the Alexa Developer Console, the Alexa Skill project is configured, including an Alexa Interaction Model that trains Alexa's language understanding service. Learn more about how to use the Jovo CLI to create and deploy Alexa Skill projects in the [Alexa Developer Console project](#alexa-developer-console-project) section.

If a user converses with your Skill, Alexa sends API requests to your Skill's code endpoint. The code is then responsible for returning an appropriate response. Learn more about how you can build this with the Jovo Framework in the [Alexa Skill code](#alexa-skill-code) section.

Jovo is a framework that allows you to build apps that work across devices and platforms. However, this does not mean that you can't build highly complex Alexa Skills with Jovo. Any custom Alexa Skill that can be built with the official ASK SDK can also be built with the Jovo Framework. In the [platform-specific features](#platform-specific-features) section, we're going to take a look at building

## Installation

To create a new Alexa project with Jovo, we recommend installing the Jovo CLI, creating a new Jovo project, and selecting Alexa as platform using the CLI wizard. Learn more in our [getting started guide](https://www.jovo.tech/docs/getting-started).

```sh
# Install Jovo CLI globally
$ npm install -g @jovotech/cli

# Start new project wizard
# In the platform step, use the space key to select Alexa
$ jovo new <directory>
```

If you want to add Alexa to an existing Jovo project, you can install the plugin like this:

```sh
$ npm install @jovotech/platform-alexa
```

Add it as plugin to your [app configuration](https://www.jovo.tech/docs/app-config), e.g. `app.ts`:

```typescript
import { App } from '@jovotech/framework';
import { AlexaPlatform } from '@jovotech/platform-alexa';
// ...

const app = new App({
  plugins: [
    new AlexaPlatform({
      intentMap: {
        'AMAZON.StopIntent': 'END',
        'AMAZON.CancelIntent': 'END',
      },
      // ...
    }),
    // ...
  ],
});
```

The Alexa platform comes with its own `intentMap` that gets merged into the [global `intentMap`](https://www.jovo.tech/docs/app-config#intentmap). This maps incoming Alexa intents to Jovo intents or handlers.

You can also add the CLI plugin to your [project configuration](https://www.jovo.tech/docs/project-config) in `jovo.project.js`. [Learn more about the Alexa-specific project configuration here](https://www.jovo.tech/marketplace/platform-alexa/project-config).

```js
const { ProjectConfig } = require('@jovotech/cli-core');
const { AlexaCli } = require('@jovotech/platform-alexa');
// ...

const project = new ProjectConfig({
  // ...
  plugins: [
    new AlexaCli(),
    // ...
  ],
});
```

The Alexa CLI plugin uses the official ASK (Alexa Skills Kit) CLI provided by Amazon for deployment. For the deployment to work, you need to at least set up a `default` ASK profile using the ASK CLI. [Follow the official Alexa docs to install and configure ASK CLI](https://developer.amazon.com/en-US/docs/alexa/smapi/quick-start-alexa-skills-kit-command-line-interface.html).

```sh
# Install ASK CLI globally
$ npm install -g ask-cli

# Configure ASK profile
$ ask configure
```

After the successful installation, you can do the following:

- Use the Jovo CLI to [create a project in the Alexa Developer Console](#alexa-developer-console-project)
- Use the Jovo Framework to [build the Alexa Skill code](#alexa-skill-code)

## Alexa Developer Console Project

Jovo helps you manage your Alexa Skill project in the [Alexa Developer Console](https://developer.amazon.com/alexa/console/ask#/) using the Jovo CLI.

You can use the [`build` command](https://www.jovo.tech/marketplace/platform-alexa/cli-commands#build) to turn the [Alexa project configuration](https://www.jovo.tech/marketplace/platform-alexa/project-config) into Alexa specific files.

```sh
$ jovo build:platform alexa
```

These files can be found in a folder called `platform.alexa` in the `build` directory of your project. They include the [Alexa Interaction Model](https://www.jovo.tech/marketplace/platform-alexa/model) that is responsible for training Alexa's natural language understanding service.

Since Alexa requires certain built-in intents, make sure that the files in your `models` folder contain the following elements before running `build`. They are added by default if you select Alexa as platform in the `new` CLI wizard.

```json
{
  "alexa": {
    "interactionModel": {
      "languageModel": {
        "intents": [
          {
            "name": "AMAZON.CancelIntent",
            "samples": []
          },
          {
            "name": "AMAZON.HelpIntent",
            "samples": []
          },
          {
            "name": "AMAZON.StopIntent",
            "samples": []
          }
        ]
      }
    }
  }
}
```

The resulting files can then be deployed to the Alexa Developer Console using the [`deploy:platform` command](https://www.jovo.tech/marketplace/platform-alexa/cli-commands#deploy).

```sh
$ jovo deploy:platform alexa
```

Learn more on the following pages:

- [Alexa CLI Commands](https://www.jovo.tech/marketplace/platform-alexa/cli-commands)
- [Alexa Project Configuration](https://www.jovo.tech/marketplace/platform-alexa/project-config)
- [Alexa Interaction Model](https://www.jovo.tech/marketplace/platform-alexa/interaction-model)

## Alexa Skill Code

The Jovo Alexa platform package is a [platform integration](https://www.jovo.tech/docs/platforms) that understands the types of requests Alexa sends and knows how to translate output into an Alexa response. To learn more about the Jovo request lifecycle, take a look at the [RIDR documentation](https://www.jovo.tech/docs/ridr-lifecycle).

When a user interacts with your Skill through Alexa, the voice assistant turns user input (usually speech) into structured meaning (usually _intents_ and _slots_). It then sends a request with this data to you Jovo app. [Learn more about the request structure in the official Alexa docs](https://developer.amazon.com/en-US/docs/alexa/custom-skills/handle-requests-sent-by-alexa.html).

The Jovo app then uses this request information to return an appropriate response that tells Alexa what to say (or display) to the user. For example, the code snippet below asks the user if they like pizza:

```typescript
LAUNCH() {
  return this.$send(YesNoOutput, { message: 'Do you like pizza?' });
}
```

If you want to learn more about how to return the right response, take a look at these concepts:

- [Components](https://www.jovo.tech/docs/components)
- [Handlers](https://www.jovo.tech/docs/handlers)
- [Output](https://www.jovo.tech/docs/output)

The output is then translated into a response that is returned to Alexa. [Learn more about the response structure in the official Alexa docs](https://developer.amazon.com/en-US/docs/alexa/custom-skills/request-and-response-json-reference.html#response-format).

## Platform-Specific Features

The Alexa platform integration for Jovo supports a lot of platform-specific features. You can access the Alexa object like this:

```typescript
this.$alexa;
```

You can also use this object to see if the request is coming from Alexa (or a different platform):

```typescript
if (this.$alexa) {
  // ...
}
```

The following Alexa properties offer additional features:

- [Request](#request)
- [User](#user)
- [Output](#output)
- [Device](#device)
- [Entities (Slots)](#entities-slots-)
- [ISP](#isp)
- [Alexa Conversations](#alexa-conversations)
- [Name-free Interaction](#name-free-interaction)

### Request

You can access the request using the following methods:

```typescript
// Generic request type
this.$request;

// Alexa request type
this.$alexa.$request;
```

There are also some helper methods to help you retrieve information from Alexa requests.

For example, you can retrieve the `unit` property from the [Alexa System object](https://developer.amazon.com/docs/alexa/custom-skills/request-and-response-json-reference.html#system-object) like this:

```typescript
this.$alexa.$request.getUnit();

/* Result:
  {
    unitId: string;
    persistentUnitId: string;
  }
*/
```

### User

There are various Alexa specific features added to the [user class](https://www.jovo.tech/docs/user) that can be accessed like this:

```typescript
this.$alexa.$user;
```

The following features are offered by the Alexa user property:

- [User Profile](#user-profile)
- [Account Linking](#account-linking)

#### User Profile

You can call the [Alexa Customer Profile API](https://developer.amazon.com/en-US/docs/alexa/custom-skills/request-customer-contact-information-for-use-in-your-skill.html) by using the following methods:

```typescript
await this.$alexa.$user.getEmail();
// Result: string

await this.$alexa.$user.getName();
// Result: string

await this.$alexa.$user.getGivenName();
// Result: string

await this.$alexa.$user.getMobileNumber();
// Result: { countryCode: string; mobileNumber: string; }
```

Below is an example `getEmail` handler:

```typescript
import { AskForPermissionConsentCardOutput } from '@jovotech/platform-alexa';
// ...

async getEmail() {
  try {
    const email = await this.$alexa.$user.getEmail();
    return this.$send({ message: `Your email address is ${email}` });
  } catch(error) {
    if (error.code === 'NO_USER_PERMISSION') {
      return this.$send(AskForPermissionConsentCardOutput, {
        message: 'Please grant access to your email address.',
        permissions: 'alexa::profile:email:read',
        listen: false,
      });
    } else {
      // ...
    }
  }
},
```

If the `getEmail` call returns an error with the code `NO_USER_PERMISSION`, an `AskForPermissionsConsent` card ([learn more in the official Alexa docs](https://developer.amazon.com/en-US/docs/alexa/custom-skills/request-customer-contact-information-for-use-in-your-skill.html#sample-response-with-permissions-card)) returned to ask the user for permission. For this, the [`AskForPermissionConsentCardOutput`](https://github.com/jovotech/jovo-framework/blob/v4/latest/platforms/platform-alexa/src/output/templates/AskForPermissionConsentCardOutput.ts) convenience [output class](https://www.jovo.tech/docs/output-classes) is used.

Under the hood, it looks like this:

```typescript
{
  listen: this.options.listen,
  message: this.options.message,
  platforms: {
    alexa: {
      nativeResponse: {
        response: {
          card: {
            type: 'AskForPermissionsConsent',
            permissions: this.options.permissions,
          },
        },
      },
    },
  },
}
```

For a Skill to be able to request information from the Customer Profile API, the permissions need to be added to the Skill manifest, either in the Alexa Developer Console or the `skill.json` file. The latter can be done by using the [`files` property of the Alexa project config](./project-config.md#files):

```js
new AlexaCli({
  files: {
    'skill-package/skill.json': {
      manifest: {
        permissions: [
          'alexa::profile:email:read',
          // ...
        ],
      },
    },
  },
  // ...
});
```

#### Account Linking

Account linking enables you to connect your Alexa Skill users to other systems.

[Learn more in the Account Linking documentation for Alexa](https://www.jovo.tech/marketplace/platform-alexa/account-linking).

### Output

There are various Alexa specific elements that can be added to the [output](https://www.jovo.tech/docs/output).

[Learn more in the Jovo Output documentation for Alexa](https://www.jovo.tech/marketplace/platform-alexa/output).

### Device

You can check if the device supports APL by using the following method that checks for [platform-specific device capabilities](https://www.jovo.tech/docs/device#platform-specific-device-features):

```typescript
import { AlexaCapability } from '@jovotech/platform-alexa';
// ...

if (this.$device.supports(AlexaCapability.Apl)) {
  /* ... */
}
// or
if (this.$device.supports('ALEXA:APL')) {
  /* ... */
}
```

There are also various Alexa specific features added to the [device class](https://www.jovo.tech/docs/device) that can be accessed like this:

```typescript
this.$alexa.$device;
```

You can access the following properties and methods of the Alexa device class:

- `this.$alexa.$device.id`: Get the device ID from the Alexa request
- [Device location and address](#device-location-and-address)
- [System settings](#system-settings)

#### Device Location and Address

It is possible to retrieve your Alexa Skill user's address information, if they grant the permission for this. Learn more in the [official Alexa docs](https://developer.amazon.com/en-US/docs/alexa/custom-skills/device-address-api.html).

You need to first get the permission, which you can do by sending a card to the user's Alexa app. You can use the [`AskForPermissionOutput`](https://github.com/jovotech/jovo-framework/blob/v4/latest/platforms/platform-alexa/src/output/templates/AskForPermissionOutput.ts) for this:

```typescript
import { AskForPermissionOutput } from '@jovotech/platform-alexa';
// ...

someHandler() {
  // ...

  try {
    const location = await this.$alexa.$device.getLocation();
    // ...

  } catch(error) {
    if (error.code === 'NO_USER_PERMISSION') {
      return this.$send(AskForPermissionOutput, {
        message: 'Please grant the permission to access your device address.',
        permissionScope: 'read::alexa:device:all:address',
      });
    } else {
      // ...
    }
  }
}
```

Under the hood, the `AskForPermissionOutput` looks like this:

```typescript
{
  message: this.options.message,
  platforms: {
    alexa: {
      nativeResponse: {
        response: {
          shouldEndSession: true,
          directives: [
            {
              type: 'Connections.SendRequest',
              name: 'AskFor',
              payload: {
                '@type': 'AskForPermissionsConsentRequest',
                '@version': '1',
                'permissionScope': this.options.permissionScope,
              },
              token: this.options.token || '',
            },
          ],
        },
      },
    },
  },
}
```

You can use the `getLocation()` method to retrieve the device location:

```typescript
import { DeviceLocation } from '@jovotech/platform-alexa';
// ...

async someHandler() {
  const location: DeviceLocation = await this.$alexa.$device.getLocation();

  /* Result:
   {
      city: string;
      countryCode: string;
      postalCode: string;
    }
  */
}
```

The `getAddress()` method can be used to retrieve the address associated with the device:

```typescript
import { DeviceAddressLocation } from '@jovotech/platform-alexa';
// ...

async someHandler() {
  const address: DeviceAddressLocation = await this.$alexa.$device.getAddress();

  /* Result:
   {
      addressLine1: string;
      addressLine2: string;
      addressLine3: string;
      districtOrCounty: string;
      stateOrRegion: string;
      city: string;
    }
  */
}
```

#### System Settings

It is possible to retrieve some of your Alexa Skill user's settings without them granting you any special permissions. Learn more in the [official Alexa docs](https://developer.amazon.com/en-GB/docs/alexa/smapi/alexa-settings-api-reference.html).

You can use the `getTimeZone()` method to retrieve the timezone setting:

```typescript
async someHandler() {
  const timezone: string = await this.$alexa.$device.getTimeZone();

  /* Result:
    "Africa/Abidjan"
  */
}
```

### Entities (Slots)

Alexa _slots_ are called _entities_ in Jovo. You can learn more in the [Jovo Model](https://www.jovo.tech/docs/models) and the [`$entities` documentation](https://www.jovo.tech/docs/entities).

You can access the Alexa-specific `$entities` property like this, which allows you to get typed access to the `native` API result for each slot:

```typescript
this.$alexa.$entities;

// Example: Get native API result object for slot "name"
this.$alexa.$entities.name.native;
```

Learn more about the structure of the API result in the [official Alexa documentation on entity resolution](https://developer.amazon.com/en-US/docs/alexa/custom-skills/entity-resolution.html).

### ISP

Jovo offers an integration with in-skill purchasing (ISP) which allows you to make money by selling digital goods and services through your Alexa Skill.

[Learn more in the Jovo ISP documentation for Alexa](https://www.jovo.tech/marketplace/platform-alexa/isp).

### Alexa Conversations

You can build Alexa Skills with Jovo that make use of the Alexa Conversations dialogue management engine.

[Learn more in the Jovo Alexa Conversations documentation](https://www.jovo.tech/marketplace/platform-alexa/alexa-conversations).

### Skill Connections

You can use Jovo with [Alexa Skill Connections](https://developer.amazon.com/docs/alexa/custom-skills/understand-skill-connections.html) by sending a `Connections.StartConnection` directive as shown in the [official Alexa docs](https://developer.amazon.com/docs/alexa/custom-skills/use-skill-connections-to-request-tasks.html#implement-a-handler-to-return-a-connectionsstartconnection-directive-to-use-skill-connection).

For this, the Jovo Alexa integration offers convenience [output classes](https://www.jovo.tech/docs/output-classes). Below is an overview of all classes:

| Class                                                                                                                                                                                                                     | URI                                                          |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------ |
| [`ConnectionAskForPermissionConsentOutput`](https://github.com/jovotech/jovo-framework/tree/v4/latest/platforms/platform-alexa/src/output/templates/ConnectionAskForPermissionConsentOutput.ts)                           | `connection://AMAZON.AskForPermissionsConsent/2`             |
| [`ConnectionLinkAppOutput`](https://github.com/jovotech/jovo-framework/tree/v4/latest/platforms/platform-alexa/src/output/templates/ConnectionLinkAppOutput.ts)                                                           | `connection://AMAZON.LinkApp/2`                              |
| [`ConnectionPrintImageOutput`](https://github.com/jovotech/jovo-framework/tree/v4/latest/platforms/platform-alexa/src/output/templates/ConnectionPrintImageOutput.ts)                                                     | `connection://AMAZON.PrintImage/1`                           |
| [`ConnectionPrintPdfOutput`](https://github.com/jovotech/jovo-framework/tree/v4/latest/platforms/platform-alexa/src/output/templates/ConnectionPrintPdfOutput.ts)                                                         | `connection://AMAZON.PrintPDF/1`                             |
| [`ConnectionPrintWebPageOutput`](https://github.com/jovotech/jovo-framework/tree/v4/latest/platforms/platform-alexa/src/output/templates/ConnectionPrintWebPageOutput.ts)                                                 | `connection://AMAZON.PrintWebPage/1`                         |
| [`ConnectionScheduleFoodEstablishmentReservationOutput`](https://github.com/jovotech/jovo-framework/tree/v4/latest/platforms/platform-alexa/src/output/templates/ConnectionScheduleFoodEstablishmentReservationOutput.ts) | `connection://AMAZON.ScheduleFoodEstablishmentReservation/1` |
| [`ConnectionScheduleTaxiReservationOutput`](https://github.com/jovotech/jovo-framework/tree/v4/latest/platforms/platform-alexa/src/output/templates/ConnectionScheduleTaxiReservationOutput.ts)                           | `connection://AMAZON.ScheduleTaxiReservation/1`              |
| [`ConnectionTestStatusCodeOutput`](https://github.com/jovotech/jovo-framework/tree/v4/latest/platforms/platform-alexa/src/output/templates/ConnectionTestStatusCodeOutput.ts)                                             | `connection://AMAZON.TestStatusCode/1`                       |
| [`ConnectionVerifyPersonOutput`](https://github.com/jovotech/jovo-framework/tree/v4/latest/platforms/platform-alexa/src/output/templates/ConnectionVerifyPersonOutput.ts)                                                 | `connection://AMAZON.VerifyPerson/2`                         |

You can find the output options in each class implementation. For example, you use the [`ConnectionAskForPermissionConsentOutput`](https://github.com/jovotech/jovo-framework/tree/v4/latest/platforms/platform-alexa/src/output/templates/ConnectionAskForPermissionConsentOutput.ts) like this:

```typescript
import { ConnectionAskForPermissionConsentOutput } from '@jovotech/platform-alexa';
// ...

someHandler() {
  // ...

  return this.$send(ConnectionAskForPermissionConsentOutput, {
    // Options
    message: 'Please grant access to your Alexa profile name',
    shouldEndSession: true,
    token: '<your-token>',
    permissionScopes: ['alexa::profile:given_name:read']
  })
}
```

This would result in the following output template:

```typescript
{
  message: 'Please grant access to your Alexa profile name',
  platforms: {
    alexa: {
      nativeResponse: {
        response: {
          shouldEndSession: true,
          directives: [
            {
              type: 'Connections.StartConnection',
              uri: 'connection://AMAZON.AskForPermissionsConsent/2',
              input: {
                '@type': 'AskForPermissionsConsentRequest',
                '@version': '2',
                'permissionScopes': ['alexa::profile:given_name:read'],
              },
              token: '<your-token>',
              onCompletion: 'RESUME_SESSION', // default
            },
          ],
        },
      },
    },
  },
}
```

### Name-free Interaction

You can handle [name-free interactions](https://developer.amazon.com/docs/alexa/custom-skills/implement-canfulfillintentrequest-for-name-free-interaction.html) by responding to `CanFulfillIntentRequest` requests. To do this, you can use the following two helpers:

- `AlexaHandles.onCanFulfillIntentRequest()`: A method for the [`@Handle` decorator](https://www.jovo.tech/docs/handle-decorators) that can be added to a handler to accept requests of the type `CanFulfillIntentRequest`
- By returning [`CanFulfillIntentOutput`](https://github.com/jovotech/jovo-framework/blob/v4/latest/platforms/platform-alexa/src/output/templates/CanFulfillIntentOutput.ts), a [convenience output class](https://www.jovo.tech/marketplace/platform-alexa/output#alexa-output-classes), you can send a response to Alexa that includes the `CanFulfillIntent` directive

```typescript
import { Handle } from '@jovotech/framework';
import { CanFulfillIntentOutput, AlexaHandles } from '@jovotech/platform-alexa';
// ...

@Handle(AlexaHandles.onCanFulfillIntentRequest())
someHandler() {
  // ...
  return this.$send(CanFulfillIntentOutput, {
    canFulfill: 'YES',
  });
}
```

Under the hood, `onCanFulfillIntentRequest()` as part of [`AlexaHandles`](https://github.com/jovotech/jovo-framework/blob/v4/latest/platforms/platform-alexa/src/AlexaHandles.ts) looks like this:

```typescript
{
  global: true,
  types: ['CanFulfillIntentRequest'],
  platforms: ['alexa'],
}
```

[`CanFulfillIntentOutput`](https://github.com/jovotech/jovo-framework/blob/v4/latest/platforms/platform-alexa/src/output/templates/CanFulfillIntentOutput.ts) looks like this:

```typescript
{
  listen: false,
  platforms: {
    alexa: {
      nativeResponse: {
        response: {
          canFulfillIntent: {
            canFulfill: this.options.canFulfill,
            slots: this.options.slots ?? {},
          },
        },
      },
    },
  },
}
```
