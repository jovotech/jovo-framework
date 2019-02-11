import _get = require('lodash.get');
import _set = require('lodash.set');
import _merge = require('lodash.merge');

import {AlexaSkill} from "../core/AlexaSkill";
import {AlexaRequest} from "../core/AlexaRequest";
import {Plugin} from 'jovo-core';
import {Alexa} from "../Alexa";
import {EnumAlexaRequestType} from "../core/alexa-enums";
import {AlexaSpeechBuilder} from "../core/AlexaSpeechBuilder";
import {AlexaResponse} from "../core/AlexaResponse";
import {GadgetController} from "./GadgetControllerPlugin";

export class GameEngine {
    alexaSkill: AlexaSkill;
    events: any; // tslint:disable-line
    recognizers: any; // tslint:disable-line

    constructor(alexaSkill: AlexaSkill) {
        this.alexaSkill = alexaSkill;
    }

    /**
     * Converts array of events to an object with all the events
     * @param {array} eventArray
     * @return {GameEngine}
     */
    setEvents(eventArray: any[]) { // tslint:disable-line
        this.events = this.events || {};

        eventArray.forEach((event) => {
            if (event instanceof EventsBuilder) {
                this.events = _merge(this.events, event.build());
            } else {
                this.events = _merge(this.events, event);
            }
        });

        return this;
    }

    /**
     * Converts array of recognizers to an object with all the recognizers
     * @param {array} recognizerArray
     * @return {GameEngine}
     */
    setRecognizers(recognizerArray: any[]) { // tslint:disable-line
        this.recognizers = this.recognizers || {};

        recognizerArray.forEach((recognizer) => {
            if (recognizer instanceof RecognizerBuilder) {
                this.recognizers = _merge(this.recognizers, recognizer.build());
            } else {
                this.recognizers = _merge(this.recognizers, recognizer);
            }
        });

        return this;
    }

    /**
     * Gets EventsBuilder instance
     * @param {string} name of the event
     * @return {EventsBuilder}
     */
    getEventsBuilder(name: string) {
        return new EventsBuilder(name);
    }

    /**
     * Gets DeviationRecognizerBuilder instance
     * @param {string} name of the recognizer
     * @return {DeviationRecognizerBuilder}
     */
    getDeviationRecognizerBuilder(name: string) {
        return new DeviationRecognizerBuilder(name);
    }

    /**
     * Gets PatternRecognizerBuilder instance
     * @param {string} name of the recognizer
     * @return {PatternRecognizerBuilder}
     */
    getPatternRecognizerBuilder(name: string) {
        return new PatternRecognizerBuilder(name);
    }

    /**
     * Gets ProgressRecognizerBuilder instance
     * @param {string} name of the recognizer
     * @return {ProgressRecognizerBuilder}
     */
    getProgressRecognizerBuilder(name: string) {
        return new ProgressRecognizerBuilder(name);
    }

    /**
     * Sends GameEngine.StartInputHandler directive
     * @param {number} timeout the maximum run time for this Input Handler, in milliseconds
     * @param {array} proxies names for unknown gadget IDs to use in recognizers
     * @param {array} recognizers array of recognizer objects
     * @param {array} events array of event objects
     */
    startInputHandler(timeout: number, proxies: any[], recognizers: any[], events: any[]) { // tslint:disable-line
        if (recognizers && events) {
            this.setRecognizers(recognizers).setEvents(events);
        }

        const gameEngineDirectives = _get(this.alexaSkill.$output, 'Alexa.GameEngine', []);
        gameEngineDirectives.push(new GameEngineStartInputHandlerDirective(timeout, proxies, this.recognizers, this.events));
        _set(this.alexaSkill.$output, 'Alexa.GameEngine', gameEngineDirectives);

        return this.alexaSkill;
    }

    /**
     * Sends GameEngine.StopInputHandler directive
     */
    stopInputHandler(originatingRequestId?: string) {
        const alexaRequest = this.alexaSkill.$request as AlexaRequest;

        if (!originatingRequestId) {
            originatingRequestId = _get(alexaRequest, 'request.originatingRequestId');
        }

        const gameEngineDirectives = _get(this.alexaSkill.$output, 'Alexa.GameEngine', []);
        // @ts-ignore
        gameEngineDirectives.push(new GameEngineStopInputHandlerDirective(originatingRequestId));
        _set(this.alexaSkill.$output, 'Alexa.GameEngine', gameEngineDirectives);

        return this.alexaSkill;
    }

    /**
     * Delete 'shouldEndSession' attribute, add speech text and send response
     * @param {speechBuilder|string} speech speechBuilder object whose speech attribute will be used
     */
    respond(speech: string | AlexaSpeechBuilder) {

        if (_get(speech, 'constructor.name') === 'String') {
            _set(this.alexaSkill.$output, 'Alexa.respond', {speech});

        } else if (_get(speech, 'constructor.name') === 'AlexaSpeechBuilder') {
            _set(this.alexaSkill.$output, 'Alexa.respond', {speech: speech.toString()});
        }
    }


}


export class GameEnginePlugin implements Plugin {

    install(alexa: Alexa) {
        alexa.middleware('$type')!.use(this.type.bind(this));

        alexa.middleware('$output')!.use(this.output.bind(this));
        AlexaSkill.prototype.$gameEngine = undefined;
        AlexaSkill.prototype.gameEngine = function() {
            return this.$gameEngine;
        };
    }
    uninstall(alexa: Alexa) {
    }

    type(alexaSkill: AlexaSkill) {
        const alexaRequest = alexaSkill.$request as AlexaRequest;
        if (_get(alexaRequest, 'request.type') === 'GameEngine.InputHandlerEvent') {
            alexaSkill.$type = {
                type: EnumAlexaRequestType.ON_GAME_ENGINE_INPUT_HANDLER_EVENT,
            };
        }
        alexaSkill.$gameEngine = new GameEngine(alexaSkill);

    }

    output(alexaSkill: AlexaSkill) {
        const output = alexaSkill.$output;
        const response = alexaSkill.$response as AlexaResponse;
        if (_get(output, 'Alexa.GameEngine')) {
            let directives = _get(response, 'response.directives', []);

            if (Array.isArray(_get(output, 'Alexa.GameEngine'))) {
                directives = directives.concat(_get(output, 'Alexa.GameEngine'));
            } else {
                directives.push(_get(output, 'Alexa.GameEngine'));
            }
            _set(response, 'response.directives', directives);
        }

        if (_get(output, 'Alexa.respond')) {
            _set(response, 'response.outputSpeech', {
                type: 'SSML',
                ssml: AlexaSpeechBuilder.toSSML(_get(output, 'Alexa.respond.speech')),
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


/**
 * Class RecognizerBuilder
 */
class RecognizerBuilder {
    name: string;
    recognizers: any; // tslint:disable-line

    /**
     * Constructor
     * @param {string} name of the recognizer
     * @param {string} type of the recognizer
     */
    constructor(name: string, type: string) {
        this.name = name;
        _set(this, `recognizers.${name}.type`, type);
    }

    /**
     * Sets specific property of the recognizer
     * @param {string} key
     * @param {string} value
     * @return {RecognizerBuilder}
     */
    setProperty(key: string, value: any) { // tslint:disable-line
        _set(this, `recognizers.${this.name}.${key}`, value);
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
    constructor(name: string) {
        super(name, 'deviation');
    }

    /**
     * Sets recognizer
     * @param {string} recognizer that defines a pattern that must not be deviated from
     * @return {DeviationRecognizerBuilder}
     */
    recognizer(recognizer: any) {  // tslint:disable-line
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
    constructor(name: string) {
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
    patternAnchor(anchor: string) {
        const possibleAnchorValues = ['start', 'end', 'anywhere'];
        if (!possibleAnchorValues.includes(anchor)) {
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
    fuzzy(fuzzy: boolean) {
        this.setProperty('fuzzy', fuzzy);
        return this;
    }

    /**
     * Sets gadgetIds
     * @param {array} gadgetIds of the Echo Buttons to consider in this pattern recognizer.
     * @return {PatternRecognizerBuilder}
     */
    gadgetIds(gadgetIds: string[]) {
        this.setProperty('gadgetIds', gadgetIds);
        return this;
    }

    /**
     * Sets actions
     * @param {array} actions
     * @return {PatternRecognizerBuilder}
     */
    actions(actions: any[]) { // tslint:disable-line
        this.setProperty('actions', actions);
        return this;
    }

    /**
     * Sets pattern
     * @param {array} pattern
     * @return {PatternRecognizerBuilder}
     */
    pattern(pattern: any[]) { // tslint:disable-line
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
    constructor(name: string) {
        super(name, 'progress');
    }

    /**
     * Sets recognizer
     * @param {string} recognizer that defines a pattern that must not be deviated from
     * @return {ProgressRecognizerBuilder}
     */
    recognizer(recognizer: any) {  // tslint:disable-line
        this.setProperty('recognizer', recognizer);
        return this;
    }

    /**
     * Sets completion
     * @param {string} completion
     * @return {ProgressRecognizerBuilder}
     */
    completion(completion: any) {  // tslint:disable-line
        this.setProperty('completion', completion);
        return this;
    }
}

/**
 * Class EventsBuilder
 */
class EventsBuilder {
    name: string;
    events: any;  // tslint:disable-line

    /**
     * Constructor
     * @param {string} name of the event
     */
    constructor(name: string) {
        this.name = name;
    }

    /**
     * Sets specific property of the event
     * @param {string} key
     * @param {string} value
     * @return {EventsBuilder}
     */
    setProperty(key: string, value: any ) {  // tslint:disable-line
        _set(this, `events.${this.name}.${key}`, value);
        return this;
    }

    /**
     * Sets meets
     * @param {array} meets
     * @return {EventsBuilder}
     */
    meets(meets: any[]) {  // tslint:disable-line
        this.setProperty('meets', meets);
        return this;
    }

    /**
     * Sets fails
     * @param {array} fails
     * @return {EventsBuilder}
     */
    fails(fails: any[]) {  // tslint:disable-line
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
    reports(report: string) {
        const possibleReportValues = ['history', 'matches', 'nothing'];
        if (!possibleReportValues.includes(report)) {
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
    shouldEndInputHandler(shouldEndInputHandler = true) {
        this.setProperty('shouldEndInputHandler', shouldEndInputHandler);
        return this;
    }

    /**
     * Sets maximumInvocations
     * @param {number} maximumInvocations
     * @return {EventsBuilder}
     */
    maximumInvocations(maximumInvocations: number) {
        this.setProperty('maximumInvocations', maximumInvocations);
        return this;
    }

    /**
     * Sets triggerTimeMilliseconds
     * @param {number} triggerTimeMilliseconds adds a time constraint to the event
     * @return {EventsBuilder}
     */
    triggerTimeMilliseconds(triggerTimeMilliseconds: number) {
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
abstract class GameEngineDirective {
    type: string;

    constructor(type: string) {
        this.type = type;
    }
}

class GameEngineStartInputHandlerDirective extends GameEngineDirective {
    timeout: number;
    proxies: any[];  // tslint:disable-line
    recognizers: any[];  // tslint:disable-line
    events: any[];  // tslint:disable-line
    constructor(timeout: number, proxies: any[], recognizers: any[], events: any[]) {  // tslint:disable-line
        super('GameEngine.StartInputHandler');
        this.timeout = timeout;
        this.proxies = proxies;
        this.recognizers = recognizers;
        this.events = events;
    }
}

class GameEngineStopInputHandlerDirective extends GameEngineDirective {
    originatingRequestId: string;

    constructor(originatingRequestId: string) {
        super('GameEngine.StopInputHandler');
        this.originatingRequestId = originatingRequestId;
    }
}
