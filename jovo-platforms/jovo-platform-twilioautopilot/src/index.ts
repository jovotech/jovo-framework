import { AutopilotBot } from './core/AutopilotBot';
import { AudioPlayerItem, AudioPlayer } from './modules/AudioPlayer';
import { StandardCard, ImageItem } from './modules/Cards';

declare module 'jovo-core/dist/src/Jovo' {
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
