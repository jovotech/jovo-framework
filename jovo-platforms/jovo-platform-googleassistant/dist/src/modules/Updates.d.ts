import { Plugin } from 'jovo-core';
import { GoogleAssistant } from '../GoogleAssistant';
import { GoogleAction } from '../core/GoogleAction';
export declare class Updates {
    googleAction: GoogleAction;
    constructor(googleAction: GoogleAction);
    askForRegisterUpdate(intent: string, frequency?: string): void;
    isRegisterUpdateOk(): boolean;
    getRegisterUpdateStatus(): string | undefined;
    isRegisterUpdateCancelled(): boolean;
    getConfigureUpdatesIntent(): string | undefined;
}
export declare class UpdatesPlugin implements Plugin {
    install(googleAssistant: GoogleAssistant): void;
    type(googleAction: GoogleAction): void;
    output(googleAction: GoogleAction): void;
    uninstall(googleAssistant: GoogleAssistant): void;
}
