---
title: 'Alexa Output'
excerpt: 'Learn more about Jovo output templates for Alexa.'
---

# Alexa Output

Learn more about output templates for [Alexa](https://www.jovo.tech/marketplace/platform-alexa).

## Introduction

Jovo offers the ability to [create structured output](https://www.jovo.tech/docs/output) that is then translated into native platform responses.

This structured output is called [output template](https://www.jovo.tech/docs/output-templates). Its root properties are generic output elements that work across platforms. [Learn more about how generic output is translated into an Alexa response below](#generic-output-elements).

```typescript
{
  message: `Hello world! What's your name?`,
  reprompt: 'Could you tell me your name?',
  listen: true,
}
```

You can also add platform-specific output to an output template. [Learn more about Alexa output below](#alexa-output-elements).

```typescript
{
  // ...
  platforms: {
    alexa: {
      // ...
    }
  }
}
```

## Generic Output Elements

Generic output elements are in the root of the output template and work across platforms. [Learn more in the Jovo Output docs](https://www.jovo.tech/docs/output-templates).

Below, you can find a list of generic output elements that work with Alexa:

- [`message`](#message)
- [`reprompt`](#reprompt)
- [`listen`](#listen)
- [`quickReplies`](#quickreplies)
- [`card`](#card)
- [`carousel`](#carousel)

### message

The [generic `message` element](https://www.jovo.tech/docs/output-templates#message) is what Alexa is saying to the user:

```typescript
{
  message: 'Hello world!',
}
```

Under the hood, Jovo translates the `message` into an `outputSpeech` object ([see the official Alexa docs](https://developer.amazon.com/en-US/docs/alexa/custom-skills/request-and-response-json-reference.html#outputspeech-object)):

```json
{
  "outputSpeech": {
    "type": "SSML",
    "ssml": "<speak>Hello world!</speak>"
  }
}
```

### reprompt

The [generic `reprompt` element](https://www.jovo.tech/docs/output-templates#message) is used to ask again if the user does not respond to a prompt after a few seconds:

```typescript
{
  message: `Hello world! What's your name?`,
  reprompt: 'Could you tell me your name?',
}
```

Under the hood, Jovo translates the `reprompt` into an `outputSpeech` object ([see the official Alexa docs](https://developer.amazon.com/en-US/docs/alexa/custom-skills/request-and-response-json-reference.html#outputspeech-object)) inside `reprompt`:

```json
{
  "reprompt": {
    "outputSpeech": {
      "type": "SSML",
      "ssml": "<speak>Could you tell me your name?</speak>"
    }
  }
}
```

### listen

The [`listen` element](https://www.jovo.tech/docs/output-templates#listen) determines if Alexa should keep the microphone open and wait for a user's response.

By default (if you don't specify it otherwise in the template), `listen` is set to `true`. If you want to close a session after a response, you need to set it to `false`:

```typescript
{
  message: `Goodbye!`,
  listen: false,
}
```

Under the hood, Jovo translates `listen: false` to `"shouldEndSession": true` in the JSON response.

The `listen` element can also be used to add dynamic entities for Alexa. [Learn more in the `$entities` documentation](https://www.jovo.tech/docs/entities#dynamic-entities).

### quickReplies

Alexa does not natively support quick replies. However, Jovo automatically turns the [generic `quickReplies` element](https://www.jovo.tech/docs/output-templates#quickreplies) into buttons for APL:

```typescript
{
  // ...
  quickReplies: [
    {
      text: 'Button A',
      intent: 'ButtonAIntent',
    },
  ];
}
```

For this to work, `genericOutputToApl` needs to be enabled in the [Alexa output configuration](#alexa-output-configuration).

For these buttons, you need to pass a target `intent`. When the button is clicked, the [Jovo Router](https://www.jovo.tech/docs/routing) automatically maps this to the specified intent.

It's also possible to add entities:

```typescript
{
  // ...
  quickReplies: [
    {
      text: 'Button A',
      intent: 'ButtonIntent',
      entities: {
        button: {
          value: 'a',
        },
      },
    },
  ];
}
```

### card

Jovo automatically turns the [generic `card` element](https://www.jovo.tech/docs/output-templates#card) into a detail screen for APL:

```typescript
{
  // ...
  card: {
    title: 'Hello world!',
    content: 'Welcome to this new app built with Jovo.'
  },
}
```

For this to work, `genericOutputToApl` needs to be enabled in the [Alexa output configuration](#alexa-output-configuration).

**Note**: If you want to send a home card to the Alexa mobile app instead, we recommend using the [`nativeResponse` property](#native-response).

### carousel

Alexa does not natively support carousels. However, Jovo automatically turns the [generic `carousel` element](https://www.jovo.tech/docs/output-templates#carousel) into a card slider for APL:

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

For this to work, `genericOutputToApl` needs to be enabled in the [Alexa output configuration](#alexa-output-configuration).

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
          entities: {
            element: {
              value: 'A',
            },
          },
        },
      },
      {
        title: 'Element B',
        content: 'Hi there!',
        selection: {
          intent: 'ElementIntent',
          entities: {
            element: {
              value: 'B',
            },
          },
        },
      }
    ]
  },
}
```

In the example above, a tap on an element triggers the `ElementIntent` and contains an entity of the name `element`.

## Alexa Output Elements

It is possible to add platform-specific output elements to an output template. [Learn more in the Jovo output documentation](https://www.jovo.tech/docs/output-templates#platform-specific-output-elements).

For Alexa, you can add output elements inside an `alexa` object:

```typescript
{
  // ...
  platforms: {
    alexa: {
      // ...
    }
  }
}
```

### Native Response

The [`nativeResponse` property](https://www.jovo.tech/docs/output-templates#native-response) allows you to add native elements exactly how they would be added to the Alexa JSON response.

```typescript
{
  // ...
  platforms: {
    alexa: {
      nativeResponse: {
        // ...
      }
    }
  }
}
```

For example, an APL RenderDocument directive ([see official Alexa docs](https://developer.amazon.com/en-US/docs/alexa/alexa-presentation-language/apl-interface.html#renderdocument-directive)) could be added like this:

```typescript
{
  // ...
  platforms: {
    alexa: {
      nativeResponse: {
        response: {
          directives: [
            {
              type: 'Alexa.Presentation.APL.RenderDocument',
              token: 'helloworldToken',
              document: {
                /* ... */
              },
              datasources: {
                /* ... */
              },
            },
          ];
        }
      }
    }
  }
}
```

Learn more about the [response format in the official Alexa documentation](https://developer.amazon.com/en-US/docs/alexa/custom-skills/request-and-response-json-reference.html#response-format).

## Alexa Output Configuration

This is the default output configuration for Alexa:

```typescript
const app = new App({
  // ...

  plugins: [
    new AlexaPlatform({
      output: {
        genericOutputToApl: true,
        aplTemplates: {
          carousel: CAROUSEL_APL
          card: CARD_APL
        },
      },
    }),
  ],
});
```

It includes the following properties:

- `genericOutputToApl`: Determines if generic output like [`quickReplies`](#quickreplies), [`card`](#card), and [`carousel`](#carousel) should automatically be converted into an APL directive.
- `aplTemplates.carousel`: Allows the app to override the default APL template used for carousels.
- `aplTemplates.card`: Allows the app to override the default APL template used for cards.
