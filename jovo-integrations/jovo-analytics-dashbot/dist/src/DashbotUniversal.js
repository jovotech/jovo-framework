"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _merge = require("lodash.merge");
const dashbot = require("dashbot"); // tslint:disable-line
class DashbotUniversal {
    constructor(config) {
        this.config = {
            key: '',
        };
        if (config) {
            this.config = _merge(this.config, config);
        }
        this.track = this.track.bind(this);
    }
    install(app) {
        // @ts-ignore
        this.dashbot = dashbot(this.config.key).universal;
        app.on('response', this.track);
    }
    uninstall(app) {
        app.removeListener('response', this.track);
    }
    /**
     * Sends the request & response logs to Dashbot
     * @param {HandleRequest} handleRequest
     */
    track(handleRequest) {
        if (!handleRequest.jovo) {
            return;
        }
        if (handleRequest.jovo.getPlatformType() === 'CorePlatform') {
            const requestLog = this.createRequestLog(handleRequest);
            this.dashbot.logIncoming(requestLog);
            const responseLog = this.createResponseLog(handleRequest);
            this.dashbot.logOutgoing(responseLog);
        }
    }
    /**
     * returns the request log for Dashbot
     * @param {HandleRequest} handleRequest
     */
    createRequestLog(handleRequest) {
        var _a, _b;
        /**
         * text (user utterance) can be either in the request if text input was used,
         * or in the response if an ASR plugin transcribed the incoming audio file.
         */
        const request = handleRequest.host.getRequestObject();
        const response = handleRequest.jovo.$response;
        const text = request.request.body.text || ((_a = response.context.request.asr) === null || _a === void 0 ? void 0 : _a.text) || '';
        const requestLog = {
            platformJson: {
                // complete JSON request that will be visible in Dashbot console
                asr: handleRequest.jovo.$asr,
                nlu: handleRequest.jovo.$nlu,
                request,
            },
            text,
            userId: handleRequest.jovo.$request.getUserId(),
        };
        const intent = (_b = handleRequest.jovo.$nlu.intent) === null || _b === void 0 ? void 0 : _b.name;
        if (intent) {
            requestLog.intent = {
                name: intent,
            };
            if (Object.keys(handleRequest.jovo.$inputs).length > 0) {
                const inputs = this.parseJovoInputsToDashbotInputs(handleRequest.jovo.$inputs);
                requestLog.intent.inputs = inputs;
            }
        }
        return requestLog;
    }
    /**
     * returns the response log for Dashbot
     * @param {HandleRequest} handleRequest
     */
    createResponseLog(handleRequest) {
        const actions = handleRequest.jovo.$response.actions;
        const text = this.getResponseText(actions);
        const responseLog = {
            platformJson: Object.assign({}, handleRequest.jovo.$response),
            text,
            userId: handleRequest.jovo.$request.getUserId(),
        };
        const images = this.getImageLogs(actions);
        if (images.length > 0) {
            responseLog.images = images;
        }
        const buttons = this.getButtonLogs(actions);
        if (buttons.length > 0) {
            responseLog.buttons = buttons;
        }
        return responseLog;
    }
    /**
     * returns an array of `Image` objects created from the VisualActions.
     * @param {Action[]} actions
     */
    getImageLogs(actions) {
        const images = [];
        actions.forEach((action) => {
            if (action.type === 'VISUAL' && action.visualType === 'IMAGE_CARD') {
                images.push({ url: action.imageUrl });
            }
        });
        return images;
    }
    /**
     * returns an array of `Button` objects created form the QuickReplyActions.
     * @param {Action[]} actions
     */
    getButtonLogs(actions) {
        const buttons = [];
        actions.forEach((action) => {
            if (action.type === 'QUICK_REPLY') {
                action.replies.forEach((quickReply) => {
                    buttons.push({
                        // use value as fallback, since empty strings are not shown in transcripts
                        id: quickReply.id || quickReply.value,
                        label: quickReply.label || quickReply.value,
                        value: quickReply.value,
                    });
                });
            }
        });
        return buttons;
    }
    /**
     * Creates a string containing the output for the SPEECH, AUDIO, VISUAL, and PROCESSING
     * action types. Each type is separated by a pipe ("|").
     * @param {Actions} actions array from response
     */
    getResponseText(actions) {
        const textArr = actions.map((action) => {
            if (action.type === 'SPEECH') {
                return this.getSpeechActionText(action);
            }
            else if (action.type === 'AUDIO') {
                return this.getAudioActionText(action);
            }
            else if (action.type === 'VISUAL') {
                return this.getVisualActionText(action);
            }
            else if (action.type === 'PROCESSING') {
                return this.getProcessingActionText(action);
            }
            else {
                // could be QuickReplies
                return '';
            }
        }, '');
        // we filter out all falsy values before constructing the string.
        return textArr.filter((value) => value).join(' | ');
    }
    /**
     * Will throw error if parsed any other action than of type `SpeechAction`
     *
     * returns `SPEECH: ${action's plain text}`
     * @param {SpeechAction} action
     */
    getSpeechActionText(action) {
        return 'SPEECH: ' + action.plain || '';
    }
    /**
     * Will throw error if parsed any other action than of type `AudioAction`
     *
     * Returns a string containing the `AUDIO: ` tag as well as each tracks filename.
     *
     * e.g. `AUDIO: {fileName} | {fileName2} | ...`
     * @param {Action} action
     */
    getAudioActionText(action) {
        const text = action.tracks
            .map((track) => {
            return getFilenameFromUrl(track.src);
        })
            .join(' | ');
        return 'AUDIO: ' + text;
    }
    /**
     * Will throw error if parsed any other action than of type `VisualAction`
     *
     * Returns a string containing the `VISUAL: ` tag as well as the cards title, body,
     * and image name (if defined).
     *
     * e.g. `VISUAL: ${title} | ${body} | ${filename} }
     * @param {VisualAction} action
     */
    getVisualActionText(action) {
        let text = 'VISUAL: ';
        if (action.visualType === 'BASIC_CARD') {
            text += this.getBasicCardText(action);
        }
        else if (action.visualType === 'IMAGE_CARD') {
            text += this.getImageCardText(action);
        }
        return text;
    }
    /**
     * Returns the text for `VisualActionBasicCard`
     * @param {VisualActionBasicCard} action
     */
    getBasicCardText(action) {
        return `${action.title} | ${action.body}`;
    }
    /**
     * Returns the text for `VisualActionImageCard`
     * @param {VisualActionImageCard} action
     */
    getImageCardText(action) {
        let text = '';
        if (action.title) {
            text += `${action.title} | `;
        }
        if (action.body) {
            text += `${action.body} | `;
        }
        text += getFilenameFromUrl(action.imageUrl);
        return text;
    }
    /**
     * Returns `PROCESSING: ${action.text}`
     * @param {ProcessingAction} action
     */
    getProcessingActionText(action) {
        return 'PROCESSING: ' + action.text;
    }
    /**
     * First, delete the unused properties from the jovo-core `Input` interface
     * to match Dashbot's `Input` interface.
     * After that create array with the updated inputs
     * @param {Inputs} inputs request's inputs
     */
    parseJovoInputsToDashbotInputs(inputs) {
        const arr = [];
        Object.values(inputs).forEach((input) => {
            delete input.key;
            delete input.id;
            arr.push(input);
        });
        return arr;
    }
}
exports.DashbotUniversal = DashbotUniversal;
/**
 * Returns the filename from the hosted files url
 * e.g. "https://www.example.com/my-audio.mp3" -> "my-audio.mp3"
 * @param {string} url
 * @returns {string}
 */
function getFilenameFromUrl(url) {
    return url.slice(url.lastIndexOf('/') + 1);
}
//# sourceMappingURL=DashbotUniversal.js.map