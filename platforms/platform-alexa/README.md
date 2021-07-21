# Amazon Alexa Platform Integration

The Amazon Alexa [platform integration](../docs/platforms.md) allows you to build custom Alexa Skills using Jovo.

- [Getting Started](#getting-started)
- [Platform-Specific Features](#platform-specific-features)
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

