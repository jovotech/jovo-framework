---
title: 'Google Assistant Output'
excerpt: 'Learn more about Jovo output templates for Google Assistant Output.'
---
# Google Assistant Output

Learn more about output templates for [Google Assistant](https://v4.jovo.tech/marketplace/platform-googleassistant).

## Introduction

Jovo offers the ability to [create structured output](https://v4.jovo.tech/docs/output) that is then translated into native platform responses.

This structured output is called [output template](https://v4.jovo.tech/docs/output-templates). Its root properties are generic output elements that work across platforms. [Learn more about how generic output is translated into a Google Assistant response below](#generic-output-elements).

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
    googleAssistant: {
      // ...
    }
  }
}
```


## Generic Output Elements

Generic output elements are in the root of the output template and work across platforms. [Learn more in the Jovo Output docs](https://v4.jovo.tech/docs/output-templates).

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

You can display a collection ([see the official Google Assistant docs](https://developers.google.com/assistant/conversational/prompts-selection?hl=en#collection)) by using the `carousel` property:

```typescript
{
  // ...
  carousel: {
    title: 'Select an element',
    selection: {
      intent: 'SelectElementIntent',
      entityType: 'ElementType',
    },
    items: [
      {
        title: 'Element A',
        content: 'To my right, you will see element 2.'
        selection: {
          entities: {
            element: {
              value: 'a'
            }
          }
        }
      },
      {
        title: 'Element B',
        content: 'Hi there!',
        selection: {
          entities: {
            element: {
              value: 'b'
            }
          }
        }
      }
    ],
  },
}
```

It includes the following properties:

* `selection` (required): This is used to map a selection of an item to both an `intent` and an `entityType`. The type is needed to create a type override ([see official Google documentation](https://developers.google.com/assistant/conversational/webhooks?hl=en&tool=builder#runtime_type_overrides)).
* `items` (required): An array of elements to be displayed. They also need to include a `selection` property with an `entities` map.
* `title` (optional): A string that gets displayed at the top.


## Google Assistant-specific Output Elements

It is possible to add platform-specific output elements to an output template. [Learn more in the Jovo output documentation](https://v4.jovo.tech/docs/output-templates#platform-specific-output-elements).

For Google Assistant, you can add output elements inside an `googleAssistant` object:

```typescript
{
  // ...
  platforms: {
    googleAssistant: {
      // ...
    }
  }
}
```

### Native Response

The [`nativeResponse` property](https://v4.jovo.tech/docs/output-templates#native-response) allows you to add native elements exactly how they would be added to the Google Assistant JSON response.

```typescript
{
  // ...
  platforms: {
    googleAssistant: {
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
    googleAssistant: {
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
