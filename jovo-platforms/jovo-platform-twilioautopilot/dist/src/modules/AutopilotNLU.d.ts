import { Plugin } from 'jovo-core';
import { Autopilot } from '../Autopilot';
import { AutopilotBot } from '../core/AutopilotBot';
export declare class AutopilotNLU implements Plugin {
    install(autopilot: Autopilot): void;
    uninstall(autopilot: Autopilot): void;
    nlu(autopilotBot: AutopilotBot): Promise<void>;
    inputs(autopilotBot: AutopilotBot): Promise<void>;
}
