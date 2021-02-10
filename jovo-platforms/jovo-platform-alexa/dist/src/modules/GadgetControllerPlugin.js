"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _get = require("lodash.get");
const _set = require("lodash.set");
const _map = require("lodash.map");
const AlexaSkill_1 = require("../core/AlexaSkill");
const AlexaSpeechBuilder_1 = require("../core/AlexaSpeechBuilder");
class GadgetController {
    constructor(alexaSkill) {
        this.alexaSkill = alexaSkill;
    }
    /**
     * Sets animations
     * @param {array} animationArray
     * @return {GadgetController}
     */
    // tslint:disable-next-line
    setAnimations(animationArray) {
        animationArray.forEach((animation) => {
            this.animations = [];
            if (animation instanceof AnimationsBuilder) {
                this.animations.push(animation.build());
            }
            else {
                this.animations.push(animation);
            }
        });
        return this;
    }
    /**
     * Sets triggerEvent to buttonDown
     * @return {GadgetController}
     */
    setButtonDownTriggerEvent() {
        this.triggerEvent = 'buttonDown';
        return this;
    }
    /**
     * Sets triggerEvent to buttonUp
     * @return {GadgetController}
     */
    setButtonUpTriggerEvent() {
        this.triggerEvent = 'buttonUp';
        return this;
    }
    /**
     * Sets triggerEvent to none
     * @return {GadgetController}
     */
    setNoneTriggerEvent() {
        this.triggerEvent = 'none';
        return this;
    }
    /**
     * Checks if triggerEvent is one of the possible values
     * Throws error if not
     * @param {string} triggerEvent Either 'buttonDown', 'buttonUp' or 'none'
     * @return {GadgetController}
     */
    setTriggerEvent(triggerEvent) {
        const possibleTriggerEventValues = ['buttonDown', 'buttonUp', 'none'];
        if (!possibleTriggerEventValues.includes(triggerEvent)) {
            throw new Error("report has to be either 'buttonDown', 'buttonUp' or 'none'");
        }
        this.triggerEvent = triggerEvent;
        return this;
    }
    /**
     * Gets AnimationsBuilder instance
     * @return {AnimationsBuilder}
     */
    getAnimationsBuilder() {
        return new AnimationsBuilder();
    }
    /**
     * Gets SequenceBuilder instance
     * @return {SequenceBuilder}
     */
    getSequenceBuilder() {
        return new SequenceBuilder();
    }
    /**
     * Sends GadgetController.StartInputHandler directive
     * @param {array} targetGadgets ids that will receive the command
     * @param {number} triggerEventTimeMs delay in milliseconds. Minimum: 0. Maximum: 65,535.
     * @param {string} triggerEvent Either 'buttonDown', 'buttonUp' or 'none'
     * @param {array} animations one or more animations.
     */
    setLight(targetGadgets, // tslint:disable-line
    triggerEventTimeMs, triggerEvent, animations) {
        if (triggerEvent && animations) {
            this.setTriggerEvent(triggerEvent).setAnimations(animations);
        }
        const parameters = {
            triggerEvent: this.triggerEvent,
            triggerEventTimeMs,
            animations: this.animations,
        };
        const gadgetControllerDirectives = _get(this.alexaSkill.$output, 'Alexa.GadgetController', []);
        gadgetControllerDirectives.push(new GadgetControllerSetLightDirective(1, targetGadgets, parameters));
        _set(this.alexaSkill.$output, 'Alexa.GadgetController', gadgetControllerDirectives);
    }
    /**
     * Delete 'shouldEndSession' attribute, add speech text and send response
     * @param {speechBuilder|string} speech speechBuilder object whose speech attribute will be used
     */
    respond(speech) {
        if (_get(speech, 'constructor.name') === 'String') {
            _set(this.alexaSkill.$output, 'Alexa.respond', { speech });
        }
        else if (_get(speech, 'constructor.name') === 'AlexaSpeechBuilder') {
            _set(this.alexaSkill.$output, 'Alexa.respond', { speech: speech.toString() });
        }
    }
}
exports.GadgetController = GadgetController;
class GadgetControllerPlugin {
    install(alexa) {
        alexa.middleware('$type').use(this.type.bind(this));
        alexa.middleware('$output').use(this.output.bind(this));
        AlexaSkill_1.AlexaSkill.prototype.$gadgetController = undefined;
        AlexaSkill_1.AlexaSkill.prototype.gadgetController = function () {
            return this.$gadgetController;
        };
    }
    uninstall(alexa) { }
    type(alexaSkill) {
        alexaSkill.$gadgetController = new GadgetController(alexaSkill);
    }
    output(alexaSkill) {
        const output = alexaSkill.$output;
        const response = alexaSkill.$response;
        if (_get(output, 'Alexa.GadgetController')) {
            let directives = _get(response, 'response.directives', []);
            if (Array.isArray(_get(output, 'Alexa.GadgetController'))) {
                directives = directives.concat(_get(output, 'Alexa.GadgetController'));
            }
            else {
                directives.push(_get(output, 'Alexa.GadgetController'));
            }
            _set(response, 'response.directives', directives);
        }
        if (_get(output, 'Alexa.respond')) {
            _set(response, 'response.outputSpeech', {
                type: 'SSML',
                ssml: AlexaSpeechBuilder_1.AlexaSpeechBuilder.toSSML(_get(output, 'Alexa.respond.speech')),
            });
            if (_get(response, 'response.shouldEndSession')) {
                delete response.response.shouldEndSession;
            }
            // set sessionAttributes (necessary since AlexaCore's handler runs before us
            // and skips adding session attributes since it sees shouldEndSession is true)
            if (alexaSkill.$session && alexaSkill.$session.$data) {
                _set(response, 'sessionAttributes', alexaSkill.$session.$data);
            }
        }
    }
}
exports.GadgetControllerPlugin = GadgetControllerPlugin;
/**
 * Class AnimationsBuilder
 */
class AnimationsBuilder {
    /**
     * Constructor
     */
    constructor() {
        this.animation = {}; // tslint:disable-line
    }
    /**
     * Sets repeat
     * @param {number} repeat number of times to play this animation. Minimum: 0. Maximum: 255.
     * @return {AnimationsBuilder}
     */
    repeat(repeat) {
        this.animation.repeat = repeat;
        return this;
    }
    /**
     * Sets targetLights
     * @param {array} targetLights
     * @return {AnimationsBuilder}
     */
    targetLights(targetLights) {
        this.animation.targetLights = targetLights;
        return this;
    }
    /**
     * Sets sequence
     * @param {array} sequence steps to render in order
     * @return {AnimationsBuilder}
     */
    // tslint:disable-next-line
    sequence(sequence) {
        // tslint:disable-line
        this.animation.sequence = this.animation.sequence || [];
        // tslint:disable-next-line
        _map(sequence, (item) => {
            if (item instanceof SequenceBuilder) {
                this.animation.sequence.push(item.build());
            }
            else {
                this.animation.sequence.push(item);
            }
        });
        return this;
    }
    /**
     * Returns events object
     * @public
     * @return {object}
     */
    build() {
        return this.animation;
    }
}
/**
 * Class SequenceBuilder
 */
class SequenceBuilder {
    /**
     * Constructor
     */
    constructor() {
        this.sequence = {}; // tslint:disable-line
    }
    /**
     * Sets durationMs
     * @param {number} durationMs in milliseconds to render this step. Minimum: 1. Maximum: 65,535.
     * @return {SequenceBuilder}
     */
    duration(durationMs) {
        this.sequence.durationMs = durationMs;
        return this;
    }
    /**
     * Sets color
     * @param {string} color
     * @return {SequenceBuilder}
     */
    color(color) {
        this.sequence.color = color;
        return this;
    }
    /**
     * Sets blend
     * @param {boolean} blend
     * @return {SequenceBuilder}
     */
    blend(blend) {
        this.sequence.blend = blend;
        return this;
    }
    /**
     * Returns events object
     * @public
     * @return {object}
     */
    build() {
        return this.sequence;
    }
}
class GadgetControllerDirective {
    constructor(type) {
        this.type = type;
    }
}
class GadgetControllerSetLightDirective extends GadgetControllerDirective {
    // tslint:disable-next-line
    constructor(version, targetGadgets, parameters) {
        super('GadgetController.SetLight');
        this.version = version;
        this.targetGadgets = targetGadgets;
        this.parameters = parameters;
    }
}
//# sourceMappingURL=GadgetControllerPlugin.js.map