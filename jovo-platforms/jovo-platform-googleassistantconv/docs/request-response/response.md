# Response

> To view this page on the Jovo website, visit https://v3.jovo.tech/marketplace/jovo-platform-googleassistantconv/request-response/response

## Introduction

The response is the data that you send to the platform after processing the request. It consists of information like:

* output, e.g. speech, audio, etc.
* permission requests,
* or session data

Here's an example response:

```js
{
  "prompt":{
    "firstSimple": {
      "speech":"<speak>Hello World! What's your name?</speak>"
    }
  },
  "user": {
    "params": { 
      "userId":"318a83d3-dfd5-499c-9496-e4cace5f1f6a"
    }
  },
  "session": {
    "id":"ABwppHHV8CJwgvqoZgHOqJz0CyjLFeoUoB-C7cCe9auND2Ve3HAW3AgIbuZGduwizXpxtyl6FmY234vsxpudQg",
    "params": {
      "_JOVO_SESSION_": {
        "createdAt":"2021-01-06T12:51:18.882Z",
        "new":true,
        "reprompts":{
          "NO_INPUT1":"<speak>Please tell me your name.</speak>"
        }
      },
      "_JOVO_STATE_":null,
      "foo":"bar"
    }
  }
}
```

The main component is the output. Besides the [platform independent output](https://v3.jovo.tech/docs/output), Google Conversational Actions provide multiple other types of output. You can find out more about that in [*Interfaces*](https://v3.jovo.tech/marketplace/jovo-platform-googleassistantconv#interfaces) section of the documentation.

## $response Object

The `$response` object supports a handful of cross-platform helper methods to get/set its values. You can find them in the [general response docs](https://v3.jovo.tech/docs/requests-responses/response#cross-platform-methods).

Besides that, Google Assistant supports the following getter methods:

Name | Description | Return Value
:--- | :--- | :---
`getBasicCard()` | Returns the response's basic card object. | basic card object or undefined
`hasDisplayText()` | Checks whether the response contains a display text | boolean
`getDisplayText()` | Returns the response's display text. | string or undefined
`hasMediaResponse()` | Checks whether the response contains a media response | boolean
`getMediaResponse()` | Returns the media response object | object or undefined
`hasSuggestionChips(chips?: string[])` | Returns true if the response contains suggestion chips. If you parse an array of strings, the method will only return true if the suggestion chip's title are equal to the parsed array's values (same order) | boolean
`getSuggestionChips()` | Returns the response's suggestion chips array. | array or undefined
`hasImageCard(title?: string, content?: string, imageUrl?: string)` | Returns true if the response contains an image card. If you parse any of the cards properties, the method will only return true if they are equal to the ones in the response. | boolean
`hasSimpleCard(title?: string, content?: string)`  | Returns true if the response contains a simple card. If you parse any of the cards properties, the method will only return true if they are equal to the ones in the response.| boolean
