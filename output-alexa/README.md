---
title: 'Alexa Output'
excerpt: 'Learn more about Jovo output templates for Alexa.'
---
# Alexa Output

Learn more about output templates for [Alexa](https://v4.jovo.tech/marketplace/platform-alexa).

## Introduction

Jovo offers the ability to [create structured output](https://v4.jovo.tech/docs/output) that is then translated into native platform responses.

This structured output is called [output template](https://v4.jovo.tech/docs/output-templates). Its root properties are generic output elements that work across platforms. [Learn more about how generic output is translated into an Alexa response below](#generic-output-elements).

```typescript
{
  message: `Hello world! What's your name?`,
  reprompt: 'Could you tell me your name?',
  listen: true,
}
```

You can also add platform-specific output to an output template. [Learn more about Alexa-specific output below](#alexa-specific-output-elements).

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

Generic output elements are in the root of the output template and work across platforms. [Learn more in the Jovo Output docs](https://v4.jovo.tech/docs/output-templates).

Below, you can find a list of generic output elements that work with Alexa.
### Message

The `message` is what Alexa is saying to the user:

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

If the `message` is an object that contains `speech` and `text`, the `speech` property will be used for Alexa:

```typescript
{
  message: {
    speech: 'Hello world!', // Used by Alexa
    text: 'Hello screen!', // Used by chat platforms or other voice platforms that support display text
  }
}
```

### Reprompt

If Alexa asks a question and the user does not respond after a few seconds, it will state a `reprompt` to ask again:

```typescript
{
  message: `Hello world! What's your name?`,
  reprompt: 'Could you tell me your name?',
  listen: true,
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

**Note**: For Alexa to wait for a user to answer a question, the [listen property](#listen) needs to be added.

### Listen

The `listen` property needs to be added to tell Alexa that it should keep the microphone open and wait for a user's response.

```typescript
{
  listen: true,
}
```

Under the hood, Jovo translates `listen: true` to `"shouldEndSession": false` in the JSON response.

### Quick Replies

Alexa does not natively support quick replies. However, Jovo automatically turns the `quickReplies` object into buttons for APL:

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

For these buttons, you need to pass a target `intent`. When the button is clicked, the [Jovo Router](https://v4.jovo.tech/docs/routing) automatically maps this to the specified intent.

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
        }
      },
    }
  ]
}
```

### Card

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

**Note**: If you want to send a home card to the Alexa mobile app instead, we recommend using the [`nativeResponse` property](#native-response).

### Carousel

Alexa does not natively support carousels. However, Jovo automatically turns the `carousel` object into a card slider for APL:

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

## Alexa-specific Output Elements

It is possible to add platform-specific output elements to an output template. [Learn more in the Jovo output documentation](https://v4.jovo.tech/docs/output-templates#platform-specific-output-elements).

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

The [`nativeResponse` property](https://v4.jovo.tech/docs/output-templates#native-response) allows you to add native elements exactly how they would be added to the Alexa JSON response.

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
              document: { /* ... */ },
              datasources: { /* ... */ },
            }
          ]
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
      },
    }),
  ],
});
```

It includes the following properties:

* `genericOutputToApl`: Determines if generic output like `quickReplies`, `card`, and `carousel` should automatically be converted into an APL directive.
