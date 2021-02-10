"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const GoogleBusinessBot_1 = require("../core/GoogleBusinessBot");
const GoogleBusinessAPI_1 = require("../services/GoogleBusinessAPI");
class Cards {
    install(googleBusiness) {
        GoogleBusinessBot_1.GoogleBusinessBot.prototype.showCarousel = async function (carousel, fallback) {
            const data = Object.assign(Object.assign({}, this.makeBaseResponse()), { fallback, richCard: {
                    carouselCard: carousel,
                } });
            await GoogleBusinessAPI_1.GoogleBusinessAPI.sendResponse({
                data,
                serviceAccount: this.$config.plugin.GoogleBusiness.serviceAccount,
                sessionId: this.$request.getSessionId(),
            });
        };
        GoogleBusinessBot_1.GoogleBusinessBot.prototype.showStandaloneCard = async function (card, fallback) {
            const data = Object.assign(Object.assign({}, this.makeBaseResponse()), { fallback, richCard: {
                    standaloneCard: card,
                } });
            await GoogleBusinessAPI_1.GoogleBusinessAPI.sendResponse({
                data,
                serviceAccount: this.$config.plugin.GoogleBusiness.serviceAccount,
                sessionId: this.$request.getSessionId(),
            });
        };
    }
}
exports.Cards = Cards;
//# sourceMappingURL=Cards.js.map