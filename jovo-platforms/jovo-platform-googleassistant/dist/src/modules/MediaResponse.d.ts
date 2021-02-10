import { Plugin } from 'jovo-core';
import { GoogleAssistant } from '../GoogleAssistant';
import { GoogleAction } from '../core/GoogleAction';
export declare class MediaResponse {
    googleAction: GoogleAction;
    constructor(googleAction: GoogleAction);
    play(url: string, name: string, options?: any): GoogleAction;
}
export declare class MediaResponsePlugin implements Plugin {
    install(googleAssistant: GoogleAssistant): void;
    type(googleAction: GoogleAction): void;
    output(googleAction: GoogleAction): void;
    uninstall(googleAssistant: GoogleAssistant): void;
}
