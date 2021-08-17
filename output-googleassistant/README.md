# Google Assistant Output

Learn more about output templates for Google Assistant.
- [Introduction](#introduction)
- [Generic Output Elements](#generic-output-elements)
  - [Message](#message)
  - [Reprompt](#reprompt)
  - [Listen](#listen)
  - [Quick Replies (Suggestions)](#quick-replies-suggestions)
  - [Card](#card)
  - [Carousel (Collection)](#carousel-collection)
- [Google Assistant-specific Output Elements](#google-assistant-specific-output-elements)
  - [Native Response](#native-response)


## Introduction

Jovo offers the ability to [create structured output](https://github.com/jovotech/jovo-framework/blob/v4dev/docs/routing.md) that is then translated into native platform responses.

This structured output is called [output template](https://github.com/jovotech/jovo-output/blob/master/docs/output-templates.md). Its root properties are generic output elements that work across platforms. [Learn more about how generic output is translated into a Google Assistant response below](#generic-output-elements).

```typescript
{
  message: `Hello world! What's your name?`,
  reprompt: 'Could you tell me your name?',
  listen: true,
}
```

You can also add platform-specific output to an output template. [Learn more about Google Assistant-specific output below](#google-assistant-specific-output-elements).

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


## Generic Output Elements

Generic output elements are in the root of the output template and work across platforms. [Learn more in the Jovo Output docs](https://github.com/jovotech/jovo-output/blob/master/docs/output-templates.md).

Below, you can find a list of generic output elements that work with Google Assistant.

### Message

The `message` is what Google Assistant is saying (or displaying) to the user:

```typescript
{
  message: 'Hello world!',
}
```

Under the hood, Jovo translates the `message` into a `firstSimple` response object ([see the official Google Assistant docs](https://developers.google.com/assistant/conversational/prompts-simple?hl=en)):

```json
{
  "prompt": {
    "firstSimple": {
      "speech": "Hello world!"
    }
  }
}
```

It's also possible to add a `displayText` property:

```typescript
{
  message: {
    text: 'Speech hello world!',
    displayText: 'Display hello world!'
  },
}
```

This is then turned into the following response:

```json
{
  "prompt": {
    "firstSimple": {
      "speech": "Speech hello world!",
      "text": "Display hello world!"
    }
  }
}
```

### Reprompt

If Google Assistant asks a question and the user does not respond after a few seconds, it will state a `reprompt` to ask again:

```typescript
{
  message: `Hello world! What's your name?`,
  reprompt: 'Could you tell me your name?',
  listen: true,
}
```

Under the hood, Jovo translates the `reprompt` into `NO_INPUT_1`, `NO_INPUT_2`, and `NO_INPUT_FINAL`.

**Note**: For Google Assistant to wait for a user to answer a question, the [listen property](#listen) needs to be added.

### Listen

The `listen` property needs to be added to tell Google Assistant that it should keep the microphone open and wait for a user's response.

```typescript
{
  listen: true,
}
```

If `listen` is not set to `true`, Jovo transitions to the `actions.scene.END_CONVERSATION` under the hood.

### Quick Replies (Suggestions)

On Google Assistant, quick replies are called suggestions. [You can learn more in the official Google Assistant docs](https://developers.google.com/assistant/conversational/prompts?hl=en#suggestions).

```typescript
{
  // ...
  quickReplies: [ 'Yes', 'No' ]
}
```

### Card

You can display a basic card ([see the official Google Assistant docs](https://developers.google.com/assistant/conversational/prompts-rich?hl=en)) by using the `card` property:

```typescript
{
  // ...
  card: {
    title: 'Hello world!',
    content: 'Welcome to this new app built with Jovo.'
  },
}
```

### Carousel (Collection)

You can display a collection ([see the official Google Assistant docs](https://developers.google.com/assistant/conversational/prompts-selection?hl=en)) by using the `carousel` property:

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

## Google Assistant-specific Output Elements

It is possible to add platform-specific output elements to an output template. [Learn more in the Jovo output documentation](https://github.com/jovotech/jovo-output/blob/master/docs/output-templates.md#platform-specific-output-elements).

For Google Assistant, you can add output elements inside an `GoogleAssistant` object:

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

### Native Response

The [`nativeResponse` property](https://github.com/jovotech/jovo-output/blob/master/docs/output-templates.md#native-response) allows you to add native elements exactly how they would be added to the Google Assistant JSON response.

```typescript
{
  // ...
  platforms: {
    GoogleAssistant: {
      nativeResponse: {
        // ...
      }
    }
  }
}
```

For example, you can add `scene` information ([see the official Google docs](https://developers.google.com/assistant/conversational/webhooks?hl=en&tool=builder#response-json_4)) like this:

```typescript
{
  // ...
  platforms: {
    GoogleAssistant: {
      nativeResponse: {
        scene: {
          name: 'SceneName',
          slots: {},
          next: {
            name: 'HiddenScene',
          }
        }
      }
    }
  }
}
```

You can find examples for the [Google Assistant response format in the official Google documentation](https://developers.google.com/assistant/conversational/webhooks?hl=en&tool=builder#example-response).