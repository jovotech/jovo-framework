# Response

> To view this page on the Jovo website, visit https://v3.jovo.tech/marketplace/jovo-platform-alexa/request-response/response

* [Introduction](#introduction)
* [$response Object](#response-object)

## Introduction

The response is the data that you send to the platform after processing the request. It consists of information like:

* output, e.g. speech, audio, etc.
* directives,
* or session data

Here's an example response:

```js

```{
  "version": "1.0",
  "sessionAttributes": {
    "name": "Paul"
  },
  "response": {
    "outputSpeech": {
      "type": "SSML",
      "ssml": "<speak>Simple Ask</speak>"
    },
    "reprompt": {
      "outputSpeech": {
        "type": "SSML",
        "ssml": "<speak>Simple Ask Reprompt</speak>"
      }
    },
    "card": {
      "type": "Standard",
      "image": {
              "smallImageUrl": "https://via.placeholder.com/720x480",
              "largeImageUrl": "https://via.placeholder.com/1200x800"
      },
      "title": "Standard Title",
      "text": "Standard Text"
    },
    "shouldEndSession": false
  }
}
```

The main component is the output. Besides the [platform independent output](https://v3.jovo.tech/docs/output), Alexa provides multiple other types of output. You can find out more about that in `Interfaces` section of the documentation.

## $response Object

The `$response` object supports a handful of cross-platform helper methods to get/set its values. You can find them in the [general response docs](https://v3.jovo.tech/docs/requests-responses/response#cross-platform-methods).

Besides that, Alexa supports the following getter methods:

Name | Description | Return Value
:--- | :--- | :---
`getAplDirective()` | Returns APL object from response. | APL object or undefined
`getApltDirective()` | Returns the APLT object from response. | APLT object or undefined
`hasApltDirective()` | Checks if response has APLT directive. | boolean
`getAudioDirective()` | Returns Audio Player object from response. | Audio object or undefined
`getDirectives()` | Returns entire directives object from response. | Directives object or undefined
`getCard()` | Returns the card object from response. | Card object or undefined
`getDisplayDirective()` | Returns Display Template object from response. | Display object or undefined
`getVideoDirective()` | Returns Video Player object from response. | Video object or undefined
`hasAplDirective()` | Checks if response has APL directive. | boolean
`hasAskForAddressCard()` | Checks that Alexa permissions card is present and contains `read::alexa:device:all:address` | boolean
`hasAskForCountryAndPostalCodeCard()` | Checks that Alexa permissions card is present and contains `read::alexa:device:all:address:country_and_postal_code` | boolean
`hasAudioDirective()` | Checks if response has audio directive. | boolean
`hasDisplayDirective()` | Checks if response has display template directive. | boolean
`hasLinkAccountCard()` | Checks that Alexa `LinkAcount` card is present. | boolean
`hasSimpleCard(title?: string, text?: string)` | Checks if response has a simple Alexa card. If you parse any of the cards properties, the method will only return true if they are equal to the ones in the response. | boolean
`hasStandardCard(title?: string, text?: string, smallImageUrl?: string, largeImageUrl?: string)` | Checks if response has a standard Alexa card. If you parse any of the cards properties, the method will only return true if they are equal to the ones in the response. | boolean
`hasVideoDirective()` | Checks if response has video directive. | boolean
