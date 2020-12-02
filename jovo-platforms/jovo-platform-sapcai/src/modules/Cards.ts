import { Plugin } from 'jovo-core';
import { Message, QuickReply, SapCai, SapCaiResponse, SapCaiSkill } from '..';
import { Button, ButtonList, Card, CardContent, Carousel, List, Picture } from '../response';
import _get = require('lodash.get');
import _set = require('lodash.set');

export class Cards implements Plugin {
  install(sapcai: SapCai) {
    sapcai.middleware('$output')!.use(this.output.bind(this));

    SapCaiSkill.prototype.showQuickReplyCard = function (title: string, buttons: Button[]) {
      _set(
        this.$output,
        'SapCai.QuickReply',
        new QuickReply({
          title,
          buttons,
        }),
      );
      return this;
    };

    SapCaiSkill.prototype.showStandardCard = function (
      title: string,
      subtitle: string,
      imageUrl: string,
      buttons: Button[],
    ) {
      _set(
        this.$output,
        'SapCai.Card',
        new Card({
          title,
          subtitle,
          imageUrl,
          buttons,
        }),
      );
      return this;
    };

    SapCaiSkill.prototype.showButtonsCard = function (title: string, buttons: Button[]) {
      _set(
        this.$output,
        'SapCai.ButtonList',
        new ButtonList({
          title,
          buttons,
        }),
      );
      return this;
    };

    SapCaiSkill.prototype.showCarouselCard = function (items: CardContent[]) {
      _set(this.$output, 'SapCai.Carousel', new Carousel(items));
      return this;
    };

    SapCaiSkill.prototype.showListCard = function (elements: CardContent[], buttons: Button[]) {
      _set(
        this.$output,
        'SapCai.List',
        new List({
          elements,
          buttons,
        }),
      );
      return this;
    };

    SapCaiSkill.prototype.showPictureCard = function (pictureUrl: string) {
      _set(this.$output, 'SapCai.Picture', new Picture(pictureUrl));
      return this;
    };

    // Not supported yet by SAP CAI
    // SapCaiSkill.prototype.showVideoCard = function (videoUrl: string) {
    //   _set(this.$output, 'SapCai.Video', new Video(videoUrl));
    //   return this;
    // };
  }

  uninstall(sapcai: SapCai) {}

  output(caiSkill: SapCaiSkill) {
    const output = caiSkill.$output;
    const prevReplies = _get(caiSkill.$response, 'replies');
    const replies: Message[] = prevReplies ? prevReplies : [];

    if (!caiSkill.$response) {
      caiSkill.$response = new SapCaiResponse();
    }
    const card = _get(output, 'SapCai.Card');
    if (card) {
      replies.push(card);
    }

    const quickReply = _get(output, 'SapCai.QuickReply');
    const quickReplies = output.quickReplies;
    if (quickReply) {
      replies.push(quickReply);
    } else if (quickReplies?.length) {
      replies.push(
        new QuickReply({
          buttons: quickReplies.map((reply) => ({
            title: typeof reply === 'string' ? reply : reply.label || reply.value,
            value: typeof reply === 'string' ? reply : reply.value,
          })),
        }),
      );
    }

    const buttonList = _get(output, 'SapCai.ButtonList');
    if (buttonList) {
      replies.push(buttonList);
    }

    const carousel = _get(output, 'SapCai.Carousel');
    if (carousel) {
      replies.push(carousel);
    }

    const list = _get(output, 'SapCai.List');
    if (list) {
      replies.push(list);
    }

    const picture = _get(output, 'SapCai.Picture');
    if (picture) {
      replies.push(picture);
    }

    const video = _get(output, 'SapCai.Video');
    if (video) {
      replies.push(video);
    }

    _set(caiSkill.$response, 'replies', replies);
  }
}
