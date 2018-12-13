import {EventEmitter} from "events";
import {BaseApp} from "./BaseApp";
import {SessionConstants} from "./enums";
import {SpeechBuilder} from "./SpeechBuilder";
import _get = require('lodash.get');
import _set = require('lodash.set');

import {
    AppConfig,
    Host,
    Inputs,
    JovoData,
    JovoRequest,
    JovoResponse, JovoSession,
    Output,
    RequestType,
    NLUData,
    SessionAttributes, SessionData
} from "./Interfaces";

import {User} from "./User";
import {Cms} from "./Cms";

export abstract class Jovo extends EventEmitter {
    readonly $host: Host;
    readonly $app: BaseApp;
    readonly $data: JovoData;
    $type: RequestType;
    $user?: User;
    $nlu?: NLUData;
    $inputs: Inputs;
    readonly $output: Output;
    $request?: JovoRequest;
    $response?: JovoResponse;
    $session: JovoSession;
    readonly $plugins?: any; // tslint:disable-line
    $speech: SpeechBuilder = new SpeechBuilder();
    $reprompt: SpeechBuilder = new SpeechBuilder();
    $cms: Cms; // tslint:disable-line

    $requestSessionAttributes: SessionAttributes = {};

    constructor(app: BaseApp, host: Host) {
        super();
        this.setMaxListeners(0);
        this.$host = host;
        this.$app = app;
        this.$data = {};
        this.$session = {
            $data: {}
        };
        this.$type = {
        };
        this.$inputs = {};
        this.$output = {};
        this.$request = undefined;
        this.$response = undefined;
        this.$plugins = {};
        this.$cms = new Cms();
    }

    abstract isNewSession(): boolean;
    abstract hasAudioInterface(): boolean;
    abstract hasScreenInterface(): boolean;
    abstract hasVideoInterface(): boolean;
    abstract getSpeechText(): string | undefined;
    abstract getSpeechBuilder(): SpeechBuilder | undefined;
    abstract speechBuilder(): SpeechBuilder | undefined;
    abstract getRepromptText(): string | undefined;
    abstract getDeviceId(): string | undefined;
    abstract getRawText(): string | undefined;

    /**
     * Returns state value stored in the request session
     * @return {string}
     */
    getState() {
        return this.getSessionAttribute(SessionConstants.STATE);
    }

    /**
     * Saves state to sessionAttributes
     * @param {String} state
     */
    setState(state: string | undefined) {
        if (typeof state === 'undefined') {
            this.removeState();
        } else {
            this.setSessionAttribute(SessionConstants.STATE, state);
        }
        return this;
    }

    removeState() {
        if (this.$session && this.$session.$data[SessionConstants.STATE]) {
            delete this.$session.$data[SessionConstants.STATE];
        }
    }
    /**
     * Returns session attribute value for given path
     * @param {string} path
     * @return {any}
     */
    getSessionAttribute(path: string): any { // tslint:disable-line
        if (this.$session) {
            return _get(this.$session.$data, path);
        }
        return;
    }

    /**
     * Returns full session attributes obj
     * @return {any}
     */
    getSessionAttributes(): SessionData | undefined {
        if (this.$session) {
            return this.$session.$data;
        }
        return;
    }

    /**
     * Sets session attribute for given path
     * @param {string} path
     * @param {any} value
     * @return {Jovo} this
     */
    setSessionAttribute(path: string, value: any): Jovo { // tslint:disable-line
        if (this.$session) {
            _set(this.$session.$data, path, value);
        }
        return this;
    }

    /**
     * Adds session attribute for given path
     * @param {string} path
     * @param {any} value
     * @return {Jovo} this
     */
    addSessionAttribute(path: string, value: any): Jovo { // tslint:disable-line
        return this.setSessionAttribute(path, value);
    }
    /**
     * Sets full session attributes obj
     * @public
     * @param {any} sessionAttributes
     * @return {Jovo} this
     */
    setSessionAttributes(sessionAttributes: SessionAttributes) {
        if (this.$session) {
            this.$session.$data = sessionAttributes;
        }
        return this;
    }

    /**
     * Returns locale
     * @deprecated use this.$request.getLocale() instead
     * @returns {string}
     */
    getLocale() {
        // return this.$request.getLocale();
    }

    /**
     * @param {string | SpeechBuilder} speech
     * @returns {Jovo}
     */
    tell(speech: string | SpeechBuilder): Jovo {
        delete this.$output.ask;
        this.$output.tell = {
            speech: speech.toString()
        };
        return this;
    }

    ask(speech: string | SpeechBuilder, reprompt?: string | SpeechBuilder) {
        delete this.$output.tell;

        if (!reprompt) {
            reprompt = speech;
        }

        this.$output.ask = {
            speech: speech.toString(),
            reprompt: reprompt.toString()
        };

        return this;
    }

    // TODO: move to Handler.ts?
    // private mapInputs(inputs: Inputs): Inputs {
    //     const mappedInputs: Inputs = {};
    //     const config = this.$app!.config;
    //
    //     if (config) {
    //         Object.keys(inputs).forEach((inputKey: string) => {
    //             if (config.inputMap && config.inputMap[inputKey]) {
    //                 mappedInputs[config.inputMap[inputKey]] = inputs[inputKey];
    //             } else {
    //                 mappedInputs[inputKey] = inputs[inputKey];
    //             }
    //
    //         });
    //     }
    //     return mappedInputs;
    // }

    mapInputs(inputMap: {[key: string]: string}): void {
        const mappedInputs: Inputs = {};

        Object.keys(this.$inputs).forEach((inputKey: string) => {
            if (inputMap[inputKey]) {
                mappedInputs[inputMap[inputKey]] = this.$inputs[inputKey];
            } else {
                mappedInputs[inputKey] = this.$inputs[inputKey];
            }

        });
        this.$inputs = mappedInputs;
    }


    getInput(key: string) {
        return _get(this.$inputs, key);
    }

    output(obj: Output) {
        Object.assign(this.output, obj);
        return this;
    }

    showSimpleCard(title: string, content: string) {
        this.$output.card = {
            SimpleCard: {
                title,
                content
            }
        };
        return this;
    }

    showImageCard(title: string, content: string, imageUrl: string) {
        this.$output.card = {
            ImageCard: {
                title,
                content,
                imageUrl,
            }
        };
        return this;
    }

    showAccountLinkingCard() {
        this.$output.card = {
            AccountLinkingCard: {
            }
        };
        return this;
    }

    endSession() {
        console.log('endSession() is obsolete in v2');
    }
}
