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
        this.response = jovo.alexaSkill().getResponse();
    }

    /**
     * Sets events
     * @param {array} eventArray
     * @return {GadgetController}
     */
    setEvents(eventArray) {
        this.events = {};

        _.forEach(eventArray, (event) => {
            this.events = _.merge(this.events, event);
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
     * @param {array} animations one or more animations.
     */
    setLight(targetGadgets, triggerEventTimeMs, animations) {
        animations = _.map(animations, (item) => {
            if (typeof item === AnimationsBuilder) {
                return item.build();
            }

            return item;
        });

        this.response.addDirective({
            type: 'GadgetController.SetLight',
            version: 1,
            targetGadgets,
            parameters: {
                triggerEvent: this.triggerEvent,
                triggerEventTimeMs,
                animations,
            },
        });
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
        sequence = _.map(sequence, (item) => {
            if (typeof item === SequenceBuilder) {
                return item.build();
            }

            return item;
        });

        this.animation.sequence = sequence;
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
