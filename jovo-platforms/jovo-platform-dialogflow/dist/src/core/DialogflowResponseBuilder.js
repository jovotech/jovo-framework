"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class DialogflowResponseBuilder {
    constructor(factory) {
        this.factory = factory;
    }
    // tslint:disable-next-line
    create(json) {
        return this.factory.createResponse(json);
    }
}
exports.DialogflowResponseBuilder = DialogflowResponseBuilder;
//# sourceMappingURL=DialogflowResponseBuilder.js.map