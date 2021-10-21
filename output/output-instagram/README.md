---
title: 'Instagram Output'
excerpt: 'Learn more about Jovo output templates for Instagram bots.'
---
# Instagram Output

Learn more about output templates for [Instagram](https://v4.jovo.tech/marketplace/platform-instagram).

## Introduction

Jovo offers the ability to [create structured output](https://v4.jovo.tech/docs/output) that is then translated into native platform responses.

This structured output is called [output template](https://v4.jovo.tech/docs/output-templates). Its root properties are generic output elements that work across platforms. [Learn more about how generic output is translated into an Instagram response below](#generic-output-elements).

```typescript
{
  message: `Hello world! What's your name?`
}
```

You can also add platform-specific output to an output template. [Learn more about Instagram-specific output below](#instagram-output-elements).

```typescript
{
  // ...
  platforms: {
    instagram: {
      // ...
    }
  }
}
```


## Generic Output Elements

Generic output elements are in the root of the output template and work across platforms. [Learn more in the Jovo output template docs](https://v4.jovo.tech/docs/output-templates).

Below, you can find a list of generic output elements that work with Instagram:

- [`message`](#message)
- [`quickReplies`](#quickreplies)
- [`card`](#card)
- [`carousel`](#carousel)

### message

The [generic `message` element](https://v4.jovo.tech/docs/output-templates#message)  contains the main response of your bot, which is usually displayed in a chat bubble:

```typescript
{
  message: 'Hello world!',
}
```

It is also possible to use `message` as an object which contains both a `speech` (the *spoken* text on platforms like Alexa) and a `text` (*written* text to be displayed in chat bubbles) field. In this case, Instagram uses the `text` element.

```typescript
{
  message: {
    speech: 'Hello listener!',
    text: 'Hello reader!'
  }
}
```

Under the hood, Jovo translates the `message` into `message.text` as part of a call to the Facebook Send API ([see the official Instagram Messaging docs](https://developers.facebook.com/docs/messenger-platform/instagram/features/send-message)):

```json
{
  "recipient": {
    "id": "<IGSID>"
  },
  "message": {
    "text": "Hello world!"
  }
}
```

### quickReplies

The [generic `quickReplies` element](https://v4.jovo.tech/docs/output-templates#quick-replies) allows you to define small buttons that help the user answer a question faster. This concept is also called [quick replies in the Instagram Messaging documentation](https://developers.facebook.com/docs/messenger-platform/instagram/features/quick-replies).

Quick replies can be an array of strings:

```typescript
{
  // ...
  quickReplies: [ 'yes', 'no' ]
}
```

Alternatively, you can use an array of objects that includes a `text` (what the user sees) and a `value` (what is passed to the bot):

```typescript
{
  // ...
  quickReplies: [
    {
      text: 'oh yeah',
      value: 'yes'
    },
    {
      text: 'hell no',
      value: 'no'
    }
  ]
}
```

Under the hood, Jovo translates these into Instagram quick replies of the type `text`. [Learn more in the official Instagram Messaging documentation](https://developers.facebook.com/docs/messenger-platform/instagram/features/quick-replies#sending-quick-replies). The quick replies are added to a `message`:

```json
{
  "recipient":{
    "id":"<IGSID>"
  },
  "messaging_type": "RESPONSE",
  "message": {
    "quick_replies": [
      {
        "content_type": "text",
        "title": "oh yeah",
        "payload": "yes"
      },
      {
        "content_type": "text",
        "title": "hell no",
        "payload": "no"
      }
    ]
  }
}
```

The `payload` is the value that gets passed to the [NLU integration](https://v4.jovo.tech/docs/nlu) to turn raw text into structured content. For quick replies that are passed as strings, the `title` and `payload` are the same. If the quick replies are objects, the `text` gets turned into `title` and the `value` into `payload`.


### card

The [generic `card` element](https://v4.jovo.tech/docs/output-templates#card) can be used to send a [Instagram Messaging generic template](https://developers.facebook.com/docs/messenger-platform/instagram/features/generic-template).

Here is an example of a card with all properties that are supported by Instagram:

```typescript
{
  // ...
  card: {
    title: 'Hello world!',
    subtitle: 'Welcome to the show.',
    imageUrl: 'https://...',

    // Instagram specific properties
    defaultAction: { /* ... */ },
    buttons: [ /* ... */ ]
  },
}
```

The following values are specific for Instagram and are described in detail in sections below:

- `defaultAction`: A URL that is opened in the Instagram webview when a user taps the template. This element has the same properties as the URL button type that's described in the [`buttons` section below](#buttons).
- [`buttons`](#buttons): Up to 3 buttons that can be attached to the card.

Under the hood, Jovo translates the `card` into the following generic template:

```json
{
  "recipient":{
    "id": "<IGSID>"
  },
  "message":{
    "attachment":{
      "type": "template",
      "payload":{
        "template_type": "generic",
        "elements": [
           {
            "title": "Hello world!",
            "image_url":"https://...",
            "subtitle": "Welcome to the show.",
            "default_action": {
              "type": "web_url",
              "url": "https://...",
              "webview_height_ratio": "tall",
            },
            "buttons": [
              {
                "type":"postback",
                "title":"Start Chatting",
                "payload":"DEVELOPER_DEFINED_PAYLOAD"
              }              
            ]      
          }
        ]
      }
    }
  }
}
```

Learn more about this structure in the [official Instagram Messaging docs](https://developers.facebook.com/docs/messenger-platform/instagram/features/generic-template).

### carousel

A [generic `carousel` element](https://v4.jovo.tech/docs/output-templates#carousel) is a horizontally scrollable set of [`card`](#card) items. In Facebook's definition, this is called a [carousel of generic templates](https://developers.facebook.com/docs/messenger-platform/instagram/features/generic-template).

This is how a carousel can be defined:

```typescript
{
  // ...
  carousel: {
    items: [
      {
        title: 'Hello world!',
        subtitle: 'Welcome to the show.',
        imageUrl: 'https://...',
      },
      {
        title: 'Hello again!',
        subtitle: 'This is element 2.',
        imageUrl: 'https://...',
      }
    ]
  },
}
```

The elements in an `items` array can contain all properties that are shown in the [`card` section](#card).

## Instagram Output Elements

It is possible to add platform-specific output elements to an output template. [Learn more in the Jovo output template documentation](https://v4.jovo.tech/docs/output-templates#platform-specific-output-elements).

For Instagram, you can add output elements inside a `instagram` object:

```typescript
{
  // ...
  platforms: {
    instagram: {
      // ...
    }
  }
}
```

These elements include:

- [`buttons`](#buttons)

### buttons

The [generic `card` element](#card) that gets translated into a generic template may contain buttons, which are added using the `buttons` array.

```typescript
import { ButtonType } from '@jovotech/output-instagram';

// ...

{
  // ...
  card: {
    // ...
    buttons: [
      {
        type: ButtonType.Postback, // or 'postback'
        title: 'Start Chatting',
        payload: 'DEVELOPER_DEFINED_PAYLOAD' // what happens with payload?
      }

    ],
  },
}
```

Not all button types supported by Facebook Messenger are supported by Instagram. Here is a table of all supported button types:

| Enum key | Enum value | Links | 
|----------|------------|-------|
| `ButtonType.Postback` | `'postback'` | [Code](https://github.com/jovotech/jovo-output/blob/master/output-facebookmessenger/src/models/button/PostbackButton.ts), [Official Docs](https://developers.facebook.com/docs/messenger-platform/send-messages/buttons#postback)   |
| `ButtonType.Url` | `'web_url'` | [Code](https://github.com/jovotech/jovo-output/blob/master/output-facebookmessenger/src/models/button/UrlButton.ts), [Official Docs](https://developers.facebook.com/docs/messenger-platform/send-messages/buttons#url) |


[Learn more about the buttons types in the official Facebook Messenger docs](https://developers.facebook.com/docs/messenger-platform/send-messages/buttons).
