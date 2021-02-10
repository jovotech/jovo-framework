import { Plugin } from 'jovo-core';
import { Autopilot } from '../Autopilot';
import { AutopilotBot } from '../core/AutopilotBot';
export interface ImageItem {
    label?: string;
    url: string;
}
export interface StandardCard {
    body: string;
    images?: ImageItem[];
}
export declare class Cards implements Plugin {
    install(autopilot: Autopilot): void;
    uninstall(autopilot: Autopilot): void;
    output(autopilotBot: AutopilotBot): void;
}
