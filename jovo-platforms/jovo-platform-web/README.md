# Jovo Web Platform

> To view this page on the Jovo website, visit https://v3.jovo.tech/marketplace/jovo-platform-web

Learn more about the Jovo Web Platform, which can be used to build fully customized voice and chat experiences that work in the browser.

- [Introduction](#introduction)
  - [How it works](#how-it-works)
  - [Installation](#installation)
- [Usage](#usage)
  - [Requests and Responses](#requests-and-responses)
  - [Adding Integrations](#adding-integrations)
  - [Responding with Actions](#responding-with-actions)
    - [SpeechAction](#speechaction)
    - [AudioAction](#audioaction)
    - [VisualAction](#visualaction)
    - [ProcessingAction](#processingaction)
    - [QuickReplyAction](#quickreplyaction)
    - [CustomAction](#customaction)
    - [SequenceContainerAction](#sequencecontaineraction)
    - [ParallelContainerAction](#parallelcontaineraction)
  - [Using the ActionBuilder](#using-the-actionbuilder)

## Introduction

Besides integrations with major platforms like [Alexa](https://v3.jovo.tech/marketplace/jovo-platform-alexa), [Google Assistant](https://v3.jovo.tech/marketplace/jovo-platform-googleassistant), or [Facebook Messenger](https://v3.jovo.tech/marketplace/jovo-platform-facebookmessenger), Jovo also enables you to connect your own clients to build fully custom conversational experiences for both voice and chat.

The Jovo Web Platform helps you connect your Jovo app to various web frontends. You can check out one of these starter templates to get a first impression how it looks like:

- [Standalone Voice Experience](https://github.com/jovotech/jovo-starter-web-standalone)
- [Voice Overlay](https://github.com/jovotech/jovo-starter-web-overlay)
- [Chat Widget](https://github.com/jovotech/jovo-starter-web-chatwidget)
- [Embedded Chat](https://github.com/jovotech/jovo-starter-web-embeddedchat)

### How it works

![Jovo Client and Jovo Core Platform](./img/jovo-client-platform-communication.png 'How Jovo Core Platform communicates with clients like web apps')

The Jovo Web Platform can be connected to any web client (the "frontend" that records speech or text input and passes it to the Jovo app). You can either implement your own client or use existing [Jovo Clients](https://v3.jovo.tech/marketplace/tag/clients).

The client sends a request to the Jovo app that may contain audio, text, or other input. The Jovo Core Platform then deals with this information and returns a response back to the client. [Learn more about the Core Platform request and response structures below](#requests-and-responses).

Depending on the client, it may be necessary to add integrations to the platform to convert the input to structured data:

- [Automatic Speech Recognition (ASR)](https://v3.jovo.tech/marketplace/tag/asr) to turn spoken audio into transcribed text
- [Natural Language Understanding (NLU)](https://v3.jovo.tech/marketplace/tag/nlu) to turn raw text into meaning

After these integrations are added, building a Jovo app for custom clients is similar to building for platforms like Alexa and Google Assistant. [Take a look at the Jovo Docs to learn more](https://v3.jovo.tech/docs).

### Installation

Install the integration into your project directory:

```sh
$ npm install --save jovo-platform-web
```

Import the installed module, initialize and add it to the `app` object.

```javascript
// @language=javascript

// src/app.js

const { WebPlatform } = require('jovo-platform-web');

const webPlatform = new WebPlatform();

app.use(webPlatform);

// @language=typescript

// src/app.ts

import { WebPlatform } from 'jovo-platform-web';

const webPlatform = new WebPlatform();

app.use(webPlatform);
```

## Usage

You can access the `webApp` object like this:

```javascript
// @language=javascript
this.$webApp

// @language=typescript
this.$webApp!
```

The returned object will be an instance of `WebApp` if the current request is compatible with the Web Platform. Otherwise `undefined` will be returned.

### Requests and Responses

In a Jovo app, each interaction goes through a [request & response cycle](https://v3.jovo.tech/docs/requests-responses), where the Jovo app receives the request from the client in a JSON format, [routes](https://v3.jovo.tech/docs/routing) through the logic, and then assembles a response that is sent back to the client.

The request usually contains data like an audio file or raw text ([find all sample request JSONs here](https://github.com/jovotech/jovo-framework/tree/master/jovo-platforms/jovo-platform-web/sample-request-json/v1)):

```json
{
  "version": "3.2.4",
  "type": "jovo-platform-web",
  "request": {
    "id": "d86f9fdf-6762-4acf-8d1d-ce330a29d592",
    "timestamp": "2020-11-23T12:50:21.009Z",
    "type": "TRANSCRIBED_TEXT",
    "body": { "text": "hello world" },
    "locale": "en",
    "data": {}
  },
  "context": {
    "device": { "type": "BROWSER", "capabilities": { "AUDIO": true, "HTML": true, "TEXT": true } },
    "session": {
      "id": "1e4076b8-539a-48d5-8b14-1ec3cf651b7b",
      "data": {},
      "lastUpdatedAt": "2020-11-23T12:35:21.345Z"
    },
    "user": { "id": "67fed000-9f11-4acf-bbbc-1e52e5ea22a9", "data": {} }
  }
}
```

The response contains all the information that is needed by the client to display content ([find all sample response JSONs here](https://github.com/jovotech/jovo-framework/tree/master/jovo-platforms/jovo-platform-web/sample-response-json/v1)):

```json
{
  "version": "3.2.4",
  "actions": [
    {
      "plain": "Hello World! What's your name?",
      "ssml": "<speak>Hello World! What's your name?</speak>",
      "type": "SPEECH"
    }
  ],
  "reprompts": [
    {
      "plain": "Please tell me your name.",
      "ssml": "<speak>Please tell me your name.</speak>",
      "type": "SPEECH"
    }
  ],
  "user": { "data": {} },
  "session": { "data": {}, "end": false },
  "context": { "request": { "nlu": { "intent": { "name": "LAUNCH" } } } }
}
```

### Adding Integrations

Depending on how the client sends the data (e.g. just a raw audio file, or written text), it may be necessary to add [Automatic Speech Recognition (ASR)](https://v3.jovo.tech/marketplace/tag/asr) or [Natural Language Understanding (NLU)](https://v3.jovo.tech/marketplace/tag/nlu) integrations to the Jovo Web Platform.

Integrations can be added with the `use` method:

```javascript
const webPlatform = new webPlatform();

webPlatform
  .use
  // Add integrations here
  ();

app.use(webPlatform);
```

The example below uses the [Jovo NLU integration for NLPjs](https://v3.jovo.tech/marketplace/jovo-nlu-nlpjs) to turn raw text into structured meaning:

```javascript
// @language=javascript

// src/app.js
const { WebPlatform } = require('jovo-platform-web');
const { NlpjsNlu } = require('jovo-nlu-nlpjs');

const webPlatform = new WebPlatform();
webPlatform.use(new NlpjsNlu());

app.use(webPlatform);

// @language=typescript

// src/app.ts
import { WebPlatform } from 'jovo-platform-web';
import { NlpjsNlu } from 'jovo-nlu-nlpjs';

const webPlatform = new WebPlatform();
webPlatform.use(new NlpjsNlu());

app.use(webPlatform);
```

### Responding with Actions

Actions are additional ways (beyond speech output) how the client can respond to the user. You can add or set Actions like this:

```javascript
// @language=javascript

// Add Actions and RepromptActions (multiple calls possible)
this.$webApp.addActions(this.$webApp.$actions);
this.$webApp.addRepromptActions(this.$webApp.$repromptActions);

// Set Actions and RepromptActions (overrides existing Actions)
this.$webApp.setActions(this.$webApp.$actions);
this.$webApp.setRepromptActions(this.$webApp.$repromptActions);

// @language=typescript

// Add Actions and RepromptActions (multiple calls possible)
this.$webApp?.addActions(this.$webApp?.$actions);
this.$webApp?.addRepromptActions(this.$webApp?.$repromptActions);

// Set Actions and RepromptActions (overrides existing Actions)
this.$webApp?.setActions(this.$webApp?.$actions);
this.$webApp?.setRepromptActions(this.$webApp?.$repromptActions);
```

> **INFO** The actions generated for the speech of `tell` and `ask` will NOT be overwritten.

There are several action types available:

- [SpeechAction](#speechaction)
- [AudioAction](#audioaction)
- [VisualAction](#visualaction)
- [ProcessingAction](#processingaction)
- [QuickReplyAction](#quickreplyaction)
- [CustomAction](#customaction)

There are also containers that can be used to nest actions:

- [SequenceContainerAction](#sequencecontaineraction)
- [ParallelContainerAction](#parallelcontaineraction)

#### SpeechAction

The SpeechAction can be used to display text and synthesize text. The SpeechAction has the following interface:

| Name          | Description                                        | Value    | Required |
| :------------ | :------------------------------------------------- | :------- | :------- |
| `type`        | the type of the action                             | `SPEECH` | yes      |
| `ssml`        | the SSML string                                    | string   | no       |
| `plain`       | the plain speech string                            | string   | no       |
| `displayText` | the text that will only be displayed on the screen | string   | no       |

#### AudioAction

The AudioAction can be used to play an audio file.

| Name                                   | Description                                                                                                                                                     | Value    | Required |
| :------------------------------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------- | :------- | :------- |
| `type`                                 | the type of the action                                                                                                                                          | `AUDIO`  | yes      |
| `tracks[]`                             | an array containing the audio tracks                                                                                                                            | object[] | yes      |
| `tracks[].src`                         | the url where the audio file is stored                                                                                                                          | string   | yes      |
| `tracks[].id`                          | the id of the audio track                                                                                                                                       | string   | no       |
| `tracks[].offsetInMs`                  | the timestamp from which the playback will begin specified in milliseconds. Omitting the value or setting it to `0` will start the playback from the beginning  | number   | no       |
| `tracks[].durationInMs`                | the duration of the playback in milliseconds. If the value is smaller than the audio tracks actual duration, the playback will be stopped at the specified time | number   | no       |
| `tracks[].metaData`                    | an object containing the audio track's metadata                                                                                                                 | object   | no       |
| `tracks[].metaData.title`              | the title of the track                                                                                                                                          | string   | no       |
| `tracks[].metaData.description`        | the description of the track                                                                                                                                    | string   | no       |
| `tracks[].metaData.coverImageUrl`      | the url to the cover image                                                                                                                                      | string   | no       |
| `tracks[].metaData.backgroundImageUrl` | the url to the background image                                                                                                                                 | string   | no       |

#### VisualAction

The VisualAction can be used for visual output like cards.

| Name         | Description                                                                                                                         | Value                        | Required |
| :----------- | :---------------------------------------------------------------------------------------------------------------------------------- | :--------------------------- | :------- |
| `type`       | the type of the action                                                                                                              | `VISUAL`                     | yes      |
| `visualType` | the type of visual output                                                                                                           | `BASIC_CARD` or `IMAGE_CARD` | yes      |
| `title`      | the title of the card. Optional if `visualType` is `IMAGE_CARD`                                                                     | string                       | yes      |
| `body`       | the body of the card. Optional if `visualType` is `IMAGE_CARD`                                                                      | string                       | yes      |
| `imageUrl`   | the url to the image you want to display. Can only be used if `visualType` is `IMAGE_CARD` and is in that case a required parameter | no                           |

#### ProcessingAction

The ProcessingAction can be used to display processing information.

| Name             | Description                                | Value                            | Required |
| :--------------- | :----------------------------------------- | :------------------------------- | :------- |
| `type`           | the type of the action                     | `PROCESSING`                     | yes      |
| `processingType` | the type of the processing action          | `HIDDEN`, `TYPING`, or `SPINNER` | yes      |
| `durationInMs`   | the duration of the action in milliseconds | number                           | no       |
| `text`           | the text that should be displayed          | string                           | no       |

#### QuickReplyAction

The QuickReplyAction can be used to provide the user with suggested replies.

| Name              | Description                           | Value         | Required |
| :---------------- | :------------------------------------ | :------------ | :------- |
| `type`            | the type of the action                | `QUICK_REPLY` | yes      |
| `replies[]`       | an array containing the quick replies | object[]      | yes      |
| `replies[].id`    | the id of the quick reply             | string        | no       |
| `replies[].label` | the label of the quick reply          | string        | no       |
| `replies[].value` | the value of the quick reply          | string        | yes      |

#### CustomAction

The CustomAction can be used to send a custom payload that can be handled by the client.

#### SequenceContainerAction

The SequenceContainer can be used to nest actions. All actions inside this container will be processed after another.

| Name        | Description                               | Value           | Required |
| :---------- | :---------------------------------------- | :-------------- | :------- |
| `type`      | the type of the action                    | `SEQ_CONTAINER` | yes      |
| `actions[]` | the array of actions inside the container | yes             |

#### ParallelContainerAction

The ParallelContainer can be used to nest actions. All actions inside this container will be processed simultaneously.

| Name        | Description                               | Value           | Required |
| :---------- | :---------------------------------------- | :-------------- | :------- |
| `type`      | the type of the action                    | `PAR_CONTAINER` | yes      |
| `actions[]` | the array of actions inside the container | yes             |

### Using the ActionBuilder

`WebApp` has the properties `$actions` and `$repromptActions`, which are instances of `ActionBuilder`.
The `ActionBuilder` is the recommended way of filling the output for the Web Platform.

Example Usage:

```javascript
// @language=javascript

this.$webApp.$actions.addSpeech({
  plain: 'text',
  ssml: '<s>text</s>',
});

// @language=typescript

this.$webApp?.$actions.addSpeech({
  plain: 'text',
  ssml: '<s>text</s>',
});
```

The `ActionBuilder` has the following helper functions:

| Name                                                                       | Description                                                                                                                                                                                        | Return Type     |
| :------------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :-------------- |
| `addSpeech(data: SpeechAction \| string)`                                  | adds a SpeechAction to the `actions` array. If `data` is only a string, it will be added as the `plain` property to a new SpeechAction                                                             | `ActionBuilder` |
| `addAudio(data: AudioAction)`                                              | adds an AudioAction to the `actions` array                                                                                                                                                         | `ActionBuilder` |
| `addProcessingInformation(data: ProcessingAction)`                         | adds a ProcessingAction to the `actions` array                                                                                                                                                     | `ActionBuilder` |
| `addQuickReplies(data: Array<QuickReply \| string>)`                       | adds a QuickReplyAction to the `actions` array. The `data` parameter can either be an array of QuickReplies (same interface as the `replies` array in the QuickReplyAction) or an array of strings | `ActionBuilder` |
| `addContainer(actions: Action[], type: 'SEQ_CONTAINER' \| PAR_CONTAINER')` | adds a ContainerAction of the parsed type including the parsed actions to the `actions` array                                                                                                      | `ActionBuilder` |
