# Request

> To view this page on the Jovo website, visit https://v3.jovo.tech/marketplace/jovo-platform-googleassistant/request-response/request

* [Introduction](#introduction)
* [$request Object](#request-object)

## Introduction

The request is the incoming data that the Alexa platform sends to your app's endpoint. It consists of information like:

* User ID,
* Intent, e.g. `MyNameIsIntent`
* Input, e.g. `name`
* Session data, e.g. a state

and other things that might be relevant to your app. You can access the incoming request with `this.$request`.

Here's an example request:

```js
{
  "responseId": "14b77881-d5bc-475e-acd2-c0eff6e884f2",
  "queryResult": {
    "queryText": "help",
    "parameters": {},
    "allRequiredParamsPresent": true,
    "outputContexts": [
      {
        "name": "projects/newagent-904be/agent/sessions/1526414104011/contexts/actions_capability_screen_output"
      },
      {
        "name": "projects/newagent-904be/agent/sessions/1526414104011/contexts/actions_capability_audio_output"
      },
      {
        "name": "projects/newagent-904be/agent/sessions/1526414104011/contexts/google_assistant_input_type_keyboard"
      },
      {
        "name": "projects/newagent-904be/agent/sessions/1526414104011/contexts/actions_capability_web_browser"
      },
      {
        "name": "projects/newagent-904be/agent/sessions/1526414104011/contexts/actions_capability_media_response_audio"
      }
    ],
    "intent": {
      "name": "projects/newagent-904be/agent/intents/70f56b11-ef4b-48dd-b94b-8cce040b94df",
      "displayName": "HelpIntent"
    },
    "intentDetectionConfidence": 1,
    "diagnosticInfo": {},
    "languageCode": "en-us"
  },
  "originalDetectIntentRequest": {
    "source": "google",
    "version": "2",
    "payload": {
      "isInSandbox": true,
      "surface": {
        "capabilities": [
          {
            "name": "actions.capability.MEDIA_RESPONSE_AUDIO"
          },
          {
            "name": "actions.capability.AUDIO_OUTPUT"
          },
          {
            "name": "actions.capability.WEB_BROWSER"
          }
        ]
      },
      "inputs": [
        {
          "rawInputs": [
            {
              "query": "help",
              "inputType": "KEYBOARD"
            }
          ],
          "arguments": [
            {
              "rawText": "help",
              "textValue": "help",
              "name": "text"
            }
          ],
          "intent": "actions.intent.TEXT"
        }
      ],
      "user": {
        "lastSeen": "2018-05-15T19:46:52Z",
        "locale": "en-US",
        "userStorage": "{\"userId\":\"ABwppHEQSzwUcHZQ39qIuk2kzopSAoPjK2_BKfvXm89IQ9Q0XPu2FZM6kVQ66v-BEDaWjgq4Vm99Vdlfxw\"}"
      },
      "conversation": {
        "conversationId": "1526414104011",
        "type": "ACTIVE",
        "conversationToken": "[]"
      },
      "availableSurfaces": [
        {
          "capabilities": [
            {
              "name": "actions.capability.SCREEN_OUTPUT"
            },
            {
              "name": "actions.capability.AUDIO_OUTPUT"
            }
          ]
        }
      ]
    }
  },
  "session": "projects/newagent-904be/agent/sessions/1526414104011"
}
```

> In the Jovo Framework repository we keep sample requests for the most common types. You can find them [here](https://github.com/jovotech/jovo-framework/tree/v3/latest/jovo-platforms/jovo-platform-dialogflow/sample-request-json/v2/google)


## $request Object

Besides the [cross-platform getter and setter methods](https://v3.jovo.tech/docs/requests-responses/request#cross-platform-methods) the Google Assistant `$request` object supports the following general helper methods:

Name | Description | Return Value
:--- | :--- | :---
`getUserStorage()` | Returns the `userStorage` object where you can persist data across sessions | object
`hasWebBrowserInterface()` | Returns true if the user's device is capable of using a web browser | boolean

