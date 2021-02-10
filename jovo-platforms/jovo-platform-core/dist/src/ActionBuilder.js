"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Interfaces_1 = require("./Interfaces");
class ActionBuilder {
    constructor() {
        this.actions = [];
    }
    addContainer(actions, type = Interfaces_1.ActionType.SequenceContainer) {
        this.actions.push({ type, actions });
        return this;
    }
    addText(data) {
        const action = typeof data === 'string'
            ? {
                text: data,
                type: Interfaces_1.ActionType.Text,
            }
            : Object.assign({ type: Interfaces_1.ActionType.Text, text: data.text }, data);
        this.actions.push(action);
        return this;
    }
    addSpeech(data) {
        const action = typeof data === 'string'
            ? { type: Interfaces_1.ActionType.Speech, plain: data }
            : Object.assign({ type: Interfaces_1.ActionType.Speech }, data);
        this.actions.push(action);
        return this;
    }
    addAudio(data) {
        this.actions.push(Object.assign({ type: Interfaces_1.ActionType.Audio }, data));
        return this;
    }
    addProcessingInformation(data) {
        this.actions.push(Object.assign({ type: Interfaces_1.ActionType.Processing }, data));
        return this;
    }
    addQuickReplies(quickReplies) {
        const replies = [];
        for (let i = 0, len = quickReplies.length; i < len; i++) {
            replies.push(typeof quickReplies[i] === 'string'
                ? {
                    id: quickReplies[i],
                    label: quickReplies[i],
                    value: quickReplies[i],
                }
                : quickReplies[i]);
        }
        this.actions.push({ type: Interfaces_1.ActionType.QuickReply, replies });
        return this;
    }
    reset() {
        this.actions.splice(0);
    }
    build() {
        return this.actions.slice();
    }
}
exports.ActionBuilder = ActionBuilder;
//# sourceMappingURL=ActionBuilder.js.map