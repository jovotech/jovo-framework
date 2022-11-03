---
title: 'Google Business Messages Output'
excerpt: 'Learn more about Jovo output templates for Google Business Messages.'
url: 'https://www.jovo.tech/marketplace/platform-googlebusiness/output'
---

# Google Business Messages Output

Learn more about output templates for [Google Business Messages](https://www.jovo.tech/marketplace/platform-googlebusiness).

## Introduction

Jovo offers the ability to [create structured output](https://www.jovo.tech/docs/output) that is then translated into native platform responses.

This structured output is called [output template](https://www.jovo.tech/docs/output-templates). Its root properties are generic output elements that work across platforms. [Learn more about how generic output is translated into a Google Business Messages response below](#generic-output-elements).

```typescript
{
  message: `Hello world! What's your name?`,
}
```

You can also add platform-specific output to an output template. [Learn more about Google Business Messages-specific output below](#google-business-messages-output-elements).

```typescript
{
  // ...
  platforms: {
    googleBusiness: {
      // ...
    }
  }
}
```

## Generic Output Elements

Generic output elements are in the root of the output template and work across platforms. [Learn more in the Jovo output template docs](https://www.jovo.tech/docs/output-templates).

Below, you can find a list of generic output elements that work with Google Business Messages:

- [`message`](#message)
- [`quickReplies`](#quickreplies)
- [`card`](#card)
- [`carousel`](#carousel)

### message

The [generic `message` element](https://www.jovo.tech/docs/output-templates#message) contains the main response of your bot, which is usually displayed in a chat bubble:

```typescript
{
  message: 'Hello world!',
}
```

Under the hood, Jovo translates the `message` into a text message ([see the official Google Business Messages docs](https://developers.google.com/business-communications/business-messages/guides/build/send#text)):

```json
{
  "text": "Hello world!"
  // ...
}
```

It is also possible to use `message` as an object which contains both a `speech` (the _spoken_ text on platforms like Alexa) and a `text` (_written_ text to be displayed in chat bubbles). In this case, Google Business Messages uses the `text` element.

```typescript
{
  message: {
    speech: 'Hello listener!',
    text: 'Hello reader!'
  }
}
```

### quickReplies

The [generic `quickReplies` element](https://www.jovo.tech/docs/output-templates#quick-replies) allows you to define small buttons that help the user answer a question faster. This concept is called [suggested replies in the Google Business Messages documentation](https://developers.google.com/business-communications/business-messages/guides/build/send#suggested_replies).

Quick replies can be an array of strings:

```typescript
{
  // ...
  quickReplies: ['yes', 'no'],
}
```

Alternatively, you can use an array of objects that includes a `text` (what the user sees) and a `value` (what is passed to the bot):

```typescript
{
  // ...
  quickReplies: [
    {
      text: 'oh yeah',
      value: 'yes',
    },
    {
      text: 'hell no',
      value: 'no',
    },
  ],
}
```

Under the hood, Jovo translates these into Google Business Messages suggested replies:

```json
{
  "suggestions": [
    {
      "reply": {
        "text": "oh yeah",
        "postbackData": "yes"
      }
    },
    {
      "reply": {
        "text": "hell no",
        "postbackData": "no"
      }
    }
  ]
  // ...
}
```

The `postbackData` is the value that gets passed to the [NLU integration](https://www.jovo.tech/docs/nlu) to turn raw text into structured content. For quick replies that are passed as strings, the `text` and `postbackData` are the same. If the quick replies are objects, the `text` is used as `text` and the `value` as `postbackData`.

### card

The [generic `card` element](https://www.jovo.tech/docs/output-templates#card) can be used to send a [Google Business Messages rich card](https://developers.google.com/business-communications/business-messages/guides/build/send#rich-cards).

Here is an example of a card with all properties that are supported by Google Business Messages:

```typescript
{
  // ...
  card: {
    title: 'Hello world!',
    content: 'Welcome to the show.', // Can also use the 'subtitle' property
    imageUrl: 'https://...',
    imageAlt: 'The image displays a...',

    // Google Business Messages specific properties
    suggestions: [ /* ... */ ]
  },
}
```

The [`suggestions` property](#suggestions) is specific for Google Business Messages and described in detail below.

Under the hood, Jovo translates the `card` into the following rich card:

```json
{
  "richCard": {
    "standaloneCard": {
      "cardContent": {
        "title": "Hello world",
        "description": "Sent with Business Messages.",
        "media": {
          "height": "MEDIUM",
          "contentInfo": {
            "altText": "The image displays a...",
            "fileUrl": "https://jovo-assets.s3.amazonaws.com/jovo-icon.png"
          }
        },
        "suggestions": []
      }
    }
  }
  // ...
}
```

Since Google Business Message rich cards don't offer a subtitle, either the `content` or `subtitle` property of the generic `card` element is used as a `description` (`content` is prioritized if both exist).

If no `imageAlt` is provided, the `title` is being used.

### carousel

A [generic `carousel` element](https://www.jovo.tech/docs/output-templates#carousel) is a horizontally scrollable set of [`card`](#card) items. In Google Business Messages' definition, this is called a [rich card carousel](https://developers.google.com/business-communications/business-messages/guides/build/send#rich-card-carousels).

This is how a carousel can be defined:

```typescript
{
  // ...
  carousel: {
    items: [
      {
        title: 'Hello world!',
        content: 'Welcome to the show.',
        imageUrl: 'https://jovo-assets.s3.amazonaws.com/jovo-icon.png',
        imageAlt: 'The image displays a...',
      },
      {
        title: 'Hi there!',
        content: 'This is element 2.',
        imageUrl: 'https://jovo-assets.s3.amazonaws.com/jovo-icon.png',
        imageAlt: 'The image displays a...',
      }
    ]
  },
}
```

The elements in the `items` array can contain all properties that are shown in the [`card` section](#card). If the array consists of only 1 item, the output is converted to a single [`card`](#card).

Under the hood, Jovo translates the `carousel` into the following rich card carousel:

```json
{
  "richCard": {
    "carouselCard": {
      "cardWidth": "MEDIUM",
      "cardContents": [
        {
          "title": "Hello world!",
          "description": "Welcome to the show.",
          "suggestions": [],
          "media": {
            "height": "MEDIUM",
            "contentInfo": {
              "altText": "The image displays a...",
              "fileUrl": "https://..."
            }
          }
        },
        {
          "title": "Hi there!",
          "description": "This is element 2."
          // ...
        }
      ]
    }
  }
  // ...
}
```

## Google Business Messages Output Elements

It is possible to add platform-specific output elements to an output template. [Learn more in the Jovo output template documentation](https://www.jovo.tech/docs/output-templates#platform-specific-output-elements).

For Google Business Messages, you can add output elements inside a `googleBusiness` object:

```typescript
{
  // ...
  platforms: {
    googleBusiness: {
      // ...
    }
  }
}
```

These elements include:

- [`fallback`](#fallback)
- [`suggestions`](#suggestions)
- [`image`](#image)
- [`nativeResponse`](#nativeresponse)

### fallback

Google Business Messages lets you define a message that gets displayed if the user's device/client does not support a specific feature (e.g. suggested replies) of the main message. [Learn more about the fallback strategy in the official Google Business Messages docs](https://developers.google.com/business-communications/business-messages/guides/build/send#fallback_strategy).

You can set a `fallback` message like this:

```typescript
{
  // ...
  platforms: {
    googleBusiness: {
      // ...
      fallback: 'Hello world!',
    }
  }
}
```

Under the hood, Jovo adds the `fallback` to the response like this:

```json
{
  "fallback": "Hello world!"
  // ...
}
```

### suggestions

In the sections above, we've come across `suggestions` already. For example, [`quickReplies`](#quickreplies) are turned into _suggested replies_ and [cards](#card) may also contain `suggestions`. Overall, a _suggestion_ can be seen as a helpful prompt that guides a user in leaving a certain input or taking certain actions.

Google Business Messages offers different types of `suggestions` that can either be added to an element like [`card`](#card) or to the overall message like this:

```typescript
{
  // ...
  platforms: {
    googleBusiness: {
      // ...
      suggestions: [
        // ...
      ];
    }
  }
}
```

Each type of suggestion comes with its own set of properties, which are all added in the same way as they are detailed in the official Google Business Messages documentation:

- [Suggested replies](https://developers.google.com/business-communications/business-messages/guides/build/send#suggested_replies)
- [Suggested actions](https://developers.google.com/business-communications/business-messages/guides/build/send#suggested_actions)
- [Authentication request suggestion](https://developers.google.com/business-communications/business-messages/guides/build/send#authentication-request-suggestion)
- [Live agent request suggestion](https://developers.google.com/business-communications/business-messages/guides/build/send#live_agent_request_suggestion)

### image

You can send an image by adding the `image` element to your Google Business output. [Learn more about images in the official Google Business Messages docs](https://developers.google.com/business-communications/business-messages/guides/build/send#images).

```typescript
{
  // ...
  platforms: {
    googleBusiness: {
      // ...
      image: {
        fileUrl: 'https://...',
        thumbnailUrl: 'https://...',
        altText: 'An image that shows a...',
        forceRefresh: false,
      }
    }
  }
}
```

The `image` properties are added to the response like this:

```json
{
  "image": {
    "contentInfo": {
      "fileUrl": "https://...",
      "thumbnailUrl": "https://...",
      "altText": "An image that shows a...",
      "forceRefresh": false
    }
  }
  // ...
}
```

Learn more about the properties in the [official API reference](https://developers.google.com/business-communications/business-messages/reference/rest/v1/conversations.messages#contentinfo).

### nativeResponse

The [`nativeResponse` property](https://www.jovo.tech/docs/output-templates#native-response) allows you to add native elements exactly how they would be added to the Google Business message JSON.

```typescript
{
  // ...
  platforms: {
    googleBusiness: {
      // ...
      nativeResponse: {
        // ...
      }
    }
  }
}
```

Learn more about the JSON structure in the [Google Business Messages "Send messages" documentation](https://developers.google.com/business-communications/business-messages/guides/build/send).
