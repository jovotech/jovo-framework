import {
  AssistantEvents,
  AudioPlayerEvents,
  AudioVisualizer,
  Config,
  ConversationEvents,
  ConversationPart,
  InitConfig,
  InputRecordEvents,
  JovoWebClient,
  SpeechSynthesizerEvents,
  Store,
} from 'jovo-client-web';
import Vue from 'vue';
import { PluginData } from './Interfaces';

export class JovoWebClientVue {
  private readonly $store: Vue;
  private readonly $assistant: JovoWebClient;
  private readonly $events: string[];

  constructor(url: string, config?: InitConfig) {
    const data: PluginData = {
      isRecording: false,
      isFirstRequestDone: false,
      isPlayingAudio: false,
      isSpeakingText: false,
      conversationParts: [],
    };
    this.$store = new Vue({ data });
    this.$assistant = new JovoWebClient(url, config);
    this.$events = [];
    this.setupListeners();
    this.$assistant.start();
  }

  get instance(): JovoWebClient {
    return this.$assistant;
  }

  get data(): PluginData {
    return this.$store.$data as PluginData;
  }

  get store(): Store {
    return this.$assistant.store;
  }

  get volume(): number {
    return this.$assistant.volume;
  }

  set volume(value: number) {
    this.$assistant.volume = value;
  }

  get config(): Config {
    return this.$assistant.$config;
  }

  set config(config: Config) {
    this.$assistant.$config = config;
  }

  // tslint:disable-next-line:no-any
  on(event: string, func: (...args: any[]) => void) {
    if (!this.$events.includes(event)) {
      this.setupListener(event);
      this.$events.push(event);
    }
    this.$store.$on(event, func);
  }

  // tslint:disable-next-line:no-any
  off(event: string, func: (...args: any[]) => void) {
    this.$store.$off(event, func);
  }

  // region input-related
  sendText(text: string, fromVoice = true): JovoWebClientVue {
    this.$assistant.input.sendText(text, fromVoice);
    return this;
  }

  startRecording(): JovoWebClientVue {
    this.$assistant.input.startRecording();
    return this;
  }

  stopRecording(): JovoWebClientVue {
    this.$assistant.input.stopRecording();
    return this;
  }

  startConversation() {
    this.$assistant.input.startConversation();
    return this;
  }

  abortRecording(): JovoWebClientVue {
    this.$assistant.input.abortRecording();
    return this;
  }

  setVisualizer(visualizer: AudioVisualizer): JovoWebClientVue {
    this.$assistant.input.setVisualizer(visualizer);
    return this;
  }

  // endregion

  // region output-related
  stopAudioOutput() {
    if (this.data.isPlayingAudio) {
      this.$assistant.audioPlayer.stopAll();
    }
    if (this.data.isSpeakingText) {
      this.$assistant.speechSynthesizer.stop();
    }
  }

  // endregion

  private setupListeners() {
    this.on(AssistantEvents.LaunchRequest, () => {
      this.data.isFirstRequestDone = false;
    });

    this.setupIsRecordingListeners();
    this.setupIsPlayingAudioListeners();
    this.setupIsSpeakingTextListeners();

    this.on(ConversationEvents.Change, (parts: ConversationPart[]) => {
      this.data.conversationParts = JSON.parse(JSON.stringify(parts));
    });
  }

  private setupIsRecordingListeners() {
    this.on(InputRecordEvents.Started, this.setIsRecording.bind(this, true));
    this.on(InputRecordEvents.Stopped, this.setIsRecording.bind(this, false));
    this.on(InputRecordEvents.Aborted, this.setIsRecording.bind(this, false));
  }

  private setIsRecording(isRecording: boolean) {
    this.data.isRecording = isRecording;
  }

  private setupIsPlayingAudioListeners() {
    this.on(AudioPlayerEvents.Play, () => {
      this.data.isPlayingAudio = true;
    });
    this.on(AudioPlayerEvents.Resume, this.onAudioPlayerEvent.bind(this));
    this.on(AudioPlayerEvents.Pause, this.onAudioPlayerEvent.bind(this));
    this.on(AudioPlayerEvents.Error, this.onAudioPlayerEvent.bind(this));
    this.on(AudioPlayerEvents.Stop, this.onAudioPlayerEvent.bind(this));
    this.on(AudioPlayerEvents.End, this.onAudioPlayerEvent.bind(this));
  }

  private onAudioPlayerEvent() {
    this.data.isPlayingAudio = this.$assistant.audioPlayer.isPlaying;
  }

  private setupIsSpeakingTextListeners() {
    this.on(SpeechSynthesizerEvents.Speak, this.setIsSpeakingText.bind(this, true));
    this.on(SpeechSynthesizerEvents.Resume, this.setIsSpeakingText.bind(this, true));
    this.on(SpeechSynthesizerEvents.Pause, this.setIsSpeakingText.bind(this, false));
    this.on(SpeechSynthesizerEvents.Error, this.setIsSpeakingText.bind(this, false));
    this.on(SpeechSynthesizerEvents.Stop, this.setIsSpeakingText.bind(this, false));
    this.on(SpeechSynthesizerEvents.End, this.setIsSpeakingText.bind(this, false));
  }

  private setIsSpeakingText(isSpeakingText: boolean) {
    this.data.isSpeakingText = isSpeakingText;
  }

  /**
   * Adds a listener for the given event to the assistant.
   * Via this method the Vue-instance ($store) works as an event-bus.
   * The advantage is, that less events are directly subscribed to an $assistant-event.
   */
  private setupListener(event: string) {
    // tslint:disable-next-line:no-any
    this.$assistant.on(event, (...args: any[]) => {
      this.$store.$emit(event, ...args);
    });
  }
}
