"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jovo_core_1 = require("jovo-core");
const BixbyResponse_1 = require("./BixbyResponse");
const BixbySpeechBuilder_1 = require("./BixbySpeechBuilder");
class BixbyCapsule extends jovo_core_1.Jovo {
    constructor(app, host, handleRequest) {
        super(app, host, handleRequest);
        // tslint:disable:no-any
        this.$layout = {};
        this.$bixbyCapsule = this;
        this.$response = new BixbyResponse_1.BixbyResponse();
        this.$speech = new BixbySpeechBuilder_1.BixbySpeechBuilder(this);
        this.$reprompt = new BixbySpeechBuilder_1.BixbySpeechBuilder(this);
    }
    speechBuilder() {
        return this.getSpeechBuilder();
    }
    getSpeechBuilder() {
        return new BixbySpeechBuilder_1.BixbySpeechBuilder(this);
    }
    isNewSession() {
        return this.$request.isNewSession();
    }
    getTimestamp() {
        return this.$request.getTimestamp();
    }
    getLocale() {
        return this.$request.getLocale();
    }
    getUserId() {
        return this.$user.getId();
    }
    // tslint:disable:no-any
    addLayoutAttribute(key, value) {
        this.$layout[key] = value;
    }
    getDeviceId() {
        // TODO implement!
        return undefined;
    }
    hasAudioInterface() {
        // TODO implement, always has audio interface?
        return true;
    }
    hasScreenInterface() {
        // TODO implement, always has screen interface?
        return true;
    }
    hasVideoInterface() {
        // TODO implement, can play videos?
        return false;
    }
    getType() {
        return 'BixbyCapsule';
    }
    getPlatformType() {
        return 'Bixby';
    }
    getSelectedElementId() {
        // TODO what does this do?
        return undefined;
    }
    getRawText() {
        // TODO again, what does this do?
        return undefined;
    }
    getAudioData() {
        return undefined;
    }
}
exports.BixbyCapsule = BixbyCapsule;
//# sourceMappingURL=BixbyCapsule.js.map