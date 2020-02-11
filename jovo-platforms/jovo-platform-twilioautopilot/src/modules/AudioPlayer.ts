import { Plugin } from 'jovo-core';
import { Autopilot } from '../Autopilot';
import { AutopilotBot } from '../core/AutopilotBot';
import { AutopilotResponse } from '../core/AutopilotResponse';

export interface AudioPlayerItem {
  loop: number;
  url: string;
}

export class AudioPlayer {
  autopilotBot: AutopilotBot;

  constructor(autopilotBot: AutopilotBot) {
    this.autopilotBot = autopilotBot;
  }

  /**
   * Add an audio file to the response
   * @param {string} url
   * @param {number} loop
   */
  play(url: string, loop: number) {
    const audio: AudioPlayerItem = {
      url,
      loop,
    };

    this.autopilotBot.$output.Autopilot.AudioPlayer = audio;
  }
}

/**
 * @see https://www.twilio.com/docs/autopilot/actions/play
 */
export class AudioPlayerPlugin implements Plugin {
  install(autopilot: Autopilot) {
    autopilot.middleware('$output')!.use(this.output.bind(this));

    AutopilotBot.prototype.$audioPlayer = undefined;
    AutopilotBot.prototype.audioPlayer = function() {
      return this.$audioPlayer;
    };
  }

  uninstall(autopilot: Autopilot) {}

  output(autopilotBot: AutopilotBot) {
    const output = autopilotBot.$output;
    const response = autopilotBot.$response as AutopilotResponse;

    // audio player is only supported on "Voice". Will be ignored on other platforms
    if (output.Autopilot.AudioPlayer) {
      const playAction = output.Autopilot.AudioPlayer;
      response.actions.unshift(playAction);
    }
  }
}
