import { Plugin, HandleRequest } from 'jovo-core';
import { Autopilot } from '../Autopilot';
import { AutopilotBot } from '../core/AutopilotBot';
export declare class AutopilotCore implements Plugin {
    install(autopilot: Autopilot): void;
    uninstall(autopilot: Autopilot): void;
    init(handleRequest: HandleRequest): Promise<void>;
    request(autopilotBot: AutopilotBot): Promise<void>;
    type(autopilotBot: AutopilotBot): Promise<void>;
    session(autopilotBot: AutopilotBot): Promise<void>;
    output(autopilotBot: AutopilotBot): Promise<void>;
}
