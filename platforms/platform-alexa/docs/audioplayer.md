---
title: 'Alexa AudioPlayer'
excerpt: 'Learn how to build Alexa Skills with AudioPlayer functionality using Jovo.'
---

# Alexa AudioPlayer

Learn how to build Alexa Skills with AudioPlayer functionality using Jovo.

## Introduction

AudioPlayer Alexa Skills can be used to stream long-form audio files like music or podcasts. For this functionality, Alexa provides specific built-in intents as well as request types. More information can be found in the [official Alexa docs](https://developer.amazon.com/docs/alexa/custom-skills/audioplayer-interface-reference.html). Also, there is an [example Jovo Alexa AudioPlayer app here](https://github.com/jovotech/jovo-framework/tree/v4/latest/examples/typescript/alexa/audioplayer).

In the [configuration](#configuration) section, you can learn how to set up your Alexa Skill project and Jovo app to work the Alexa AudioPlayer interface.

You can interact with the AudioPlayer interface like this:
- [Send AudioPlayer Responses](#send-audioplayer-responses): Play or stop songs and manage the queue of songs to be played.
- [Handle AudioPlayer Requests](#handle-audioplayer-requests): Alexa sends requests to your Jovo app that contain information about the current player activity.

In general, we recommend creating a custom [global](https://www.jovo.tech/docs/components#global-components) `AudioPlayerComponent` that interacts with the AudioPlayer interface. Here is an example that plays an audio file in the [`START` handler](https://www.jovo.tech/docs/handlers#start) and logs AudioPlayer requests:

```typescript
import { BaseComponent, Component, Global, Handle, Intents } from '@jovotech/framework';
import {
  AlexaHandles,
  AudioPlayerPlayOutput,
  AudioPlayerStopOutput,
} from '@jovotech/platform-alexa';

@Global()
@Component()
export class AudioPlayerComponent extends BaseComponent {
  START() {
    return this.$send(AudioPlayerPlayOutput, {
      message: 'Starting audio',
      audioItem: {
        stream: {
          url: 'https://s3.amazonaws.com/jovo-songs/song1.mp3',
        },
      },
    });
  }

  @Intents(['AMAZON.ResumeIntent'])
  resumeAudio() {
    return this.$send(AudioPlayerPlayOutput, {
      message: 'Continuing audio',
      audioItem: {
        stream: {
          url: 'https://s3.amazonaws.com/jovo-songs/song1.mp3',
          offsetInMilliseconds: this.$user.data.audioPlayerOffset,
        },
      },
    });
  }

  @Intents(['AMAZON.PauseIntent'])
  END() {
    return this.$send(AudioPlayerStopOutput);
  }

  @Handle(AlexaHandles.onAudioPlayer('AudioPlayer.PlaybackStarted'))
  playbackStarted() {
    console.log('AudioPlayer.PlaybackStarted');
    // this.$send is not necessary here and below, an empty response will be returned
  }

  @Handle(AlexaHandles.onAudioPlayer('AudioPlayer.PlaybackNearlyFinished'))
  playbackNearlyFinished() {
    console.log('AudioPlayer.PlaybackNearlyFinished');
  }

  @Handle(AlexaHandles.onAudioPlayer('AudioPlayer.PlaybackFailed'))
  playbackFailed() {
    const error = this.$alexa!.audioPlayer.error;
    console.log('AudioPlayer.PlaybackFailed', error?.type, error?.message);
  }

  @Handle(AlexaHandles.onAudioPlayer('AudioPlayer.PlaybackStopped'))
  playbackStopped() {
    this.$user.data.audioPlayerOffset = this.$alexa!.audioPlayer?.offsetInMilliseconds;
    console.log('Saved audioPlayerOffset:', this.$user.data.audioPlayerOffset + ' ms');
    console.log('AudioPlayer.PlaybackStopped');
  }

  @Handle(AlexaHandles.onAudioPlayer('AudioPlayer.PlaybackFinished'))
  playbackFinished() {
    console.log('AudioPlayer.PlaybackFinished');
  }
}
```


## Configuration

To be able to use the Alexa AudioPlayer, you need to enable the AudioPlayer interface for your Alexa Skill project. Learn more in the [official Alexa docs](https://developer.amazon.com/docs/alexa/custom-skills/audioplayer-interface-reference.html#config).

You can enable it in the Alexa Developer Console or using the [Jovo CLI](https://www.jovo.tech/docs/cli) by adding the following to your [Alexa project configuration](./project-config.md):

```js
new AlexaCli({
  files: {
    'skill-package/skill.json': {
      manifest: {
        apis: {
          custom: {
            interfaces: [
              {
                type: 'AUDIO_PLAYER',
              },
            ],
          },
        },
      },
    },
  },
  // ...
}),
```

Running the [`build:platform alexa` command](./cli-commands.md#build) will add the interface to the `skill.json` in your Alexa project files. [`deploy:platform alexa`](./cli-commands.md#deploy) then updates the project in the Alexa Developer Console. Learn more about [Jovo Alexa CLI commands here](./cli-commands.md).

The AudioPlayer interface also requires you to add a few built-in intents to your Alexa Interaction Model. This will be added to the Alexa Developer Console automatically after enabling the interface. You can add them to the [Jovo Model](https://www.jovo.tech/docs/models) directly or use the [`get:platform alexa` command](./cli-commands.md#get) to import the files into your `build` folder. Running `build:platform alexa --reverse` will then turn that into your updated Jovo Model.


## Send AudioPlayer Responses

To interact with the Alexa AudioPlayer interface, you have to send directives as part of the Alexa response JSON. Below you can learn how to do this using [Jovo Output](https://www.jovo.tech/docs/output).

- [Play](#play)
- [Stop](#stop)
- [ClearQueue](#clearqueue)

### Play

To play an audio file (or add it to the queue), you need to send a directive of the type `AudioPlayer.Play`. You can find the full reference in the [official Alexa docs](https://developer.amazon.com/docs/alexa/custom-skills/audioplayer-interface-reference.html#play).

To send the directive, you can use the [`AudioPlayerPlayOutput`](https://github.com/jovotech/jovo-framework/blob/v4/latest/platforms/platform-alexa/src/output/templates/AudioPlayerPlayOutput.ts) [output class](https://www.jovo.tech/docs/output-classes).

```typescript
import { AudioPlayerPlayOutput } from '@jovotech/platform-alexa';
// ...

someHandler() {
  // ...

  return this.$send(AudioPlayerPlayOutput, {
    message: 'Starting audio',
    audioItem: {
      stream: {
        url: 'https://s3.amazonaws.com/jovo-songs/song1.mp3',
      },
    },
  })
}
```

You can pass the following options:

- `message`: What will be said by Alexa before the music starts playing.
- `audioItem`: This includes all information about the audio file to be played. You can pass any structure that is [referenced in the Alexa docs](https://developer.amazon.com/docs/alexa/custom-skills/audioplayer-interface-reference.html#play).
- `playBehavior`: Can be `REPLACE_ALL`, `ENQUEUE`, `REPLACE_ENQUEUED`. Default: `REPLACE_ALL`.

Below is a more detailed example:

```typescript
import { AudioPlayerPlayOutput, PlayBehavior } from '@jovotech/platform-alexa';
// ...

someHandler() {
  // ...

  return this.$send(AudioPlayerPlayOutput, {
    message: 'Starting audio',
    playBehavior: PlayBehavior.ReplaceAll, // or: 'REPLACE_ALL'
    audioItem: {
      stream: {
        url: 'https://s3.amazonaws.com/jovo-songs/song1.mp3',
        token: 'song1',
        offsetInMilliseconds: 0,
      },
      metadata: {
        title: 'Title of the song to display',
        // ...
      }
    },
  })
}
```

If no `token` is passed, the name of the song including file type (in the above example, it would be `song1.mp3`) will be used. The default `offsetInMilliseconds` is `0` (to play the song from the beginning).

Under the hood, the [output template](./output.md) returned by the [`AudioPlayerPlayOutput`](https://github.com/jovotech/jovo-framework/blob/v4/latest/platforms/platform-alexa/src/output/templates/AudioPlayerPlayOutput.ts) looks like this:

```typescript
{
  message: this.options.message,
  platforms: {
    alexa: {
      nativeResponse: {
        response: {
          shouldEndSession: true,
          directives: [
            {
              type: 'AudioPlayer.Play',
              playBehavior: this.options.playBehavior, // default: 'REPLACE_ALL'
              audioItem: this.options.audioItem,
            },
          ],
        },
      },
    },
  },
}
```

### Stop

The type `AudioPlayer.Stop` stops the audio playback. You can find the full reference in the [official Alexa docs](https://developer.amazon.com/docs/alexa/custom-skills/audioplayer-interface-reference.html#stop).

To send the directive, you can use the [`AudioPlayerStopOutput`](https://github.com/jovotech/jovo-framework/blob/v4/latest/platforms/platform-alexa/src/output/templates/AudioPlayerStopOutput.ts) [output class](https://www.jovo.tech/docs/output-classes).

```typescript
import { AudioPlayerStopOutput } from '@jovotech/platform-alexa';
// ...

someHandler() {
  // ...

  return this.$send(AudioPlayerStopOutput, { message: 'Goodbye.' });
}
```

Under the hood, the [output template](./output.md) returned by the [`AudioPlayerStopOutput`](https://github.com/jovotech/jovo-framework/blob/v4/latest/platforms/platform-alexa/src/output/templates/AudioPlayerStopOutput.ts) looks like this:

```typescript
{
  message: this.options.message,
  platforms: {
    alexa: {
      nativeResponse: {
        response: {
          shouldEndSession: true,
          directives: [
            {
              type: 'AudioPlayer.Stop',
            },
          ],
        },
      },
    },
  },
}
```

### ClearQueue

The type `AudioPlayer.ClearQueue` can be used to remove audio files from the queue that were added with [`AudioPlayer.Play`](#play). You can find the full reference in the [official Alexa docs](https://developer.amazon.com/docs/alexa/custom-skills/audioplayer-interface-reference.html#clearqueue).

To send the directive, you can use the [`AudioPlayerClearQueueOutput`](https://github.com/jovotech/jovo-framework/blob/v4/latest/platforms/platform-alexa/src/output/templates/AudioPlayerClearQueueOutput.ts) [output class](https://www.jovo.tech/docs/output-classes).

```typescript
import { AudioPlayerClearQueueOutput } from '@jovotech/platform-alexa';
// ...

someHandler() {
  // ...

  return this.$send(AudioPlayerClearQueueOutput);
}
```

The `clearBehavior` can also be passed as option:

- `CLEAR_ALL`: Clear everything and stop playing the current song
- `CLEAR_ENQUEUED`: Clear just the queue and continue playing the current song

```typescript
import { AudioPlayerClearQueueOutput, ClearBehavior } from '@jovotech/platform-alexa';
// ...

someHandler() {
  // ...

  return this.$send(AudioPlayerClearQueueOutput, {
    clearBehavior: ClearBehavior.Enqueued // or: 'CLEAR_ENQUEUED'
  });
}
```

Under the hood, the [output template](./output.md) returned by the [`AudioPlayerClearQueueOutput`](https://github.com/jovotech/jovo-framework/blob/v4/latest/platforms/platform-alexa/src/output/templates/AudioPlayerClearQueueOutput.ts) looks like this:

```typescript
{
  message: this.options.message,
  platforms: {
    alexa: {
      nativeResponse: {
        response: {
          shouldEndSession: true,
          directives: [
            {
              type: 'AudioPlayer.ClearQueue',
              clearBehavior: this.options.clearBehavior, // Default: 'CLEAR_ALL'
            },
          ],
        },
      },
    },
  },
}
```


## Handle AudioPlayer Requests

The AudioPlayer interface sends requests to your Jovo app, for example when the playback stopped or failed. Learn more in the [official Alexa docs](https://developer.amazon.com/de-DE/docs/alexa/custom-skills/audioplayer-interface-reference.html#requests).

The following Jovo features help you deal with requests like this:
- [AudioPlayer Handlers](#audioplayer-handlers)
- [AudioPlayer Property](#audioplayer-property)

### AudioPlayer Handlers

Jovo offers `AlexaHandles` helpers for the [`@Handle` decorator](https://www.jovo.tech/docs/handle-decorators) that can be used to react to [AudioPlayer requests](https://developer.amazon.com/docs/alexa/custom-skills/audioplayer-interface-reference.html#requests).

You can accept AudioPlayer and PlayBackController events in your handlers like this:

```typescript
import { AlexaHandles } from '@jovotech/platform-alexa';
// ...

@Handle(AlexaHandles.onAudioPlayer('AudioPlayer.PlaybackStopped'))
playbackStopped() {
  // ...
}

@Handle(AlexaHandles.onPlaybackController('PlaybackController.NextCommandIssued'))
nextCommandIssued() {
  // ...
}
```

Using these helpers is the same as using the following [`@Handle` decorator](https://www.jovo.tech/docs/handle-decorators):

```typescript
@Handle({
  global: true,
  types: [ 'AudioPlayer.PlaybackStopped' ],
  platforms: [ 'alexa' ],
})
```

The key here is the [`types` property](https://www.jovo.tech/docs/handle-decorators#types) that is important to match the handler with the request type coming from the Alexa AudioPlayer interface.

The handlers need to be [`global`](https://www.jovo.tech/docs/handle-decorators#global) because these requests happen outside Alexa's definition of a session, meaning they come without any [state](https://www.jovo.tech/docs/state-stack) data.

Here is an example for all AudioPlayer request types:

```typescript
import { BaseComponent, Component, Global, Handle } from '@jovotech/framework';
import { AlexaHandles } from '@jovotech/platform-alexa';
// ...

@Global()
@Component()
export class AudioPlayerComponent extends BaseComponent {
  // ...

  @Handle(AlexaHandles.onAudioPlayer('AudioPlayer.PlaybackStarted'))
  playbackStarted() {
    // @see https://developer.amazon.com/docs/alexa/custom-skills/audioplayer-interface-reference.html#playbackstarted

    console.log('AudioPlayer.PlaybackStarted');
    // this.$send is not necessary here and below, an empty response will be returned
  }

  @Handle(AlexaHandles.onAudioPlayer('AudioPlayer.PlaybackNearlyFinished'))
  playbackNearlyFinished() {
    // @see https://developer.amazon.com/docs/alexa/custom-skills/audioplayer-interface-reference.html#playbacknearlyfinished

    console.log('AudioPlayer.PlaybackNearlyFinished');
  }

  @Handle(AlexaHandles.onAudioPlayer('AudioPlayer.PlaybackFailed'))
  playbackFailed() {
    // @see https://developer.amazon.com/docs/alexa/custom-skills/audioplayer-interface-reference.html#playbackfailed

    const error = this.$alexa!.audioPlayer.error;
    console.log('AudioPlayer.PlaybackFailed', error?.type, error?.message);
  }

  @Handle(AlexaHandles.onAudioPlayer('AudioPlayer.PlaybackStopped'))
  playbackStopped() {
    // @see https://developer.amazon.com/docs/alexa/custom-skills/audioplayer-interface-reference.html#playbackstopped

    this.$user.data.audioPlayerOffset = this.$alexa!.audioPlayer?.offsetInMilliseconds;
    console.log('Saved audioPlayerOffset:', this.$user.data.audioPlayerOffset + ' ms');
    console.log('AudioPlayer.PlaybackStopped');
  }

  @Handle(AlexaHandles.onAudioPlayer('AudioPlayer.PlaybackFinished'))
  playbackFinished() {
    // @see https://developer.amazon.com/docs/alexa/custom-skills/audioplayer-interface-reference.html#playbackfinished

    console.log('AudioPlayer.PlaybackFinished');
  }
}
```

There is no need to return output in these handlers. An empty response will be returned to the Alexa AudioPlayer interface.

### AudioPlayer Property

The Jovo platform integration for Alexa contains an `audioPlayer` property that makes it easier to retrieve information from the requests.

```typescript
this.$alexa.audioPlayer;
```

The `audioPlayer` object contains the following properties that are found in the [Alexa AudioPlayer object](https://developer.amazon.com/docs/alexa/custom-skills/request-and-response-json-reference.html#audioplayer-object) as part of the request:

- `this.$alexa.audioPlayer.playerActivity`: Can be `PLAYING`, `PAUSED`, `FINISHED`, `BUFFER_UNDERRUN`, or `IDLE`.
- `this.$alexa.audioPlayer.offsetInMilliseconds`: The current (at the time the request was sent) offset of the track that is played.
- `this.$alexa.audioPlayer.token`: A token that represents the song that is played. This was previously set using the [`AudioPlayerPlayOutput`](#play).
- `this.$alexa.audioPlayer.error`: A potential error that is sent with a `PlaybackFailed` request.

