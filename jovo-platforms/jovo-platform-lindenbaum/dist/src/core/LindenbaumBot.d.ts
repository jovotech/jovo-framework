import { AudioData, BaseApp, HandleRequest, Host, Jovo, SpeechBuilder, AxiosResponse } from 'jovo-core';
import { Responses } from './LindenbaumResponse';
import { LindenbaumUser } from './LindenbaumUser';
import { DialogAPIData } from '../services/DialogAPI';
export declare class LindenbaumBot extends Jovo {
    $lindenbaumBot: LindenbaumBot;
    $user: LindenbaumUser;
    constructor(app: BaseApp, host: Host, handleRequest?: HandleRequest);
    setResponses(responses: Responses[]): this;
    /**
     * Calls the `/call/drop` endpoint to terminate the call
     */
    addDrop(): this;
    /**
     * Calls the `/call/bridge` endpoint to bridge the call to `headNumber`
     * @param {number} extensionLength
     * @param {string} headNumber
     */
    addBridge(extensionLength: number, headNumber: string): this;
    /**
     * Calls the `/call/forward` endpoint to forward the call to `destinationNumber`
     * @param {string} destinationNumber
     */
    addForward(destinationNumber: string): this;
    /**
     * Calls the `/call/data` endpoint to save additional data on the conversations
     * @param {string} key
     * @param {string} value
     */
    addData(key: string, value: string): this;
    isNewSession(): boolean;
    hasAudioInterface(): boolean;
    hasScreenInterface(): boolean;
    hasVideoInterface(): boolean;
    getSpeechBuilder(): SpeechBuilder | undefined;
    speechBuilder(): SpeechBuilder | undefined;
    getDeviceId(): undefined;
    getRawText(): string;
    getTimestamp(): string;
    getLocale(): string;
    getType(): string;
    getPlatformType(): string;
    getSelectedElementId(): undefined;
    getAudioData(): AudioData | undefined;
    /**
     * Returns the dialog data for the parsed `dialogId`.
     * If `dialogId` is not parsed, it uses the current request's `dialogId` property
     * @param {string} resellerToken
     * @param {string | undefined} dialogId
     * @returns {Promise<AxiosResponse<DialogAPIData>>}
     */
    getDialogData(resellerToken: string, dialogId?: string): Promise<AxiosResponse<DialogAPIData>>;
    /**
     * Delete the dialog data for the parsed `dialogId`.
     * If `dialogId` is not parsed, it uses the current request's `dialogId` property
     * @param {string} resellerToken
     * @param {string | undefined} dialogId
     * @returns {Promise<AxiosResponse>}
     */
    deleteDialogData(resellerToken: string, dialogId?: string): Promise<AxiosResponse>;
}
