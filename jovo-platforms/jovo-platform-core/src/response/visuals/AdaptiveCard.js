"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var _merge = require("lodash.merge");
var AdaptiveCard = /** @class */ (function () {
    function AdaptiveCard(options) {
        this.type = 'AdaptiveCard';
        this.version = '1.0';
        _merge(this, options);
    }
    return AdaptiveCard;
}());
exports.AdaptiveCard = AdaptiveCard;
