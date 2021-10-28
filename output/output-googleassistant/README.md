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

You can also add platform-specific output to an output template. [Learn more about Google Assistant-specific output below](#google-assistant-output-elements).

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

Generic output elements are in the root of the output template and work across platforms. [Learn more in the Jovo output template docs](https://v4.jovo.tech/docs/output-templates).

Below, you can find a list of generic output elements that work with Google Assistant:

- [`message`](#message)
- [`reprompt`](#reprompt)
- [`listen`](#listen)
- [`quickReplies`](#quickreplies-suggestions) (called *suggestions* in Google Assistant)
- [`card`](#card)
- [`carousel`](#carousel) (called *collection* in Google Assistant)

### message

The [generic `message` element](https://v4.jovo.tech/docs/output-templates#message) is what Google Assistant is saying (or displaying) to the user:

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
      "speech": "<speak>Hello world!</speak>",
      "text": "Hello world!"
    }
  }
}
```

The resulting `speech` property gets automatically wrapped into SSML tags. For `text`, SSML is removed.

It's also possible to turn `message` into an object with a `speech` and a `text` property:

```typescript
{
  message: {
    speech: 'Hello listener!',
    text: 'Hello reader!'
  },
}
```

This is then turned into the following response:

```json
{
  "prompt": {
    "firstSimple": {
      "speech": "<speak>Hello listener!</speak>",
      "text": "Hello reader!"
    }
  }
}
```

### reprompt

The [generic `reprompt` element](https://v4.jovo.tech/docs/output-templates#message) is used to ask again if the user does not respond to a prompt after a few seconds:

```typescript
{
  message: `Hello world! What's your name?`,
  reprompt: 'Could you tell me your name?',
  listen: true,
}
```

Under the hood, Jovo translates the `reprompt` into `NO_INPUT_1`, `NO_INPUT_2`, and `NO_INPUT_FINAL`.

**Note**: For Google Assistant to wait for a user to answer a question, the [listen property](#listen) needs to be added.

### listen

The [`listen` element](https://v4.jovo.tech/docs/output-templates#listen)  determines if Google Assistant should keep the microphone open and wait for a user's response.

By default (if you don't specify it otherwise in the template), `listen` is set to `true`. If you want to close a session after a response, you need to set it to `false`:

```typescript
{
  message: `Goodbye!`,
  listen: false,
}
```

If `listen` is set to `false`, Jovo sets the `expectUserResponse` in the Google Assistant response to `false`.

The `listen` element can also be used to add dynamic entities, called type overrides in Google Assistant. [Learn more in the `$entities` documentation](https://v4.jovo.tech/docs/entities#dynamic-entities).

### quickReplies (Suggestions)

The [generic `quickReplies` element](https://v4.jovo.tech/docs/output-templates#quick-replies) translates into a concept called suggestions on Google Assistant. [You can learn more in the official Google Assistant docs](https://developers.google.com/assistant/conversational/prompts?hl=en#suggestions).

```typescript
{
  // ...
  quickReplies: [ 'Yes', 'No' ]
}
```

Under the hood, Jovo translates `quickReplies` into the following:

```json
{
  "suggestions": [
    {
      "title": "Yes"
    },
    {
      "title": "No"
    }
  ]
}
```

If you define your `quickReplies` using objects instead of strings, the `text` property will be used for the resulting `title`:


```typescript
{
  quickReplies: [
    {
      text: 'oh yeah', // this is used for 'title'
      value: 'yes'
    },
    // ...
  ]
}
```


### card

The [generic `card` element](https://v4.jovo.tech/docs/output-templates#card) can be used to display a basic card in Google Assistant. [Learn more about basic cards in the official Google Assistant docs](https://developers.google.com/assistant/conversational/prompts-rich?hl=en).

```typescript
{
  // ...
  card: {
    title: 'Hello world!',
    subtitle: 'Some subtitle',
    content: 'Welcome to this new app built with Jovo.',
    imageUrl: 'https://...'
  },
}
```

Under the hood, this gets translated into the following object as part of the response to Google Assistant:

```json
{
  "card": {
    "title": "Hello world!",
    "subtitle": "Some subtitle",
    "text": "Welcome to this new app built with Jovo.", // Taken from 'content'
    "image": {
      "alt": "Hello world!", // Taken from 'title'
      "url": "https://...",
    }
  }
}
```

### carousel (Collection)

A [generic `carousel` element](https://v4.jovo.tech/docs/output-templates#carousel) is a horizontally scrollable set of [`card`](#card) items. In Google Assistant, this is called a *collection*. [Learn more in the official Google Assistant docs](https://developers.google.com/assistant/conversational/prompts-selection?hl=en#collection).

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


## Google Assistant Output Elements

It is possible to add platform-specific output elements to an output template. [Learn more in the Jovo output template documentation](https://v4.jovo.tech/docs/output-templates#platform-specific-output-elements).

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

### nativeResponse

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
