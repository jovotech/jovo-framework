---
title: 'Web Client'
excerpt: 'Build voice experiences and chatbots for the web.'
---

# Web Client

Build voice experiences and chatbots for the web. This frontend client brings your Jovo app to websites and web apps.

## Introduction

![Jovo Client and Jovo Core Platform](https://github.com/jovotech/jovo-framework/raw/master/jovo-platforms/jovo-platform-core/img/jovo-client-platform-communication.png 'How Jovo Core Platform communicates with clients like web apps')

[Jovo Clients](https://www.jovo.tech/docs/clients) help with two tasks:

- [Record user input](#record-user-input) (speech, text, buttons) and send it as a [request to the Jovo app](#send-a-request-to-jovo) (where the [Web Platform](https://www.jovo.tech/marketplace/platform-web) handles the conversational logic).
- [Handle the response from the Jovo app](#handle-the-response-from-jovo) and play/show output to the user.

The Jovo Web Client can be used on websites and web apps. This is the vanilla JavaScript version for custom websites or frameworks and libraries like React. You can also find versions for [Vue2](https://www.jovo.tech/marketplace/client-web-vue2) and [Vue3](https://www.jovo.tech/marketplace/client-web-vue2).

## Installation

Install the client package:

```bash
$ npm install @jovotech/client-web
```

If you want to use the client in a plain HTML/JS project ([find an example HTML file here](https://github.com/jovotech/jovo-framework/blob/v4/latest/clients/client-web/demo/index.html)), you can set it up like this:

```html
<script>
  const client = new window.JovoWebClient.Client('http://localhost:3000/webhook', {
    // Configuration
  });

  // ...
</script>
```

If you are using a library like React, you can initialize it like this:

```typescript
const client = new Client('http://localhost:3000/webhook', {
  // Configuration
});
```

The constructor accepts two parameters:

- `endpointUrl`: For local development of your Jovo app with [Express](https://www.jovo.tech/marketplace/server-express), you can use `http://localhost:3000/webhook`. Learn more in the [deployment](#deployment) section.
- [Configuration options](#configuration)

## Configuration

This is the default configuration for the Jovo Web Client:

```typescript
{
	version: '4.0',
	locale: 'en',
	platform: 'web',
	device: {
		id: '<uuid>',
		capabilities: [
			'AUDIO', 'SCREEN'
		],
	},
	input: {
		audioRecorder: { /* ... */ },
    speechRecognizer: { /* ... */ },
	},
	output: {
		speechSynthesizer: { /* ... */ },
		audioPlayer: { /* ... */ },
		reprompts: { /* ... */ },
	},
	store: {
		storageKey: 'JOVO_WEB_CLIENT_DATA',
    shouldPersistSession: true,
    sessionExpirationInSeconds: 1800,
	},
}
```

- `version`: The version of the [Jovo Web Platform](https://www.jovo.tech/marketplace/platform-web) request and response schemas.
- `locale`: This locale is added to the request to the Jovo app. Default: `en`.
- `platform`: The platform name that is added to the request to the Jovo app. Default: `web`.
- `device`: Information about the device, including `capabilities`. Learn more in the [Jovo Device docs](https://www.jovo.tech/docs/device).
- `input`: Learn more about the [`audioRecorder`](#audiorecorder) and [`speechRecognizer`](#webspeech-api-speechrecognizer) in the [user input section](#record-user-input).
- `output`: Learn more about the [`audioPlayer`](#audioplayer) and [`speechSynthesizer`](#webspeech-api-speechsynthesizer) in the [handle Jovo response section](#handle-the-response-from-jovo).
- `store`: Defines how session data is stored in the browser's local storage.

## Record User Input

You can record user input using the following methods:

```typescript
await client.startRecording();

client.stopRecording(); // Successfully finish the recording
client.abortRecording(); // Cancel the recording
```

You can also pass an input modality. The default is `AUDIO`:

```typescript
import { RecordingModalityType } from '@jovotech/client-web';
// ...

await client.startRecording({ type: RecordingModalityType.Audio }); // or 'AUDIO'
```

Depending on the [configuration](#configuration) and browser support, the recording either uses the [`AudioRecorder`](#audiorecorder) or WebSpeech API [`SpeechRecognizer`](#speechrecognizer). Make sure that the client audio recorder is already [initialized](#initialize).

You can check if the client is currently recording input by using the following helper:

```typescript
client.isRecordingInput;
```

### Initialize

Some browsers and devices (for example iOS) need a user touch event before they can play or recording audio.

For this, the `initialize()` method can be used, which should be called in a click handler, for example:

```typescript
initializeButton.addEventListener('click', async () => {
  await client.initialize();
});
```

This can be done as part of a launch button or a push to talk button.

You can check if the client is already initialized by using the following helper:

```typescript
client.isInitialized;
```

### AudioRecorder

The Jovo Web Client implements an [`AudioRecorder`](https://github.com/jovotech/jovo-framework/blob/v4/latestclients/client-web/src/standalone/AudioRecorder.ts) that records speech in an audio file and sends it to your Jovo app as [`SPEECH` input type](https://www.jovo.tech/docs/input#speech).

The default configuration for the `AudioRecorder` (which you can access with `client.audioRecorder`) is:

```typescript
audioRecorder: {
  enabled: true,
  sampleRate: 16000,
  startDetection: { //
    enabled: true,
    timeoutInMs: 3000,
    threshold: 0.2,
  },
  silenceDetection: {
    enabled: true,
    timeoutInMs: 1500,
    threshold: 0.2,
  },

  // https://developer.mozilla.org/en-US/docs/Web/API/MediaStreamConstraints/audio
  audioConstraints: { // ?
    echoCancellation: true,
    noiseSuppression: true,
  },

  // https://developer.mozilla.org/en-US/docs/Web/API/AudioContext
  analyser: {
    bufferSize: 2048,
    maxDecibels: -10,
    minDecibels: -90,
    smoothingTimeConstant: 0.85,
  },
},
```

- `sampleRate`: The [audio sample rate](<https://en.wikipedia.org/wiki/Sampling_(signal_processing)>) of the recording.
- `startDetection`: The start detection determines when in the recording process the user starts speaking.
- `silenceDetection`: The start detection determines when in the recording process the user stops speaking.
- `audioConstraints`: Learn more in the [official documentation by Mozilla](https://developer.mozilla.org/en-US/docs/Web/API/MediaStreamConstraints/audio).
- `analyser`: Learn more in the [official documentation by Mozilla](https://developer.mozilla.org/en-US/docs/Web/API/AudioContext).

You can also use the following helpers to detect browser support and check if `AudioRecorder` is currently recording:

```typescript
client.audioRecorder.isInitialized;
client.audioRecorder.isRecording;
client.audioRecorder.startDetectionEnabled;
client.audioRecorder.silenceDetectionEnabled;
```

The `AudioRecorder` also emits events based on the recording status. The table below shows all events of the type `AudioRecorderEvent`:

| Enum key          | Enum value           | Description                                                                             |
| ----------------- | -------------------- | --------------------------------------------------------------------------------------- |
| `Start`           | `'start'`            | Recording has started.                                                                  |
| `Processing`      | `'processing'`       | Recording is in progress.                                                               |
| `StartDetected`   | `'start-detected'`   | Speech was detected in the recording. Related to the `startDetection` configuration.    |
| `SilenceDetected` | `'silence-detected'` | Silence was detected in the recording. Related to the `silenceDetection` configuration. |
| `Timeout`         | `'timeout'`          | Silence exceeded the `silenceDetection.timeoutInMs` configuration.                      |
| `Abort`           | `'abort'`            | Recording was cancelled.                                                                |
| `Stop`            | `'stop'`             | Recording was stopped.                                                                  |

### WebSpeech API SpeechRecognizer

The [WebSpeech API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API) offers a [speech recognition service](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API) that makes it easier to turn speech audio into transcribed text right in the browser.

This way, you can record speech input and send it to your Jovo app as [`TRANSCRIBED_SPEECH` input type](https://www.jovo.tech/docs/input#transcribed_speech).

The default configuration for the [`SpeechRecognizer`](https://github.com/jovotech/jovo-framework/blob/v4/latestclients/client-web/src/standalone/SpeechRecognizer.ts) (which you can access with `client.speechRecognizer`) is:

```typescript
speechRecognizer: {
  enabled: true,
  startDetection: { //
    enabled: true,
    timeoutInMs: 3000,
    threshold: 0.2,
  },
  silenceDetection: {
    enabled: true,
    timeoutInMs: 1500,
    threshold: 0.2,
  },

  // See https://developer.mozilla.org/en-US/docs/Web/API/SpeechRecognition
  lang: 'en',
  continuous: true,
  interimResults: true,
  maxAlternatives: 1,
  grammars: window.SpeechGrammarList ? new window.SpeechGrammarList() : null,
}
```

- `startDetection`: The start detection determines when in the recording process the user starts speaking.
- `silenceDetection`: The start detection determines when in the recording process the user stops speaking.
- All other configurations are explained in the [official documentation by Mozilla](https://developer.mozilla.org/en-US/docs/Web/API/SpeechRecognition).

You can also use the following helpers to detect browser support and check if `SpeechRecognizer` is currently recording speech:

```typescript
client.speechRecognizer.isAvailable;
client.speechRecognizer.isRecording;
client.speechRecognizer.startDetectionEnabled;
client.speechRecognizer.silenceDetectionEnabled;
```

The `SpeechRecognizer` also emits events based on the recording status. The table below shows all events of the type `SpeechRecognizerEvent`:

| Enum key           | Enum value            | Description                                                                             |
| ------------------ | --------------------- | --------------------------------------------------------------------------------------- |
| `Start`            | `'start'`             | Recording has started.                                                                  |
| `StartDetected`    | `'start-detected'`    | Speech was detected in the recording. Related to the `startDetection` configuration.    |
| `SpeechRecognized` | `'speech-recognized'` | Speech is currently transcribed.                                                        |
| `SilenceDetected`  | `'silence-detected'`  | Silence was detected in the recording. Related to the `silenceDetection` configuration. |
| `Timeout`          | `'timeout'`           | Silence exceeded the `silenceDetection.timeoutInMs` configuration.                      |
| `Abort`            | `'abort'`             | Recording was cancelled.                                                                |
| `Stop`             | `'stop'`              | Recording was stopped.                                                                  |
| `End`              | `'end'`               | Speech recognition has finished.                                                        |

### Push to Talk

You can implement a _push to talk_ experience by adding event listeners to a button, for example:

```typescript
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
  await client.startRecording();
}

private onMouseUp(event: MouseEvent | TouchEvent) {
  window.removeEventListener('mouseup', this.onMouseUp);
  client.stopRecording();
}
```

## Send a Request to Jovo

After successful user input, the Jovo Web Client sends a request to the Jovo app, where the [Web Platform](https://www.jovo.tech/marketplace/platform-web) handles the conversational logic and then returns a response.

The request is based on different [Jovo Input](https://www.jovo.tech/docs/input) types, depending on the recording type:

- [`TEXT` input](https://www.jovo.tech/docs/input#text) for text (chat) messages.
- [`SPEECH` input](https://www.jovo.tech/docs/input#speech) for audio recordings with the [`AudioRecorder`](#audiorecorder).
- [`TRANSCRIBED_SPEECH` input](https://www.jovo.tech/docs/input#transcribed_speech) for text based on audio recordings with the [`SpeechRecognizer`](#speechrecognizer).

While the client already does the job for you for `AudioRecorder` and `SpeechRecognizer` input, you can also manually send a request based on [Jovo Input](https://www.jovo.tech/docs/input) to the Jovo app using the `send()` method:

```typescript
import { InputType } from '@jovotech/client-web';
// ...

const response = await client.send({
  type: InputType.Text, // or 'TEXT'
  text: 'Hello World',
});
```

If you want to make modifications before sending a request, you can also use the `createRequest()` method:

```typescript
import { InputType } from '@jovotech/client-web';
// ...

const request = client.createRequest({
  type: InputType.Text, // or 'TEXT'
  text: 'Hello World',
});

// ...

const response = await client.send(request);
```

## Handle the Response from Jovo

After sending a request to the Jovo app, the client waits for the app to go through the [RIDR Lifecycle](https://www.jovo.tech/docs/ridr-lifecycle) and return a [Web Platform response](https://www.jovo.tech/marketplace/platform-web#responses).

This response contains an `output` property, which includes [output templates](https://www.jovo.tech/docs/output-templates) that are used by the client to show and play a response to the user. For example, an output template could look like this:

```typescript
{
  message: 'Do you like pizza?',
  quickReplies: ['yes', 'no'],
}
```

The response can be text based (e.g. chat bubbles) as well as audio or speech output. For this, the client offers helpful features to make playing audio output easier.

- [AudioPlayer](#audioplayer)
- [WebSpeech API SpeechSynthesizer](#webspeech-api-synthesizer)
- [Reprompts](#reprompts)

### AudioPlayer

The `AudioPlayer` is responsible for playing audio files. Similar to the [`AudioRecorder`](#audiorecorder), it needs to be [initialized](#initialize).

The default configuration for the [`AudioPlayer`](https://github.com/jovotech/jovo-framework/blob/v4/latestclients/client-web/src/standalone/AudioPlayer.ts) (which you can access with `client.audioPlayer`) is:

```typescript
audioPlayer: {
  enabled: true
},
```

The player has the following features:

```typescript
client.audioPlayer.play(audioSource: string, contentType = 'audio/mpeg');
client.audioPlayer.resume();
client.audioPlayer.pause();
client.audioPlayer.stop();
```

The `AudioPlayer` also emits events based on the its status. The table below shows all events of the type `AudioPlayerEvent`:

| Enum key | Enum value |
| -------- | ---------- |
| `Play`   | `'play'`   |
| `Pause`  | `'pause'`  |
| `Resume` | `'resume'` |
| `Stop`   | `'stop'`   |
| `End`    | `'end'`    |
| `Error`  | `'error'`  |

You can also use the following helpers:

```typescript
client.audioPlayer.isInitialized;
client.audioPlayer.isPlaying; // or client.isPlayingAudio
client.audioPlayer.canResume;
client.audioPlayer.canPause;
client.audioPlayer.canStop;
client.audioPlayer.volume;
```

### WebSpeech API SpeechSynthesizer

The [WebSpeech API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API) offers a [speech synthesis service](https://developer.mozilla.org/en-US/docs/Web/API/SpeechSynthesis) that makes it easier to turn output [`messages`](https://www.jovo.tech/docs/output-templates#message) and [`reprompts`](https://www.jovo.tech/docs/output-templates#reprompt) into spoken audio right in the browser.

The configuration for the [`SpeechSynthesizer`](https://github.com/jovotech/jovo-framework/blob/v4/latestclients/client-web/src/standalone/SpeechSynthesizer.ts) (which you can access with `client.speechSynthesizer`) is:

```typescript
speechSynthesizer: {
  enabled: true,
  language: 'en',
  voice: SpeechSynthesisVoice
},
```

- `language`: Can also be overridden using the `locale` property in the root of the [client configuration](#configuration).
- `voice`: Learn more in the [official documentation by Mozilla](https://developer.mozilla.org/en-US/docs/Web/API/SpeechSynthesisVoice).

The player has the following features:

```typescript
client.speechSynthesizer.speak(utterance: SpeechSynthesisUtterance | string, forceVolume = true);
client.speechSynthesizer.resume();
client.speechSynthesizer.pause();
client.speechSynthesizer.stop();
```

The `SpeechSynthesizer` also emits events based on the its status. The table below shows all events of the type `SpeechSynthesizerEvent`:

| Enum key | Enum value |
| -------- | ---------- |
| `Play`   | `'play'`   |
| `Pause`  | `'pause'`  |
| `Resume` | `'resume'` |
| `Stop`   | `'stop'`   |
| `End`    | `'end'`    |
| `Error`  | `'error'`  |

You can also use the following helpers:

```typescript
client.speechSynthesizer.isAvailable;
client.speechSynthesizer.isSpeaking; // or client.isPlayingAudio
client.speechSynthesizer.canResume;
client.speechSynthesizer.canPause;
client.speechSynthesizer.canStop;
client.speechSynthesizer.volume;
```

The Web Client also implements an [`SSMLProcessor`](https://github.com/jovotech/jovo-framework/blob/v4/latest/clients/client-web/src/core/SSMLProcessor.ts) that processes standard SSML tags like `audio` and `break`.

### Reprompts

The Web Client is able to play [reprompts](https://www.jovo.tech/docs/output-templates#reprompt) if the user doesn't respond to a prompt. This feature is currently only available for Speech Interfaces.

Reprompts are played by the [`RepromptProcessor`](https://github.com/jovotech/jovo-framework/blob/v4/latestclients/client-web/src/core/RepromptProcessor.ts), which can be configured like this:

```typescript
reprompts: {
  enabled: true,
  maxAttempts: 1,
},
```

The `maxAttempts` property defines how many reprompts should be played before closing the session.

## Deployment

If you want to deploy your web experience to production, you need to do the following:

- Deploy the Jovo app: [Learn more about server integrations here](https://www.jovo.tech/docs/server).
- Update the `endpointUrl` with your app endpoint (for example, an AWS API Gateway URL).
- Deploy the client.
