'use strict';

const _ = require('lodash');

/**
 * Class GadgetController
 */
class GadgetController {

    /**
     * Constructor
     * @param {Jovo} jovo
     */
    constructor(jovo) {
        this.jovo = jovo;
        this.response = jovo.alexaSkill().getResponse();
    }

    /**
     * Sets animations
     * @param {array} animationArray
     * @return {GadgetController}
     */
    setAnimations(animationArray) {
        this.animations = this.animations || [];

        _.forEach(animationArray, (animation) => {
            if (animation instanceof AnimationsBuilder) {
                this.animations.push(animation.build());
            } else {
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
        let possibleTriggerEventValues = ['buttonDown', 'buttonUp', 'none'];
        if (possibleTriggerEventValues.indexOf(triggerEvent) === -1) {
            throw new Error('report has to be either \'buttonDown\', \'buttonUp\' or \'none\'');
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
    setLight(targetGadgets, triggerEventTimeMs, triggerEvent, animations) {
        if (triggerEvent && animations) {
            this.setTriggerEvent(triggerEvent).setAnimations(animations);
        }
        this.response.addDirective({
            type: 'GadgetController.SetLight',
            version: 1,
            targetGadgets,
            parameters: {
                triggerEvent: this.triggerEvent,
                triggerEventTimeMs,
                animations: this.animations,
            },
        });
    }

    /**
     * Delete 'shouldEndSession' attribute, add speech text and send response
     * @param {speechBuilder|string} speech speechBuilder object whose speech attribute will be used
     */
    respond(speech) {
        if (_.get(speech, 'constructor.name') === 'String') {
            this.response.setOutputSpeech(
                speech
            );
        } else if (_.get(speech, 'constructor.name') === 'AlexaSpeechBuilder') {
            this.response.setOutputSpeech(
                speech.toString()
            );
        }
        this.response.deleteShouldEndSession();
        this.jovo.respond();
    }
}

/**
 * Class AnimationsBuilder
 */
class AnimationsBuilder {

    /**
     * Constructor
     */
    constructor() {
        this.animation = {};
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
    sequence(sequence) {
        this.animation.sequence = this.animation.sequence || [];

        _.map(sequence, (item) => {
            if (item instanceof SequenceBuilder) {
                this.animation.sequence.push(item.build());
            }

            this.animation.sequence.push(item);
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
        this.sequence = {};
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

module.exports.GadgetController = GadgetController;
