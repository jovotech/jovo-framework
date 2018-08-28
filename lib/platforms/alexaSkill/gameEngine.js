'use strict';

const _ = require('lodash');

/**
 * Class GameEngine
 */
class GameEngine {

    /**
     * Constructor
     * @param {Jovo} jovo
     */
    constructor(jovo) {
        this.jovo = jovo;
        this.response = jovo.alexaSkill().getResponse();
    }

    /**
     * Converts array of events to an object with all the events
     * @param {array} eventArray
     * @return {GameEngine}
     */
    setEvents(eventArray) {
        this.events = this.events || {};

        _.forEach(eventArray, (event) => {
            if (event instanceof EventsBuilder) {
                this.events = _.merge(this.events, event.build());
            } else {
                this.events = _.merge(this.events, event);
            }
        });

        return this;
    }

    /**
     * Converts array of recognizers to an object with all the recognizers
     * @param {array} recognizerArray
     * @return {GameEngine}
     */
    setRecognizers(recognizerArray) {
        this.recognizers = this.recognizers || {};

        _.forEach(recognizerArray, (recognizer) => {
            if (recognizer instanceof RecognizerBuilder) {
                this.recognizers = _.merge(this.recognizers, recognizer.build());
            } else {
                this.recognizers = _.merge(this.recognizers, recognizer);
            }
        });

        return this;
    }

    /**
     * Gets EventsBuilder instance
     * @param {string} name of the event
     * @return {EventsBuilder}
     */
    getEventsBuilder(name) {
        return new EventsBuilder(name);
    }

    /**
     * Gets DeviationRecognizerBuilder instance
     * @param {string} name of the recognizer
     * @return {DeviationRecognizerBuilder}
     */
    getDeviationRecognizerBuilder(name) {
        return new DeviationRecognizerBuilder(name);
    }

    /**
     * Gets PatternRecognizerBuilder instance
     * @param {string} name of the recognizer
     * @return {PatternRecognizerBuilder}
     */
    getPatternRecognizerBuilder(name) {
        return new PatternRecognizerBuilder(name);
    }

    /**
     * Gets ProgressRecognizerBuilder instance
     * @param {string} name of the recognizer
     * @return {ProgressRecognizerBuilder}
     */
    getProgressRecognizerBuilder(name) {
        return new ProgressRecognizerBuilder(name);
    }

    /**
     * Sends GameEngine.StartInputHandler directive
     * @param {number} timeout the maximum run time for this Input Handler, in milliseconds
     * @param {array} proxies names for unknown gadget IDs to use in recognizers
     * @param {array} recognizers array of recognizer objects
     * @param {array} events array of event objects
     */
    startInputHandler(timeout, proxies, recognizers, events) {
        if (recognizers && events) {
            this.setRecognizers(recognizers).setEvents(events);
        }
        this.response.addDirective({
            type: 'GameEngine.StartInputHandler',
            timeout,
            proxies,
            recognizers: this.recognizers,
            events: this.events,
        });
    }

    /**
     * Sends GameEngine.StopInputHandler directive
     */
    stopInputHandler() {
        const originatingRequestId = _.get(this.jovo.request(), 'request.originatingRequestId');

        this.response.addDirective({
            type: 'GameEngine.StopInputHandler',
            originatingRequestId,
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
 * Class RecognizerBuilder
 */
class RecognizerBuilder {

    /**
     * Constructor
     * @param {string} name of the recognizer
     * @param {string} type of the recognizer
     */
    constructor(name, type) {
        this.name = name;
        _.set(this, `recognizers.${name}.type`, type);
    }

    /**
     * Sets specific property of the recognizer
     * @param {string} key
     * @param {string} value
     * @return {RecognizerBuilder}
     */
    setProperty(key, value) {
        _.set(this, `recognizers.${this.name}.${key}`, value);
        return this;
    }

    /**
     * Returns pattern recognizer object
     * @public
     * @return {object}
     */
    build() {
        return this.recognizers;
    }
}

/**
 * Class DeviationRecognizerBuilder
 */
class DeviationRecognizerBuilder extends RecognizerBuilder {

    /**
     * Constructor
     * @param {string} name of the recognizer
     */
    constructor(name) {
        super(name, 'deviation');
    }

    /**
     * Sets recognizer
     * @param {string} recognizer that defines a pattern that must not be deviated from
     * @return {DeviationRecognizerBuilder}
     */
    recognizer(recognizer) {
        this.setProperty('recognizer', recognizer);
        return this;
    }
}

/**
 * Class PatternRecognizerBuilder
 */
class PatternRecognizerBuilder extends RecognizerBuilder {

    /**
     * Constructor
     * @param {string} name of the recognizer
     */
    constructor(name) {
        super(name, 'match');
    }

    /**
     * Sets anchor to start
     * @return {PatternRecognizerBuilder}
     */
    anchorStart() {
        this.setProperty('anchor', 'start');
        return this;
    }

    /**
     * Sets anchor to end
     * @return {PatternRecognizerBuilder}
     */
    anchorEnd() {
        this.setProperty('anchor', 'end');
        return this;
    }

    /**
     * Sets anchor to anywhere
     * @return {PatternRecognizerBuilder}
     */
    anchorAnywhere() {
        this.setProperty('anchor', 'anywhere');
        return this;
    }

    /**
     * Sets anchor
     * @param {string} anchor Either 'start', 'end' or 'anywhere
     * @return {PatternRecognizerBuilder}
     */
    patternAnchor(anchor) {
        let possibleAnchorValues = ['start', 'end', 'anywhere'];
        if (possibleAnchorValues.indexOf(anchor) === -1) {
            throw new Error('anchor has to be either \'start\', \'end\' or \'anywhere\'');
        }
        this.setProperty('anchor', anchor);
        return this;
    }

    /**
     * Sets fuzzy
     * @param {boolean} fuzzy
     * @return {PatternRecognizerBuilder}
     */
    fuzzy(fuzzy) {
        this.setProperty('fuzzy', fuzzy);
        return this;
    }

    /**
     * Sets gadgetIds
     * @param {array} gadgetIds of the Echo Buttons to consider in this pattern recognizer.
     * @return {PatternRecognizerBuilder}
     */
    gadgetIds(gadgetIds) {
        this.setProperty('gadgetIds', gadgetIds);
        return this;
    }

    /**
     * Sets actions
     * @param {array} actions
     * @return {PatternRecognizerBuilder}
     */
    actions(actions) {
        this.setProperty('actions', actions);
        return this;
    }

    /**
     * Sets pattern
     * @param {array} pattern
     * @return {PatternRecognizerBuilder}
     */
    pattern(pattern) {
        this.setProperty('pattern', pattern);
        return this;
    }
}

/**
 * Class ProgressRecognizerBuilder
 */
class ProgressRecognizerBuilder extends RecognizerBuilder {

    /**
     * Constructor
     * @param {string} name of the recognizer
     */
    constructor(name) {
        super(name, 'progress');
    }

    /**
     * Sets recognizer
     * @param {string} recognizer that defines a pattern that must not be deviated from
     * @return {ProgressRecognizerBuilder}
     */
    recognizer(recognizer) {
        this.setProperty('recognizer', recognizer);
        return this;
    }

    /**
     * Sets completion
     * @param {string} completion
     * @return {ProgressRecognizerBuilder}
     */
    completion(completion) {
        this.setProperty('completion', completion);
        return this;
    }
}

/**
 * Class EventsBuilder
 */
class EventsBuilder {

    /**
     * Constructor
     * @param {string} name of the event
     */
    constructor(name) {
        this.name = name;
    }

    /**
     * Sets specific property of the event
     * @param {string} key
     * @param {string} value
     * @return {EventsBuilder}
     */
    setProperty(key, value) {
        _.set(this, `events.${this.name}.${key}`, value);
        return this;
    }

    /**
     * Sets meets
     * @param {array} meets
     * @return {EventsBuilder}
     */
    meets(meets) {
        this.setProperty('meets', meets);
        return this;
    }

    /**
     * Sets fails
     * @param {array} fails
     * @return {EventsBuilder}
     */
    fails(fails) {
        this.setProperty('fails', fails);
        return this;
    }

    /**
     * Sets reports to history
     * @return {EventsBuilder}
     */
    reportsHistory() {
        this.setProperty('reports', 'history');
        return this;
    }

    /**
     * Sets reports to matches
     * @return {EventsBuilder}
     */
    reportsMatches() {
        this.setProperty('reports', 'matches');
        return this;
    }

    /**
     * Sets reports to nothing
     * @return {EventsBuilder}
     */
    reportsNothing() {
        this.setProperty('reports', 'nothing');
        return this;
    }

    /**
     * Sets report parameter
     * @param {string} report
     * @return {EventsBuilder}
     */
    reports(report) {
        let possibleReportValues = ['history', 'matches', 'nothing'];
        if (possibleReportValues.indexOf(report) === -1) {
            throw new Error('report has to be either \'history\', \'matches\' or \'nothing\'');
        }
        this.setProperty('reports', report);
        return this;
    }
    /**
     * Sets shouldEndInputHandler
     * @param {boolean} shouldEndInputHandler
     * @return {EventsBuilder}
     */
    shouldEndInputHandler(shouldEndInputHandler) {
        this.setProperty('shouldEndInputHandler', shouldEndInputHandler);
        return this;
    }

    /**
     * Sets maximumInvocations
     * @param {number} maximumInvocations
     * @return {EventsBuilder}
     */
    maximumInvocations(maximumInvocations) {
        this.setProperty('maximumInvocations', maximumInvocations);
        return this;
    }

    /**
     * Sets triggerTimeMilliseconds
     * @param {number} triggerTimeMilliseconds adds a time constraint to the event
     * @return {EventsBuilder}
     */
    triggerTimeMilliseconds(triggerTimeMilliseconds) {
        this.setProperty('triggerTimeMilliseconds', triggerTimeMilliseconds);
        return this;
    }

    /**
     * Returns events object
     * @public
     * @return {object}
     */
    build() {
        return this.events;
    }
}

module.exports.GameEngine = GameEngine;
