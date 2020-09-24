# Jovo Web Platform

> To view this page on the Jovo website, visit https://www.jovo.tech/marketplace/jovo-platform-web

Learn more about the Jovo Web Platform, which can be used to deploy a voice experiences to custom devices and hardware, including the web, mobile apps, and Raspberry Pi.


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

In a Jovo app, each interaction goes through a [request & response cycle](https://www.jovo.tech/docs/requests-responses), where the Jovo app receives the request from the client in a JSON format, [routes](https://www.jovo.tech/docs/routing) through the logic, and then assembles a response that is sent back to the client.

The request usually contains data like an audio file or raw text ([find all sample request JSONs here](https://github.com/jovotech/jovo-framework/tree/master/jovo-platforms/jovo-platform-web/sample-request-json/v1)):

```js
{
  "request": {
    "locale": "en-US",
    "timestamp": "2019-07-01T08:23:06.441Z"
  },
  "session": {
    "data": {
    },
    "id": "92dd969e-024a-4bd1-9aee-29d39daaa61f",
    "new": false
  },
  "user": {
    "id": "2f416861-94aa-424b-b9f2-ac5f83a36fa0",
    "data": {
    }
  },
  "$version": "1.0.0",
  "text": "my name is Max"
}
```

The response contains all the information that is needed by the client to display content ([find all sample response JSONs here](https://github.com/jovotech/jovo-framework/tree/master/jovo-platforms/jovo-platform-web/sample-response-json/v1)):

```js
{
  "version": "1.0",
  "response": {
    "shouldEndSession": true,
    "output": {
      "speech": {
        "text": "Sample response text"
      },
      "actions": [
        {
          "key": "name.set",
          "value": "Chris"
        }
      ]
    },
    "inputText": "my name is Chris"
  },
  "sessionData": {},
  "userData": {
  }
}
```


### Adding Integrations

Depending on how the client sends the data (e.g. just a raw audio file, or written text), it may be necessary to add [Automatic Speech Recognition (ASR)](https://www.jovo.tech/marketplace/tag/asr) or [Natural Language Understanding (NLU)](https://www.jovo.tech/marketplace/tag/nlu) integrations to the Jovo Web Platform.

Integrations can be added with the `use` method:

```javascript
const webPlatform = new webPlatform();

webPlatform.use(
	// Add integrations here
);

app.use(webPlatform);
```

The example below uses the [Jovo NLU integration for NLPjs](https://www.jovo.tech/marketplace/jovo-nlu-nlpjs) to turn raw text into structured meaning:

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

The `output` object in the JSON response can contain both `speech` output and `actions`:

```javascript
"output": {
	"speech": {
		"text": "Sample response text"
	},
	"actions": [
		{
			"key": "name.set",
			"value": "Chris"
		}
	]
},
```

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

* [SpeechAction](#speechaction)
* [AudioAction](#audioaction)
* [VisualAction](#visualaction)
* [ProcessingAction](#processingaction)
* [CustomAction](#customaction)

There are also containers that can be used to nest actions:

* [SequenceContainerAction](#sequencecontaineraction)
* [ParallelContainerAction](#parallelcontaineraction)


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

`WebApp` has the properties `$actions` and `$repromptActions`, which are instances of `ActionBuilder`.
The `ActionBuilder` is the recommended way of filling the output for the Web Platform.

Example Usage:

```javascript
// @language=javascript

this.$webApp.$actions.addSpeech({
	plain: 'text',
	ssml: '<s>text</s>'
});

// @language=typescript

this.$webApp?.$actions.addSpeech({
	plain: 'text',
	ssml: '<s>text</s>'
});
```

### Showing Quick Replies

```javascript
// @language=javascript

this.$webApp.showQuickReplies(['quickReply1', 'quickReply2']);

// @language=typescript

this.$webApp?.showQuickReplies(['quickReply1', 'quickReply2']);
```
