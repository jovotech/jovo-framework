# Jovo Request Object

> To view this page on the Jovo website, visit https://v3.jovo.tech/docs/requests-responses/request

Learn more about the Jovo `$request` object.

- [Introduction](#introduction)
- [Cross-Platform Methods](#cross-platform-methods)
  - [Request Getters](#request-getters)
  - [Request Setters](#request-setters)

## Introduction

> [Learn more about the Request & Response Lifecycle here](./README.md '../').

The `$request` object offers helpful features to access information about the incoming request from the platform (e.g. Amazon Alexa or Google Assistant).

You can access the request object like this:

```javascript
this.$request;
```

The request gets processed early in the lifecycle and can be accessed after the [`request` middleware](../../advanced-concepts/architecture.md '../architecture') is executed.

## Cross-Platform Methods

The Jovo `$request` object offers several helper methods to access and set information that is available across platforms, like the `userId` and the `timestamp`.

You can find them in the following sections:

- [Request Getters](#request-getters)
- [Request Setters](#request-setters)

### Request Getters

You can access data from a current request with cross-platform methods like `this.$request.getIntentName()`.

Here is a list of all available helper methods to get data from a request:

| Method                          | Description                                                                                                                                                     |
| ------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------- |
| `getIntentName(): string        | undefined`                                                                                                                                                      | Get the intent name for intent requests. `undefined` for launch requests. |
| `getInputs(): Inputs`           | Get inputs (slots, parameter) of the request. [Learn more about input here](../routing/input.md '../routing/input').                                            |
| `getUserId(): string`           | Get the User ID of the request.                                                                                                                                 |
| `getDeviceName(): string`       | Get the device name.                                                                                                                                            |
| `getTimestamp(): string`        | Get the timestamp of the request. Example: `2015-05-13T12:34:56Z`.                                                                                              |
| `getLocale(): string`           | Get the locale (language) of the request. Example: `en-US`.                                                                                                     |
| `getAccessToken(): string       | undefined`                                                                                                                                                      | Get an access token to the request.                                       |
| `isNewSession(): boolean`       | Returns true for new sessions (launch requests or deep invocations).                                                                                            |
| `hasAudioInterface(): boolean`  | Returns true if the device supports audio.                                                                                                                      |
| `hasScreenInterface(): boolean` | Returns true if the device has a screen.                                                                                                                        |
| `hasVideoInterface(): boolean`  | Returns true if the device supports video.                                                                                                                      |
| `getSessionData(): SessionData` | Get session data (also known as session attributes), replaces previous data. [Learn more about session data here](../data#session-data '../data#session-data'). |
| `getState(): string`            | Get the state (which is the same as session data `_JOVO_STATE_`). [Learn more about states here](../routing/states.md '../routing/states').                     |

### Request Setters

For some use cases (especially [Unit Testing](../../workflows/unit-testing.md '../unit-testing')), it might be helpful to modify a request object, like `this.$request.setIntentName('HelloWorldIntent')`.

Here is a list of all available helper methods:

| Method                                     | Description                                                                                                                                                                  |
| ------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `setIntentName(intentName: string)`        | Set the intent name for intent requests.                                                                                                                                     |
| `setInputs(inputs: Inputs)`                | Set input objects of `name`, `key`, `value`, and `id`. [Learn more about input here](../routing/input.md '../routing/input').                                                |
| `setUserId(userId: string)`                | Specifies the User ID of the request. Default is a random string.                                                                                                            |
| `setTimestamp(timestamp: string)`          | Set the timestamp of the request. Example: `2015-05-13T12:34:56Z`.                                                                                                           |
| `setLocale(locale: string)`                | Set the locale (language) of the request. Default: `en-US`.                                                                                                                  |
| `setAccessToken(accessToken: string)`      | Add an access token to the request.                                                                                                                                          |
| `setNewSession(isNew: boolean)`            | Makes this request the first interaction of a session. Default for launch requests. This option turns intent requests into a "deep invocation" (e.g. "Alexa, ask X to do Y") |
| `setAudioInterface()`                      | Add audio as supported interface.                                                                                                                                            |
| `setScreenInterface()`                     | Add screen as supported interface.                                                                                                                                           |
| `setVideoInterface()`                      | Add video as supported interface.                                                                                                                                            |
| `setSessionData(sessionData: SessionData)` | Adds session data (also known as session attributes), replaces previous data. [Learn more about session data here](../data#session-data '../data#session-data').             |
| `addSessionData(key: string, value: any)`  | Adds additional element to the session data (also known as session attributes).                                                                                              |
| `setState(state: string)`                  | Set the state (which is the same as session data `_JOVO_STATE_`). [Learn more about states here](../routing/states.md '../routing/states').                                  |

Note: "New Session" requests can't have any Session Data or States.

You can also modify the request objects by directly writing into them. This, however, would require to make different adjustments for each platforms, as paths and namings differ.

<!--[metadata]: {"description": "Learn more about the Jovo $request object.",
		        "route": "requests-responses/request"}-->
