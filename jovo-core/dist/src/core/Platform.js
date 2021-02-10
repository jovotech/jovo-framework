"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ActionSet_1 = require("./ActionSet");
const Extensible_1 = require("./Extensible");
class Platform extends Extensible_1.Extensible {
    constructor(config) {
        super(config);
        this.actionSet = new ActionSet_1.ActionSet([
            'setup',
            '$init',
            '$request',
            '$session',
            '$user',
            '$type',
            '$nlu',
            '$inputs',
            '$output',
            '$response',
        ], this);
    }
    supportsASR() {
        return this.actionSet.middleware.has('$asr');
    }
    supportsTTS() {
        return this.actionSet.middleware.has('$tts');
    }
    setup(handleRequest) {
        return this.middleware('setup').run(handleRequest);
    }
}
exports.Platform = Platform;
//# sourceMappingURL=Platform.js.map