import { ConversationPart, Options } from 'jovo-client-web';

export interface PluginOptions {
  client?: Options;
  url: string;
}

export interface Data {
  isRecording: boolean;
  isFirstRequestDone: boolean;
  isPlayingAudio: boolean;
  isSpeakingText: boolean;
  conversationParts: ConversationPart[];

  // tslint:disable-next-line:no-any
  [index: string]: any;
}
