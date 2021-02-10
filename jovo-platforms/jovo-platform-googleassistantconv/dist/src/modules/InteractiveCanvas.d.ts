import { Plugin } from 'jovo-core';
import { GoogleAssistant } from '../GoogleAssistant';
import { GoogleAction } from '../core/GoogleAction';
export declare class InteractiveCanvas implements Plugin {
    install(googleAssistant: GoogleAssistant): void;
    output(googleAction: GoogleAction): void;
    uninstall(googleAssistant: GoogleAssistant): void;
}
