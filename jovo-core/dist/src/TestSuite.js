"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Conversation_1 = require("./util/Conversation");
/**
 * Defines a class with static functions for testing purpose.
 */
class TestSuite {
    constructor(requestBuilder, responseBuilder) {
        this.requestBuilder = requestBuilder;
        this.responseBuilder = responseBuilder;
    }
    /**
     * Instantiates conversation object with the given config object.
     * @param {ConversationConfig} config
     * @returns {Conversation}
     */
    conversation(config) {
        return new Conversation_1.Conversation(this, config);
    }
}
exports.TestSuite = TestSuite;
//# sourceMappingURL=TestSuite.js.map