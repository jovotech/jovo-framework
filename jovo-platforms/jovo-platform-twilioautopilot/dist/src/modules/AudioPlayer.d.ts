import { Plugin } from 'jovo-core';
import { Autopilot } from '../Autopilot';
import { AutopilotBot } from '../core/AutopilotBot';
export interface AudioPlayerItem {
    loop: number;
    url: string;
}
export declare class AudioPlayer {
    autopilotBot: AutopilotBot;
    constructor(autopilotBot: AutopilotBot);
    /**
     * Add an audio file to the response
     * @param {string} url
     * @param {number} loop
     */
    play(url: string, loop: number): void;
}
/**
 * @see https://www.twilio.com/docs/autopilot/actions/play
 */
export declare class AudioPlayerPlugin implements Plugin {
    install(autopilot: Autopilot): void;
    uninstall(autopilot: Autopilot): void;
    output(autopilotBot: AutopilotBot): void;
}
