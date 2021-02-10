import { BaseApp } from '..';
import { Data, JovoRequest, JovoResponse, SessionData } from '../Interfaces';
import { TestSuite } from '../TestSuite';
import { AxiosRequestConfig } from './HttpService';
declare type ConversationTestRuntime = 'app' | 'server';
export interface ConversationConfig {
    userId?: string;
    locale?: string;
    runtime?: ConversationTestRuntime;
    defaultDbDirectory?: string;
    deleteDbOnSessionEnded?: boolean;
    httpOptions?: AxiosRequestConfig;
}
export declare class Conversation {
    testSuite: TestSuite;
    sessionData: SessionData;
    app?: BaseApp;
    $user: {
        $data: Data;
        $metaData: Data;
    };
    config: ConversationConfig;
    constructor(testSuite: TestSuite, config?: ConversationConfig);
    /**
     * Sets userid, timestamp and locale to every request.
     * @param {JovoRequest} req
     */
    applyToRequest(req: JovoRequest): void;
    /**
     * Set request user and session data
     * @param req
     */
    prepare(req: JovoRequest): Promise<JovoRequest>;
    /**
     * Send request to server or directly to the app, resolve with response.
     * Rejects with Error on failure.
     * @param {JovoRequest} req
     * @returns {Promise<JovoResponse>}
     */
    send(req: JovoRequest): Promise<JovoResponse>;
    /**
     * Send request to server, resolve with response.
     * Rejects with Error on failure.
     * @param {JovoRequest} req
     * @returns {Promise<JovoResponse>}
     */
    sendToServer(req: JovoRequest): Promise<JovoResponse>;
    /**
     * Send request directly to app, resolve with response.
     * Rejects with Error on failure.
     * @param {JovoRequest} req
     * @returns {Promise<JovoResponse>}
     */
    sendToApp(req: JovoRequest, app: BaseApp): Promise<JovoResponse>;
    /**
     * Perform user/session data housekeeping with response
     * @param jovoResponse
     */
    postProcess(jovoResponse: JovoResponse): Promise<void>;
    /**
     * Clears session data for this conversation object
     */
    clearSession(): void;
    /**
     * Resets conversation. Clears database and session
     * @returns {Promise<void>}
     */
    reset(): Promise<void>;
    /**
     * Deletes filedb jsonf ile
     * @returns {Promise<void>}
     */
    clearDb(): Promise<void>;
    /**
     * Saves conversation.$data and conversation.$metaData to file db json.
     * @returns {Promise<void>}
     */
    private saveUserData;
    /**
     * Updates conversation.$data, conversation.$meta  and conversation.$context from file db json.
     * @returns {Promise<void>}
     */
    private updateUserData;
}
export {};
