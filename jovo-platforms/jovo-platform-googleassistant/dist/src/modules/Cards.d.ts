import { Plugin } from 'jovo-core';
import { GoogleAssistant } from '../GoogleAssistant';
import { GoogleAction } from '../core/GoogleAction';
export declare class Cards implements Plugin {
    install(googleAssistant: GoogleAssistant): void;
    type(googleAction: GoogleAction): void;
    output(googleAction: GoogleAction): void;
    uninstall(googleAssistant: GoogleAssistant): void;
}
