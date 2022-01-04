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
          token: 'song1',
          offsetInMilliseconds: 0,
        },
      },
    });
  }

  @Handle(AlexaHandles.onAudioPlayer('AudioPlayer.PlaybackStarted'))
  playbackStarted() {
    // @see https://developer.amazon.com/en-US/docs/alexa/custom-skills/audioplayer-interface-reference.html#playbackstopped
    console.log('AudioPlayer.PlaybackStarted');
    // this.$send is not necessary here, an empty response will be returned
  }

  @Handle(AlexaHandles.onAudioPlayer('AudioPlayer.PlaybackNearlyFinished'))
  playbackNearlyFinished() {
    // @see https://developer.amazon.com/en-US/docs/alexa/custom-skills/audioplayer-interface-reference.html#playbacknearlyfinished
    console.log('AudioPlayer.PlaybackNearlyFinished');
    // this.$send is not necessary here, an empty response will be returned
  }

  @Handle(AlexaHandles.onAudioPlayer('AudioPlayer.PlaybackFailed'))
  playbackFailed() {
    // @see https://developer.amazon.com/en-US/docs/alexa/custom-skills/audioplayer-interface-reference.html#playbackfailed
    const error = this.$alexa!.audioPlayer.error;
    console.log('AudioPlayer.PlaybackFailed', error?.type, error?.message);
    // this.$send is not necessary here, an empty response will be returned
  }

  @Handle(AlexaHandles.onAudioPlayer('AudioPlayer.PlaybackStopped'))
  playbackStopped() {
    // @see https://developer.amazon.com/en-US/docs/alexa/custom-skills/audioplayer-interface-reference.html#playbackstopped
    this.$user.data.audioPlayerOffset = this.$alexa!.audioPlayer?.offsetInMilliseconds;
    console.log('Saved audioPlayerOffset:', this.$user.data.audioPlayerOffset + ' ms');
    console.log('AudioPlayer.PlaybackStopped');
    // this.$send is not necessary here, an empty response will be returned
  }

  @Handle(AlexaHandles.onAudioPlayer('AudioPlayer.PlaybackFinished'))
  playbackFinished() {
    // @see https://developer.amazon.com/en-US/docs/alexa/custom-skills/audioplayer-interface-reference.html#playbackfinished
    console.log('AudioPlayer.PlaybackFinished');
    // this.$send is not necessary here, an empty response will be returned
  }

  @Intents(['ClearQueueIntent'])
  clearQueue() {}

  @Intents(['AMAZON.ResumeIntent'])
  resumeAudio() {
    return this.$send(AudioPlayerPlayOutput, {
      message: 'Continuing audio',
      audioItem: {
        stream: {
          url: 'https://s3.amazonaws.com/jovo-songs/song1.mp3',
          token: 'song1',
          offsetInMilliseconds: this.$user.data.audioPlayerOffset,
        },
      },
    });
  }

  @Intents(['AMAZON.PauseIntent'])
  END() {
    return this.$send(AudioPlayerStopOutput);
  }
}
