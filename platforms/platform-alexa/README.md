# Amazon Alexa Platform Integration

The Amazon Alexa [platform integration](../docs/platforms.md) allows you to build custom Alexa Skills using Jovo.

- [Getting Started](#getting-started)
- [Platform-Specific Features](#platform-specific-features)
  - [User](#user)
  - [Output](#output)

## Getting Started

You can install the plugin like this:

```sh
$ npm install @jovotech/platform-alexa --save
```

Add it as plugin to your [app configuration](../docs/app-config.md), e.g. `app.ts`:

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

You can also add the CLI plugin to your [project configuration](../docs/project-config.md) in `jovo.project.js`:

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

There are various Alexa specific features added to the [user class](../docs/user.md) that can be accessed like this:

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
          Alexa: {
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

If the `getEmail` call returns an error with the code `NO_USER_PERMISSION`, an `AskForPermissionsConsent` card ([learn more in the official Alexa docs](https://developer.amazon.com/en-US/docs/alexa/custom-skills/request-customer-contact-information-for-use-in-your-skill.html#sample-response-with-permissions-card)) is added to the Alexa-specific [output](../docs/output.md). Please note that the example adds the output to the `$send` method for simplicity. It could also be added using output classes.


### Output

There are various Alexa specific elements that can be added to the [output](../docs/output.md).

For output that is only used for Alexa, you can add the following to the output object:

```typescript
{
  // ...
  platforms: {
    Alexa: {
      // ...
    }
  }
}
```

You can add response objects that should show up exactly like this in the Alexa response object using the `nativeResponse` object:

```typescript
{
  // ...
  platforms: {
    Alexa: {
      nativeResponse: {
        // ...
      }
      // ...
    }
  }
}
```

#### Quick Replies

Jovo automatically turns the `quickReplies` object into buttons for APL:

```typescript
{
  // ...
  quickReplies: [
    {
      text: 'Button A',
      intent: 'ButtonAIntent'
    }
  ]
}
```

For these buttons, you need to pass a target `intent`. When the button is clicked, the [Jovo Router](../docs/routig.md) automatically maps this to the specified intent.

It's also possible to add entities:

```typescript
{
  // ...
  quickReplies: [
    {
      text: 'Button A',
      intent: 'ButtonIntent',
      entities: [
        {
          name: 'button',
          value: 'a',
        },
      ]
    }
  ]
}
```

#### Card

Jovo automatically turns the `card` object into a detail screen for APL:

```typescript
{
  // ...
  card: {
    title: 'Hello world!',
    content: 'Welcome to this new app built with Jovo.'
  },
}
```

#### Carousel

Jovo automatically turns the `carousel` object into a card slider for APL:

```typescript
{
  // ...
  carousel: {
    items: [
      {
        title: 'Element 1',
        content: 'To my right, you will see element 2.'
      },
      {
        title: 'Element 2',
        content: 'Hi there!'
      }
    ]
  },
}
```

You can make it clickable by adding a `selection` object. Once an element is selected by the user, the Jovo Router will automatically map the request to the provided `intent` (and potentially `entities`):

```typescript
{
  // ...
  carousel: {
    items: [
      {
        title: 'Element A',
        content: 'To my right, you will see element B.',
        selection: {
          intent: 'ElementIntent',
          entities: [
            {
              name: 'element',
              value: 'A',
            },
          ],
        },
      },
      {
        title: 'Element B',
        content: 'Hi there!',
        selection: {
          intent: 'ElementIntent',
          entities: [
            {
              name: 'element',
              value: 'B',
            },
          ],
        },
      }
    ]
  },
}
```

