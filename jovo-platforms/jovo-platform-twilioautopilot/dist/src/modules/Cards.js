"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const AutopilotBot_1 = require("../core/AutopilotBot");
class Cards {
    install(autopilot) {
        autopilot.middleware('$output').use(this.output.bind(this));
        /**
         * naming: twilio names it just `show`
         */
        AutopilotBot_1.AutopilotBot.prototype.showStandardCard = function (content, images) {
            const card = {
                body: content,
            };
            if (Array.isArray(images)) {
                card.images = images;
            }
            else if (typeof images === 'object') {
                card.images = [images];
            }
            if (!this.$output.Autopilot.card) {
                this.$output.Autopilot.card = {};
            }
            this.$output.Autopilot.card.StandardCard = card;
            return this;
        };
    }
    uninstall(autopilot) { }
    output(autopilotBot) {
        var _a, _b, _c;
        const output = autopilotBot.$output;
        const response = autopilotBot.$response;
        if ((_a = output.card) === null || _a === void 0 ? void 0 : _a.SimpleCard) {
            const card = output.card.SimpleCard;
            const show = {
                body: card.content,
            };
            response.actions.unshift({ show });
        }
        if ((_b = output.card) === null || _b === void 0 ? void 0 : _b.ImageCard) {
            const card = output.card.ImageCard;
            const show = {
                body: card.content,
                images: [
                    {
                        url: card.imageUrl,
                    },
                ],
            };
            response.actions.unshift({ show });
        }
        if ((_c = output.Autopilot.card) === null || _c === void 0 ? void 0 : _c.StandardCard) {
            response.actions.unshift({ show: output.Autopilot.card.StandardCard });
        }
    }
}
exports.Cards = Cards;
//# sourceMappingURL=Cards.js.map