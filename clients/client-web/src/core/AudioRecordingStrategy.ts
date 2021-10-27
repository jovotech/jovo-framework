import { InputType } from '@jovotech/common';
import { ClientEvent } from '../Client';
import { AudioRecorderEvent, AudioRecorderEventListenerMap } from '../standalone/AudioRecorder';
import {
  SpeechRecognizerEvent,
  SpeechRecognizerEventListenerMap,
} from '../standalone/SpeechRecognizer';
import { AudioHelper, Base64Converter } from '../utilities';
import {
  AudioRecordingModality,
  RecordingModality,
  RecordingModalityType,
  RecordingStrategy,
} from './RecordingStrategy';

export class AudioRecordingStrategy extends RecordingStrategy<
  RecordingModalityType.Audio | 'AUDIO',
  AudioRecordingModality
> {
  readonly type: RecordingModalityType.Audio | 'AUDIO' = RecordingModalityType.Audio;

  get modality(): AudioRecordingModality | undefined {
    return this.client.currentRecordingModality?.type === RecordingModalityType.Audio
      ? this.client.currentRecordingModality
      : undefined;
  }

  get useSpeechRecognition(): boolean {
    return this.modality?.useSpeechRecognition ?? true;
  }

  async startRecording(modality: AudioRecordingModality): Promise<RecordingModality> {
    if (modality.useSpeechRecognition === undefined) {
      modality.useSpeechRecognition = true;
    }
    if (modality.useSpeechRecognition && this.client.speechRecognizer.isAvailable) {
      this.addSpeechRecognizerEventListeners();
      this.client.speechRecognizer.start();
    } else {
      this.addAudioRecorderEventListeners();
      await this.client.audioRecorder.start();
    }
    return modality;
  }

  stopRecording(): void {
    if (this.useSpeechRecognition && this.client.speechRecognizer.isAvailable) {
      this.client.speechRecognizer.stop();
    } else {
      this.client.audioRecorder.stop();
    }
  }

  abortRecording(): void {
    if (this.useSpeechRecognition && this.client.speechRecognizer.isAvailable) {
      this.client.speechRecognizer.abort();
    } else {
      this.client.audioRecorder.abort();
    }
  }

  private onSpeechRecognizerEnd: SpeechRecognizerEventListenerMap['end'] = async (event) => {
    this.onSpeechRecognizerFinished();
    if (!event) {
      return;
    }
    const text = AudioHelper.textFromSpeechRecognition(event);
    this.client.emit(ClientEvent.Input, {
      type: InputType.TranscribedSpeech,
      text,
    });
  };

  private onSpeechRecognizerFinished = () => {
    this.client.setRecordingModality(undefined);
    this.removeSpeechRecognizerEventListeners();
  };

  private onAudioRecorderStop: AudioRecorderEventListenerMap['stop'] = async (result) => {
    this.onAudioRecorderFinished();
    this.client.emit(ClientEvent.Input, {
      type: InputType.Speech,
      audio: {
        sampleRate: result.sampleRate,
        base64: Base64Converter.arrayBufferToBase64(result.data.buffer),
      },
    });
  };

  private onAudioRecorderFinished = () => {
    this.client.setRecordingModality(undefined);
    this.removeAudioRecorderEventListeners();
  };

  private addAudioRecorderEventListeners() {
    this.client.audioRecorder.on(AudioRecorderEvent.Stop, this.onAudioRecorderStop);
    this.client.audioRecorder.on(AudioRecorderEvent.Abort, this.onAudioRecorderFinished);
    this.client.audioRecorder.on(AudioRecorderEvent.Timeout, this.onAudioRecorderFinished);
  }

  private addSpeechRecognizerEventListeners() {
    this.client.speechRecognizer.on(SpeechRecognizerEvent.End, this.onSpeechRecognizerEnd);
    this.client.speechRecognizer.on(SpeechRecognizerEvent.Abort, this.onSpeechRecognizerFinished);
    this.client.speechRecognizer.on(SpeechRecognizerEvent.Timeout, this.onSpeechRecognizerFinished);
  }

  private removeAudioRecorderEventListeners() {
    this.client.audioRecorder.off(AudioRecorderEvent.Stop, this.onAudioRecorderStop);
    this.client.audioRecorder.off(AudioRecorderEvent.Abort, this.onAudioRecorderFinished);
    this.client.audioRecorder.off(AudioRecorderEvent.Timeout, this.onAudioRecorderFinished);
  }

  private removeSpeechRecognizerEventListeners() {
    this.client.speechRecognizer.off(SpeechRecognizerEvent.End, this.onSpeechRecognizerEnd);
    this.client.speechRecognizer.off(SpeechRecognizerEvent.Abort, this.onSpeechRecognizerFinished);
    this.client.speechRecognizer.off(
      SpeechRecognizerEvent.Timeout,
      this.onSpeechRecognizerFinished,
    );
  }
}
