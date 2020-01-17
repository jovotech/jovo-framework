import { SpeechSynthesizerEvents } from '../events';
import { JovoWebClient } from '../JovoWebClient';

export class SpeechSynthesizer {
  private $volume: number = 1.0;
  private readonly $speechSynthesis: SpeechSynthesis | null = null;

  constructor(private readonly $client: JovoWebClient) {
    if ('speechSynthesis' in window) {
      this.$speechSynthesis = window.speechSynthesis;
    }
  }

  get volume(): number {
    return this.$volume;
  }

  set volume(value: number) {
    this.$volume = value;
  }

  get isAvailable(): boolean {
    return this.$speechSynthesis !== null;
  }

  get canSpeak(): boolean {
    return (
      this.$speechSynthesis !== null &&
      !this.$speechSynthesis.paused &&
      !this.$speechSynthesis.speaking
    );
  }

  get canPause(): boolean {
    return (
      this.$speechSynthesis !== null &&
      this.$speechSynthesis.speaking &&
      !this.$speechSynthesis.paused
    );
  }

  get canResume(): boolean {
    return (
      this.$speechSynthesis !== null &&
      this.$speechSynthesis.speaking &&
      this.$speechSynthesis.paused
    );
  }

  get canStop(): boolean {
    return this.$speechSynthesis !== null && this.$speechSynthesis.speaking;
  }

  private get language(): string {
    return this.$client.options.locale;
  }

  private get isAutomaticLanguageEnabled(): boolean {
    return this.$client.options.speechSynthesis.automaticallySetLanguage;
  }

  speakText(text: string): Promise<void> {
    if (this.canSpeak) {
      const utterance = this.makeDefaultUtterance(text);
      utterance.volume = this.volume;
      return this.speak(utterance);
    } else {
      return Promise.reject(Error('SpeechSynthesis not available'));
    }
  }

  speak(utterance: SpeechSynthesisUtterance): Promise<void> {
    return new Promise(async (resolve, reject) => {
      if (this.canSpeak) {
        this.applyLanguageIfEnabled(utterance);

        utterance.onerror = (e) => {
          this.$client.emit(SpeechSynthesizerEvents.Error, e);
          reject(e);
        };

        utterance.onend = () => {
          this.$client.emit(SpeechSynthesizerEvents.End);
          resolve();
        };

        await this.$speechSynthesis!.speak(utterance);
        this.$client.emit(SpeechSynthesizerEvents.Speak, utterance);
      }
    });
  }

  pause() {
    if (this.canPause) {
      this.$speechSynthesis!.pause();
      this.$client.emit(SpeechSynthesizerEvents.Pause);
    }
  }

  resume() {
    if (this.canResume) {
      this.$speechSynthesis!.resume();
      this.$client.emit(SpeechSynthesizerEvents.Resume);
    }
  }

  stop() {
    if (this.canStop) {
      this.$speechSynthesis!.cancel();
      this.$client.emit(SpeechSynthesizerEvents.Stop);
    }
  }

  private applyLanguageIfEnabled(utterance: SpeechSynthesisUtterance) {
    if (this.isAutomaticLanguageEnabled && !utterance.lang) {
      utterance.lang = this.language;
    }
  }

  private makeDefaultUtterance(text: string): SpeechSynthesisUtterance {
    return new SpeechSynthesisUtterance(text);
  }
}
