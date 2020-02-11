import { AutopilotBot } from './core/AutopilotBot';
import { AudioPlayerItem, AudioPlayer } from './modules/AudioPlayer';
import { StandardCard, ImageItem } from './modules/Cards';
import { TestSuite } from 'jovo-core';
import { AutopilotRequestBuilder } from './core/AutopilotRequestBuilder';
import { AutopilotResponseBuilder } from './core/AutopilotResponseBuilder';

export interface AutopilotTestSuite
  extends TestSuite<AutopilotRequestBuilder, AutopilotResponseBuilder> {}

declare module 'jovo-core/dist/src/core/Jovo' {
  interface Jovo {
    $autopilotBot?: AutopilotBot;
    autopilotBot(): AutopilotBot;
  }
}

// AudioPlayer
declare module './core/AutopilotBot' {
  interface AutopilotBot {
    $audioPlayer?: AudioPlayer;
    audioPlayer(): AudioPlayer | undefined;
  }
}

// Cards
declare module './core/AutopilotBot' {
  interface AutopilotBot {
    showStandardCard(content: string, images?: ImageItem[] | ImageItem): this;
  }
}

declare module 'jovo-core/dist/src/Interfaces' {
  interface Output {
    Autopilot: {
      AudioPlayer?: AudioPlayerItem;
      card?: {
        StandardCard?: StandardCard;
      };
    };
  }
}

export { Autopilot } from './Autopilot';
