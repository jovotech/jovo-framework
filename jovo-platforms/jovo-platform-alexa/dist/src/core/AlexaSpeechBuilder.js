"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _sample = require("lodash.sample");
const jovo_core_1 = require("jovo-core");
class AlexaSpeechBuilder extends jovo_core_1.SpeechBuilder {
    constructor(alexaSkill) {
        super(alexaSkill);
    }
    addLangText(language, text, conditionOrProbability, probability) {
        const finalText = Array.isArray(text) ? _sample(text) : text;
        const condition = typeof conditionOrProbability === 'boolean' ? conditionOrProbability : undefined;
        probability = typeof conditionOrProbability === 'number' ? conditionOrProbability : probability;
        return this.addText(`<lang xml:lang="${language}">${finalText}</lang>`, condition, probability);
    }
    addTextWithPolly(pollyName, text, conditionOrProbability, probability) {
        const condition = typeof conditionOrProbability === 'boolean' ? conditionOrProbability : undefined;
        probability = typeof conditionOrProbability === 'number' ? conditionOrProbability : probability;
        const surroundSsml = {
            voice: {
                name: pollyName,
            },
        };
        return this.addText(text, condition, probability, surroundSsml);
    }
    addText(text, conditionOrProbabilityOrSurroundSsml, probabilityOrSurroundSsml, surroundBySsml) {
        const parsed = this.parseArguments(conditionOrProbabilityOrSurroundSsml, probabilityOrSurroundSsml, surroundBySsml);
        let surroundSsml = parsed.surroundSsml;
        if (AlexaSpeechBuilder.pollyVoice) {
            if (!surroundSsml) {
                surroundSsml = {};
            }
            surroundSsml.voice = {
                name: AlexaSpeechBuilder.pollyVoice,
            };
        }
        return super.addText(text, parsed.condition, parsed.probability, surroundSsml);
    }
    addEmotion(name, intensity, text, conditionOrProbabilityOrSurroundSsml, probabilityOrSurroundSsml, surroundBySsml) {
        const parsed = this.parseArguments(conditionOrProbabilityOrSurroundSsml, probabilityOrSurroundSsml, surroundBySsml);
        const surroundSsml = parsed.surroundSsml || {};
        surroundSsml['amazon:emotion'] = { name, intensity };
        return this.addText(text, parsed.condition, parsed.probability, surroundSsml);
    }
    addAudio(url, textOrConditionOrProbability, conditionOrProbability, probability) {
        const parsed = this.parseAudioArguments(url, textOrConditionOrProbability, conditionOrProbability, probability);
        return super.addAudio(url, undefined, parsed.condition, parsed.probability);
    }
}
exports.AlexaSpeechBuilder = AlexaSpeechBuilder;
//# sourceMappingURL=AlexaSpeechBuilder.js.map