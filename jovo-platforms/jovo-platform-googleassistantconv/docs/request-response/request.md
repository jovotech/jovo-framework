# Request

> To view this page on the Jovo website, visit https://v3.jovo.tech/marketplace/jovo-platform-googleassistantconv/request-response/request

* [Introduction](#introduction)
* [$request Object](#request-object)

## Introduction

The request is the incoming data that the platform sends to your app's endpoint. It consists of information like:

* User ID,
* Intent, e.g. `MyNameIsIntent`
* Input, e.g. `name`
* Session data, e.g. a state

and other things that might be relevant to your app. You can access the incoming request with `this.$request`.

Here's an example request:

```js
{
  "handler": {
    "name": "start"
  },
  "intent": {
    "name": "actions.intent.MAIN",
    "params": {},
    "query": "Talk to action demo"
  },
  "scene": {
    "name": "actions.scene.START_CONVERSATION",
    "slotFillingStatus": "UNSPECIFIED",
    "slots": {}
  },
  "session": {
    "id": "ABwppHFhNCQBhtdhHJo8KxcDSsoCaMeZl4nZIcGHZ8Pqv63L8TDogehT8MwuWguYy-O8SYH691zBllT2RmvHp0FRDQ",
    "params": {},
    "typeOverrides": [],
    "languageCode": ""
  },
  "user": {
    "locale": "en-US",
    "params": {
      "userId": "5aab7198-8d71-4465-8a50-07ee9273c42c"
    },
    "accountLinkingStatus": "ACCOUNT_LINKING_STATUS_UNSPECIFIED",
    "verificationStatus": "VERIFIED",
    "packageEntitlements": [],
    "lastSeenTime": "2020-06-30T07:53:35Z"
  },
  "home": {
    "params": {}
  },
  "device": {
    "capabilities": [
      "SPEECH",
      "RICH_RESPONSE",
      "LONG_FORM_AUDIO"
    ]
  }
}
```

> In the Jovo Framework repository we keep sample requests for the most common types. You can find them [here](https://github.com/jovotech/jovo-framework/tree/v3/latest/jovo-platforms/jovo-platform-googleassistantconv/sample-request-json)

## $request Object

Besides the [cross-platform getter and setter methods](https://v3.jovo.tech/docs/requests-responses/request#cross-platform-methods) the Google Assistant `$request` object supports the following general helper methods:

Name | Description | Return Value
:--- | :--- | :---
`getUserStorage()` | Returns the `params` object where you can persist data across sessions | object
`hasWebBrowserInterface()` | Returns true if the user's device is capable of using a web browser | boolean

