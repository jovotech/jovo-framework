"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = require("..");
const response_1 = require("../response");
const _get = require("lodash.get");
const _set = require("lodash.set");
class Cards {
    install(sapcai) {
        sapcai.middleware('$output').use(this.output.bind(this));
        __1.SapCaiSkill.prototype.showQuickReplyCard = function (title, buttons) {
            _set(this.$output, 'SapCai.QuickReply', new __1.QuickReply({
                title,
                buttons,
            }));
            return this;
        };
        __1.SapCaiSkill.prototype.showStandardCard = function (title, subtitle, imageUrl, buttons) {
            _set(this.$output, 'SapCai.Card', new response_1.Card({
                title,
                subtitle,
                imageUrl,
                buttons,
            }));
            return this;
        };
        __1.SapCaiSkill.prototype.showButtonsCard = function (title, buttons) {
            _set(this.$output, 'SapCai.ButtonList', new response_1.ButtonList({
                title,
                buttons,
            }));
            return this;
        };
        __1.SapCaiSkill.prototype.showCarouselCard = function (items) {
            _set(this.$output, 'SapCai.Carousel', new response_1.Carousel(items));
            return this;
        };
        __1.SapCaiSkill.prototype.showListCard = function (elements, buttons) {
            _set(this.$output, 'SapCai.List', new response_1.List({
                elements,
                buttons,
            }));
            return this;
        };
        __1.SapCaiSkill.prototype.showPictureCard = function (pictureUrl) {
            _set(this.$output, 'SapCai.Picture', new response_1.Picture(pictureUrl));
            return this;
        };
        // Not supported yet by SAP CAI
        // SapCaiSkill.prototype.showVideoCard = function (videoUrl: string) {
        //   _set(this.$output, 'SapCai.Video', new Video(videoUrl));
        //   return this;
        // };
    }
    uninstall(sapcai) { }
    output(caiSkill) {
        const output = caiSkill.$output;
        const prevReplies = _get(caiSkill.$response, 'replies');
        const replies = prevReplies ? prevReplies : [];
        if (!caiSkill.$response) {
            caiSkill.$response = new __1.SapCaiResponse();
        }
        const card = _get(output, 'SapCai.Card');
        if (card) {
            replies.push(card);
        }
        const quickReply = _get(output, 'SapCai.QuickReply');
        const quickReplies = output.quickReplies;
        if (quickReply) {
            replies.push(quickReply);
        }
        else if (quickReplies === null || quickReplies === void 0 ? void 0 : quickReplies.length) {
            replies.push(new __1.QuickReply({
                buttons: quickReplies.map((reply) => ({
                    title: typeof reply === 'string' ? reply : reply.label || reply.value,
                    value: typeof reply === 'string' ? reply : reply.value,
                })),
            }));
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
exports.Cards = Cards;
//# sourceMappingURL=Cards.js.map