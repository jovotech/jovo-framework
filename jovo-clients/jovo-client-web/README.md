# Jovo Web Client

> To view this page on the Jovo website, visit https://v3.jovo.tech/marketplace/jovo-client-web

The Jovo Web Client enables you to build voice and conversational experiences for the web. Use this package (vanilla JavaScript, [find the Vue.js client here](https://v3.jovo.tech/marketplace/jovo-client-web-vue)) in your frontend web app and connect it to your Jovo backend using the [Jovo Core Platform](https://v3.jovo.tech/marketplace/jovo-platform-core).

- [Introduction](#introduction)
  - [Installation](#installation)
  - [Quickstart](#quickstart)

## Introduction

![Jovo Client and Jovo Core Platform](https://raw.githubusercontent.com/jovotech/jovo-framework/master/jovo-platforms/jovo-platform-core/img/jovo-client-platform-communication.png 'How Jovo Core Platform communicates with clients like web apps')

[Jovo Clients](https://v3.jovo.tech/marketplace/tag/clients) are used as a frontend that collects user input. This input (e.g. speech or text) is then passed to the [Jovo Core Platform](https://v3.jovo.tech/marketplace/jovo-platform-core) that handles the conversational logic.

The "Jovo for Web" client can be used on websites and web apps. It comes with helpful features that make it easier to capture speech input, detect when a user stops speaking, and display information that is returned from the Jovo app. The client is open source and fully customizable.

### Installation

Install the client into your web project like this:

```sh
$ npm install jovo-client-web
```

### Quickstart

You can find starters for our [Vue.js client](https://v3.jovo.tech/marketplace/jovo-client-web-vue) at [github.com/jovotech/jovo-client-web-starters](https://github.com/jovotech/jovo-client-web-starters).

## Configuration

To access the Jovo Web Client, you have to create a new client object:

```js
const client = new window.JovoWebClient.Client(endpointUrl: string);
```

The `endpointUrl` specifies the url of your Jovo app. For local development you can use `http://localhost:3000/webhook`.

## Sending a Request to the Jovo App

To send a request to the Jovo app, you can use the `$client` object:

```js
client.createRequest({ type: RequestType.Text, body: { 'Hello World' } }).send();
```

## Recording Voice Input

To record the user's voice input and automatically send it to the Jovo app, you can use the `startInputRecording()` and `stopInputRecording()` methods. Here's a sample implementation of a microphone button that will record the audio as long as the button is pushed down and send the audio as soon as it's released:

```html
<button @mousedown="onMouseDown" @touchstart="onMouseDown"></button>
```

```js
async onMouseDown(event: MouseEvent | TouchEvent) {
  if (!client.isInitialized) {
    await client.initialize();
  }
  if (client.isRecordingInput) {
    return;
  }
  if (event instanceof MouseEvent) {
    window.addEventListener('mouseup', this.onMouseUp);
  } else {
    window.addEventListener('touchend', this.onMouseUp);
  }
  await client.startInputRecording();
}

private onMouseUp(event: MouseEvent | TouchEvent) {
  window.removeEventListener('mouseup', this.onMouseUp);
  client.stopInputRecording();
}
```

## Event Listeners

You can use listeners to react to events of the Jovo app from within your Vue component

```js
import { ClientEvent } from 'jovo-client-web-vue';
import { Component, Vue } from 'vue-property-decorator';

@Component({
  name: 'overlay'
})
export default class Overlay extends Vue {
  mounted() {
    client.on(ClientEvent.Request, this.onRequest);
    client.on(ClientEvent.Response, this.onResponse);
    client.on(ClientEvent.Action, this.onAction);
  }

  beforeDestroy() {
    client.off(ClientEvent.Request, this.onRequest);
    client.off(ClientEvent.Response, this.onResponse);
    client.off(ClientEvent.Action, this.onAction);
  }
```

The following event types are supported:

| Name       | Description                                                                  | Parsed Parameters             |
| :--------- | :--------------------------------------------------------------------------- | :---------------------------- |
| `Request`  | triggered when the request is received by the Jovo app. Parses the request   | `(req: WebRequest)`           |
| `Response` | triggered when the Jovo app sends out the response. Parses the response      | `(res: WebResponse)`          |
| `Action`   | triggered when the Jovo app's response contains an action. Parses the action | `(action: Action)`            |
| `Reprompt` | triggered when a reprompt is triggered. Parses the reprompt actions          | `(repromptActions: Action[])` |

### SpeechRecognizer

The SpeechRecognizer uses Google Chrome's ASR and has its own set of listeners:

```js
import { SpeechRecognizerEvent } from 'jovo-client-web-vue';
import { Component, Vue } from 'vue-property-decorator';

@Component({
  name: 'overlay'
})
export default class Overlay extends Vue {
  mounted() {
    client.$speechRecognizer.on(
      SpeechRecognizerEvent.SpeechRecognized,
      this.onSpeechRecognized,
    );
  }

  beforeDestroy() {
    client.$speechRecognizer.off(
      SpeechRecognizerEvent.SpeechRecognized,
      this.onSpeechRecognized,
    );
  }
```

| Name               | Description                                                              | Parsed Parameters                 |
| :----------------- | :----------------------------------------------------------------------- | :-------------------------------- |
| `StartDetected`    | triggered when the speech input has started                              | `()`                              |
| `SpeechRecognized` | triggered when the speech input has been collected                       | `(event: SpeechRecognitionEvent)` |
| `End`              | triggered when the SpeechRecognizer has ended (after `SpeechRecognized`) | `(event: SpeechRecognitionEvent)` |
| `Timeout`          | triggered when the SpeechRecognizer has timed out                        | `()`                              |
| `SilenceDetected`  | triggered when the SpeechRecognizer detected silence                     | `()`                              |
| `Error`            | triggered when the SpeechRecognizer encountered an error                 | `(error: Error)`                  |

The `AudioHelper` class can be used to get the transcript from the `SpeechRecognizerEvent`:

```js
import { AudioHelper } from 'jovo-client-web-vue';

//...
onSpeechRecognized(event: SpeechRecognitionEvent) {
  this.inputText = AudioHelper.textFromSpeechRecognition(event);
}
```
