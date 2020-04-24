# Lindenbaum Platform Integration

Learn how to build your Lindenbaum Cognitive Voice bot with the Jovo Framework.

* [Getting Started](#getting-started)
* [Installation](#installation)
* [Basics](#basics)
  * [User ID](#user-id)
* [Requests](#requests)
  * [$request](#request)
* [Responses](#responses)

## Getting Started

Lindenbaum Cognitive Voice is a European platform that allows you to create voice bots that are deployable as smart IVR systems.

## Installation

First, you have to install the npm package:

```sh
npm install --save jovo-platform-lindenbaum
```

After that, initialize it in your project the following way:

```js
// @language=javascript
const { Lindenbaum } = require('jovo-platform-lindenbaum');

app.use(new Lindenbaum());

// @language=typescript
import { Lindenbaum } from 'jovo-platform-lindenbaum';

app.use(new Lindenbaum());
```

Besides that, you have to add a NLU. Jovo provides integrations for a big variety of NLUs from Dialogflow to Rasa and more.

The NLU has to be added as a plugin to the platform:

```js
// @language=javascript
const { Lindenbaum } = require('jovo-platform-lindenbaum');
const { DialogflowNlu } = require('jovo-nlu-dialogflow');

const lindenbaum = new Lindenbaum();
lindenbaum.use(new DialogflowNlu({
  credentialsFile: './credentials.json'
}));

app.use(lindenbaum);

// @language=typescript
import { Lindenbaum } from 'jovo-platform-lindenbaum';
import { DialogflowNlu } from 'jovo-nlu-dialogflow';

const lindenbaum = new Lindenbaum();
lindenbaum.use(new DialogflowNlu({
  credentialsFile: './credentials.json'
}));

app.use(lindenbaum);
```

The Lindenbaum platform sends requests to three separate endpoints. The ExpressJS server of a default Jovo project only supports one endpoint. Because of that, we add a middleware which redirects all of the 3 endpoints to the single default one.

For that, add the following piece of code to your project's `index.js` file:

```js
// @language=javascript

const { Lindenbaum } = require('jovo-platform-lindenbaum');

Webhook.use(Lindenbaum.lindenbaumExpressJsMiddleware);

// @language=typescript
import { Lindenbaum } from 'jovo-platform-lindenbaum';

Webhook.use(Lindenbaum.lindenbaumExpressJsMiddleware);
```

## Basics

All of the Lindenbaum specific objects and functions are accessed using the `$lindenbaumBot` object:

```js
// @language=javascript

this.$lindenbaumBot

// @language=typescript

this.$lindenbaumBot
```

The object will only be defined if the incoming request is from Autopilot. Because of that, you should first check wether it's defined or not before accessing it:

```js
// @language=javascript

if (this.$lindenbaumBot) {

}

// @language=typescript

if (this.$lindenbaumBot) {

}
```

### User ID

The Lindenbaum platform does not offer a distinct user ID. The reason being that the only identifier for each user (their phone number) is not always present, for example through anonymous calls.

Because of that we use the session ID as the user ID at the same time. 

## Requests

As described earlier, the Lindenbaum platform sends requests to three different endpoint. Each endpoint has a different request schema.

The first request is sent when the user calls the bot's number. It is automatically mapped to Jovo's LAUNCH intent and has the following scheme:

```js
{
  "dialogId": "574255f8-2650-49ea-99bc-3edc4b89369b",
  "timestamp": "1587057946",
  "local": "+4972112345678",
  "remote": "+4972110203040",
  "language": "en-US",
  "callback": "https://callback.com/restbot"
}
```

The second endpoint receives the requests containing the user's input (either speech or DTMF). It is always handled as an intent, with the NLU determining which intent to route to.

```js
{
  "dialogId": "574255f8-2650-49ea-99bc-3edc4b89369b",
  "timestamp": "1587057946",
  "text": "Hello World",
  "type": "SPEECH",
  "language": "en-US",
  "confidence": 0,
  "callback": "https://callback.com/restbot"
}
```

Last but not least, the request that is sent when the user ends the call. It is automatically routed to the `END` intent:

```js
{
  "dialogId": "574255f8-2650-49ea-99bc-3edc4b89369b",
  "timestamp": "1587057946"
}
```

Since the Lindenbaum platform doesn't use a NLU, it also doesn't parse any kind of NLU data with its requests (intent, inputs). That means some of the functions like `this.$request.getIntentName()` don't work. In that case, the framework will put out a warning and tell you how to access the data correctly.

### $request

For the `$request` object it means, that not all properties are defined at all times. Only `dialogId` and `timestamp` are.

Here's the complete interface of the class:

Name | Description | Value
:--- | :--- | :---
`callback` | the base URL which will be used to send out the response | string
`confidence` | describes how confident the platform is with the ASR | number - 0 <= x <= 1
`dialogId` | the id that is used as both session ID and user ID | string
`language` | the locale of the incoming request, e.g. `en-US` | string
`local` | the phone number of the bot | string
`remote` | the phone number of the caller. Could be undefined if it's an anonymous call | string
`text` | the user's input | string
`timestamp` | the timestamp of the request in unix time | string
`type` | the type of input. Either `SPEECH` or `DTMF` | enum

Besides that the integration offers you the following getters/setters (depending on the request, some getters might return undefined):

Name | Description | Return Value
:--- | :--- | :---
`getCallbackUrl()` | returns the `callback` property | string or undefined
`getLocal()` | returns the `local` property | string or undefined
`getLocale()` | returns the `language` property | string or undefined
`getMessageType()` | returns the `type` property | string or undefined
`getRawText()` | returns the text input. | string
`getRemote()` | returns the `remote` property | string or undefined
`getSessionId()` | returns the `dialogId` | string
`getTimestamp()` | returns timestamp in ISO 8601 format | string
`getUserId()` | returns the `dialogId`, see [User ID](#user-id) for explanation | string
`setCallbackUrl(url: string)` | sets the `callback` property | LindenbaumRequest (i.e. $request)
`setLocal(phoneNumber: string)` | sets the `local` property | LindenbaumRequest
`setLocale(locale: string)` | sets the `language` property | LindenbaumRequest
`setMessageType(type: 'SPEECH' | 'DTMF')` | sets the `type` property | LindenbaumRequest
`setRawText(text: string)` | sets the `text` property | LindenbaumRequest
`setRemote(phoneNumber: string)` | sets the `remote` property | LindenbaumRequest
`setSessionId(id: string)` | sets the `dialogId` property | LindenbaumRequest
`setTimestamp(timestamp: string)` | sets the `timestamp` property. Parameter has to be ISO 8601 format | LindenbaumRequest
`setUserId(id: string)` | sets the `dialogId` property | LindenbaumRequest

## Responses

The Lindenbaum platform doesn't follow the usual JSON response path. Although you do receive requests, you don't send out one single response, but call multiple API endpoints for each type of response (e.g. speech output, audio, etc.).

While that is different from what you're probably used to, it allows you to create more creative responses, for example first speech output then play an audio file followed by another speech output. That wouldn't be possible with Alexa.

The following responses are supported:

Function | Description | Return Value | Endpoint
:--- | :--- | :--- | :---
`addBridge(extensionLength: number, headNumber: string)` | bridge the call to the `headNumber` parameter | this | `/call/bridge`
`addData(key: string, value: string)` | add data to the current conversation. Can be later on retrieved using the Lindenbaum Dialog API | this | `/call/data`
`addDrop()` | terminate the conversation manually | this | `/call/drop`
`addForward(destinationNumber: string)` | forward the call to the `destinationNumber` parameter | this | `/call/forward`
`tell(text: string)` / `ask(text: string)` | standard speech output. If you use drop, the framework will also add an API call to the `/call/drop` endpoint at the end to terminate the conversation | this | `/call/say`

### Order of the Responses

Since we send out multiple API calls with each request & response cycle, the order in which these API calls are made are important. 

Since the Jovo Framework was first built for Alexa & Google Assistant, it is not perfectly fit to accommodate the wide range of response possibilities. One such limitation would be, that the Jovo Framework only allows a single speech output per response. If you want to create more complex responses, we allow you to set the response yourself using the `setResponses(responses: Responses[])` function:

```js
// @language=javascript
const dialogId = this.$request.getSessionId();
const language = this.$request.getLocale();

this.$lindenbaumBot.setResponses([
  {
    '/call/say': {
      dialogId,
      language,
      text: 'Hello World',
      bargeIn: false
    }
  },
  {
    '/call/play': {
      dialogId,
      url: 'https://test.com/test.mp3',
      bargeIn: false
    }
  },
  {
    '/call/say': {
      dialogId,
      language,
      text: 'Hello World Again!',
      bargeIn: false
    }
  }
]);

// @language=typescript
const dialogId = this.$request!.getSessionId();
const language = this.$request!.getLocale();

this.$lindenbaumBot!.setResponses([
  {
    '/call/say': {
      dialogId,
      language,
      text: 'Hello World',
      bargeIn: false
    }
  },
  {
    '/call/play': {
      dialogId,
      url: 'https://test.com/test.mp3',
      bargeIn: false
    }
  },
  {
    '/call/say': {
      dialogId,
      language,
      text: 'Hello World Again!',
      bargeIn: false
    }
  }
]);
```

Here are the interfaces for each of the responses (you can also import these if you're using typescript):

```ts
// bridge call to different destination
interface BridgeResponse {
  '/call/bridge': {
    dialogId: string;
    headNumber: string;
    extensionLength: number;
  }
}

// end call
interface DropResponse {
  '/call/drop': {
    dialogId: string;
  }
}

// forward call to different destination
interface ForwardResponse {
  '/call/forward': {
    dialogId: string;
    destinationNumber: string;
  }
}

// play audio file
interface PlayResponse {
  '/call/play': {
    dialogId: string;
    url: string;
    bargeIn: boolean;
  }
}

// simple text output
interface SayResponse {
  '/call/say': {
    dialogId: string;
    text: string;
    language: string;
    bargeIn: boolean;
  }
}
```

One of the consequences of the way responses work with Lindenbaum is the importance of the order in which the framework sends the API requests.

If you use the `setResponses()` function we follow the principle of what you see is what you get, meaning the API calls will be made in the order of the array, starting from index 0 and ending with n - 1.

For more simple responses you can still use the Jovo built-in functions, e.g. `tell()` or `ask()` as well as Lindenbaum function, e.g. `addForward()`, `addBridge()`, etc.

In that case, we have the following order `ask`/`tell`/`audio` -> `forward`/`bridge`/`data` 
