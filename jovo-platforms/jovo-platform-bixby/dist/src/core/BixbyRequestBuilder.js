"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BixbyRequest_1 = require("./BixbyRequest");
class BixbyRequestBuilder {
    constructor() {
        this.type = 'BixbyCapsule';
    }
    // tslint:disable:no-any
    async launch(json) {
        return await this.launchRequest(json);
    }
    // tslint:disable:no-any
    async launchRequest(json) {
        return BixbyRequest_1.BixbyRequest.fromJSON(json, { intent: 'LAUNCH' });
    }
    // tslint:disable:no-any
    intent(name, slots) {
        return new Promise((res, rej) => { });
    }
    audioPlayerRequest(json) {
        throw new Error('Method not implemented.');
    }
    end(json) {
        throw new Error('Method not implemented.');
    }
    rawRequest(json) {
        throw new Error('Method not implemented.');
    }
    rawRequestByKey(key) {
        throw new Error('Method not implemented.');
    }
}
exports.BixbyRequestBuilder = BixbyRequestBuilder;
//# sourceMappingURL=BixbyRequestBuilder.js.map