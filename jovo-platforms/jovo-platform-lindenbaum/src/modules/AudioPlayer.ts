import { LindenbaumBot } from '../core/LindenbaumBot';
import { Plugin } from 'jovo-core';
import { Lindenbaum } from '../Lindenbaum';
import { LindenbaumRequest } from '../core/LindenbaumRequest';
import { LindenbaumResponse } from '../core/LindenbaumResponse';

export class AudioPlayer {
  lindenbaumBot: LindenbaumBot;

  constructor(lindenbaumBot: LindenbaumBot) {
    this.lindenbaumBot = lindenbaumBot;
  }

  /**
   * Calls the `/call/play` endpoint to play an audio file
   * @param {string} url
   * @param {boolean} bargeIn
   */
  play(url: string, bargeIn: boolean) {
    this.lindenbaumBot.$output.Lindenbaum.push({
      play: {
        url,
        bargeIn,
      },
    });

    return this;
  }
}

export class AudioPlayerPlugin implements Plugin {
  install(lindenbaum: Lindenbaum) {
    lindenbaum.middleware('$output')!.use(this.output.bind(this));

    LindenbaumBot.prototype.$audioPlayer = undefined;
    LindenbaumBot.prototype.audioPlayer = function () {
      return this.$audioPlayer;
    };
  }

  uninstall(lindenbaum: Lindenbaum) {}

  output(lindenbaumBot: LindenbaumBot) {
    const outputs = lindenbaumBot.$output;
    const response = lindenbaumBot.$response as LindenbaumResponse;

    outputs.Lindenbaum.forEach((output) => {
      if (output.play) {
        response.responses.push({
          '/call/play': {
            dialogId: (lindenbaumBot.$request as LindenbaumRequest).dialogId,
            url: output.play.url,
            bargeIn: output.play.bargeIn,
          },
        });
      }
    });
  }
}
