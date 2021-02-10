"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BasicCard_1 = require("./BasicCard");
class QuickReplyContent {
}
exports.QuickReplyContent = QuickReplyContent;
class QuickReply extends BasicCard_1.BasicCard {
    constructor(content) {
        super('quickReplies');
        this.content = content;
    }
}
exports.QuickReply = QuickReply;
//# sourceMappingURL=QuickReply.js.map