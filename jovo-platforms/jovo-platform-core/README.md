# Jovo Core Platform

> To view this page on the Jovo website, visit https://v3.jovo.tech/marketplace/jovo-platform-core

Learn more about the Jovo Core Platform, which can be used to deploy a voice experiences to custom devices and hardware, including the web, mobile apps, and Raspberry Pi.

- [Introduction](#introduction)
  - [How it works](#how-it-works)
  - [Installation](#installation)
- [Usage](#usage)
  - [Requests and Responses](#requests-and-responses)
  - [Adding Integrations](#adding-integrations)
  - [Responding with Actions](#responding-with-actions)
  - [Using the ActionBuilder](#using-the-actionbuilder)
  - [Showing Quick Replies](#showing-quick-replies)

## Introduction

Besides integrations with major platforms like [Alexa](https://v3.jovo.tech/marketplace/jovo-platform-alexa), [Google Assistant](https://v3.jovo.tech/marketplace/jovo-platform-googleassistant), or [Facebook Messenger](https://v3.jovo.tech/marketplace/jovo-platform-facebookmessenger), Jovo also enables you to connect your own clients to build fully custom conversational experiences for both voice and chat.

As each platform comes with its own structure for [requests and responses](https://v3.jovo.tech/docs/requests-responses), companies often create their own internal platform integration with Jovo. You can learn more about the process in this [Tutorial: Add a Custom Platform to the Jovo Framework](https://v3.jovo.tech/tutorials/adding-your-own-platform).

To make the process easier, we created the Jovo Core Platform which comes with its own request and response JSON structure and a lot of helpful features off-the-shelf.

### How it works

![Jovo Client and Jovo Core Platform](./img/jovo-client-platform-communication.png 'How Jovo Core Platform communicates with clients like web apps')

The Jovo Core Platform can be connected to any client (the "frontend" that records speech or text input and passes it to the Jovo app). You can either implement your own client or use existing [Jovo Clients](https://v3.jovo.tech/marketplace/tag/clients).

The client sends a request to the Jovo app that may contain audio, text, or other input. The Jovo Core Platform then deals with this information and returns a response back to the client. [Learn more about the Core Platform request and response structures below](#requests-and-responses).

Depending on the client, it may be necessary to add integrations to the platform to convert the input to structured data:

- [Automatic Speech Recognition (ASR)](https://v3.jovo.tech/marketplace/tag/asr) to turn spoken audio into transcribed text
- [Natural Language Understanding (NLU)](https://v3.jovo.tech/marketplace/tag/nlu) to turn raw text into meaning

After these integrations are added, building a Jovo app for custom clients is similar to building for platforms like Alexa and Google Assistant. [Take a look at the Jovo Docs to learn more](https://v3.jovo.tech/docs).

### Installation

Install the integration into your project directory:

```sh
$ npm install --save jovo-platform-core
```

Import the installed module, initialize and add it to the `app` object.

```javascript
// @language=javascript

// src/app.js
const { CorePlatform } = require('jovo-platform-core');

const corePlatform = new CorePlatform();

app.use(corePlatform);

// @language=typescript

// src/app.ts
import { CorePlatform } from 'jovo-platform-core';

const corePlatform = new CorePlatform();

app.use(corePlatform);
```

## Usage

You can access the `corePlatformApp` object like this:

```javascript
// @language=javascript
this.$corePlatformApp

// @language=typescript
this.$corePlatformApp!
```

The returned object will be an instance of `CorePlatformApp` if the current request is compatible with the Core Platform. Otherwise `undefined` will be returned.

### Requests and Responses

In a Jovo app, each interaction goes through a [request & response cycle](https://v3.jovo.tech/docs/requests-responses), where the Jovo app receives the request from the client in a JSON format, [routes](https://v3.jovo.tech/docs/routing) through the logic, and then assembles a response that is sent back to the client.

The request usually contains data like an audio file or raw text ([find all sample request JSONs here](https://github.com/jovotech/jovo-framework/tree/v3/latest/jovo-platforms/jovo-platform-core/sample-request-json/v1)):

```json
{
  "version": "3.2.3",
  "type": "jovo-platform-core",
  "request": {
    "id": "d86f9fdf-6762-4acf-8d1d-ce330a29d592",
    "timestamp": "2020-11-23T12:50:21.009Z",
    "type": "TRANSCRIBED_TEXT",
    "body": { "text": "hello world" },
    "locale": "en",
    "data": {}
  },
  "context": {
    "device": {
      "type": "UNSPECIFIED",
      "capabilities": { "AUDIO": true, "HTML": true, "TEXT": true }
    },
    "session": {
      "id": "1e4076b8-539a-48d5-8b14-1ec3cf651b7b",
      "data": {},
      "lastUpdatedAt": "2020-11-23T12:35:21.345Z"
    },
    "user": { "id": "67fed000-9f11-4acf-bbbc-1e52e5ea22a9", "data": {} }
  }
}
```

The response contains all the information that is needed by the client to display content ([find all sample response JSONs here](https://github.com/jovotech/jovo-framework/tree/v3/latest/jovo-platforms/jovo-platform-core/sample-response-json/v1)):

```json
{
  "version": "3.2.3",
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

Depending on how the client sends the data (e.g. just a raw audio file, or written text), it may be necessary to add [Automatic Speech Recognition (ASR)](https://v3.jovo.tech/marketplace/tag/asr) or [Natural Language Understanding (NLU)](https://v3.jovo.tech/marketplace/tag/nlu) integrations to the Jovo Core Platform.

Integrations can be added with the `use` method:

```javascript
const corePlatform = new CorePlatform();

corePlatform
  .use
  // Add integrations here
  ();

app.use(corePlatform);
```

The example below uses the [Jovo NLU integration for NLPjs](https://v3.jovo.tech/marketplace/jovo-nlu-nlpjs) to turn raw text into structured meaning:

```javascript
// @language=javascript

// src/app.js
const { CorePlatform } = require('jovo-platform-core');
const { NlpjsNlu } = require('jovo-nlu-nlpjs');

const corePlatform = new CorePlatform();
corePlatform.use(new NlpjsNlu());

app.use(corePlatform);

// @language=typescript

// src/app.ts
import { CorePlatform } from 'jovo-platform-core';
import { NlpjsNlu } from 'jovo-nlu-nlpjs';

const corePlatform = new CorePlatform();
corePlatform.use(new NlpjsNlu());

app.use(corePlatform);
```

### Responding with Actions

Actions are additional ways (beyond speech output) how the client can respond to the user. You can add or set Actions like this:

```javascript
// @language=javascript

// Add Actions and RepromptActions (multiple calls possible)
this.$corePlatformApp.addActions(this.$corePlatformApp.$actions);
this.$corePlatformApp.addRepromptActions(this.$corePlatformApp.$repromptActions);

// Set Actions and RepromptActions (overrides existing Actions)
this.$corePlatformApp.setActions(this.$corePlatformApp.$actions);
this.$corePlatformApp.setRepromptActions(this.$corePlatformApp.$repromptActions);

// @language=typescript

// Add Actions and RepromptActions (multiple calls possible)
this.$corePlatformApp?.addActions(this.$corePlatformApp?.$actions);
this.$corePlatformApp?.addRepromptActions(this.$corePlatformApp?.$repromptActions);

// Set Actions and RepromptActions (overrides existing Actions)
this.$corePlatformApp?.setActions(this.$corePlatformApp?.$actions);
this.$corePlatformApp?.setRepromptActions(this.$corePlatformApp?.$repromptActions);
```

> **INFO** The actions generated for the speech of `tell` and `ask` will NOT be overwritten.

There are several action types available:

- [SpeechAction](#speechaction)
- [AudioAction](#audioaction)
- [VisualAction](#visualaction)
- [ProcessingAction](#processingaction)
- [CustomAction](#customaction)

There are also containers that can be used to nest actions:

- [SequenceContainerAction](#sequencecontaineraction)
- [ParallelContainerAction](#parallelcontaineraction)

#### SpeechAction

The SpeechAction can be used to display text and synthesize text.

#### AudioAction

The AudioAction can be used to play an audio file.

#### VisualAction

The VisualAction can be used for visual output like cards.

#### ProcessingAction

The ProcessingAction can be used to display processing information.

#### CustomAction

The CustomAction can be used to send a custom payload that can be handled by the client.

#### SequenceContainerAction

The SequenceContainer can be used to nest actions. All actions inside this container will be processed after another.

#### ParallelContainerAction

The ParallelContainer can be used to nest actions. All actions inside this container will be processed simultaneously.

### Using the ActionBuilder

`CorePlatformApp` has the properties `$actions` and `$repromptActions`, which are instances of `ActionBuilder`.
The `ActionBuilder` is the recommended way of filling the output for the Core Platform.

Example Usage:

```javascript
// @language=javascript

this.$corePlatformApp.$actions.addSpeech({
  plain: 'text',
  ssml: '<s>text</s>',
});

// @language=typescript

this.$corePlatformApp?.$actions.addSpeech({
  plain: 'text',
  ssml: '<s>text</s>',
});
```

### Showing Quick Replies

```javascript
// @language=javascript

this.$corePlatformApp.showQuickReplies(['quickReply1', 'quickReply2']);

// @language=typescript

this.$corePlatformApp?.showQuickReplies(['quickReply1', 'quickReply2']);
```
