import { AlexaSkill } from '../core/AlexaSkill';
import { Plugin } from 'jovo-core';
import { Alexa } from '../Alexa';
import { AlexaSpeechBuilder } from '../core/AlexaSpeechBuilder';
export declare class GameEngine {
    alexaSkill: AlexaSkill;
    events: any;
    recognizers: any;
    constructor(alexaSkill: AlexaSkill);
    /**
     * Converts array of events to an object with all the events
     * @param {array} eventArray
     * @return {GameEngine}
     */
    setEvents(eventArray: any[]): this;
    /**
     * Converts array of recognizers to an object with all the recognizers
     * @param {array} recognizerArray
     * @return {GameEngine}
     */
    setRecognizers(recognizerArray: any[]): this;
    /**
     * Gets EventsBuilder instance
     * @param {string} name of the event
     * @return {EventsBuilder}
     */
    getEventsBuilder(name: string): EventsBuilder;
    /**
     * Gets DeviationRecognizerBuilder instance
     * @param {string} name of the recognizer
     * @return {DeviationRecognizerBuilder}
     */
    getDeviationRecognizerBuilder(name: string): DeviationRecognizerBuilder;
    /**
     * Gets PatternRecognizerBuilder instance
     * @param {string} name of the recognizer
     * @return {PatternRecognizerBuilder}
     */
    getPatternRecognizerBuilder(name: string): PatternRecognizerBuilder;
    /**
     * Gets ProgressRecognizerBuilder instance
     * @param {string} name of the recognizer
     * @return {ProgressRecognizerBuilder}
     */
    getProgressRecognizerBuilder(name: string): ProgressRecognizerBuilder;
    /**
     * Sends GameEngine.StartInputHandler directive
     * @param {number} timeout the maximum run time for this Input Handler, in milliseconds
     * @param {array} proxies names for unknown gadget IDs to use in recognizers
     * @param {array} recognizers array of recognizer objects
     * @param {array} events array of event objects
     */
    startInputHandler(timeout: number, proxies: any[], recognizers: any[], events: any[]): AlexaSkill;
    /**
     * Sends GameEngine.StopInputHandler directive
     */
    stopInputHandler(originatingRequestId?: string): AlexaSkill;
    /**
     * Delete 'shouldEndSession' attribute, add speech text and send response
     * @param {speechBuilder|string} speech speechBuilder object whose speech attribute will be used
     */
    respond(speech: string | AlexaSpeechBuilder): void;
}
export declare class GameEnginePlugin implements Plugin {
    install(alexa: Alexa): void;
    uninstall(alexa: Alexa): void;
    type(alexaSkill: AlexaSkill): void;
    output(alexaSkill: AlexaSkill): void;
}
/**
 * Class RecognizerBuilder
 */
declare class RecognizerBuilder {
    name: string;
    recognizers: any;
    /**
     * Constructor
     * @param {string} name of the recognizer
     * @param {string} type of the recognizer
     */
    constructor(name: string, type: string);
    /**
     * Sets specific property of the recognizer
     * @param {string} key
     * @param {string} value
     * @return {RecognizerBuilder}
     */
    setProperty(key: string, value: any): this;
    /**
     * Returns pattern recognizer object
     * @public
     * @return {object}
     */
    build(): any;
}
/**
 * Class DeviationRecognizerBuilder
 */
declare class DeviationRecognizerBuilder extends RecognizerBuilder {
    /**
     * Constructor
     * @param {string} name of the recognizer
     */
    constructor(name: string);
    /**
     * Sets recognizer
     * @param {string} recognizer that defines a pattern that must not be deviated from
     * @return {DeviationRecognizerBuilder}
     */
    recognizer(recognizer: any): this;
}
/**
 * Class PatternRecognizerBuilder
 */
declare class PatternRecognizerBuilder extends RecognizerBuilder {
    /**
     * Constructor
     * @param {string} name of the recognizer
     */
    constructor(name: string);
    /**
     * Sets anchor to start
     * @return {PatternRecognizerBuilder}
     */
    anchorStart(): this;
    /**
     * Sets anchor to end
     * @return {PatternRecognizerBuilder}
     */
    anchorEnd(): this;
    /**
     * Sets anchor to anywhere
     * @return {PatternRecognizerBuilder}
     */
    anchorAnywhere(): this;
    /**
     * Sets anchor
     * @param {string} anchor Either 'start', 'end' or 'anywhere
     * @return {PatternRecognizerBuilder}
     */
    patternAnchor(anchor: string): this;
    /**
     * Sets fuzzy
     * @param {boolean} fuzzy
     * @return {PatternRecognizerBuilder}
     */
    fuzzy(fuzzy: boolean): this;
    /**
     * Sets gadgetIds
     * @param {array} gadgetIds of the Echo Buttons to consider in this pattern recognizer.
     * @return {PatternRecognizerBuilder}
     */
    gadgetIds(gadgetIds: string[]): this;
    /**
     * Sets actions
     * @param {array} actions
     * @return {PatternRecognizerBuilder}
     */
    actions(actions: any[]): this;
    /**
     * Sets pattern
     * @param {array} pattern
     * @return {PatternRecognizerBuilder}
     */
    pattern(pattern: any[]): this;
}
/**
 * Class ProgressRecognizerBuilder
 */
declare class ProgressRecognizerBuilder extends RecognizerBuilder {
    /**
     * Constructor
     * @param {string} name of the recognizer
     */
    constructor(name: string);
    /**
     * Sets recognizer
     * @param {string} recognizer that defines a pattern that must not be deviated from
     * @return {ProgressRecognizerBuilder}
     */
    recognizer(recognizer: any): this;
    /**
     * Sets completion
     * @param {string} completion
     * @return {ProgressRecognizerBuilder}
     */
    completion(completion: any): this;
}
/**
 * Class EventsBuilder
 */
declare class EventsBuilder {
    name: string;
    events: any;
    /**
     * Constructor
     * @param {string} name of the event
     */
    constructor(name: string);
    /**
     * Sets specific property of the event
     * @param {string} key
     * @param {string} value
     * @return {EventsBuilder}
     */
    setProperty(key: string, value: any): this;
    /**
     * Sets meets
     * @param {array} meets
     * @return {EventsBuilder}
     */
    meets(meets: any[]): this;
    /**
     * Sets fails
     * @param {array} fails
     * @return {EventsBuilder}
     */
    fails(fails: any[]): this;
    /**
     * Sets reports to history
     * @return {EventsBuilder}
     */
    reportsHistory(): this;
    /**
     * Sets reports to matches
     * @return {EventsBuilder}
     */
    reportsMatches(): this;
    /**
     * Sets reports to nothing
     * @return {EventsBuilder}
     */
    reportsNothing(): this;
    /**
     * Sets report parameter
     * @param {string} report
     * @return {EventsBuilder}
     */
    reports(report: string): this;
    /**
     * Sets shouldEndInputHandler
     * @param {boolean} shouldEndInputHandler
     * @return {EventsBuilder}
     */
    shouldEndInputHandler(shouldEndInputHandler?: boolean): this;
    /**
     * Sets maximumInvocations
     * @param {number} maximumInvocations
     * @return {EventsBuilder}
     */
    maximumInvocations(maximumInvocations: number): this;
    /**
     * Sets triggerTimeMilliseconds
     * @param {number} triggerTimeMilliseconds adds a time constraint to the event
     * @return {EventsBuilder}
     */
    triggerTimeMilliseconds(triggerTimeMilliseconds: number): this;
    /**
     * Returns events object
     * @public
     * @return {object}
     */
    build(): any;
}
export {};
