import { Plugin, HandleRequest } from 'jovo-core';
import { GoogleAssistant } from '../GoogleAssistant';
import { GoogleAction } from '../core/GoogleAction';
export declare class ConversationalActionsCore implements Plugin {
    install(googleAssistant: GoogleAssistant): void;
    init(handleRequest: HandleRequest): Promise<void>;
    type(googleAction: GoogleAction): void;
    nlu(googleAction: GoogleAction): Promise<void>;
    inputs(googleAction: GoogleAction): Promise<void>;
    session(googleAction: GoogleAction): Promise<void>;
    output(googleAction: GoogleAction): Promise<void>;
    uninstall(googleAssistant: GoogleAssistant): void;
}
