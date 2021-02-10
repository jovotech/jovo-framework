"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jovo_core_1 = require("jovo-core");
class GoogleActionSpeechBuilder extends jovo_core_1.SpeechBuilder {
    constructor(googleAction) {
        super(googleAction);
    }
    addAudio(url, textOrConditionOrProbability, conditionOrProbability, probability) {
        var _a;
        const parsed = this.parseAudioArguments(url, textOrConditionOrProbability, conditionOrProbability, probability);
        const text = ((_a = parsed.text) === null || _a === void 0 ? void 0 : _a.length) ? `<audio src="${parsed.url}">${parsed.text}</audio>`
            : `<audio src="${parsed.url}"/>`;
        return this.addText(text, parsed.condition, parsed.probability);
    }
    addPhoneme(text, ph, alphabet) {
        return this.addText(text);
    }
}
exports.GoogleActionSpeechBuilder = GoogleActionSpeechBuilder;
//# sourceMappingURL=GoogleActionSpeechBuilder.js.map