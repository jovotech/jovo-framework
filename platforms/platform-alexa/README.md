---
title: 'Alexa Platform Integration'
excerpt: 'The Amazon Alexa platform integration allows you to build custom Alexa Skills using Jovo.'
---
# Amazon Alexa Platform Integration

The Amazon Alexa [platform integration](https://v4.jovo.tech/docs/platforms) allows you to build custom Alexa Skills using Jovo.

## Getting Started

You can install the plugin like this:

```sh
$ npm install @jovotech/platform-alexa
```

Add it as plugin to your [app configuration](https://v4.jovo.tech/docs/app-config), e.g. `app.ts`:

```typescript
import { App } from '@jovotech/framework';
import { AlexaPlatform } from '@jovotech/platform-alexa';
// ...

const app = new App({
  plugins: [
    new AlexaPlatform(),
    // ...
  ],
});
```

You can also add the CLI plugin to your [project configuration](https://v4.jovo.tech/docs/project-config) in `jovo.project.js`:

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

[Learn more about the Alexa project configuration here](https://v4.jovo.tech/marketplace/platform-alexa/project-config).

## Platform-Specific Features

You can access the Alexa specific object like this:

```typescript
this.$alexa
```

You can also use this object to see if the request is coming from Alexa (or a different platform):

```typescript
if(this.$alexa) {
  // ...
}
```

### User

There are various Alexa specific features added to the [user class](https://v4.jovo.tech/docs/user) that can be accessed like this:

```typescript
this.$alexa.$user
```

#### User Profile

You can call the [Alexa Customer Profile API](https://developer.amazon.com/en-US/docs/alexa/custom-skills/request-customer-contact-information-for-use-in-your-skill.html) to retrieve the user's email address like this:

```typescript
await this.$alexa.$user.getEmail()
```

Below is an example `getEmail` handler:

```typescript
async getEmail() {
  try {
    const email = await this.$alexa.$user.getEmail();
    return this.$send({ message: `Your email address is ${email}` });
  } catch(error) {
    if (error.code === 'NO_USER_PERMISSION') {
      return this.$send({
        message: 'Please grant access to your email address.',
        platforms: {
          alexa: {
            card: {
              type: 'AskForPermissionsConsent',
              permissions: [
                'alexa::profile:email:read'
              ],
            },
          },
        },
      });
    } else {
      // ...
    }
  }
},
```

If the `getEmail` call returns an error with the code `NO_USER_PERMISSION`, an `AskForPermissionsConsent` card ([learn more in the official Alexa docs](https://developer.amazon.com/en-US/docs/alexa/custom-skills/request-customer-contact-information-for-use-in-your-skill.html#sample-response-with-permissions-card)) is added to the Alexa-specific [output](https://v4.jovo.tech/docs/output). Please note that the example adds the output to the `$send` method for simplicity. It could also be added using output classes.


### Output

There are various Alexa specific elements that can be added to the [output](https://v4.jovo.tech/docs/output).

[Learn more in the Jovo Output documentation for Alexa](https://v4.jovo.tech/marketplace/platform-alexa/output).


### Entities (Slots)

Alexa *slots* are called *entities* in Jovo. You can learn more in the [Jovo Model](https://v4.jovo.tech/docs/models) and the [`$entities` documentation](https://v4.jovo.tech/docs/entities).

You can access the Alexa-specific `$entities` property like this, which allows you to get typed access to the `native` API result for each slot:

```typescript
this.$alexa.$entities

// Example: Get native API result object for slot "name"
this.$alexa.$entities.name.native
```

Learn more about the structure of the API result in the [official Alexa documentation on entity resolution](https://developer.amazon.com/en-US/docs/alexa/custom-skills/entity-resolution.html).