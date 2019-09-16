import { Card, CardContent } from './response/Card';
import {Plugin} from 'jovo-core';
import {SAPCAI} from "./SAPCAI";
import _get = require('lodash.get');
import _set = require('lodash.set');
import {SAPCAISkill} from "./SAPCAISkill";
import {SAPCAIResponse} from "./SAPCAIResponse";
import { QuickReply } from './response/QuickReply';
import { Button } from './response/Button';
import { ButtonList } from './response/ButtonList';
import { Carousel } from './response/Carousel';
import { List } from './response/List';
import { Picture } from './response/Picture';
import { Video } from './response/Video';


export class Cards implements Plugin {


    install(sapcai: SAPCAI) {

        sapcai.middleware('$output')!.use(this.output.bind(this));


        SAPCAISkill.prototype.showQuickReplyCard = function(title: string, buttons: Button[]) {
            _set(this.$output, 'SAPCAI.QuickReply',
                new QuickReply({
                    title,
                    buttons
                })
            );
            return this;
        };

        SAPCAISkill.prototype.showStandardCard = function(title: string, subtitle: string, imageUrl: string, buttons: Button[]) {
            _set(this.$output, 'SAPCAI.Card',
                new Card({
                    title,
                    subtitle,
                    imageUrl,
                    buttons
                })
            );
            return this;
        };

        SAPCAISkill.prototype.showButtonsCard = function(title: string, buttons: Button[]) {
            _set(this.$output, 'SAPCAI.ButtonList',
                new ButtonList({
                    title,
                    buttons
                })
            );
            return this;
        };

        SAPCAISkill.prototype.showCarouselCard = function(items: CardContent[]) {
            _set(this.$output, 'SAPCAI.Carousel',
                new Carousel(items)
            );
            return this;
        };

        SAPCAISkill.prototype.showListCard = function(elements: CardContent[], buttons: Button[]) {
            _set(this.$output, 'SAPCAI.List',
                new List({
                    elements,
                    buttons
                })
            );
            return this;
        };

        SAPCAISkill.prototype.showPictureCard = function(pictureUrl: string) {
            _set(this.$output, 'SAPCAI.Picture',
                new Picture(pictureUrl)
            );
            return this;
        };

        // Note supported yet by SAP CAI
        /*SAPCAISkill.prototype.showVideoCard = function(videoUrl: string) {
            _set(this.$output, 'SAPCAI.Video',
                new Video(videoUrl)
            );
            return this;
        };*/


    }
    uninstall(sapcai: SAPCAI) {
    }

    output(sapcaiSkill: SAPCAISkill) {

        const output = sapcaiSkill.$output;
        const prevReplies = _get(sapcaiSkill.$response, 'replies');
        const replies : any[] = prevReplies ? prevReplies : [];


        if (!sapcaiSkill.$response) {
            sapcaiSkill.$response = new SAPCAIResponse();
        }
        const card = _get(output, 'SAPCAI.Card');
        if (card) {
            replies.push(card);
        }
        
        const quickReply = _get(output, 'SAPCAI.QuickReply');
        if (quickReply) {
            replies.push(quickReply);
        }
        
        const buttonList = _get(output, 'SAPCAI.ButtonList');
        if (buttonList) {
            replies.push(buttonList);
        }
        
        const carousel = _get(output, 'SAPCAI.Carousel');
        if (carousel) {
            replies.push(carousel);
        }
        
        const list = _get(output, 'SAPCAI.List');
        if (list) {
            replies.push(list);
        }
        
        const picture = _get(output, 'SAPCAI.Picture');
        if (picture) {
            replies.push(picture);
        }
        
        const video = _get(output, 'SAPCAI.Video');
        if (video) {
            replies.push(video);
        }

        _set(sapcaiSkill.$response, 'replies', replies);
    }

}
