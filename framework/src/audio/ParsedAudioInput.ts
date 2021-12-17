import { AudioInput } from '@jovotech/common';
import { AudioUtilities } from './AudioUtilities';

export class ParsedAudioInput {
  static fromAudioInput(audio: AudioInput): ParsedAudioInput {
    const samples = AudioUtilities.getSamplesFromBase64(audio.base64);
    return new ParsedAudioInput(samples, audio.sampleRate);
  }

  constructor(public samples: Float32Array, public sampleRate: number) {}

  sampleDown(targetSampleRate: number): this {
    this.samples = AudioUtilities.sampleDown(this.samples, this.sampleRate, targetSampleRate);
    this.sampleRate = targetSampleRate;
    return this;
  }

  toWav(targetSampleRate?: number): Buffer {
    const samples = targetSampleRate
      ? AudioUtilities.sampleDown(this.samples, this.sampleRate, targetSampleRate)
      : this.samples;
    return AudioUtilities.encodeSamplesToWav(samples, targetSampleRate || this.sampleRate);
  }
}
