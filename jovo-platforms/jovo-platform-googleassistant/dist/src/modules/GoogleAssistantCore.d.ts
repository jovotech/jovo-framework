import { Plugin, HandleRequest } from 'jovo-core';
import { GoogleAssistant } from '../GoogleAssistant';
import { GoogleAction } from '../core/GoogleAction';
export declare class GoogleAssistantCore implements Plugin {
    install(googleAssistant: GoogleAssistant): void;
    init(handleRequest: HandleRequest): Promise<void>;
    type(googleAction: GoogleAction): void;
    output(googleAction: GoogleAction): Promise<void>;
    userStorageGet(googleAction: GoogleAction): Promise<void>;
    userStorageStore(googleAction: GoogleAction): Promise<void>;
    uninstall(googleAssistant: GoogleAssistant): void;
}
