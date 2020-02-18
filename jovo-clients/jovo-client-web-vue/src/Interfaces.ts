import { ConversationPart, InitConfig } from 'jovo-client-web';

export interface PluginConfig {
  client?: InitConfig;
  url: string;
}

export interface PluginData {
  isRecording: boolean;
  isFirstRequestDone: boolean;
  isPlayingAudio: boolean;
  isSpeakingText: boolean;
  conversationParts: ConversationPart[];

  // tslint:disable-next-line:no-any
  [index: string]: any;
}
