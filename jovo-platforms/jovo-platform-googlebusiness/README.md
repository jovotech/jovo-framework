# Google Business Messages Platform Integration

> To view this page on the Jovo website, visit https://v3.jovo.tech/marketplace/jovo-platform-googlebusiness

Learn how to build your Google Business Messages bot with the Jovo Framework.

- [Getting Started](#getting-started)
- [Installation](#installation)
- [Basics](#basics)
  - [LAUNCH and END Intent](#launch-and-end-intent)
- [Requests](#requests)
  - [$request](#request)
- [Responses](#responses)

## Getting Started

[Google Business Messages](https://developers.google.com/business-communications/business-messages) allows the user to chat with a business within Google Maps and Search. It is an asynchronous chat platform where businesses can either let a bot answer or a customer service worker. The platform doesn't provide a built-in NLU, so you are free to choose one of the many integrations in the [Jovo Marketplace](https://v3.jovo.tech/marketplace/tag/nlu).

## Installation

Install the module:

```sh
$ npm install jovo-platform-googlebusiness --save
```

> Make sure, that you have a database-integration enabled because this platform needs [User-Session Data](https://v3.jovo.tech/docs/data/user#session-data).
> You do not have to change the config because `GoogleBusiness` will enable the feature when it is installed.

Import the installed module, initialize and add it to the `app` object:

```javascript
// @language=javascript

// src/app.js
const { GoogleBusiness } = require('jovo-platform-googlebusiness');

app.use(
  new GoogleBusiness(),
  // add NLU here
);

// @language=typescript

// src/app.ts
import { GoogleBusiness } from 'jovo-platform-googlebusiness';

app.use(
  new GoogleBusiness(),
  // add NLU here
);
```

After that, you have to add JSON key of a service account that has access to the Google Business Messages API:

```javascript
// @language=javascript

// src/app.js
module.exports = {
	platform: {
		GoogleBusiness: {
			serviceAccount: require('path-to-service-account-json')
		}
	}
};

// @language=typescript

// src/app.ts
export = {
	platform: {
		GoogleBusiness: {
			serviceAccount: require('path-to-service-account-json')
		}
	}
};
```

## Basics

All of the Google Business specific objects and functions are accessed using the `$googleBusinessBot` object:

```js
// @language=javascript

this.$googleBusinessBot;

// @language=typescript

this.$googleBusinessBot;
```

The object will only be defined if the incoming request is from Google Business Messages. Because of that, you should first check whether it's defined or not before accessing it:

```js
// @language=javascript

if (this.$googleBusinessBot) {
}

// @language=typescript

if (this.$googleBusinessBot) {
}
```

### LAUNCH and END Intent

Sadly, the Google Business Messages don't provide a separate request to mark the start and end of a session. Therefore, both the LAUNCH and END intent are not usable.

## Requests

The integration currently supports two different request types. First, the standard text request:

```js
{
  "agent": "brands/BRAND_ID/agents/AGENT_ID",
  "conversationId": "CONVERSATION_ID",
  "customAgentId": "CUSTOM_AGENT_ID",
  "requestId": "REQUEST_ID",
  "message": {
    "messageId": "MESSAGE_ID",
    "name": "conversations/CONVERSATION_ID/messages/MESSAGE_ID",
    "text": "MESSAGE_TEXT",
    "createTime": "MESSAGE_CREATE_TIME",
  },
  "context": {
    "entryPoint": "CONVERSATION_ENTRYPOINT",
    "placeId": "LOCATION_PLACE_ID",
    "userInfo": {
      "displayName": "USER_NAME",
    },
  },
  "sendTime": "SEND_TIME",
}
```

followed by the suggestion request, triggered when a user clicks on one of the provided suggestion chips:

```js
{
  "agent": "brands/BRAND_ID/agents/AGENT_ID",
  "conversationId": "CONVERSATION_ID",
  "customAgentId": "CUSTOM_AGENT_ID",
  "requestId": "REQUEST_ID",
  "suggestionResponse": {
    "message": "conversations/CONVERSATION_ID/messages/MESSAGE_ID",
    "postbackData": "POSTBACK_DATA",
    "createTime": "RESPONSE_CREATE_TIME",
    "text": "SUGGESTION_TEXT",
    "suggestionType": "SUGGESTION_TYPE",
  }
  "context": {
    "entryPoint": "CONVERSATION_ENTRYPOINT",
    "placeId": "LOCATION_PLACE_ID",
    "userInfo": {
      "displayName": "USER_NAME",
    },
  },
  "sendTime": "SEND_TIME",
}
```

> You can find a detailed explanation for each attribute in the official documentation by Google [here](https://developers.google.com/business-communications/business-messages/reference/rest/v1/UserMessage)

### $request

Besides the default request helpers, like `getTimestamp()`, the integration provides the following ones:

| Name                   | Description                                                                           | Return Value                                              |
| :--------------------- | :------------------------------------------------------------------------------------ | :-------------------------------------------------------- |
| `getAgent()`           | returns agent's ID                                                                    | string                                                    |
| `getCustomAgentId()`   | returns the agent's custom ID                                                         | string                                                    |
| `getRequestId()`       | returns the request's ID                                                              | string                                                    |
| `getRawText()`         | returns either the value of the `message.text` or `suggestionResponse.text` attribute | string                                                    |
| `getEntryPoint()`      | returns the entry point that the user clicked to initiate the conversation            | either `ENTRY_POINT_UNSPECIFIED`, `PLACESHEET`, or `MAPS` |
| `getPlaceId()`         | returns the ID from the Google Places database for the location the user messaged.    | string or undefined                                       |
| `getUserDisplayName()` | returns the user's display name                                                       | string or undefined                                       |

## Responses

Besides the generic text response using [`ask()`](https://v3.jovo.tech/docs/output#ask), you can also add cards to your responses.

First, the standalone card using the `showStandaloneCard(card)` method:

```js
// @language=javascript

this.$googleBusinessBot.showStandaloneCard({
  cardContent: {
    title: 'Test Title',
    description: 'test description',
    media: {
      height: 'MEDIUM',
      contentInfo: {
        fileUrl: 'https://test.com/test.png',
        thumbnailUrl: 'https://test.com/thumbnail.png',
        altText: 'my image',
        forceRefresh: false
      }
    },
    suggestions: [
      {
        action: {
          text: 'visit image source',
          openUrlAction: {
            url: 'https://test.com/test.png'
          }
        }
      }
    ]
  }
});

// @language=typescript

this.$googleBusinessBot!.showStandaloneCard({
  cardContent: {
    title: 'Test Title',
    description: 'test description',
    media: {
      height: 'MEDIUM',
      contentInfo: {
        fileUrl: 'https://test.com/test.png',
        thumbnailUrl: 'https://test.com/thumbnail.png',
        altText: 'my image',
        forceRefresh: false
      }
    },
    suggestions: [
      {
        action: {
          text: 'visit image source',
          openUrlAction: {
            url: 'https://test.com/test.png'
          }
        }
      }
    ]
  }
});
```

The card's object structure is equal to the one described in the official Google documentation [here](https://developers.google.com/business-communications/business-messages/reference/rest/v1/conversations.messages#StandaloneCard)

Second, the carousel card using `showCarousel(carousel)`:

```javascript
// @language=javascript

this.$googleBusinessBot.showCarousel({
  cardWidth: 'MEDIUM',
  cardContents: [
    {
      title: 'Test Title',
      description: 'test description',
      media: {
        height: 'MEDIUM',
        contentInfo: {
          fileUrl: 'https://test.com/test.png',
          thumbnailUrl: 'https://test.com/thumbnail.png',
          altText: 'my image',
          forceRefresh: false
        }
      },
      suggestions: [
        {
          action: {
            text: 'visit image source',
            openUrlAction: {
              url: 'https://test.com/test.png'
            }
          }
        }
      ]
    }
  ]
});

// @language=typescript

this.$googleBusinessBot!.showCarousel({
  cardWidth: 'MEDIUM',
  cardContents: [
    {
      title: 'Test Title',
      description: 'test description',
      media: {
        height: 'MEDIUM',
        contentInfo: {
          fileUrl: 'https://test.com/test.png',
          thumbnailUrl: 'https://test.com/thumbnail.png',
          altText: 'my image',
          forceRefresh: false
        }
      },
      suggestions: [
        {
          action: {
            text: 'visit image source',
            openUrlAction: {
              url: 'https://test.com/test.png'
            }
          }
        }
      ]
    }
  ]
});
```

The card's object structure is equal to the one described in the official Google documentation [here](https://developers.google.com/business-communications/business-messages/reference/rest/v1/conversations.messages#carouselcard)
