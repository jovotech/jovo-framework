import { Plugin, HandleRequest } from 'jovo-core';
import { Lindenbaum } from '../Lindenbaum';
import { LindenbaumBot } from '../core/LindenbaumBot';
export declare class LindenbaumCore implements Plugin {
    install(lindenbaum: Lindenbaum): void;
    uninstall(lindenbaum: Lindenbaum): void;
    init(handleRequest: HandleRequest): Promise<void>;
    request(lindenbaumBot: LindenbaumBot): Promise<void>;
    type(lindenbaumBot: LindenbaumBot): Promise<void>;
    output(lindenbaumBot: LindenbaumBot): Promise<void>;
    /**
     * creates and returns the final response structure for `tell` property from the `$output` object.
     * @param {TellOutput} tell
     * @param {string} dialogId
     */
    private getTellResponse;
    /**
     * parses the `ask` property from the `$output` object to the final response.
     * @param {AskOutput} ask
     * @param {string} dialogId
     */
    private getAskResponse;
}
