# Jovo Response Object

Learn more about the Jovo `$response` object.

* [Introduction](#introduction)
* [Cross-Platform Methods](#cross-platform-methods)
   * [Response Setters](#response-setters)
   * [Response Getters](#response-getters)
* [Platform Specific Methods](#platform-specific-methods)
   * [Alexa Methods](#alexa-methods)
      * [Alexa Response Getters](#alexa-response-getters)
   * [Google Assistant Methods](#google-assistant-methods)
      * [Google Assistant Response Getters](#google-assistant-response-getters)

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
| `setSessionData(sessionData: SessionData)` | Sets session data. [Learn more about session data here](../../basic-concepts/data#session-data '../data#session-data'). |


### Response Getters

For some use cases (especially [Unit Testing](../../testing/unit-testing.md '../unit-testing')), it might be helpful to get information from a response object, like `this.$response.getSpeech()`.

You can use these cross-platform helper methods:

| Method        | Description        |
| ------------- |-------------|
| `getSpeech(): string` | Returns speech text without "speak" tags. |
| `getReprompt(): string` | Returns reprompt text without "speak" tags. |
| `hasSessionData(name: string, value?: any): boolean` | Checks if response has a specific session attribute in it.
| `getSessionData(): SessionData | undefined` | Returns session data. [Learn more about session data here](../../basic-concepts/data#session-data '../data#session-data'). |
| `hasSessionEnded(): boolean` | Returns `true` if session ended |
| `hasState(state: string): boolean` | Checks if response has state in it |

## Platform Specific Methods

### Alexa Methods

#### Alexa Response Getters

| Method        | Description        |
| ------------- |-------------|
| `hasAskForAddressCard(): boolean` | Checks that Alexa permissions card is present and contains `read::alexa:device:all:address` |
| `hasAskForCountryAndPostalCodeCard(): boolean` | Checks that Alexa permissions card is present and contains `read::alexa:device:all:address:country_and_postal_code` |
| `hasLinkAccountCard(): boolean` | Checks that Alexa `LinkAcount` card is present. |
| `hasStandardCard(title?: string, text?: string, smallImageUrl?: string, largeImageUrl?: string): boolean` | Checks if response has a standard Alexa card. |
| `hasSimpleCard(title?: string, text?: string): boolean` | Checks if response has a simple Alexa card.|
| `hasAplDirective(): boolean` | Checks if response APL directive.|
| `hasDisplayDirective(): boolean` | Checks if response has display template directive.|
| `hasAudioDirective(): boolean` | Checks if response has audio directive.|
| `hasVideoDirective(): boolean` | Checks if response has video directive.|
| `getDirectives(): Directives object | undefind` | Returns entire directives object from response.|
| `getAplDirective(): APL object | undefind` | Returns APL object from response.|
| `getDisplayDirective(): Display object |undefind` | Returns Display Template object from response.|
| `getAudioDirective(): Audio object | undefind` | Returns Audio Player object from response.|
| `getVideoDirective(): Video object | undefind` | Returns Video Player object from response.|

### Google Assistant Methods
Google Assistant responses are an object within the Dialogflow response and need to be accessed with an additional method. You can use the additional method `getPlatformResponse()` in the following ways:

```javascript
// @language=javascript

test('should NOT have suggestion chips', async () => {
   expect(
      response.getPlatformResponse().hasSuggestionChips()).toBe(false);
});

// @language=typescript

test('should have suggestion chips', async () => {
   expect(
      (response.getPlatformResponse() as GoogleActionResponse).hasSuggestionChips()).toBe(true);
});

```

#### Google Assistant Response Getters

| Method        | Description        |
| ------------- |-------------|
| `hasDisplayText(text?: string): boolean` | Checks that Google response has display text. |
| `hasImageCard(title?: string, content?: string, imageUrl?: string): boolean` | Checks that Google response has basic card with an image. |
| `hasMediaResponse(url?: string, name?: string): boolean` | Checks that Google response has media response. |
| `hasSimpleCard(title?: string, content?: string): boolean` | Checks that Google response has basic card without image. |
| `hasSuggestionChips(chips?: string[]): boolean` | Checks that Google response has suggestion chips. |
| `getDisplayText(): string` | Returns display text as string. |
| `getBasicCard(): object` | Returns basic card object. |
| `getMediaResponse(): object` | Returns media response object. |
| `getSuggestionChips(): object` | Returns suggestion chips object. |

<!--[metadata]: {"description": "Learn more about the Jovo $response object.",
		        "route": "requests-responses/response"}-->
