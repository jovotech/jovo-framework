# Jovo Response Object

Learn more about the Jovo `$response` object.

* [Introduction](#introduction)
* [Cross-Platform Methods](#cross-platform-methods)
   * [Response Setters](#response-setters)
   * [Response Getters](#response-getters)

## Introduction

> [Learn more about the Request & Response Lifecycle here](./README.md '../').

The `$response` object offers helpful features to access information from the response that is sent back to the platform (e.g. Amazon Alexa or Google Assistant).

You can access the response object like this:

```javascript
this.$response
```

The response gets assembled from the `$output` object in the [`platform.output` middleware](../../advanced-concepts/architecture.md '../architecture'), and then sent back to the platform in the [`response` middleware](../../advanced-concepts/architecture.md '../architecture').

## Cross-Platform Methods

### Response Setters

| Method        | Description        | 
| ------------- |-------------| 
| `setSessionData(sessionData: SessionData)` | Setts session data. [Learn more about session data here](../../basic-concepts/data#session-data '../data#session-data'). | 


### Response Getters

For some use cases (especially [Unit Testing](../../testing/unit-testing.md '../unit-testing')), it might be helpful to get information from a response object, like `this.$response.getSpeech()`.

You can use these cross-platform helper methods:

| Method        | Description        | 
| ------------- |-------------| 
| `getSpeech(): string` | Returns speech text without "speak" and tags. | 
| `getReprompt(): string` | Returns reprompt text without "speak" tags. | 
| `hasSessionData(name: string, value?: any): boolean` | Checks if response has a specific session attribute in it.
| `getSessionData(): SessionData | undefined` | Returns session data. [Learn more about session data here](../../basic-concepts/data#session-data '../data#session-data'). | 
| `hasSessionEnded(): boolean` | Returns `true` if session ended | 
| `hasState(state: string): boolean` | Checks if response has state in it | 




<!--[metadata]: {"description": "Learn more about the Jovo $response object.",
		        "route": "requests-responses/response"}-->
