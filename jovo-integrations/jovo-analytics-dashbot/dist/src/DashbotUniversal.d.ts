import { Analytics, BaseApp, HandleRequest, PluginConfig } from 'jovo-core';
import * as dashbot from 'dashbot';
export interface Config extends PluginConfig {
    key: string;
}
export declare class DashbotUniversal implements Analytics {
    config: Config;
    dashbot: dashbot.Universal;
    constructor(config?: Config);
    install(app: BaseApp): void;
    uninstall(app: BaseApp): void;
    /**
     * Sends the request & response logs to Dashbot
     * @param {HandleRequest} handleRequest
     */
    track(handleRequest: HandleRequest): void;
    /**
     * returns the request log for Dashbot
     * @param {HandleRequest} handleRequest
     */
    private createRequestLog;
    /**
     * returns the response log for Dashbot
     * @param {HandleRequest} handleRequest
     */
    private createResponseLog;
    /**
     * returns an array of `Image` objects created from the VisualActions.
     * @param {Action[]} actions
     */
    private getImageLogs;
    /**
     * returns an array of `Button` objects created form the QuickReplyActions.
     * @param {Action[]} actions
     */
    private getButtonLogs;
    /**
     * Creates a string containing the output for the SPEECH, AUDIO, VISUAL, and PROCESSING
     * action types. Each type is separated by a pipe ("|").
     * @param {Actions} actions array from response
     */
    private getResponseText;
    /**
     * Will throw error if parsed any other action than of type `SpeechAction`
     *
     * returns `SPEECH: ${action's plain text}`
     * @param {SpeechAction} action
     */
    private getSpeechActionText;
    /**
     * Will throw error if parsed any other action than of type `AudioAction`
     *
     * Returns a string containing the `AUDIO: ` tag as well as each tracks filename.
     *
     * e.g. `AUDIO: {fileName} | {fileName2} | ...`
     * @param {Action} action
     */
    private getAudioActionText;
    /**
     * Will throw error if parsed any other action than of type `VisualAction`
     *
     * Returns a string containing the `VISUAL: ` tag as well as the cards title, body,
     * and image name (if defined).
     *
     * e.g. `VISUAL: ${title} | ${body} | ${filename} }
     * @param {VisualAction} action
     */
    private getVisualActionText;
    /**
     * Returns the text for `VisualActionBasicCard`
     * @param {VisualActionBasicCard} action
     */
    private getBasicCardText;
    /**
     * Returns the text for `VisualActionImageCard`
     * @param {VisualActionImageCard} action
     */
    private getImageCardText;
    /**
     * Returns `PROCESSING: ${action.text}`
     * @param {ProcessingAction} action
     */
    private getProcessingActionText;
    /**
     * First, delete the unused properties from the jovo-core `Input` interface
     * to match Dashbot's `Input` interface.
     * After that create array with the updated inputs
     * @param {Inputs} inputs request's inputs
     */
    private parseJovoInputsToDashbotInputs;
}
