import { Plugin } from 'jovo-core';
import { Lex, LexBot } from '../index';
import { Button, Card } from '../response';
import _get = require('lodash.get');
import _set = require('lodash.set');
import { LexResponse } from '../core/LexResponse';

export class Cards implements Plugin {
  install(lex: Lex) {
    lex.middleware('$output')!.use(this.output.bind(this));
    LexBot.prototype.showStandardCard = function (
      title: string,
      subTitle: string,
      imageUrl: string,
      attachmentLinkUrl: string,
      buttons: Button[],
    ) {
      const cardsArray = _get(this.$output, 'Lex.Cards', []);
      cardsArray.push(
        new Card({
          title,
          subTitle,
          imageUrl,
          attachmentLinkUrl,
          buttons,
        }),
      );
      _set(this.$output, 'Lex.Cards', cardsArray);
      return this;
    };
  }

  uninstall(lex: Lex) {}

  output(lexBot: LexBot) {
    const output = lexBot.$output;

    if (!lexBot.$response) {
      lexBot.$response = new LexResponse();
    }
    const cards = _get(output, 'Lex.Cards', []);
    if (cards.length > 0) {
      _set(lexBot.$response, 'dialogAction.responseCard.version', 1);
      _set(
        lexBot.$response,
        'dialogAction.responseCard.contentType',
        'application/vnd.amazonaws.card.generic',
      );
      _set(lexBot.$response, 'dialogAction.responseCard.genericAttachments', cards);
    }
  }
}
