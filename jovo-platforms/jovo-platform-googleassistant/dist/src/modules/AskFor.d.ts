import { Plugin } from 'jovo-core';
import { GoogleAssistant } from '../GoogleAssistant';
import { GoogleAction } from '../core/GoogleAction';
export interface Device {
    location: {
        coordinates: {
            latitude: string;
            longitude: string;
        };
    };
}
export declare class AskFor implements Plugin {
    install(googleAssistant: GoogleAssistant): void;
    uninstall(googleAssistant: GoogleAssistant): void;
    type(googleAction: GoogleAction): void;
    output(googleAction: GoogleAction): void;
}
