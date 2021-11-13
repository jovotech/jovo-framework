# Response

> To view this page on the Jovo website, visit https://v3.jovo.tech/marketplace/jovo-platform-googleassistant/request-response/response

## Introduction

The response is the data that you send to the platform after processing the request. It consists of information like:

* output, e.g. speech, audio, etc.
* permission requests,
* or session data

Here's an example response:

```js
{
  "fulfillmentText": "Simple Ask",
  "outputContexts": [
    {
      "name": "projects/newagent-904be/agent/sessions/1526414104011/contexts/_jovo_session_pmfoz",
      "lifespanCount": 1,
      "parameters": {
        "session": "attribute",
        "_JOVO_STATE_": "test"
      }
    }
  ],
  "payload": {
    "google": {
      "expectUserResponse": true,
      "richResponse": {
        "items": [
          {
            "simpleResponse": {
              "ssml": "<speak>Simple Ask</speak>",
              "displayText": "Sample Display Text"
            }
          },
          {
            "basicCard": {
              "title": "Sample Card Title",
              "formattedText": "Sample Card Content"
            }
          }
        ],
        "suggestions": [
          {
            "title": "Suggestion 1"
          },
          {
            "title": "Suggestion 2"
          }
        ]
      },
      "noInputPrompts": [
        {
          "ssml": "<speak>Simple Ask Reprompt</speak>"
        },
        {
          "ssml": "<speak>Simple Ask Reprompt</speak>"
        },
        {
          "ssml": "<speak>Simple Ask Reprompt</speak>"
        }
      ],
      "userStorage": "{\"userId\":\"nq07lg\"}"
    }
  }
}
```

The main component is the output. Besides the [platform independent output](https://v3.jovo.tech/docs/output), Google Assistant provides multiple other types of output. You can find out more about that in [*Interfaces*](https://v3.jovo.tech/marketplace/jovo-platform-googleassistant#interfaces) section of the documentation.

## $response Object

The `$response` object supports a handful of cross-platform helper methods to get/set its values. You can find them in the [general response docs](https://v3.jovo.tech/docs/requests-responses/response#cross-platform-methods).

Besides that, Google Assistant supports the following getter methods:

Name | Description | Return Value
:--- | :--- | :---
`getBasicCard()` | Returns the response's basic card object. | basic card object or undefined
`getDisplayText()` | Returns the response's display text. | string or undefined
`getMediaResponse()` | Returns the media response object | object or undefined
`getSuggestionsChips()` | Returns the response's suggestion chips array. | array or undefined
`hasDisplayText()` | Returns true if the response contains a display text. If you parse a string, the method will only return true if the string and the display text value are equal. | boolean
`hasImageCard(title?: string, content?: string, imageUrl?: string)` | Returns true if the response contains an image card. If you parse any of the cards properties, the method will only return true if they are equal to the ones in the response. | boolean
`hasSimpleCard(title?: string, content?: string)`  | Returns true if the response contains a simple card. If you parse any of the cards properties, the method will only return true if they are equal to the ones in the response.| boolean
`hasSuggestionChips(chips?: string[])` | Returns true if the response contains suggestion chips. If you parse an array of strings, the method will only return true if the suggestion chip's title are equal to the parsed array's values (same order) | boolean
 