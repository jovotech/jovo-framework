---
title: 'Facebook Messenger Output'
excerpt: 'Learn more about Jovo output templates for Facebook Messenger.'
---
# Facebook Messenger Output

Learn more about output templates for [Facebook Messenger](https://v4.jovo.tech/marketplace/platform-facebookmessenger).

## Introduction

Jovo offers the ability to [create structured output](https://v4.jovo.tech/docs/output) that is then translated into native platform responses.

This structured output is called [output template](https://v4.jovo.tech/docs/output-templates). Its root properties are generic output elements that work across platforms. [Learn more about how generic output is translated into a Facebook Messenger response below](#generic-output-elements).

```typescript
{
  message: `Hello world! What's your name?`
}
```

You can also add platform-specific output to an output template. [Learn more about Facebook Messenger-specific output below](#facebook-messenger-output-elements).

```typescript
{
  // ...
  platforms: {
    facebookMessenger: {
      // ...
    }
  }
}
```


## Generic Output Elements

Generic output elements are in the root of the output template and work across platforms. [Learn more in the Jovo output template docs](https://v4.jovo.tech/docs/output-templates).

Below, you can find a list of generic output elements that work with Facebook Messenger:

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

It is also possible to use `message` as an object which contains both a `speech` (the *spoken* text on platforms like Alexa) and a `text` (*written* text to be displayed in chat bubbles) field. In this case, Facebook Messenger uses the `text` element.

```typescript
{
  message: {
    speech: 'Hello listener!',
    text: 'Hello reader!'
  }
}
```

Under the hood, Jovo translates the `message` into `message.text` as part of a call to the Facebook Send API ([see the official Facebook Messenger docs](https://developers.facebook.com/docs/messenger-platform/send-messages#sending_text)):

```json
{
  "recipient": {
    "id": "<PSID>"
  },
  "message": {
    "text": "Hello world!"
  }
}
```

### quickReplies

The [generic `quickReplies` element](https://v4.jovo.tech/docs/output-templates#quick-replies) allows you to define small buttons that help the user answer a question faster. This concept is also called [quick replies in the Facebook Messenger documentation](https://developers.facebook.com/docs/messenger-platform/send-messages/quick-replies).

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

Under the hood, Jovo translates these into Facebook Messenger quick replies of the type `text`. [Learn more in the official Facebook Messenger documentation](https://developers.facebook.com/docs/messenger-platform/send-messages/quick-replies#text). The quick replies are added to a `message`:

```json
{
  "recipient":{
    "id":"<PSID>"
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

For other quick reply content types, see [`nativeQuickReplies`](#nativequickreplies) below.


### card

The [generic `card` element](https://v4.jovo.tech/docs/output-templates#card) can be used to send a [Facebook Messenger generic template](https://developers.facebook.com/docs/messenger-platform/send-messages/template/generic). [Learn more about other templates below](#template).

Here is an example of a card with all properties that are supported by Facebook Messenger:

```typescript
{
  // ...
  card: {
    title: 'Hello world!',
    subtitle: 'Welcome to the show.',
    imageUrl: 'https://...',

    // Facebook Messenger specific properties
    defaultAction: { /* ... */ },
    buttons: [ /* ... */ ]
  },
}
```

The following values are specific for Facebook Messenger and are described in detail in sections below:

- `defaultAction`: A URL that is opened in the Facebook Messenger webview when a user taps the template. This element has the same properties as the URL button type that's described in the [`buttons` section below](#buttons).
- [`buttons`](#buttons): Up to 3 buttons that can be attached to the card.

Under the hood, Jovo translates the `card` into the following generic template:

```json
{
  "recipient":{
    "id": "<PSID>"
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

Learn more about this structure in the [official API reference by Facebook](https://developers.facebook.com/docs/messenger-platform/reference/templates/generic).

### carousel

A [generic `carousel` element](https://v4.jovo.tech/docs/output-templates#carousel) is a horizontally scrollable set of [`card`](#card) items. In Facebook's definition, this is called a [carousel of generic templates](https://developers.facebook.com/docs/messenger-platform/send-messages/template/generic#carousel).

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

## Facebook Messenger Output Elements

It is possible to add platform-specific output elements to an output template. [Learn more in the Jovo output template documentation](https://v4.jovo.tech/docs/output-templates#platform-specific-output-elements).

For Facebook Messenger, you can add output elements inside a `facebookMessenger` object:

```typescript
{
  // ...
  platforms: {
    facebookMessenger: {
      // ...
    }
  }
}
```

These elements include:

- [`nativeQuickReplies`](#nativequickreplies)
- [`template`](#template)
- [`buttons`](#buttons)

### nativeQuickReplies

The [generic `quickReplies` element](#quickreplies) can be used for text based quick replies that are supported by many platforms. Additionally, Facebook Messenger supports quick replies that allow you to ask users for their phone number or their email address.

For this, you can use the `nativeQuickReplies` element that offers all properties in the same way as they are detailed in the [official Facebook Messenger API reference](https://developers.facebook.com/docs/messenger-platform/reference/buttons/quick-replies).

Here is an example for a phone number quick reply:

```typescript
import { QuickReplyContentType } from '@jovotech/platform-facebookmessenger';

// ...

{
  // ...
  platforms: {
    facebookMessenger: {
      nativeQuickReplies: [
        {
          content_type: QuickReplyContentType.UserPhoneNumber // or 'user_phone_number'
        }
      ]
    }
  }
}
```

The following quick reply types are supported:

| Enum key | Enum value | Links | 
|----------|------------|-------|
| `QuickReplyContentType.Text` | `'text'` | [Code](https://github.com/jovotech/jovo-output/blob/master/output-facebookmessenger/src/models/quick-reply/TextQuickReply.ts), [Official Docs](https://developers.facebook.com/docs/messenger-platform/send-messages/quick-replies#text)   |
| `QuickReplyContentType.UserPhoneNumber` | `'user_phone_number'` | [Code](https://github.com/jovotech/jovo-output/blob/master/output-facebookmessenger/src/models/quick-reply/UserPhoneNumberQuickReply.ts), [Official Docs](https://developers.facebook.com/docs/messenger-platform/send-messages/quick-replies#phone) |
| `QuickReplyContentType.UserEmail`  | `'user_email'` | [Code](https://github.com/jovotech/jovo-output/blob/master/output-facebookmessenger/src/models/quick-reply/UserEmailQuickReply.ts), [Official Docs](https://developers.facebook.com/docs/messenger-platform/send-messages/quick-replies#email) |

### template

Facebook offers different types of message templates. The generic template (which is the result of the [generic `card` element](#card) from above) is one example for structured data that can be displayed. Learn more about templates in the official Facebook Messenger docs](https://developers.facebook.com/docs/messenger-platform/send-messages/templates).

You can add a template like this:

```typescript
import { TemplateType } from '@jovotech/platform-facebookmessenger';

// ...

{
  // ...
  platforms: {
    facebookMessenger: {
      template: [
        {
          template_type: TemplateType.Receipt // or 'receipt'
        }
      ]
    }
  }
}
```

Depending on the type, different properties can be added in the same way they are used in the Facebook Messenger API,for example:

```typescript
import { TemplateType } from '@jovotech/platform-facebookmessenger';

// ...

{
  // ...
  platforms: {
    facebookMessenger: {
      template: [
        {
          template_type: TemplateType.Receipt, // or 'receipt'
          recipient_name: 'Some Name',
          order_number: '2021100123',
          // ...
        }
      ]
    }
  }
}
```

Here is a table of all supported template types:

| Enum key | Enum value | Links | 
|----------|------------|-------|
| `TemplateType.Generic` | `'generic'` | [Code](https://github.com/jovotech/jovo-output/blob/master/output-facebookmessenger/src/models/template/GenericTemplate.ts), [Official Docs](https://developers.facebook.com/docs/messenger-platform/send-messages/template/generic)   |
| `TemplateType.Receipt` | `'receipt'` | [Code](https://github.com/jovotech/jovo-output/blob/master/output-facebookmessenger/src/models/template/ReceiptTemplate.ts), [Official Docs](https://developers.facebook.com/docs/messenger-platform/send-messages/template/receipt) |
| `TemplateType.Button`  | `'button'` | [Code](https://github.com/jovotech/jovo-output/blob/master/output-facebookmessenger/src/models/template/ButtonTemplate.ts), [Official Docs](https://developers.facebook.com/docs/messenger-platform/send-messages/template/button) |
| `TemplateType.Media`  | `'media'` | [Code](https://github.com/jovotech/jovo-output/blob/master/output-facebookmessenger/src/models/template/MediaTemplate.ts), [Official Docs](https://developers.facebook.com/docs/messenger-platform/send-messages/template/media) |


A template gets translated into the following:

```JSON
{
  "recipient":{
    "id":"<PSID>"
  },
  "message":{
    "attachment":{
      "type":"template",
      "payload":{
        "template_type":"<TEMPLATE_TYPE>",
        // ...
      }
    }
  }
}
```

### buttons

All [templates](#template) (including the [generic `card` element](#card) that gets translated into a generic template) may contain buttons, which are added using the `buttons` array.

```typescript
import { ButtonType } from '@jovotech/platform-facebookmessenger';

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

Here is a table of all supported button types:

| Enum key | Enum value | Links | 
|----------|------------|-------|
| `ButtonType.Postback` | `'postback'` | [Code](https://github.com/jovotech/jovo-output/blob/master/output-facebookmessenger/src/models/button/PostbackButton.ts), [Official Docs](https://developers.facebook.com/docs/messenger-platform/send-messages/buttons#postback)   |
| `ButtonType.Url` | `'web_url'` | [Code](https://github.com/jovotech/jovo-output/blob/master/output-facebookmessenger/src/models/button/UrlButton.ts), [Official Docs](https://developers.facebook.com/docs/messenger-platform/send-messages/buttons#url) |
| `ButtonType.Call`  | `'phone_number'` | [Code](https://github.com/jovotech/jovo-output/blob/master/output-facebookmessenger/src/models/button/CallButton.ts), [Official Docs](hhttps://developers.facebook.com/docs/messenger-platform/send-messages/buttons#call) |
| `ButtonType.LogIn`  | `'account_link'` | [Code](https://github.com/jovotech/jovo-output/blob/master/output-facebookmessenger/src/models/button/LogInButton.ts), [Official Docs](https://developers.facebook.com/docs/messenger-platform/send-messages/buttons#login) |
| `ButtonType.LogOut`  | `'account_unlink'` | [Code](https://github.com/jovotech/jovo-output/blob/master/output-facebookmessenger/src/models/button/LogOutButton.ts), [Official Docs](https://developers.facebook.com/docs/messenger-platform/send-messages/buttons#logout) |
| `ButtonType.GamePlay`  | `'game_play'` | [Code](https://github.com/jovotech/jovo-output/blob/master/output-facebookmessenger/src/models/button/GamePlayButton.ts), [Official Docs](https://developers.facebook.com/docs/messenger-platform/send-messages/buttons#game_play) |


[Learn more about all buttons types in the official Facebook Messenger docs](https://developers.facebook.com/docs/messenger-platform/send-messages/buttons)
